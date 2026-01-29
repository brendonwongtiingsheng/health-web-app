import { Component, OnInit, OnDestroy } from '@angular/core';
import { HostDataService, ApiCredentials } from '../../services/host-data.service';
import { AuthenticatedApiService } from '../../services/authenticated-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-host-data',
  templateUrl: './test-host-data.component.html',
  styleUrls: ['./test-host-data.component.scss']
})
export class TestHostDataComponent implements OnInit, OnDestroy {
  
  // 数据状态
  hostData: any = {};
  apiCredentials: ApiCredentials | null = null;
  isLoading = false;
  
  // API测试结果
  apiTestResults: {
    credentialsTest?: any;
    connectionTest?: any;
    refreshTest?: any;
    [key: string]: any;
  } = {};
  certificateTestResult: any = null;
  
  // 订阅
  private hostDataSubscription?: Subscription;
  
  // 测试用的保单号
  testPolicyNumber = 'POLICY123456';

  constructor(
    private hostDataService: HostDataService,
    private authenticatedApiService: AuthenticatedApiService
  ) {}

  ngOnInit() {
    console.log('🧪 测试组件初始化');
    
    // 订阅Host数据变化
    this.hostDataSubscription = this.hostDataService.hostData$.subscribe(data => {
      console.log('📨 收到Host数据更新:', data);
      this.hostData = data;
      this.apiCredentials = data.apiCredentials || null;
    });
    
    // 初始化时获取当前数据
    this.refreshHostData();
  }

  ngOnDestroy() {
    if (this.hostDataSubscription) {
      this.hostDataSubscription.unsubscribe();
    }
  }

  /**
   * 刷新Host数据
   */
  refreshHostData() {
    console.log('🔄 刷新Host数据...');
    this.hostDataService.refreshHostData();
    this.hostData = this.hostDataService.getHostData();
    this.apiCredentials = this.hostDataService.getApiCredentials();
  }

