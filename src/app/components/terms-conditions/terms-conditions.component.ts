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
      
    `;
  }
}