import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-claim-form',
  templateUrl: './submit-claim-form.component.html',
  styleUrls: ['./submit-claim-form.component.scss']
})
export class SubmitClaimFormComponent implements OnInit {
  isInformationExpanded: boolean = true;
  currentStep: number = 1;
  selectedClaimType: string = '';
  showEmploymentStatusModal: boolean = false;
  showContactEditModal: boolean = false;
  showBankEditModal: boolean = false;
  
  // File upload properties
  uploadedFiles: { [key: string]: File[] } = {
    'proof-total-disability': [],
    'proof-relationship': []
  };

  // User information
  userInfo = {
    claimFor: 'someone-else', // 'myself' or 'someone-else'
    insuredName: 'Sok Akra',
    contactNumber: '092 124 1234'
  };

  // Payment information
  paymentInfo = {
    bankName: 'Wing',
    bankAccountNumber: '021 223 235 135',
    accountHolderName: 'Sok Akra'
  };

  // Temporary edit data
  tempContactNumber: string = '';
  tempPaymentInfo = {
    bankName: '',
    bankAccountNumber: '',
    accountHolderName: ''
  };
  
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

  ngOnInit() {
    // 确保每次进入表单时都是干净的状态
    this.resetAllData();
  }

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
      
      // Validate form fields based on selected claim type
      const validationResult = this.validateCurrentStep();
      if (!validationResult.isValid) {
        alert(validationResult.message);
        return;
      }
      
