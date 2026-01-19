import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-claim-form',
  templateUrl: './submit-claim-form.component.html',
  styleUrls: ['./submit-claim-form.component.scss']
})
export class SubmitClaimFormComponent {
  isInformationExpanded: boolean = true;
  currentStep: number = 1;
  selectedClaimType: string = '';
  showEmploymentStatusModal: boolean = false;
  
  // Event details form data
  eventDetails = {
    startDate: '',
    endDate: '',
    reason: '',
    symptoms: ''
  };

  // Critical illness details form data
  criticalIllnessDetails = {
    diagnosisDate: '',
    diagnosis: '',
    symptoms: ''
  };

  // Accidental partial disability details form data
  accidentalDisabilityDetails = {
    accidentDate: '',
    reason: '',
    disabilityDetails: '',
    employmentStatus: '',
    mainDuties: '',
    activities: ''
  };

  // Total disability details form data
  totalDisabilityDetails = {
    reason: '',
    cause: '',
    accidentDate: '',
    disabilityStartDate: '',
    disabilityDetails: '',
    employmentStatus: '',
    occupation: '',
    mainDuties: '',
    activities: ''
  };

  // Death details form data
  deathDetails = {
    dateOfDeath: '',
    cause: '',
    diagnosisAccidentDate: '',
    description: '',
    symptoms: ''
  };

  employmentStatusOptions = [
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'self-employed', label: 'Self-employed' },
    { value: 'employed-full-duty', label: 'Employed and on a fully day duty' },
    { value: 'employed-light-duty', label: 'Employed but light duty' },
    { value: 'employed-different-occupation', label: 'Employed but doing a different occupation' }
  ];

  claimTypes = [
    { id: 'medicash', name: 'Medicash', icon: '💊' },
    { id: 'critical-illness', name: 'Critical illness', icon: '💗' },
    { id: 'accidental-partial-disability', name: 'Accidental partial disability', icon: '🦽' },
    { id: 'total-disability', name: 'Total disability', icon: '♿' },
    { id: 'death', name: 'Death', icon: '🔒' }
  ];

  constructor(private router: Router) {}

  toggleInformation() {
    this.isInformationExpanded = !this.isInformationExpanded;
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigateByUrl('/');
    }
  }

  onNext() {
    if (this.currentStep === 1) {
      this.currentStep = 2;
      // 保持展开状态，不要收起内容
      // this.isInformationExpanded = false; // 删除这行
    } else if (this.currentStep === 2) {
      if (!this.selectedClaimType) {
        alert('Please select a claim type');
        return;
      }
      this.currentStep = 3;
    } else if (this.currentStep === 3) {
      // Final submission
      this.onSubmit();
    }
  }

  selectClaimType(claimType: string) {
    this.selectedClaimType = claimType;
  }

  onSubmit() {
    // 最终提交逻辑
    alert('Claim submitted successfully!');
    this.router.navigateByUrl('/');
  }

  openEmploymentStatusModal() {
    this.showEmploymentStatusModal = true;
  }

  closeEmploymentStatusModal() {
    this.showEmploymentStatusModal = false;
  }

  selectEmploymentStatus(value: string) {
    if (this.selectedClaimType === 'accidental-partial-disability') {
      this.accidentalDisabilityDetails.employmentStatus = value;
    } else if (this.selectedClaimType === 'total-disability') {
      this.totalDisabilityDetails.employmentStatus = value;
    }
  }

  confirmEmploymentStatus() {
    this.showEmploymentStatusModal = false;
  }

  getEmploymentStatusDisplay(): string {
    const option = this.employmentStatusOptions.find(opt => opt.value === this.accidentalDisabilityDetails.employmentStatus);
    return option ? option.label : '';
  }

  openTotalDisabilityEmploymentStatusModal() {
    this.showEmploymentStatusModal = true;
  }

  getTotalDisabilityEmploymentStatusDisplay(): string {
    const option = this.employmentStatusOptions.find(opt => opt.value === this.totalDisabilityDetails.employmentStatus);
    return option ? option.label : '';
  }

  getSelectedClaimTypeName(): string {
    const claimType = this.claimTypes.find(type => type.id === this.selectedClaimType);
    return claimType ? claimType.name : '';
  }
}