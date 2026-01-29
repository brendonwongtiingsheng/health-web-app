import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HostDataService } from '../../services/host-data.service';
import { AuthenticatedApiService } from '../../services/authenticated-api.service';

type FormCategory = 'aps' | 'brain' | 'cancer' | 'heart' | 'kidney' | 'liver' | 'lung';

interface DownloadableForm {
  id: string;
  title: string;
}

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
  showClaimantInfoEditModal: boolean = false;
  showClaimEventInfoEditModal: boolean = false;
  showSuccessPage: boolean = false;
  showDownloadableFormsModal: boolean = false;
  isDownloadableFormsExpanded: boolean = false;
  isDocumentEditMode: boolean = false; // New property for document edit mode

  // API相关状态
  isLoadingApiData: boolean = false;
  apiTestResult: any = null;
  apiCredentialsStatus: any = null;
  certificateEligibilityResult: any = null;

  selectedFormCategory: FormCategory = 'brain'; // Default to brain category

  private origin = 'https://health-web-app-7kdd.vercel.app';

  SuccessUrl = `${this.origin}/assets/Illustration_APE.png`;

  // ✅ Strongly typed forms data (fix TS7053)
  private readonly formsData: Record<FormCategory, DownloadableForm[]> = {
    aps: [{ id: 'aps-general', title: 'General APS Form' }],
    brain: [
      { id: 'brain-bacterial', title: 'Bacterial encephalitis or encephalitis' },
      { id: 'brain-tumor', title: 'Non-cancerous brain tumors or severe concussions' },
      { id: 'brain-stroke', title: 'Stroke or cerebrovascular surgery y abnormal cerebral artery' }
    ],
    cancer: [{ id: 'cancer-general', title: 'General Cancer Form' }],
    heart: [{ id: 'heart-general', title: 'General Heart Form' }],
    kidney: [{ id: 'kidney-general', title: 'General Kidney Form' }],
    liver: [{ id: 'liver-general', title: 'General Liver Form' }],
    lung: [{ id: 'lung-general', title: 'General Lung Form' }]
  };

  // Success page data
  submissionData = {
    refNo: '',
    lifeInsured: '',
    submissionDate: '',
    claimType: ''
  };

  // File upload properties
  uploadedFiles: { [key: string]: File[] } = {
    'medical-discharge': [],
    'hospital-receipt': [],
    'physician-statement': [],
    'supporting-documents': [],
    'critical-physician-statement': [],
    'critical-medical-evidence': [],
    'critical-pathology-reports': [],
    'critical-supporting-documents': [],
    'total-physician-statement': [],
    'total-disability-proof': [],
    'total-supporting-documents': [],
    'death-physician-statement': [],
    'death-cause-proof': [],
    'death-medical-documents': [],
    'death-certificate': [],
    'death-supporting-documents': [],
    'accidental-physician-statement': [],
    'accidental-disability-proof': [],
    'accidental-supporting-documents': [],
    'general-documents': [],
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
  tempUserInfo = {
    claimFor: '',
    insuredName: '',
    contactNumber: ''
  };
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

  constructor(
    private router: Router,
    private hostDataService: HostDataService,
    private authenticatedApiService: AuthenticatedApiService
  ) {}

  ngOnInit() {
    // 确保每次进入表单时都是干净的状态
    this.resetAllData();
    
    // 初始化时检查API凭据状态
    this.checkApiCredentialsStatus();
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
      this.currentStep = 2; // Go to Claim Event Information
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

      this.currentStep = 3; // Go to Documents Upload
    } else if (this.currentStep === 3) {
      // Validate documents are uploaded
      if (!this.validateDocumentsUpload()) {
        alert('Please upload at least one document');
        return;
      }
      this.currentStep = 4; // Go to Review
    } else if (this.currentStep === 4) {
      // Final submission
      this.onSubmit();
    }
  }

  selectClaimType(claimType: string) {
    this.selectedClaimType = claimType;
  }

  onSubmit() {
    // Generate submission data
    this.submissionData = {
      refNo: this.generateRefNumber(),
      lifeInsured: this.userInfo.insuredName,
      submissionDate: this.getCurrentDate(),
      claimType: this.getSelectedClaimTypeName()
    };

    // Show success page
    this.showSuccessPage = true;
  }

  generateRefNumber(): string {
    // Generate a random reference number
    return '100034256346';
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  viewMyClaim() {
    // Navigate back to homepage and refresh
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }

  closeSuccessPage() {
    // Close success page and reset form
    this.showSuccessPage = false;
    this.resetAllData();
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
    this.showClaimantInfoEditModal = false;
    this.showClaimEventInfoEditModal = false;

    // 清除上传的文件
    this.uploadedFiles = {
      'medical-discharge': [],
      'hospital-receipt': [],
      'physician-statement': [],
      'supporting-documents': [],
      'critical-physician-statement': [],
      'critical-medical-evidence': [],
      'critical-pathology-reports': [],
      'critical-supporting-documents': [],
      'total-physician-statement': [],
      'total-disability-proof': [],
      'total-supporting-documents': [],
      'death-physician-statement': [],
      'death-cause-proof': [],
      'death-medical-documents': [],
      'death-certificate': [],
      'death-supporting-documents': [],
      'general-documents': [],
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
    this.tempUserInfo = {
      claimFor: '',
      insuredName: '',
      contactNumber: ''
    };
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

    // ✅ reset form category to default (typed)
    this.selectedFormCategory = 'brain';
    this.showDownloadableFormsModal = false;
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

  getCurrentEmploymentStatus(): string {
    if (this.selectedClaimType === 'accidental-partial-disability') {
      return this.accidentalDisabilityDetails.employmentStatus;
    } else if (this.selectedClaimType === 'total-disability') {
      return this.totalDisabilityDetails.employmentStatus;
    }
    return '';
  }

  confirmEmploymentStatus() {
    this.showEmploymentStatusModal = false;
  }

  getEmploymentStatusDisplay(): string {
    const option = this.employmentStatusOptions.find(
      opt => opt.value === this.accidentalDisabilityDetails.employmentStatus
    );
    return option ? option.label : '';
  }

  openTotalDisabilityEmploymentStatusModal() {
    this.showEmploymentStatusModal = true;
  }

  getTotalDisabilityEmploymentStatusDisplay(): string {
    const option = this.employmentStatusOptions.find(
      opt => opt.value === this.totalDisabilityDetails.employmentStatus
    );
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

        // Validate file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 20MB.`);
          continue;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          alert(`File "${file.name}" is not a supported format. Please upload PDF, JPG, or PNG files.`);
          continue;
        }

        // Initialize array if it doesn't exist
        if (!this.uploadedFiles[category]) {
          this.uploadedFiles[category] = [];
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

  hasAnyUploadedFiles(): boolean {
    // Check if any files are uploaded across all categories
    return Object.keys(this.uploadedFiles).some(category =>
      this.uploadedFiles[category] && this.uploadedFiles[category].length > 0
    );
  }

  // Validation methods
  validateCurrentStep(): { isValid: boolean; message: string } {
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

  validateMedicashDetails(): { isValid: boolean; message: string } {
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

  validateCriticalIllnessDetails(): { isValid: boolean; message: string } {
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

  validateAccidentalDisabilityDetails(): { isValid: boolean; message: string } {
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

    return { isValid: true, message: '' };
  }

  validateTotalDisabilityDetails(): { isValid: boolean; message: string } {
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

    return { isValid: true, message: '' };
  }

  validateDeathDetails(): { isValid: boolean; message: string } {
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

  validateDocumentsUpload(): boolean {
    // Check if at least one document is uploaded based on claim type
    if (this.selectedClaimType === 'medicash') {
      return (
        this.hasUploadedFiles('medical-discharge') ||
        this.hasUploadedFiles('hospital-receipt') ||
        this.hasUploadedFiles('physician-statement') ||
        this.hasUploadedFiles('supporting-documents')
      );
    } else if (this.selectedClaimType === 'critical-illness') {
      return (
        this.hasUploadedFiles('critical-physician-statement') ||
        this.hasUploadedFiles('critical-medical-evidence') ||
        this.hasUploadedFiles('critical-pathology-reports') ||
        this.hasUploadedFiles('critical-supporting-documents')
      );
    } else if (this.selectedClaimType === 'total-disability') {
      return (
        this.hasUploadedFiles('total-physician-statement') ||
        this.hasUploadedFiles('total-disability-proof') ||
        this.hasUploadedFiles('total-supporting-documents')
      );
    } else if (this.selectedClaimType === 'accidental-partial-disability') {
      return (
        this.hasUploadedFiles('accidental-physician-statement') ||
        this.hasUploadedFiles('accidental-disability-proof') ||
        this.hasUploadedFiles('accidental-supporting-documents')
      );
    } else if (this.selectedClaimType === 'death') {
      return (
        this.hasUploadedFiles('death-cause-proof') ||
        this.hasUploadedFiles('death-medical-documents') ||
        this.hasUploadedFiles('death-certificate') ||
        this.hasUploadedFiles('death-supporting-documents')
      );
    } else {
      return this.hasUploadedFiles('general-documents');
    }
  }

  getDocumentSectionTitle(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return 'Medicash documents';
      case 'critical-illness':
        return 'Critical illness documents';
      case 'accidental-partial-disability':
        return 'Accidental partial disability documents';
      case 'total-disability':
        return 'Total disability documents';
      case 'death':
        return 'Death claim documents';
      default:
        return 'Required documents';
    }
  }

  validateDocuments(): boolean {
    // Check if at least one document is uploaded for each required category
    return this.hasUploadedFiles('proof-total-disability') && this.hasUploadedFiles('proof-relationship');
  }

  viewSampleDocument() {
    // Open sample document in new tab or show modal
    alert('Sample document viewer would open here');
  }

  viewDownloadableForms() {
    this.showDownloadableFormsModal = true;
  }

  toggleDownloadableForms() {
    this.isDownloadableFormsExpanded = !this.isDownloadableFormsExpanded;
  }

  closeDownloadableFormsModal() {
    this.showDownloadableFormsModal = false;
  }

  // ✅ category now typed safely
  selectFormCategory(category: FormCategory) {
    this.selectedFormCategory = category;
  }

  // ✅ FIXED TS7053: safe indexing with typed record + runtime guard
  getFormsForCategory(category: string): DownloadableForm[] {
    if (category in this.formsData) {
      return this.formsData[category as FormCategory];
    }
    return [];
  }

  downloadSpecificForm(formId: string) {
    // Handle specific form download
    console.log('Downloading form:', formId);
    // You can implement actual download logic here
    alert(`Downloading form: ${formId}`);
  }

  downloadForm(formType: string) {
    // Download the specified form
    alert(`Downloading ${formType} form...`);
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
    if (
      this.tempPaymentInfo.bankName.trim() &&
      this.tempPaymentInfo.bankAccountNumber.trim() &&
      this.tempPaymentInfo.accountHolderName.trim()
    ) {
      this.paymentInfo = { ...this.tempPaymentInfo };
      this.closeBankEditModal();
    }
  }

  // Method to determine if next button should be shown
  shouldShowNextButton(): boolean {
    // For step 2, only show next button if claim type is selected
    if (this.currentStep === 2) {
      return this.selectedClaimType !== '';
    }
    // For all other steps, always show the next button
    return true;
  }

  // Method to get current step text
  getCurrentStepText(): string {
    switch (this.currentStep) {
      case 1:
        return 'Your information';
      case 2:
        return 'Claim event information';
      case 3:
        return 'Documents';
      case 4:
        return 'Review';
      default:
        return 'Your information';
    }
  }

  // Method to get completed steps array for checkmarks
  getCompletedSteps(): number[] {
    const completedCount = this.currentStep - 1;
    return Array.from({ length: completedCount }, (_, i) => i + 1);
  }

  // Method to get remaining steps array for dots (only for steps 1-3)
  getRemainingSteps(): number[] {
    const remainingCount = 4 - this.currentStep;
    return Array.from({ length: remainingCount }, (_, i) => i + 1);
  }

  // Method to get remaining steps for 3-step progress (step 1-3 only)
  getRemainingStepsForThree(): number[] {
    const remainingCount = 3 - this.currentStep;
    return Array.from({ length: remainingCount }, (_, i) => i + 1);
  }

  // Method to edit documents (go back to step 3)
  editDocuments() {
    this.currentStep = 3;
  }

  // Method to toggle document edit mode in step 4
  toggleDocumentEditMode() {
    this.isDocumentEditMode = !this.isDocumentEditMode;
  }

  // Helper methods for the new claim event information structure
  getEventDate(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return this.eventDetails.startDate || '29/03/2025';
      case 'critical-illness':
        return this.criticalIllnessDetails.diagnosisDate || '29/03/2025';
      case 'accidental-partial-disability':
        return this.accidentalDisabilityDetails.accidentDate || '29/03/2025';
      case 'total-disability':
        return this.totalDisabilityDetails.accidentDate || '29/03/2025';
      case 'death':
        return this.deathDetails.dateOfDeath || '29/03/2025';
      default:
        return '29/03/2025';
    }
  }

  getEndDate(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return this.eventDetails.endDate || '29/03/2025';
      default:
        return '29/03/2025';
    }
  }

  getReasonForStay(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return this.eventDetails.reason || 'Stomach pain';
      case 'critical-illness':
        return this.criticalIllnessDetails.diagnosis || 'Critical illness';
      case 'accidental-partial-disability':
        return this.accidentalDisabilityDetails.reason || 'Accident';
      case 'total-disability':
        return this.totalDisabilityDetails.reason || 'Total disability';
      case 'death':
        return this.deathDetails.cause || 'Death';
      default:
        return 'Stomach pain';
    }
  }

  getSymptoms(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return this.eventDetails.symptoms || 'I experience symptoms of stomach pain such as indigestion, nausea, and a loss of appetite.';
      case 'critical-illness':
        return this.criticalIllnessDetails.symptoms || 'Critical illness symptoms';
      case 'accidental-partial-disability':
        return this.accidentalDisabilityDetails.disabilityDetails || 'Disability symptoms';
      case 'total-disability':
        return this.totalDisabilityDetails.disabilityDetails || 'Total disability symptoms';
      case 'death':
        return this.deathDetails.symptoms || 'Death symptoms';
      default:
        return 'I experience symptoms of stomach pain such as indigestion, nausea, and a loss of appetite.';
    }
  }

  getCauseOfEvent(): string {
    switch (this.selectedClaimType) {
      case 'medicash':
        return 'Illness';
      case 'critical-illness':
        return this.criticalIllnessDetails.diagnosis || 'Illness';
      case 'accidental-partial-disability':
        return 'Accident';
      case 'total-disability':
        return this.totalDisabilityDetails.cause === 'accidental' ? 'Accident' : 'Illness';
      case 'death':
        return this.deathDetails.cause === 'accidental' ? 'Accident' : 'Illness';
      default:
        return 'Illness';
    }
  }

  editClaimEventInfo() {
    // Open modal to edit claim event information instead of navigating back
    this.showClaimEventInfoEditModal = true;
  }

  editClaimantInfo() {
    // Open modal to edit claimant information instead of navigating back
    this.tempUserInfo = { ...this.userInfo };
    this.tempPaymentInfo = { ...this.paymentInfo };
    this.showClaimantInfoEditModal = true;
  }

  // Claimant Info Edit Modal Methods
  closeClaimantInfoEditModal() {
    this.showClaimantInfoEditModal = false;
    this.tempUserInfo = {
      claimFor: '',
      insuredName: '',
      contactNumber: ''
    };
    this.tempPaymentInfo = {
      bankName: '',
      bankAccountNumber: '',
      accountHolderName: ''
    };
  }

  saveClaimantInfo() {
    if (
      this.tempUserInfo.insuredName.trim() &&
      this.tempUserInfo.contactNumber.trim() &&
      this.tempPaymentInfo.bankName.trim() &&
      this.tempPaymentInfo.bankAccountNumber.trim() &&
      this.tempPaymentInfo.accountHolderName.trim()
    ) {
      this.userInfo = { ...this.tempUserInfo };
      this.paymentInfo = { ...this.tempPaymentInfo };
      this.closeClaimantInfoEditModal();
    }
  }

  // Claim Event Info Edit Modal Methods
  closeClaimEventInfoEditModal() {
    this.showClaimEventInfoEditModal = false;
  }

  saveClaimEventInfo() {
    // Validation would go here based on claim type
    this.closeClaimEventInfoEditModal();
  }

  // ==================== API 相关方法 ====================

  /**
   * 检查API凭据状态
   */
  async checkApiCredentialsStatus() {
    try {
      console.log('🔍 检查API凭据状态...');
      this.apiCredentialsStatus = await this.authenticatedApiService.getApiCredentialsStatus();
      console.log('📊 API凭据状态:', this.apiCredentialsStatus);
    } catch (error) {
      console.error('❌ 检查API凭据状态失败:', error);
      this.apiCredentialsStatus = {
        available: false,
        hasAccessToken: false,
        hasXApiKey: false,
        hasBaseUrl: false,
        error: error
      };
    }
  }

  /**
   * 测试API连接
   */
  async testApiConnection() {
    try {
      console.log('🧪 测试API连接...');
      this.isLoadingApiData = true;
      this.apiTestResult = await this.authenticatedApiService.testApiConnection();
      console.log('📊 API连接测试结果:', this.apiTestResult);
    } catch (error) {
      console.error('❌ API连接测试失败:', error);
      this.apiTestResult = {
        success: false,
        message: `API连接测试失败: ${error}`,
        details: error
      };
    } finally {
      this.isLoadingApiData = false;
    }
  }

  /**
   * 验证证书资格 - 这是你原始的verifyCertEligibility方法的实现
   */
  async verifyCertEligibility(policyNo?: string) {
    try {
      console.log('🔍 开始验证证书资格...');
      this.isLoadingApiData = true;
      
      // 使用默认保单号或用户输入的保单号
      const testPolicyNo = policyNo || 'POLICY123456';
      
      console.log('📋 使用保单号:', testPolicyNo);
      
      // 调用认证API服务
      this.certificateEligibilityResult = await this.authenticatedApiService.verifyCertEligibility(testPolicyNo);
      
      console.log('✅ 证书资格验证成功:', this.certificateEligibilityResult);
      
      // 可以在这里处理API响应，比如更新UI状态
      alert('证书资格验证成功！请查看控制台了解详细信息。');
      
    } catch (error) {
      console.error('❌ 证书资格验证失败:', error);
      
      this.certificateEligibilityResult = {
        error: true,
        message: error instanceof Error ? error.message : '未知错误',
        details: error
      };
      
      // 显示用户友好的错误信息
      if (error instanceof Error) {
        if (error.message.includes('无法从Host应用获取API凭据')) {
          alert('无法获取API凭据。请确保您已从Host应用正确登录。');
        } else if (error.message.includes('401')) {
          alert('认证失败。您的登录可能已过期，请重新登录。');
        } else {
          alert(`API调用失败: ${error.message}`);
        }
      } else {
        alert('证书资格验证失败，请稍后重试。');
      }
      
    } finally {
      this.isLoadingApiData = false;
    }
  }

  /**
   * 刷新API凭据
   */
  async refreshApiCredentials() {
    try {
      console.log('🔄 刷新API凭据...');
      this.isLoadingApiData = true;
      
      const refreshedCredentials = await this.hostDataService.refreshApiCredentialsFromHost();
      
      if (refreshedCredentials) {
        console.log('✅ API凭据刷新成功');
        alert('API凭据已成功刷新！');
        // 重新检查状态
        await this.checkApiCredentialsStatus();
      } else {
        console.warn('⚠️ API凭据刷新失败');
        alert('API凭据刷新失败，请稍后重试。');
      }
      
    } catch (error) {
      console.error('❌ 刷新API凭据失败:', error);
      alert(`刷新API凭据失败: ${error}`);
    } finally {
      this.isLoadingApiData = false;
    }
  }

  /**
   * 获取Host数据状态
   */
  getHostDataStatus() {
    const hostData = this.hostDataService.getHostData();
    console.log('📊 当前Host数据:', hostData);
    
    return {
      hasUserId: !!hostData.userId,
      hasUserProfile: !!hostData.userProfile,
      hasApiCredentials: !!hostData.apiCredentials,
      hasSessionData: !!hostData.sessionData,
      data: hostData
    };
  }

  /**
   * 显示API调试信息
   */
  showApiDebugInfo() {
    const hostStatus = this.getHostDataStatus();
    
    const debugInfo = {
      hostData: hostStatus,
      apiCredentialsStatus: this.apiCredentialsStatus,
      apiTestResult: this.apiTestResult,
      certificateResult: this.certificateEligibilityResult
    };
    
    console.log('🐛 API调试信息:', debugInfo);
    
    // 在页面上显示调试信息
    const debugText = JSON.stringify(debugInfo, null, 2);
    alert(`API调试信息（详细信息请查看控制台）:\n\n${debugText.substring(0, 500)}...`);
  }

  /**
   * 重置API状态
   */
  resetApiStatus() {
    this.apiTestResult = null;
    this.apiCredentialsStatus = null;
    this.certificateEligibilityResult = null;
    this.isLoadingApiData = false;
    console.log('🔄 API状态已重置');
  }
}
