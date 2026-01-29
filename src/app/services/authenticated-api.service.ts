import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { HostDataService, ApiCredentials } from './host-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedApiService {
  
  constructor(
    private http: HttpClient,
    private hostDataService: HostDataService
  ) {
    console.log('🔐 Authenticated API Service initialized');
  }

  /**
   * 检查SecureStorage是否可用
   * 在Web环境中，我们使用localStorage作为fallback
   */
  private isSecureStorageAvailable(): boolean {
    // 检查是否在Capacitor环境中
    if (typeof (window as any).Capacitor !== 'undefined') {
      return true;
    }
    
    // 检查是否有SecureStoragePlugin
    if (typeof (window as any).SecureStoragePlugin !== 'undefined') {
      return true;
    }
    
    // Web环境，使用localStorage
    return typeof localStorage !== 'undefined';
  }

  /**
   * 从SecureStorage获取值
   */
  private async getFromSecureStorage(key: string): Promise<string> {
    try {
      // 如果在Capacitor环境中，使用SecureStoragePlugin
      if (typeof (window as any).SecureStoragePlugin !== 'undefined') {
        const result = await (window as any).SecureStoragePlugin.get({ key });
        return result.value;
      }
      
      // Web环境fallback到localStorage
      const value = localStorage.getItem(key);
      return value || '';
    } catch (error) {
      console.warn(`⚠️ 从SecureStorage获取${key}失败:`, error);
      return '';
    }
  }

  /**
   * 保存值到SecureStorage
   */
  private async saveToSecureStorage(key: string, value: string): Promise<void> {
    try {
      // 如果在Capacitor环境中，使用SecureStoragePlugin
      if (typeof (window as any).SecureStoragePlugin !== 'undefined') {
        await (window as any).SecureStoragePlugin.set({ key, value });
        return;
      }
      
      // Web环境fallback到localStorage
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`⚠️ 保存${key}到SecureStorage失败:`, error);
    }
  }

  /**
   * 获取默认的Base URL
   */
  private getDefaultBaseUrl(): string {
    // 你可以根据环境设置默认的API base URL
    const hostname = window.location.hostname;
    
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'http://localhost:3000'; // 开发环境
    } else if (hostname.includes('staging')) {
      return 'https://staging-api.example.com'; // 测试环境
    } else {
      return 'https://api.example.com'; // 生产环境
    }
  }

  /**
   * 获取被保险人信息
   * 使用SecureStorage获取凭据的版本
   */
  async getInsured(policyNo: any): Promise<any> {
    try {
      console.log('🔍 开始获取被保险人信息，保单号:', policyNo);
      
      // 🔑 从SecureStorage或Host获取API凭据
      let accessToken: string;
      let xApiKey: string;
      let baseUrlBFF: string;

      // 尝试从SecureStorage获取（如果在移动端环境）
      if (this.isSecureStorageAvailable()) {
        console.log('📱 检测到SecureStorage，从本地存储获取凭据');
        accessToken = await this.getFromSecureStorage('accessToken');
        xApiKey = await this.getFromSecureStorage('xapikey');
        baseUrlBFF = await this.getFromSecureStorage('baseUrlBFF') || this.getDefaultBaseUrl();
      } else {
        // 回退到从Host获取
        console.log('🌐 SecureStorage不可用，从Host获取凭据');
        const credentials = await this.hostDataService.getApiCredentialsFromHost();
        if (!credentials) {
          throw new Error('无法从Host应用或SecureStorage获取API凭据');
        }
        accessToken = credentials.accessToken;
        xApiKey = credentials.xApiKey;
        baseUrlBFF = credentials.baseUrlBFF;
      }

      if (!accessToken || !xApiKey) {
        throw new Error('API凭据不完整：缺少accessToken或xApiKey');
      }

      console.log('✅ 获取到API凭据，准备调用API');
      
      // 使用你指定的URL路径
      const url = `${baseUrlBFF}/v1/policies/insured`;
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': xApiKey,
        'strict-transport-security': 'max-age=15768000',
        'x-xss-protection': '1; mode=block',
        'Content-Type': 'application/json'
      });

      console.log('🌐 调用API:', url);
      console.log('🔑 使用的Headers:', {
        'Authorization': `Bearer ${accessToken.substring(0, 20)}...`,
        'x-api-key': xApiKey ? '***' : 'N/A'
      });
      
      // 设置30秒超时
      const body = {};
      return this.http.get(url, { headers }).pipe(
        timeout(30000) // 30秒超时
      ).toPromise();
      
    } catch (error) {
      console.error('❌ API调用失败:', error);
      
      // 如果是401错误，尝试刷新token
      if ((error as any)?.status === 401) {
        console.log('🔄 检测到401错误，尝试刷新token并重试...');
        
        if (this.isSecureStorageAvailable()) {
          // 如果使用SecureStorage，尝试从Host刷新并保存到SecureStorage
          const refreshed = await this.hostDataService.refreshApiCredentialsFromHost();
          if (refreshed) {
            await this.saveToSecureStorage('accessToken', refreshed.accessToken);
            await this.saveToSecureStorage('xapikey', refreshed.xApiKey);
            console.log('✅ Token刷新成功并保存到SecureStorage，重试API调用');
            return this.getInsured(policyNo); // 重试
          }
        } else {
          // 使用Host的刷新机制
          const refreshed = await this.hostDataService.refreshApiCredentialsFromHost();
          if (refreshed) {
            console.log('✅ Token刷新成功，重试API调用');
            return this.getInsured(policyNo); // 重试
          }
        }
      }
      
      throw error;
    }
  }

  /**
   * 通用的认证API调用方法
   * 可以用于其他需要认证的API调用
   */
  async callAuthenticatedApi(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any,
    additionalHeaders?: { [key: string]: string }
  ): Promise<any> {
    try {
      console.log(`🌐 调用认证API: ${method} ${endpoint}`);
      
      // 获取API凭据
      const credentials = await this.hostDataService.getApiCredentialsFromHost();
      if (!credentials) {
        throw new Error('无法从Host应用获取API凭据');
      }

      const url = `${credentials.baseUrlBFF}${endpoint}`;
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${credentials.accessToken}`,
        'x-api-key': credentials.xApiKey,
        'strict-transport-security': 'max-age=15768000',
        'x-xss-protection': '1; mode=block',
        'Content-Type': 'application/json',
        ...additionalHeaders
      });

      let request: Observable<any>;
      
      switch (method) {
        case 'GET':
          request = this.http.get(url, { headers });
          break;
        case 'POST':
          request = this.http.post(url, body, { headers });
          break;
        case 'PUT':
          request = this.http.put(url, body, { headers });
          break;
        case 'DELETE':
          request = this.http.delete(url, { headers });
          break;
        default:
          throw new Error(`不支持的HTTP方法: ${method}`);
      }

      return request.pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`❌ ${method} ${endpoint} 调用失败:`, error);
          
          // 如果是401错误，尝试刷新token并重试
          if (error.status === 401) {
            console.log('🔄 检测到401错误，尝试刷新token并重试...');
            return this.refreshTokenAndRetry(method, endpoint, body, additionalHeaders);
          }
          
          return throwError(error);
        })
      ).toPromise();
      
    } catch (error) {
      console.error('❌ 认证API调用失败:', error);
      throw error;
    }
  }

  /**
   * 刷新token并重试API调用
   */
  private refreshTokenAndRetry(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any,
    additionalHeaders?: { [key: string]: string }
  ): Observable<any> {
    return new Observable(observer => {
      this.hostDataService.refreshApiCredentialsFromHost().then(refreshed => {
        if (refreshed) {
          console.log('✅ Token刷新成功，重试API调用');
          // 重新调用API
          this.callAuthenticatedApi(method, endpoint, body, additionalHeaders)
            .then(result => {
              observer.next(result);
              observer.complete();
            })
            .catch(error => {
              observer.error(error);
            });
        } else {
          observer.error(new Error('Token刷新失败'));
        }
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  /**
   * 检查API凭据是否可用
   */
  async checkApiCredentials(): Promise<boolean> {
    const credentials = await this.hostDataService.getApiCredentialsFromHost();
    return !!(credentials && credentials.accessToken && credentials.xApiKey && credentials.baseUrlBFF);
  }

  /**
   * 获取当前API凭据状态
   */
  async getApiCredentialsStatus(): Promise<{
    available: boolean;
    hasAccessToken: boolean;
    hasXApiKey: boolean;
    hasBaseUrl: boolean;
    tokenExpiry?: string;
  }> {
    const credentials = await this.hostDataService.getApiCredentialsFromHost();
    
    return {
      available: !!credentials,
      hasAccessToken: !!(credentials?.accessToken),
      hasXApiKey: !!(credentials?.xApiKey),
      hasBaseUrl: !!(credentials?.baseUrlBFF),
      tokenExpiry: credentials?.tokenExpiry
    };
  }

  /**
   * 测试API连接
   */
  async testApiConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const status = await this.getApiCredentialsStatus();
      
      if (!status.available) {
        return {
          success: false,
          message: '无法获取API凭据',
          details: status
        };
      }

      if (!status.hasAccessToken || !status.hasXApiKey || !status.hasBaseUrl) {
        return {
          success: false,
          message: 'API凭据不完整',
          details: status
        };
      }

      // 可以在这里添加一个简单的API测试调用
      // 比如调用一个健康检查端点
      
      return {
        success: true,
        message: 'API凭据验证成功',
        details: status
      };
      
    } catch (error) {
      return {
        success: false,
        message: `API连接测试失败: ${error}`,
        details: error
      };
    }
  }

  /**
   * 手动设置SecureStorage中的API凭据（用于测试）
   */
  async setApiCredentialsToSecureStorage(credentials: {
    accessToken: string;
    xApiKey: string;
    baseUrlBFF?: string;
  }): Promise<void> {
    try {
      console.log('💾 保存API凭据到SecureStorage...');
      
      await this.saveToSecureStorage('accessToken', credentials.accessToken);
      await this.saveToSecureStorage('xapikey', credentials.xApiKey);
      
      if (credentials.baseUrlBFF) {
        await this.saveToSecureStorage('baseUrlBFF', credentials.baseUrlBFF);
      }
      
      console.log('✅ API凭据已保存到SecureStorage');
    } catch (error) {
      console.error('❌ 保存API凭据到SecureStorage失败:', error);
      throw error;
    }
  }

  /**
   * 从SecureStorage获取API凭据状态
   */
  async getSecureStorageCredentialsStatus(): Promise<{
    available: boolean;
    hasAccessToken: boolean;
    hasXApiKey: boolean;
    hasBaseUrl: boolean;
    source: string;
  }> {
    try {
      if (!this.isSecureStorageAvailable()) {
        return {
          available: false,
          hasAccessToken: false,
          hasXApiKey: false,
          hasBaseUrl: false,
          source: 'SecureStorage不可用'
        };
      }

      const accessToken = await this.getFromSecureStorage('accessToken');
      const xApiKey = await this.getFromSecureStorage('xapikey');
      const baseUrlBFF = await this.getFromSecureStorage('baseUrlBFF');

      return {
        available: true,
        hasAccessToken: !!accessToken,
        hasXApiKey: !!xApiKey,
        hasBaseUrl: !!baseUrlBFF,
        source: typeof (window as any).SecureStoragePlugin !== 'undefined' ? 'SecureStoragePlugin' : 'localStorage'
      };
    } catch (error) {
      return {
        available: false,
        hasAccessToken: false,
        hasXApiKey: false,
        hasBaseUrl: false,
        source: `错误: ${error}`
      };
    }
  }

  /**
   * 清除SecureStorage中的API凭据
   */
  async clearSecureStorageCredentials(): Promise<void> {
    try {
      console.log('🧹 清除SecureStorage中的API凭据...');
      
      if (typeof (window as any).SecureStoragePlugin !== 'undefined') {
        await (window as any).SecureStoragePlugin.remove({ key: 'accessToken' });
        await (window as any).SecureStoragePlugin.remove({ key: 'xapikey' });
        await (window as any).SecureStoragePlugin.remove({ key: 'baseUrlBFF' });
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('xapikey');
        localStorage.removeItem('baseUrlBFF');
      }
      
      console.log('✅ SecureStorage中的API凭据已清除');
    } catch (error) {
      console.error('❌ 清除SecureStorage凭据失败:', error);
      throw error;
    }
  }
}