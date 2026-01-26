import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  userId: string;
  language?: string;
  [key: string]: any;
}

export interface HostData {
  userId?: string;
  userProfile?: UserProfile;
  claimType?: string;
  language?: string;
  sessionData?: any;
  pageContext?: string;
  timestamp?: string;
  claimData?: any;
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
   * 兼容 Host 应用的 MfeSharedDataService 传递的数据
   */
  private initializeHostData(): void {
    console.log('🚀 MFE 开始初始化 Host 数据接收...');
    
    // 方法 1: 从 Host 的 window.hostSharedData 获取数据
    const windowData = this.getDataFromHostWindow();
    
    // 方法 2: 从 URL 参数获取数据
    const urlData = this.getDataFromUrl();
    
    // 方法 3: 设置 Host 的订阅回调
    this.setupHostSubscription();
    
    // 合并数据
    const combinedData = { ...windowData, ...urlData };
    
    if (Object.keys(combinedData).length > 0) {
      console.log('📨 MFE 接收到 Host 数据:', combinedData);
      this.hostDataSubject.next(combinedData);
    } else {
      console.log('⚠️ MFE 暂未接收到 Host 数据，将继续监听...');
    }
    
    // 设置定期检查
    this.setupPeriodicDataCheck();
  }

  /**
   * 从 Host 应用的 Window 对象获取数据
   * 兼容 Host 端的 MfeSharedDataService.setHostData() 方法
   */
  private getDataFromHostWindow(): HostData {
    try {
      // 方法 1: 从 Host 的 hostSharedData 获取
      const hostSharedData = (window as any).hostSharedData;
      if (hostSharedData && typeof hostSharedData === 'object') {
        console.log('📦 从 Host Window.hostSharedData 获取数据:', hostSharedData);
        return this.normalizeHostData(hostSharedData);
      }
      
      // 方法 2: 使用 Host 提供的 getMfeData 函数
      const getMfeData = (window as any).getMfeData;
      if (getMfeData && typeof getMfeData === 'function') {
        const data = getMfeData();
        console.log('📦 从 Host Window.getMfeData() 获取数据:', data);
        return this.normalizeHostData(data || {});
      }
      
      // 方法 3: 检查 Host 的 mfeSharedDataService
      const mfeSharedDataService = (window as any).mfeSharedDataService;
      if (mfeSharedDataService && typeof mfeSharedDataService.getHostData === 'function') {
        const data = mfeSharedDataService.getHostData();
        console.log('📦 从 Host mfeSharedDataService 获取数据:', data);
        return this.normalizeHostData(data || {});
      }
      
      console.log('⚠️ Host Window 对象中没有找到数据');
      return {};
    } catch (error) {
      console.error('❌ 从 Host Window 对象获取数据失败:', error);
      return {};
    }
  }

