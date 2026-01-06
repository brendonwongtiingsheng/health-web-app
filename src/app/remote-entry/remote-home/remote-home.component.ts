import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remote-home',
  templateUrl: './remote-home.component.html',
  styleUrls: ['./remote-home.component.scss'],
  
})
export class RemoteHomeComponent {
  private origin = 'http://10.8.0.2:4201'; // ✅ http://你的IP:4201 或你的 remote 域名

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