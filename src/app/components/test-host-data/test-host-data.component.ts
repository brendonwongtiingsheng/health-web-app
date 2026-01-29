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
    secureStorageTest?: any;
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
   * 测试获取被保险人信息API
   */
  async testGetInsured() {
    this.isLoading = true;
    try {
      console.log('🏥 测试获取被保险人信息API...');
      console.log('📋 使用保单号:', this.testPolicyNumber);
      
      const result = await this.authenticatedApiService.getInsured(this.testPolicyNumber);
      
      this.certificateTestResult = {
        success: true,
        data: result,
        policyNumber: this.testPolicyNumber,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ 获取被保险人信息成功:', this.certificateTestResult);
      
    } catch (error) {
      console.error('❌ 获取被保险人信息失败:', error);
      
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
   * 🔍 专门调试 Access Token
   */
  debugAccessToken() {
    console.log('🔍 开始 Access Token 专项调试...');
    
    // 调用服务的调试方法
    this.hostDataService.debugAccessToken();
    
    // 额外的组件级调试
    console.log('📱 组件级调试信息:');
    console.log('   当前 apiCredentials:', this.apiCredentials);
    console.log('   当前 hostData:', this.hostData);
    
    alert('Access Token 调试信息已输出到控制台，请按F12查看详细信息');
  }

  /**
   * 🔍 获取并显示完整的 Access Token
   */
  async showFullAccessToken() {
    try {
      console.log('🔍 获取完整 Access Token...');
      const token = await this.hostDataService.getFullAccessTokenForDebug();
      
      if (token) {
        // 在控制台显示完整token
        console.log('🔑 完整 Access Token:', token);
        
        // 分析token信息
        console.log('📊 Token 分析:');
        console.log('   长度:', token.length);
        console.log('   前50字符:', token.substring(0, 50));
        console.log('   是否为JWT:', token.startsWith('eyJ'));
        
        if (token.startsWith('eyJ')) {
          try {
            // 尝试解析JWT payload（不验证签名）
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              console.log('🔓 JWT Payload:', payload);
              
              if (payload.exp) {
                const expDate = new Date(payload.exp * 1000);
                console.log('⏰ Token 过期时间:', expDate.toLocaleString());
                console.log('⏰ 是否已过期:', expDate < new Date());
              }
            }
          } catch (e) {
            console.log('⚠️ JWT 解析失败:', e);
          }
        }
        
        alert(`Access Token 获取成功！\n长度: ${token.length}\n详细信息请查看控制台`);
      } else {
        alert('❌ 没有找到 Access Token，请检查 Host 应用是否正确设置了凭据');
      }
    } catch (error) {
      console.error('❌ 获取 Access Token 失败:', error);
      alert(`获取 Access Token 失败: ${error}`);
    }
  }

  /**
   * 🔍 测试所有可能的 token 获取方式
   */
  async testAllTokenSources() {
    console.log('🔍 测试所有可能的 Token 获取方式...');
    
    const results: any = {};
    
    // 测试方式1: getMfeApiCredentials
    try {
      if ((window as any).getMfeApiCredentials) {
        const creds1 = (window as any).getMfeApiCredentials();
        results.getMfeApiCredentials = {
          available: true,
          hasToken: !!creds1?.accessToken,
          tokenPreview: creds1?.accessToken?.substring(0, 20) + '...' || 'N/A'
        };
      } else {
        results.getMfeApiCredentials = { available: false };
      }
    } catch (error) {
      results.getMfeApiCredentials = { available: true, error: error };
    }

    // 测试方式2: hostSharedData
    try {
      if ((window as any).hostSharedData?.apiCredentials) {
        const creds2 = (window as any).hostSharedData.apiCredentials;
        results.hostSharedData = {
          available: true,
          hasToken: !!creds2?.accessToken,
          tokenPreview: creds2?.accessToken?.substring(0, 20) + '...' || 'N/A'
        };
      } else {
        results.hostSharedData = { available: false };
      }
    } catch (error) {
      results.hostSharedData = { available: true, error: error };
    }

    // 测试方式3: 服务中的数据
    try {
      const creds3 = this.hostDataService.getApiCredentials();
      results.serviceData = {
        available: !!creds3,
        hasToken: !!creds3?.accessToken,
        tokenPreview: creds3?.accessToken?.substring(0, 20) + '...' || 'N/A'
      };
    } catch (error) {
      results.serviceData = { error: error };
    }

    // 测试方式4: 刷新函数
    try {
      if ((window as any).refreshMfeApiCredentials) {
        console.log('🔄 尝试调用刷新函数...');
        const creds4 = await (window as any).refreshMfeApiCredentials();
        results.refreshFunction = {
          available: true,
          hasToken: !!creds4?.accessToken,
          tokenPreview: creds4?.accessToken?.substring(0, 20) + '...' || 'N/A'
        };
      } else {
        results.refreshFunction = { available: false };
      }
    } catch (error) {
      results.refreshFunction = { available: true, error: error };
    }

    console.log('📊 所有 Token 获取方式测试结果:', results);
    
    // 生成报告
    let report = '🔍 Access Token 获取方式测试报告:\n\n';
    Object.entries(results).forEach(([method, result]: [string, any]) => {
      report += `${method}:\n`;
      if (result.available === false) {
        report += '  ❌ 不可用\n';
      } else if (result.error) {
        report += `  ❌ 错误: ${result.error}\n`;
      } else if (result.hasToken) {
        report += `  ✅ 有Token: ${result.tokenPreview}\n`;
      } else {
        report += '  ⚠️ 可用但无Token\n';
      }
      report += '\n';
    });
    
    alert(report + '详细信息请查看控制台');
  }

  /**
   * 获取测试结果标题
   */
  getTestResultTitle(key: string): string {
    const titleMap: { [key: string]: string } = {
      'credentialsTest': '🔑 API凭据获取测试',
      'connectionTest': '🌐 API连接测试',
      'refreshTest': '🔄 API凭据刷新测试',
      'secureStorageTest': '🔧 SecureStorage测试'
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

  /**
   * 🔧 测试SecureStorage功能
   */
  async testSecureStorage() {
    this.isLoading = true;
    try {
      console.log('🔧 测试SecureStorage功能...');
      
      // 检查状态
      const status = await this.authenticatedApiService.getSecureStorageCredentialsStatus();
      console.log('📊 SecureStorage状态:', status);
      
      this.apiTestResults.secureStorageTest = {
        success: true,
        status: status,
        timestamp: new Date().toISOString()
      };
      
      alert(`SecureStorage测试完成！\n可用: ${status.available}\n有Token: ${status.hasAccessToken}\n来源: ${status.source}`);
      
    } catch (error) {
      console.error('❌ SecureStorage测试失败:', error);
      this.apiTestResults.secureStorageTest = {
        success: false,
        error: error,
        timestamp: new Date().toISOString()
      };
      alert(`SecureStorage测试失败: ${error}`);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 🔧 设置测试凭据到SecureStorage
   */
  async setTestCredentialsToSecureStorage() {
    const accessToken = prompt('请输入Access Token:');
    const xApiKey = prompt('请输入X-API-Key:');
    const baseUrlBFF = prompt('请输入Base URL (可选):', 'https://api.example.com');
    
    if (!accessToken || !xApiKey) {
      alert('❌ Access Token和X-API-Key都是必需的');
      return;
    }
    
    this.isLoading = true;
    try {
      await this.authenticatedApiService.setApiCredentialsToSecureStorage({
        accessToken,
        xApiKey,
        baseUrlBFF: baseUrlBFF || undefined
      });
      
      alert('✅ 测试凭据已保存到SecureStorage');
      
      // 重新测试状态
      await this.testSecureStorage();
      
    } catch (error) {
      console.error('❌ 保存测试凭据失败:', error);
      alert(`保存失败: ${error}`);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 🧹 清除SecureStorage凭据
   */
  async clearSecureStorageCredentials() {
    if (!confirm('确定要清除SecureStorage中的所有API凭据吗？')) {
      return;
    }
    
    this.isLoading = true;
    try {
      await this.authenticatedApiService.clearSecureStorageCredentials();
      alert('✅ SecureStorage凭据已清除');
      
      // 重新测试状态
      await this.testSecureStorage();
      
    } catch (error) {
      console.error('❌ 清除凭据失败:', error);
      alert(`清除失败: ${error}`);
    } finally {
      this.isLoading = false;
    }
  }
}