      this.currentStep = 3;
    } else if (this.currentStep === 3) {
      // Validate documents are uploaded
      if (!this.validateDocuments()) {
        alert('Please upload at least one document for each required category');
        return;
      }
      
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
    
    // 清除所有数据并重置表单
    this.resetAllData();
    
    // 回到homepage
    this.router.navigateByUrl('/');
  }

  resetAllData() {
    // 重置步骤和状态
    this.currentStep = 1;
    this.isInformationExpanded = true;
    this.selectedClaimType = '';
    
    // 关闭所有模态框
    this.showEmploymentStatusModal = false;
    this.showContactEditModal = false;
    this.showBankEditModal = false;
    
    // 清除上传的文件
    this.uploadedFiles = {
      'proof-total-disability': [],
      'proof-relationship': []
    };
    
    // 重置用户信息到默认值
    this.userInfo = {
      claimFor: 'someone-else',
      insuredName: 'Sok Akra',
      contactNumber: '092 124 1234'
    };
    
    // 重置银行信息到默认值
    this.paymentInfo = {
      bankName: 'Wing',
      bankAccountNumber: '021 223 235 135',
      accountHolderName: 'Sok Akra'
    };
    
    // 清除临时编辑数据
    this.tempContactNumber = '';
    this.tempPaymentInfo = {
      bankName: '',
      bankAccountNumber: '',
      accountHolderName: ''
    };
    
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

  clearStep2Data() {
    // 这个方法现在只用于向后兼容，实际使用resetAllData()
    this.resetAllData();
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

  // File upload methods
  onFileSelected(event: any, category: string) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          alert(`File "${file.name}" is not a supported format. Please upload PDF, DOC, DOCX, JPG, or PNG files.`);
          continue;
        }
        
        this.uploadedFiles[category].push(file);
      }
    }
    
    // Clear the input value to allow selecting the same file again
    event.target.value = '';
  }

  removeFile(category: string, index: number) {
    this.uploadedFiles[category].splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  hasUploadedFiles(category: string): boolean {
    return this.uploadedFiles[category] && this.uploadedFiles[category].length > 0;
  }

  // Validation methods
  validateCurrentStep(): { isValid: boolean, message: string } {
    switch (this.selectedClaimType) {
      case 'medicash':
        return this.validateMedicashDetails();
      case 'critical-illness':
        return this.validateCriticalIllnessDetails();
      case 'accidental-partial-disability':
        return this.validateAccidentalDisabilityDetails();
      case 'total-disability':
        return this.validateTotalDisabilityDetails();
      case 'death':
        return this.validateDeathDetails();
      default:
        return { isValid: false, message: 'Please select a valid claim type' };
    }
  }

  validateMedicashDetails(): { isValid: boolean, message: string } {
    const details = this.eventDetails;
    
    if (!details.startDate) {
      return { isValid: false, message: 'Please enter the start date of hospital stay' };
    }
    if (!details.endDate) {
      return { isValid: false, message: 'Please enter the end date of hospital stay' };
    }
    if (!details.reason || details.reason.trim() === '') {
      return { isValid: false, message: 'Please enter the reason for hospital stay' };
    }
    if (!details.symptoms || details.symptoms.trim() === '') {
      return { isValid: false, message: 'Please describe your symptoms' };
    }
    
    return { isValid: true, message: '' };
  }

  validateCriticalIllnessDetails(): { isValid: boolean, message: string } {
    const details = this.criticalIllnessDetails;
    
    if (!details.diagnosisDate) {
      return { isValid: false, message: 'Please enter the diagnosis date' };
    }
    if (!details.diagnosis || details.diagnosis.trim() === '') {
      return { isValid: false, message: 'Please enter the diagnosis' };
    }
    if (!details.symptoms || details.symptoms.trim() === '') {
      return { isValid: false, message: 'Please describe your symptoms' };
    }
    
    return { isValid: true, message: '' };
  }

  validateAccidentalDisabilityDetails(): { isValid: boolean, message: string } {
    const details = this.accidentalDisabilityDetails;
    
    if (!details.accidentDate) {
      return { isValid: false, message: 'Please enter the accident date' };
    }
    if (!details.reason || details.reason.trim() === '') {
      return { isValid: false, message: 'Please enter the reason for partial disability' };
    }
    if (!details.disabilityDetails || details.disabilityDetails.trim() === '') {
      return { isValid: false, message: 'Please provide disability details' };
    }
    if (!details.employmentStatus) {
      return { isValid: false, message: 'Please select your employment status' };
    }
    if (!details.mainDuties || details.mainDuties.trim() === '') {
      return { isValid: false, message: 'Please describe your main duties before being disabled' };
    }
    if (!details.activities || details.activities.trim() === '') {
      return { isValid: false, message: 'Please describe activities you cannot perform' };
    }
    
    return { isValid: true, message: '' };
  }

  validateTotalDisabilityDetails(): { isValid: boolean, message: string } {
    const details = this.totalDisabilityDetails;
    
    if (!details.reason || details.reason.trim() === '') {
      return { isValid: false, message: 'Please enter the reason for total disability' };
    }
    if (!details.cause || details.cause.trim() === '') {
      return { isValid: false, message: 'Please specify if caused by accident or illness' };
    }
    if (!details.accidentDate) {
      return { isValid: false, message: 'Please enter the accident/diagnosis date' };
    }
    if (!details.disabilityStartDate) {
      return { isValid: false, message: 'Please enter when the disability started' };
    }
    if (!details.disabilityDetails || details.disabilityDetails.trim() === '') {
      return { isValid: false, message: 'Please provide disability details' };
    }
    if (!details.employmentStatus) {
      return { isValid: false, message: 'Please select your employment status' };
    }
    if (!details.occupation || details.occupation.trim() === '') {
      return { isValid: false, message: 'Please enter your occupation' };
    }
    if (!details.mainDuties || details.mainDuties.trim() === '') {
      return { isValid: false, message: 'Please describe your main duties' };
    }
    if (!details.activities || details.activities.trim() === '') {
      return { isValid: false, message: 'Please describe activities you cannot perform' };
    }
    
    return { isValid: true, message: '' };
  }

  validateDeathDetails(): { isValid: boolean, message: string } {
    const details = this.deathDetails;
    
    if (!details.dateOfDeath) {
      return { isValid: false, message: 'Please enter the date of death' };
    }
    if (!details.cause || details.cause.trim() === '') {
      return { isValid: false, message: 'Please specify if death was caused by accident or illness' };
    }
    if (!details.diagnosisAccidentDate) {
      return { isValid: false, message: 'Please enter the diagnosis/accident date' };
    }
    if (!details.description || details.description.trim() === '') {
      return { isValid: false, message: 'Please provide a description of the cause' };
    }
    if (!details.symptoms || details.symptoms.trim() === '') {
      return { isValid: false, message: 'Please describe the symptoms' };
    }
    
    return { isValid: true, message: '' };
  }

  validateDocuments(): boolean {
    // Check if at least one document is uploaded for each required category
    return this.hasUploadedFiles('proof-total-disability') && 
           this.hasUploadedFiles('proof-relationship');
  }

  // Contact number edit methods
  openContactEditModal() {
    this.tempContactNumber = this.userInfo.contactNumber;
    this.showContactEditModal = true;
  }

  closeContactEditModal() {
    this.showContactEditModal = false;
    this.tempContactNumber = '';
  }

  saveContactNumber() {
    if (this.tempContactNumber.trim()) {
      this.userInfo.contactNumber = this.tempContactNumber.trim();
      this.closeContactEditModal();
    }
  }

  // Bank account edit methods
  openBankEditModal() {
    this.tempPaymentInfo = { ...this.paymentInfo };
    this.showBankEditModal = true;
  }

  closeBankEditModal() {
    this.showBankEditModal = false;
    this.tempPaymentInfo = {
      bankName: '',
      bankAccountNumber: '',
      accountHolderName: ''
    };
  }

  saveBankAccount() {
    if (this.tempPaymentInfo.bankName.trim() && 
        this.tempPaymentInfo.bankAccountNumber.trim() && 
        this.tempPaymentInfo.accountHolderName.trim()) {
      this.paymentInfo = { ...this.tempPaymentInfo };
      this.closeBankEditModal();
    }
  }
}