  /**
   * 测试API凭据获取
   */
  async testApiCredentials() {
    this.isLoading = true;
    try {
      console.log('🔑 测试API凭据获取...');
      
      const credentials = await this.hostDataService.getApiCredentialsFromHost();
      
      this.apiTestResults.credentialsTest = {
        success: !!credentials,
        data: credentials,
        timestamp: new Date().toISOString()
      };
      
      console.log('📊 API凭据测试结果:', this.apiTestResults.credentialsTest);
      
    } catch (error) {
      console.error('❌ API凭据测试失败:', error);
      this.apiTestResults.credentialsTest = {
        success: false,
        error: error,
        timestamp: new Date().toISOString()
      };
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 测试API连接
   */
  async testApiConnection() {
    this.isLoading = true;
    try {
      console.log('🌐 测试API连接...');
      
      const result = await this.authenticatedApiService.testApiConnection();
      
      this.apiTestResults.connectionTest = {
        ...result,
        timestamp: new Date().toISOString()
      };
      
      console.log('📊 API连接测试结果:', this.apiTestResults.connectionTest);
      
    } catch (error) {
      console.error('❌ API连接测试失败:', error);
      this.apiTestResults.connectionTest = {
        success: false,
        message: `连接测试失败: ${error}`,
        error: error,
        timestamp: new Date().toISOString()
      };
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 测试证书资格验证API - 这是你的原始API调用
   */
  async testCertificateEligibility() {
    this.isLoading = true;
    try {
      console.log('🏥 测试证书资格验证API...');
      console.log('📋 使用保单号:', this.testPolicyNumber);
      
      const result = await this.authenticatedApiService.verifyCertEligibility(this.testPolicyNumber);
      
      this.certificateTestResult = {
        success: true,
        data: result,
        policyNumber: this.testPolicyNumber,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ 证书资格验证成功:', this.certificateTestResult);
      
    } catch (error) {
      console.error('❌ 证书资格验证失败:', error);
      
      this.certificateTestResult = {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        details: error,
        policyNumber: this.testPolicyNumber,
        timestamp: new Date().toISOString()
      };
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 刷新API凭据
   */
  async refreshApiCredentials() {
    this.isLoading = true;
    try {
      console.log('🔄 刷新API凭据...');
      
      const refreshed = await this.hostDataService.refreshApiCredentialsFromHost();
      
      this.apiTestResults.refreshTest = {
        success: !!refreshed,
        data: refreshed,
        timestamp: new Date().toISOString()
      };
      
      if (refreshed) {
        console.log('✅ API凭据刷新成功');
        this.apiCredentials = refreshed;
      } else {
        console.warn('⚠️ API凭据刷新失败');
      }
      
    } catch (error) {
      console.error('❌ 刷新API凭据失败:', error);
      this.apiTestResults.refreshTest = {
        success: false,
        error: error,
        timestamp: new Date().toISOString()
      };
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 清除测试结果
   */
  clearResults() {
    this.apiTestResults = {};
    this.certificateTestResult = null;
    console.log('🧹 测试结果已清除');
  }

  /**
   * 获取Host数据状态摘要
   */
  getHostDataSummary() {
    return {
      hasUserId: !!this.hostData.userId,
      hasUserProfile: !!this.hostData.userProfile,
      hasApiCredentials: !!this.hostData.apiCredentials,
      hasSessionData: !!this.hostData.sessionData,
      totalKeys: Object.keys(this.hostData).length
    };
  }

  /**
   * 获取API凭据状态摘要
   */
  getApiCredentialsSummary() {
    if (!this.apiCredentials) {
      return {
        available: false,
        hasAccessToken: false,
        hasXApiKey: false,
        hasBaseUrl: false
      };
    }

    return {
      available: true,
      hasAccessToken: !!this.apiCredentials.accessToken,
      hasXApiKey: !!this.apiCredentials.xApiKey,
      hasBaseUrl: !!this.apiCredentials.baseUrlBFF,
      tokenExpiry: this.apiCredentials.tokenExpiry
    };
  }

  /**
   * 导出测试数据为JSON
   */
  exportTestData() {
    const exportData = {
      timestamp: new Date().toISOString(),
      hostData: this.hostData,
      apiCredentials: this.apiCredentials,
      apiTestResults: this.apiTestResults,
      certificateTestResult: this.certificateTestResult,
      summary: {
        hostData: this.getHostDataSummary(),
        apiCredentials: this.getApiCredentialsSummary()
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mfe-api-test-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('📁 测试数据已导出');
  }

  /**
   * 显示详细的调试信息
   */
  showDebugInfo() {
    const debugInfo = {
      hostData: this.hostData,
      apiCredentials: this.apiCredentials,
      testResults: this.apiTestResults,
      certificateResult: this.certificateTestResult,
      windowData: {
        hostSharedData: (window as any).hostSharedData,
        getMfeData: typeof (window as any).getMfeData,
        getMfeApiCredentials: typeof (window as any).getMfeApiCredentials,
        refreshMfeApiCredentials: typeof (window as any).refreshMfeApiCredentials
      }
    };

    console.log('🐛 详细调试信息:', debugInfo);
    alert('详细调试信息已输出到控制台，请按F12查看');
  }

  /**
   * 获取测试结果标题
   */
  getTestResultTitle(key: string): string {
    const titleMap: { [key: string]: string } = {
      'credentialsTest': '🔑 API凭据获取测试',
      'connectionTest': '🌐 API连接测试',
      'refreshTest': '🔄 API凭据刷新测试'
    };
    
    return titleMap[key] || `📊 ${key} 测试`;
  }

  /**
   * 获取Object.keys用于模板
   */
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  /**
   * 检查是否有测试结果
   */
  hasTestResults(): boolean {
    return Object.keys(this.apiTestResults).length > 0 || !!this.certificateTestResult;
  }

  /**
   * 获取测试结果条目
   */
  getTestResultEntries(): Array<{key: string, value: any}> {
    return Object.entries(this.apiTestResults).map(([key, value]) => ({key, value}));
  }
}