  /**
   * 从 URL 参数获取数据
   * 兼容 Host 端的 MfeNavigationService 传递的 queryParams
   */
  private getDataFromUrl(): HostData {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const data: HostData = {};
      
      // 获取 Host 端常用的参数
      if (urlParams.get('userId')) data.userId = urlParams.get('userId')!;
      if (urlParams.get('claimType')) data.claimType = urlParams.get('claimType')!;
      if (urlParams.get('language') || urlParams.get('lang')) {
        data.language = urlParams.get('language') || urlParams.get('lang')!;
      }
      if (urlParams.get('context')) data.pageContext = urlParams.get('context')!;
      
      // 获取所有参数作为备用
      const allParams: any = {};
      urlParams.forEach((value, key) => {
        allParams[key] = value;
      });
      
      if (Object.keys(allParams).length > 0) {
        data['urlParams'] = allParams;
        console.log('🔗 从 Host URL 参数获取数据:', data);
      }
      
      return data;
    } catch (error) {
      console.error('❌ 从 URL 参数获取数据失败:', error);
      return {};
    }
  }

  /**
   * 设置 Host 应用的订阅回调
   * 兼容 Host 端的 subscribeMfeData 方法
   */
  private setupHostSubscription(): void {
    try {
      // 检查 Host 是否提供了订阅方法
      const subscribeMfeData = (window as any).subscribeMfeData;
      if (subscribeMfeData && typeof subscribeMfeData === 'function') {
        console.log('🔗 设置 Host 数据订阅...');
        
        const subscription = subscribeMfeData((data: HostData) => {
          console.log('📨 收到 Host 订阅数据更新:', data);
          this.updateHostData(this.normalizeHostData(data));
        });
        
        console.log('✅ Host 数据订阅设置成功');
        
        // 保存订阅引用以便后续清理
        (window as any)._mfeSubscription = subscription;
      } else {
        console.log('⚠️ Host 未提供 subscribeMfeData 方法');
      }
    } catch (error) {
      console.error('❌ 设置 Host 数据订阅失败:', error);
    }
  }

  /**
   * 定期检查 Host 数据更新
   * 确保能捕获到 Host 端 MfeSharedDataService 的数据变化
   */
  private setupPeriodicDataCheck(): void {
    setInterval(() => {
      const currentWindowData = this.getDataFromHostWindow();
      const currentData = this.hostDataSubject.value;
      
      // 简单的数据变化检测
      if (JSON.stringify(currentWindowData) !== JSON.stringify(currentData)) {
        console.log('🔄 检测到 Host 数据变化，更新中...');
        this.updateHostData(currentWindowData);
      }
    }, 2000); // 每2秒检查一次
  }

  /**
   * 标准化 Host 数据格式
   * 确保数据格式与 MFE 期望的格式一致
   */
  private normalizeHostData(data: any): HostData {
    if (!data || typeof data !== 'object') {
      return {};
    }

    const normalized: HostData = {};

    // 标准化字段映射
    if (data.userId) normalized.userId = data.userId;
    if (data.userProfile) normalized.userProfile = data.userProfile;
    if (data.claimType) normalized.claimType = data.claimType;
    if (data.language) normalized.language = data.language;
    if (data.sessionData) normalized.sessionData = data.sessionData;
    if (data.pageContext) normalized.pageContext = data.pageContext;
    if (data.timestamp) normalized.timestamp = data.timestamp;
    if (data.claimData) normalized.claimData = data.claimData;

    // 保留其他所有字段
    Object.keys(data).forEach(key => {
      if (!normalized.hasOwnProperty(key)) {
        normalized[key] = data[key];
      }
    });

    return normalized;
  }

  /**
   * 更新 Host 数据
   */
  updateHostData(newData: HostData): void {
    const currentData = this.hostDataSubject.value;
    const normalizedData = this.normalizeHostData(newData);
    const updatedData = { ...currentData, ...normalizedData };
    this.hostDataSubject.next(updatedData);
    console.log('🔄 MFE Host 数据已更新:', updatedData);
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
  getUserProfile(): UserProfile | null {
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
   * 获取声明数据
   */
  getClaimData(): any | null {
    return this.hostDataSubject.value.claimData || null;
  }

  /**
   * 获取页面上下文
   */
  getPageContext(): string | null {
    return this.hostDataSubject.value.pageContext || null;
  }

  /**
   * 获取时间戳
   */
  getTimestamp(): string | null {
    return this.hostDataSubject.value.timestamp || null;
  }

  /**
   * 检查用户是否已登录
   */
  isUserLoggedIn(): boolean {
    const sessionData = this.hostDataSubject.value.sessionData;
    return sessionData?.isLoggedIn === true;
  }

  /**
   * 获取会话数据
   */
  getSessionData(): any | null {
    return this.hostDataSubject.value.sessionData || null;
  }

  /**
   * 手动刷新 Host 数据
   * 强制重新从所有来源获取数据
   */
  refreshHostData(): void {
    console.log('🔄 手动刷新 Host 数据...');
    this.initializeHostData();
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    // 清理订阅
    if ((window as any)._mfeSubscription) {
      try {
        if (typeof (window as any)._mfeSubscription.unsubscribe === 'function') {
          (window as any)._mfeSubscription.unsubscribe();
        }
        delete (window as any)._mfeSubscription;
        console.log('✅ MFE 订阅已清理');
      } catch (error) {
        console.error('❌ 清理 MFE 订阅失败:', error);
      }
    }
  }
}