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
    
    // 清除Step 2的数据
    this.clearStep2Data();
    
    // 回到homepage
    this.router.navigateByUrl('/');
  }

  clearStep2Data() {
    // 清除选中的claim type
    this.selectedClaimType = '';
    
    // 清除所有事件详情数据
    this.eventDetails = {
      startDate: '',
      endDate: '',
      reason: '',
      symptoms: ''
    };

    this.criticalIllnessDetails = {
      diagnosisDate: '',
      diagnosis: '',
      symptoms: ''
    };

    this.accidentalDisabilityDetails = {
      accidentDate: '',
      reason: '',
      disabilityDetails: '',
      employmentStatus: '',
      mainDuties: '',
      activities: ''
    };

    this.totalDisabilityDetails = {
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

    this.deathDetails = {
      dateOfDeath: '',
      cause: '',
      diagnosisAccidentDate: '',
      description: '',
      symptoms: ''
    };
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

  // Methods for Step 3 Review
  getReasonForDisability(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return this.eventDetails.reason;
      case 'critical-illness':
        return this.criticalIllnessDetails.symptoms;
      case 'accidental-partial-disability':
        return this.accidentalDisabilityDetails.reason;
      case 'total-disability':
        return this.totalDisabilityDetails.reason;
      case 'death':
        return this.deathDetails.description;
      default:
        return 'Sharp chest pain that spreads to the arm';
    }
  }

  getDisabilityDetails(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return 'I am no';
      case 'critical-illness':
        return 'I am no';
      case 'accidental-partial-disability':
        return this.accidentalDisabilityDetails.disabilityDetails || 'I am no';
      case 'total-disability':
        return this.totalDisabilityDetails.disabilityDetails || 'I am no';
      case 'death':
        return 'I am no';
      default:
        return 'I am no';
    }
  }

  getEmploymentStatusForReview(): string {
    switch (this.selectedClaimType) {
      case 'accidental-partial-disability':
        return this.getEmploymentStatusDisplay() || 'Unemployed';
      case 'total-disability':
        return this.getTotalDisabilityEmploymentStatusDisplay() || 'Unemployed';
      default:
        return 'Unemployed';
    }
  }

  getMainDutiesForReview(): string {
    switch (this.selectedClaimType) {
      case 'accidental-partial-disability':
        return this.accidentalDisabilityDetails.mainDuties || 'Sharp chest pain that spreads to the arm';
      case 'total-disability':
        return this.totalDisabilityDetails.mainDuties || 'Sharp chest pain that spreads to the arm';
      default:
        return 'Sharp chest pain that spreads to the arm';
    }
  }
}