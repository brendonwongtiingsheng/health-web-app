import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remote-home',
  templateUrl: './remote-home.component.html',
  styleUrls: ['./remote-home.component.scss'],
  
})
export class RemoteHomeComponent {
  // 自动检测当前域名，适用于本地开发和生产环境
  private origin = window.location.origin;

  bannerUrl = `${this.origin}/assets/banner-claims.png`;
  submitUrl = `${this.origin}/assets/submit-claim.png`;
  viewUrl   = `${this.origin}/assets/view-claims.png`;

  constructor(private router: Router) {}

  goBack() { this.router.navigateByUrl('/home'); }
  onSubmitClaim() { this.router.navigateByUrl('/claims/submit'); }
  onViewClaims() { this.router.navigateByUrl('/claims/list'); }

  onOpenTestimonials() {
  // 你可以换成实际路由 or 外链
  // this.router.navigateByUrl('/testimonials');
  window.open('https://www.youtube.com/', '_blank');
}

}