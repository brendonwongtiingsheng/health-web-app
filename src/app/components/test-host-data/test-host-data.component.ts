import { Component, OnInit } from '@angular/core';
import { HostDataMixin } from '../../mixins/host-data.mixin';
import { HostDataService, HostData } from '../../services/host-data.service';

@Component({
  selector: 'app-test-host-data',
  template: `
    <div class="test-host-data">
      <h2>🧪 MFE Host Data 测试页面</h2>
      
      <div class="data-section">
        <h3>📨 接收到的 Host 数据</h3>
        <div class="data-display">
          <pre>{{ hostData | json }}</pre>
        </div>
      </div>

      <div class="parsed-data" *ngIf="hostData && getObjectKeys(hostData).length > 0">
        <h3>📊 解析后的数据</h3>
        <div class="data-item" *ngIf="getUserId()">
          <strong>用户 ID:</strong> {{ getUserId() }}
        </div>
        <div class="data-item" *ngIf="getUserProfile()">
          <strong>用户配置文件:</strong> {{ getUserProfile() | json }}
        </div>
        <div class="data-item" *ngIf="getClaimType()">
          <strong>声明类型:</strong> {{ getClaimType() }}
        </div>
        <div class="data-item">
          <strong>语言:</strong> {{ getLanguage() }}
        </div>
        <div class="data-item">
          <strong>欢迎消息:</strong> {{ getWelcomeMessage() }}
        </div>
      </div>

      <div class="debug-section">
        <h3>🔍 调试信息</h3>
        <button (click)="testParameterReceiving()" class="test-btn">
          🧪 测试参数接收
        </button>
        <button (click)="simulateHostData()" class="test-btn">
          🎭 模拟 Host 数据
        </button>
        <button (click)="disablePeriodicCheck()" class="test-btn">
          ⏸️ 禁用定期检查
        </button>
        <button (click)="enablePeriodicCheck()" class="test-btn">
          ▶️ 启用定期检查
        </button>
        <div class="debug-output">
          <pre>{{ debugOutput }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-host-data {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .data-section, .parsed-data, .debug-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .data-display {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
    }
    
    .data-item {
      margin: 10px 0;
      padding: 5px;
      background: #f9f9f9;
      border-left: 3px solid #007bff;
    }
    
    .test-btn {
      margin: 5px;
      padding: 10px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .test-btn:hover {
      background: #0056b3;
    }
    
    .debug-output {
      background: #000;
      color: #0f0;
      padding: 10px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 12px;
      max-height: 300px;
      overflow-y: auto;
    }
    
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `]
})
export class TestHostDataComponent extends HostDataMixin implements OnInit {
  debugOutput: string = '';

  constructor(hostDataService: HostDataService) {
    super(hostDataService);
  }

  /**
   * 获取对象键数组（用于模板）
   */
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.addDebugLog('🚀 TestHostDataComponent 初始化完成');
  }

  /**
   * Host 数据更新时的处理
   */
  protected override onHostDataUpdated(data: HostData): void {
    super.onHostDataUpdated(data);
    this.addDebugLog(`🔄 Host 数据更新: ${JSON.stringify(data, null, 2)}`);
  }

  /**
   * 获取欢迎消息
   */
  getWelcomeMessage(): string {
    const name = this.hostData.userProfile?.name || 'User';
    const language = this.getLanguage();
    
    if (language === 'km') {
      return `ស្វាគមន៍ ${name}`;
    } else {
      return `Welcome ${name}`;
    }
  }

  /**
   * 测试参数接收
   */
  testParameterReceiving(): void {
    this.addDebugLog('🧪 开始测试 MFE 参数接收...');
    
    // 测试 1: 检查服务状态
    this.addDebugLog(`Host Data Service: ${this.hostDataService ? '✅ 正常' : '❌ 未找到'}`);
    
    // 测试 2: 获取当前数据
    const currentData = this.hostDataService.getHostData();
    this.addDebugLog(`当前 Host 数据: ${JSON.stringify(currentData, null, 2)}`);
    
    // 测试 3: 检查具体字段
    this.addDebugLog(`用户 ID: ${this.hostDataService.getUserId()}`);
    this.addDebugLog(`用户配置文件: ${JSON.stringify(this.hostDataService.getUserProfile())}`);
    this.addDebugLog(`声明类型: ${this.hostDataService.getClaimType()}`);
    this.addDebugLog(`语言: ${this.hostDataService.getLanguage()}`);
    
    // 测试 4: 检查 Window 对象
    this.addDebugLog(`Window hostSharedData: ${JSON.stringify((window as any).hostSharedData)}`);
    this.addDebugLog(`Window getMfeData: ${typeof (window as any).getMfeData}`);
    this.addDebugLog(`Window subscribeMfeData: ${typeof (window as any).subscribeMfeData}`);
    
    // 测试 5: 检查 URL 参数
    const urlParams = new URLSearchParams(window.location.search);
    const urlParamsObj: any = {};
    urlParams.forEach((value, key) => {
      urlParamsObj[key] = value;
    });
    this.addDebugLog(`URL 参数: ${JSON.stringify(urlParamsObj)}`);
  }

  /**
   * 模拟 Host 数据
   */
  simulateHostData(): void {
    this.addDebugLog('🎭 模拟 Host 数据...');
    
    // 模拟在 Window 对象上设置数据
    (window as any).hostSharedData = {
      userId: 'test-user-123',
      userProfile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        userId: 'test-user-123',
        language: 'en'
      },
      claimType: 'medical',
      language: 'en',
      sessionData: {
        isLoggedIn: true,
        token: 'mock-token-123'
      },
      pageContext: 'test-page'
    };
    
    this.addDebugLog('✅ 模拟数据已设置到 Window.hostSharedData');
    this.addDebugLog('⏳ 等待服务检测数据变化...');
  }

  /**
   * 禁用定期检查
   */
  disablePeriodicCheck(): void {
    this.hostDataService.disablePeriodicCheck();
    this.addDebugLog('⏸️ 定期检查已禁用');
  }

  /**
   * 启用定期检查
   */
  enablePeriodicCheck(): void {
    this.hostDataService.enablePeriodicCheck(5000); // 5秒间隔
    this.addDebugLog('▶️ 定期检查已启用（每5秒）');
  }

  /**
   * 添加调试日志
   */
  private addDebugLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.debugOutput += `[${timestamp}] ${message}\n`;
    console.log(message);
  }
}