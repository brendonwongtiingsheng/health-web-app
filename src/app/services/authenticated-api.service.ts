import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
   * 验证证书资格
   * 这是你原始的verifyCertEligibility方法的Angular HTTP版本
   */
  async verifyCertEligibility(policyNo: string): Promise<any> {
    try {
      console.log('🔍 开始验证证书资格，保单号:', policyNo);
      
      // 🔑 从Host获取API凭据
      const credentials = await this.hostDataService.getApiCredentialsFromHost();
      if (!credentials) {
        throw new Error('无法从Host应用获取API凭据');
      }

      console.log('✅ 获取到API凭据，准备调用API');
      
      const url = `${credentials.baseUrlBFF}/v2/policies/${policyNo}/certificate`;
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${credentials.accessToken}`,
        'x-api-key': credentials.xApiKey,
        'strict-transport-security': 'max-age=15768000',
        'x-xss-protection': '1; mode=block',
        'Content-Type': 'application/json'
      });

      console.log('🌐 调用API:', url);
      
      return this.http.get(url, { headers }).toPromise();
      
    } catch (error) {
      console.error('❌ API调用失败:', error);
      
      // 如果是401错误，尝试刷新token
      if ((error as any)?.status === 401) {
        console.log('🔄 检测到401错误，尝试刷新token并重试...');
        const refreshed = await this.hostDataService.refreshApiCredentialsFromHost();
        if (refreshed) {
          console.log('✅ Token刷新成功，重试API调用');
          return this.verifyCertEligibility(policyNo); // 重试
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
}