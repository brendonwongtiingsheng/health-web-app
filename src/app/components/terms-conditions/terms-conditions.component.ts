import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TermsConditionsService, TermsConditions } from '../../services/terms-conditions.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {
  termsContent: string = '';
  isLoading: boolean = true;
  isScrolledToBottom: boolean = false;
  canProceed: boolean = false;

  constructor(
    private router: Router,
    private termsService: TermsConditionsService
  ) {
    console.log('🏗️ TermsConditionsComponent constructor called');
  }

  ngOnInit() {
    console.log('🚀 TermsConditionsComponent initialized');
    console.log('📊 Initial state - isLoading:', this.isLoading, 'termsContent:', this.termsContent);
    this.loadTermsConditions();
  }

  loadTermsConditions() {
    console.log('🔄 Loading terms and conditions...');
    this.termsService.getTermsConditions('en').subscribe({
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
      // 导航到实际的提交理赔页面
      this.router.navigateByUrl('/submit-form');
    }
  }

  private getDefaultTermsContent(): string {
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