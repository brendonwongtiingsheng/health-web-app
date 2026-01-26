import { OnInit, OnDestroy, Directive } from '@angular/core';
import { Subscription } from 'rxjs';
import { HostDataService, HostData } from '../services/host-data.service';

@Directive()
export class HostDataMixin implements OnInit, OnDestroy {
  protected hostData: HostData = {};
  protected hostDataSubscription?: Subscription;

  constructor(protected hostDataService: HostDataService) {}

  ngOnInit(): void {
    this.initializeHostData();
  }

  ngOnDestroy(): void {
    if (this.hostDataSubscription) {
      this.hostDataSubscription.unsubscribe();
    }
  }

  /**
   * 初始化 Host 数据
   */
  protected initializeHostData(): void {
    // 获取初始数据
    this.hostData = this.hostDataService.getHostData();
    console.log('📨 组件接收到 Host 数据:', this.hostData);

    // 订阅数据更新
    this.hostDataSubscription = this.hostDataService.hostData$.subscribe(data => {
      this.hostData = data;
      this.onHostDataUpdated(data);
    });
  }

  /**
   * Host 数据更新时的回调
   * 子类可以重写这个方法来处理数据更新
   */
  protected onHostDataUpdated(data: HostData): void {
    console.log('🔄 Host 数据已更新:', data);
  }

  /**
   * 获取用户 ID
   */
  protected getUserId(): string | null {
    return this.hostData.userId || null;
  }

  /**
   * 获取用户配置文件
   */
  protected getUserProfile(): any | null {
    return this.hostData.userProfile || null;
  }

  /**
   * 获取声明类型
   */
  protected getClaimType(): string | null {
    return this.hostData.claimType || null;
  }

  /**
   * 获取语言设置
   */
  protected getLanguage(): string {
    return this.hostData.language || 'en';
  }
}