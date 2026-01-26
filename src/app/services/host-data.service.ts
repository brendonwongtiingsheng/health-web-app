import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface HostData {
  userId?: string;
  userProfile?: {
    name: string;
    email: string;
    phone: string;
    userId: string;
    language?: string;
    [key: string]: any;
  };
  claimType?: string;
  language?: string;
  sessionData?: any;
  pageContext?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class HostDataService {
  private hostDataSubject = new BehaviorSubject<HostData>({});
  public hostData$ = this.hostDataSubject.asObservable();

  constructor() {
    console.log('🔧 MFE Host Data Service initialized');
    this.initializeHostData();
  }

  /**
   * 初始化 Host 数据
   * 从多个来源获取数据：Window 对象、URL 参数等
   */
  private initializeHostData(): void {
    // 方法 1: 从 Window 对象获取数据
    const windowData = this.getDataFromWindow();
    
    // 方法 2: 从 URL 参数获取数据
    const urlData = this.getDataFromUrl();
    
    // 合并数据
    const combinedData = { ...windowData, ...urlData };
    
    if (Object.keys(combinedData).length > 0) {
      console.log('📨 MFE 接收到 Host 数据:', combinedData);
      this.hostDataSubject.next(combinedData);
    }
    
    // 设置数据监听
    this.setupDataListeners();
  }

  /**
   * 从 Window 对象获取数据
   */
  private getDataFromWindow(): HostData {
    try {
      // 方法 2.1: 直接从 hostSharedData 获取
      const hostSharedData = (window as any).hostSharedData;
      if (hostSharedData && typeof hostSharedData === 'object') {
        console.log('📦 从 Window.hostSharedData 获取数据:', hostSharedData);
        return hostSharedData;
      }
      
      // 方法 2.2: 使用 Host 提供的函数
      const getMfeData = (window as any).getMfeData;
      if (getMfeData && typeof getMfeData === 'function') {
        const data = getMfeData();
        console.log('📦 从 Window.getMfeData() 获取数据:', data);
        return data || {};
      }
      
      console.log('⚠️ Window 对象中没有找到 Host 数据');
      return {};
    } catch (error) {
      console.error('❌ 从 Window 对象获取数据失败:', error);
      return {};
    }
  }

  /**
   * 从 URL 参数获取数据
   */
  private getDataFromUrl(): HostData {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const data: HostData = {};
      
      // 获取常见的参数
      if (urlParams.get('userId')) data.userId = urlParams.get('userId')!;
      if (urlParams.get('claimType')) data.claimType = urlParams.get('claimType')!;
      if (urlParams.get('language') || urlParams.get('lang')) {
        data.language = urlParams.get('language') || urlParams.get('lang')!;
      }
      if (urlParams.get('context')) data.pageContext = urlParams.get('context')!;
      
      // 获取所有参数
      const allParams: any = {};
      urlParams.forEach((value, key) => {
        allParams[key] = value;
      });
      
      if (Object.keys(allParams).length > 0) {
        data['urlParams'] = allParams;
        console.log('🔗 从 URL 参数获取数据:', data);
      }
      
      return data;
    } catch (error) {
      console.error('❌ 从 URL 参数获取数据失败:', error);
      return {};
    }
  }

  /**
   * 设置数据监听器
   * 监听 Host 应用的数据更新
   */
  private setupDataListeners(): void {
    // 监听 Host 应用的数据更新
    if ((window as any).subscribeMfeData) {
      try {
        (window as any).subscribeMfeData((data: HostData) => {
          console.log('📨 收到 Host 数据更新:', data);
          this.updateHostData(data);
        });
        console.log('✅ Host 数据监听器设置成功');
      } catch (error) {
        console.error('❌ 设置 Host 数据监听器失败:', error);
      }
    }
    
    // 定期检查数据更新
    this.setupPeriodicDataCheck();
  }

  /**
   * 定期检查数据更新
   */
  private setupPeriodicDataCheck(): void {
    setInterval(() => {
      const currentWindowData = this.getDataFromWindow();
      const currentData = this.hostDataSubject.value;
      
      // 简单的数据变化检测
      if (JSON.stringify(currentWindowData) !== JSON.stringify(currentData)) {
        console.log('🔄 检测到数据变化，更新中...');
        this.updateHostData(currentWindowData);
      }
    }, 2000); // 每2秒检查一次
  }

  /**
   * 更新 Host 数据
   */
  updateHostData(newData: HostData): void {
    const currentData = this.hostDataSubject.value;
    const updatedData = { ...currentData, ...newData };
    this.hostDataSubject.next(updatedData);
  }

  /**
   * 获取当前 Host 数据
   */
  getHostData(): HostData {
    return this.hostDataSubject.value;
  }

  /**
   * 获取用户 ID
   */
  getUserId(): string | null {
    return this.hostDataSubject.value.userId || null;
  }

  /**
   * 获取用户配置文件
   */
  getUserProfile(): any | null {
    return this.hostDataSubject.value.userProfile || null;
  }

  /**
   * 获取声明类型
   */
  getClaimType(): string | null {
    return this.hostDataSubject.value.claimType || null;
  }

  /**
   * 获取语言设置
   */
  getLanguage(): string {
    return this.hostDataSubject.value.language || 'en';
  }

  /**
   * 检查用户是否已登录
   */
  isUserLoggedIn(): boolean {
    const sessionData = this.hostDataSubject.value.sessionData;
    return sessionData?.isLoggedIn === true;
  }
}