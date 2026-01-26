import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TermsConditionsService, TermsConditions } from '../../services/terms-conditions.service';
import { HostDataMixin } from '../../mixins/host-data.mixin';
import { HostDataService, HostData } from '../../services/host-data.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent extends HostDataMixin implements OnInit {
  termsContent: string = '';
  isLoading: boolean = true;
  isScrolledToBottom: boolean = false;
  canProceed: boolean = false;
  
  // 组件特定的属性
  userInfo: any = {};
  currentLanguage: string = 'en';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private termsService: TermsConditionsService,
    hostDataService: HostDataService
  ) {
    super(hostDataService);
    console.log('🏗️ TermsConditionsComponent constructor called');
  }

  override ngOnInit() {
    console.log('🚀 TermsConditionsComponent initialized');
    
    // 调用父类的初始化方法
    super.ngOnInit();
    
    // 组件特定的初始化
    this.initializeComponent();
  }

  /**
   * 组件初始化
   */
  private initializeComponent(): void {
    // 使用从 Host 接收到的数据
    this.userInfo = this.getUserProfile();
    this.currentLanguage = this.getLanguage();
    
    console.log('👤 用户信息:', this.userInfo);
    console.log('🌐 当前语言:', this.currentLanguage);
    
    // 根据语言加载内容
    this.loadTermsConditions();
  }

  /**
   * Host 数据更新时的处理
   */
  protected override onHostDataUpdated(data: HostData): void {
    super.onHostDataUpdated(data);
    
    // 处理数据更新
    if (data.language && data.language !== this.currentLanguage) {
      this.currentLanguage = data.language;
      this.loadTermsConditions();
    }
    
    if (data.userProfile) {
      this.userInfo = data.userProfile;
    }
  }

  loadTermsConditions() {
    console.log('🔄 Loading terms and conditions...');
    
    // 根据语言加载相应的条款内容
    const language = this.currentLanguage;
    console.log(`📋 加载 ${language} 语言的条款内容`);
    
    this.termsService.getTermsConditions(language).subscribe({
      next: (data: TermsConditions) => {
        console.log('✅ API Response received:', data);
        this.termsContent = data.content;
        this.isLoading = false;
        console.log('📝 Terms content set:', this.termsContent.substring(0, 100) + '...');
        
        // 检查内容加载后是否需要滚动
        setTimeout(() => {
          this.checkIfScrollNeeded();
        }, 100);
      },
      error: (error) => {
        console.error('❌ Error loading terms and conditions:', error);
        // 如果API失败，显示默认内容
        this.termsContent = this.getDefaultTermsContent();
        this.isLoading = false;
        console.log('📝 Using default content, length:', this.termsContent.length);
        
        // 检查内容加载后是否需要滚动
        setTimeout(() => {
          this.checkIfScrollNeeded();
        }, 100);
      }
    });
  }

  checkIfScrollNeeded() {
    const element = document.querySelector('.terms-content') as HTMLElement;
    if (element) {
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      
      console.log('🔍 Checking scroll need:', { scrollHeight, clientHeight });
      
      // 如果内容不需要滚动，直接允许继续
      if (scrollHeight <= clientHeight + 10) {
        console.log('📄 Content fits in view, no scroll needed');
        this.isScrolledToBottom = true;
        this.canProceed = true;
      }
    }
  }

  onScroll(event: any) {
    const element = event.target;
    const threshold = 10; // 允许10px的误差
    
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    const scrollHeight = element.scrollHeight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    
    console.log('📜 Scroll event:', {
      scrollTop,
      clientHeight,
      scrollHeight,
      isAtBottom,
      threshold,
      scrollPercentage: Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
    });
    
    // 如果内容很短，直接允许继续
    if (scrollHeight <= clientHeight + 50) {
      console.log('📄 Content is short, allowing proceed');
      this.isScrolledToBottom = true;
      this.canProceed = true;
      return;
    }
    
    if (isAtBottom) {
      console.log('✅ User scrolled to bottom!');
      this.isScrolledToBottom = true;
      this.canProceed = true;
    }
  }

  goBack() {
    this.router.navigateByUrl('/');
  }

  onConfirm() {
    if (this.canProceed) {
      const userId = this.getUserId();
      const claimType = this.getClaimType();
      
      console.log('✅ 用户同意条款:', {
        userId,
        claimType,
        timestamp: new Date().toISOString()
      });
      
      // 传递 host 参数到下一个页面
      const navigationExtras = {
        queryParams: this.hostData
      };
      this.router.navigate(['/submit-form'], navigationExtras);
    }
  }

  private getDefaultTermsContent(): string {
    const language = this.currentLanguage;
    
    if (language === 'km') {
      return `
        <h2>ខ្ញុំសូមប្រកាស យល់ដឹង និងយល់ព្រមថា៖</h2>
        
        <ol>
          <li>ខ្ញុំបញ្ជាក់ថាខ្ញុំមិនមែនជាពលរដ្ឋអាមេរិក ឬមានកាតព្វកិច្ចប្រកាសពន្ធនៅសហរដ្ឋអាមេរិក...</li>
          <li>ព័ត៌មានទាំងអស់ដែលខ្ញុំបានផ្តល់សម្រាប់ការទាមទារនេះគឺពេញលេញ និងពិតតាមចំណេះដឹង និងជំនឿល្អបំផុតរបស់ខ្ញុំ។</li>
          <li>ខ្ញុំបញ្ជាក់ថាខ្ញុំជាម្ចាស់ប៉ូលីស ឬអ្នកទទួលផល។</li>
        </ol>
      `;
    } else {
      return `
        <h2>I hereby DECLARE, UNDERSTAND and AGREE that:</h2>
        
        <ol>
          <li>I confirm that I am not a US citizen or have tax declaration obligation in USA or at least have one of the following indicia:
            <ul>
              <li>US passport or US resident documents</li>
              <li>US tax identification number, or</li>
              <li>US birthplace, US telephone, US address at the of request for change.</li>
            </ul>
          </li>
          
          <li>All information provided by me for this claim is completed and true to the best of my knowledge and belief.</li>
          
          <li>I confirm I am policyowner or beneficiary. The identity information I provide herein is owned by me as the policyowner or beneficiary as part of this claim submission process. I understand that "Submit eClaim application" is part of the claim process and I will not be entitled to any payment of claim until the entire claim process is considered by Manulife (Cambodia PLC) to be completed.</li>
          
          <li>I also hereby agree with and authorize Manulife to deduct from the claim payment, in the event that, I have any shortfall, for whatever reason. Manulife also has the right to reverse / claim back any incorrect payments caused by incorrect/ omission of required information provided in processing the claim.</li>
          
          <li>If a claim is submitted by me as policyowner or beneficiary, then I confirm that I have obtained the necessary authorization from the Insured to submit this claim on their behalf.</li>
          
          <li>I understand that for the purpose of auditing any of my successful claim submission, I may be requested by Manulife to submit any or all original supporting document(s). If I receive such a request, I undertake and agree to immediately submit the Original Documents to Manulife. In the event that I fail to accede to such request or the submitted Original Documents are found to be untrue, fake or misleading, Manulife reserves all the rights including but without limitation not to accept any further eClaim application from me or the Dependent.</li>
          
          <li>I also undertake to notify Manulife if any event within 30 calendar days from the date of change.</li>
          
          <li>I agree to provide my mobile phone number to Manulife in order to keep I informed of any information related to my claim submission.</li>
          
          <li>I agree to allow and authorize Manulife to implement necessary acts subject to applicable law or regulation, including information that need to be collect and disclose my/our information to domestic and oversea authority, regulators to comply with any law requirements</li>
        </ol>
      `;
    }
  }
}