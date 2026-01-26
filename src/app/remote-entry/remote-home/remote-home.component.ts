import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HostDataMixin } from '../../mixins/host-data.mixin';
import { HostDataService, HostData } from '../../services/host-data.service';

@Component({
  selector: 'app-remote-home',
  templateUrl: './remote-home.component.html',
  styleUrls: ['./remote-home.component.scss'],
  
})
export class RemoteHomeComponent extends HostDataMixin implements OnInit {
  // 直接使用Vercel URL确保图片能正确加载
  public origin = 'https://health-web-app-7kdd.vercel.app';

  bannerUrl = `${this.origin}/assets/banner-claims.png`;
  submitUrl = `${this.origin}/assets/submit-claim.png`;
  viewUrl   = `${this.origin}/assets/view-claims.png`;
  SuccessUrl = `${this.origin}/assets/Illustration_APE.png`;
  videoUrl = `${this.origin}/assets/video.png`;

  // 组件特定的属性
  userInfo: any = {};
  currentLanguage: string = 'en';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    hostDataService: HostDataService
  ) {
    super(hostDataService);
  }

  override ngOnInit() {
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
  }

  /**
   * Host 数据更新时的处理
   */
  protected override onHostDataUpdated(data: HostData): void {
    super.onHostDataUpdated(data);
    
    // 处理数据更新
    if (data.language && data.language !== this.currentLanguage) {
      this.currentLanguage = data.language;
    }
    
    if (data.userProfile) {
      this.userInfo = data.userProfile;
    }
  }

  /**
   * 获取欢迎消息
   */
  getWelcomeMessage(): string {
    const name = this.userInfo?.name || 'User';
    const language = this.getLanguage();
    
    if (language === 'km') {
      return `ស្វាគមន៍ ${name}`;
    } else {
      return `Welcome ${name}`;
    }
  }

  goBack() { this.router.navigateByUrl('/home'); }
  
  onSubmitClaim() { 
    // 传递参数到下一个页面
    const navigationExtras = {
      queryParams: this.hostData
    };
    this.router.navigate(['/terms-conditions'], navigationExtras);
  }
  
  onViewClaims() { this.router.navigateByUrl('/list'); }

  onOpenTestimonials() {
    // 你可以换成实际路由 or 外链
    // this.router.navigateByUrl('/testimonials');
    window.open('https://www.youtube.com/', '_blank');
  }
}