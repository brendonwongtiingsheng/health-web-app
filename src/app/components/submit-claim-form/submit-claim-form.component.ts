import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-claim-form',
  templateUrl: './submit-claim-form.component.html',
  styleUrls: ['./submit-claim-form.component.scss']
})
export class SubmitClaimFormComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/');
  }

  onSubmit() {
    // 最终提交逻辑
    alert('Claim submitted successfully!');
    this.router.navigateByUrl('/');
  }
}