import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remote-home',
  templateUrl: './remote-home.component.html',
  styleUrls: ['./remote-home.component.scss'],
  
})
export class RemoteHomeComponent {
  // 直接使用Vercel URL确保图片能正确加载
  private origin = 'https://health-web-app-7kdd.vercel.app';

  bannerUrl = `${this.origin}/assets/banner-claims.png`;
  submitUrl = `${this.origin}/assets/submit-claim.png`;
  viewUrl   = `${this.origin}/assets/view-claims.png`;

  constructor(private router: Router) {}

  goBack() { this.router.navigateByUrl('/home'); }
  onSubmitClaim() { this.router.navigateByUrl('/terms-conditions'); }
  onViewClaims() { this.router.navigateByUrl('/list'); }

  onOpenTestimonials() {
  // 你可以换成实际路由 or 外链
  // this.router.navigateByUrl('/testimonials');
  window.open('https://www.youtube.com/', '_blank');
}

}