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
  ) {}

  ngOnInit() {
    this.loadTermsConditions();
  }

  loadTermsConditions() {
    this.termsService.getTermsConditions('en').subscribe({
      next: (data: TermsConditions) => {
        this.termsContent = data.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading terms and conditions:', error);
        // 如果API失败，显示默认内容
        this.termsContent = this.getDefaultTermsContent();
        this.isLoading = false;
      }
    });
  }

  onScroll(event: any) {
    const element = event.target;
    const threshold = 10; // 允许10px的误差
    
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
      this.isScrolledToBottom = true;
      this.canProceed = true;
    }
  }

  goBack() {
    this.router.navigateByUrl('/claims');
  }

  onConfirm() {
    if (this.canProceed) {
      // 导航到实际的提交理赔页面
      this.router.navigateByUrl('/claims/submit-form');
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
      </ol>
    `;
  }
}