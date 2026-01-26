# Host 应用测试 MFE Remote 参数传递指南

## 概述
这个指南展示了如何在 Host 应用中测试与 MFE Remote 应用的参数传递功能。
**特别适配您的 Host 端 MfeSharedDataService 和 MfeNavigationService 系统！**

## 🎯 与您的 Host 系统完美配合

### 您的 Host 端系统特点
- ✅ **MfeSharedDataService** - 核心数据共享服务
- ✅ **MfeNavigationService** - 导航和参数传递服务  
- ✅ **三种传递方法** - URL参数、Window对象、共享服务
- ✅ **自动集成** - AppComponent 中自动初始化

### MFE 端已完美适配
- ✅ 兼容您的 `window.hostSharedData` 格式
- ✅ 支持您的 `getMfeData()` 函数
- ✅ 响应您的 `subscribeMfeData()` 订阅
- ✅ 识别您的 `mfeSharedDataService` 实例

## 🧪 测试方法

### 方法 1: 使用您的 Host 服务测试 (推荐)

#### 1.1 在您的 Host 应用组件中测试

```typescript
// 在您的 Host 组件中
export class YourHostComponent {
  constructor(
    private mfeSharedDataService: MfeSharedDataService,
    private mfeNavigationService: MfeNavigationService
  ) {}

  // 测试基础数据传递
  testBasicDataPassing() {
    const userData = {
      userId: 'host-test-123',
      userProfile: {
        name: 'Host Test User',
        email: 'host.test@example.com',
        phone: '+1234567890',
        userId: 'host-test-123',
        language: 'en'
      },
      claimType: 'medical',
      language: 'en',
      sessionData: {
        isLoggedIn: true,
        token: 'host-token-123'
      }
    };

    // 使用您的服务设置数据
    this.mfeSharedDataService.setHostData(userData);
    console.log('✅ Host 数据已通过 MfeSharedDataService 设置');
  }

  // 测试导航到 Terms & Conditions
  testNavigateToTerms() {
    this.mfeNavigationService.navigateToTermsConditions('test-user-456', 'en');
    console.log('✅ 已导航到 Terms & Conditions 并传递参数');
  }

  // 测试导航到 Claim Submission
  testNavigateToClaimSubmission() {
    const claimData = {
      userId: 'claim-user-789',
      claimType: 'medicash',
      language: 'km',
      claimAmount: 1000,
      description: 'Medical claim test'
    };

    this.mfeNavigationService.navigateToClaimSubmission(claimData);
    console.log('✅ 已导航到 Claim Submission 并传递声明数据');
  }

  // 测试用户配置文件设置
  testSetUserProfile() {
    const userProfile = {
      name: 'Advanced Test User',
      email: 'advanced@example.com',
      phone: '+0987654321',
      userId: 'advanced-123',
      language: 'km',
      department: 'Claims',
      role: 'Manager'
    };

    this.mfeNavigationService.setUserProfile(userProfile);
    console.log('✅ 用户配置文件已设置');
  }

  // 测试数据更新
  testUpdateMfeData() {
    const updateData = {
      language: 'km',
      claimType: 'dental',
      timestamp: new Date().toISOString(),
      updateReason: 'Language changed to Khmer'
    };

    this.mfeNavigationService.updateMfeData(updateData);
    console.log('✅ MFE 数据已更新');
  }
}
```

#### 1.2 在您的 Host HTML 模板中添加测试按钮

```html
<!-- 在您的 Host 组件模板中 -->
<div class="host-test-panel">
  <h2>🧪 MFE 参数传递测试</h2>
  
  <button (click)="testBasicDataPassing()">
    📤 测试基础数据传递
  </button>
  
  <button (click)="testNavigateToTerms()">
    📋 导航到 Terms & Conditions
  </button>
  
  <button (click)="testNavigateToClaimSubmission()">
    🏥 导航到 Claim Submission
  </button>
  
  <button (click)="testSetUserProfile()">
    👤 设置用户配置文件
  </button>
  
  <button (click)="testUpdateMfeData()">
    🔄 更新 MFE 数据
  </button>
  
  <div class="current-data">
    <h3>当前 Host 数据:</h3>
    <pre>{{ mfeSharedDataService.getHostData() | json }}</pre>
  </div>
</div>
```

### 方法 2: 浏览器控制台测试 (兼容您的系统)

#### 2.1 打开 MFE Remote 应用
```
http://localhost:4200/test-host-data
```

#### 2.2 在浏览器控制台中模拟您的 Host 系统

**模拟您的 MfeSharedDataService:**
```javascript
// 模拟您的 Host 系统设置数据
window.hostSharedData = {
  userId: 'console-test-123',
  userProfile: {
    name: 'Console Test User',
    email: 'console.test@example.com',
    phone: '+1234567890',
    userId: 'console-test-123',
    language: 'en'
  },
  claimType: 'medical',
  language: 'en',
  sessionData: {
    isLoggedIn: true,
    token: 'console-token-123'
  },
  pageContext: 'console-test',
  timestamp: new Date().toISOString()
};

// 模拟您的 getMfeData 函数
window.getMfeData = function() {
  return window.hostSharedData;
};

// 模拟您的 mfeSharedDataService
window.mfeSharedDataService = {
  getHostData: () => window.hostSharedData,
  setHostData: (data) => {
    window.hostSharedData = { ...window.hostSharedData, ...data };
    console.log('📤 Host 数据已更新:', window.hostSharedData);
  }
};

console.log('✅ Host 系统模拟完成');
```

**测试订阅功能:**
```javascript
// 模拟您的 subscribeMfeData 功能
let mfeSubscribers = [];

window.subscribeMfeData = function(callback) {
  mfeSubscribers.push(callback);
  console.log('🔗 MFE 订阅者已添加，总数:', mfeSubscribers.length);
  
  // 返回订阅对象（模拟 RxJS Subscription）
  return {
    unsubscribe: () => {
      const index = mfeSubscribers.indexOf(callback);
      if (index > -1) {
        mfeSubscribers.splice(index, 1);
        console.log('🔌 MFE 订阅已取消');
      }
    }
  };
};

// 模拟数据更新推送
function pushDataUpdate() {
  const updateData = {
    userId: 'updated-' + Date.now(),
    language: Math.random() > 0.5 ? 'en' : 'km',
    claimType: ['medical', 'dental', 'vision'][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString(),
    updateSource: 'Host System Push'
  };
  
  // 更新 window 数据
  window.hostSharedData = { ...window.hostSharedData, ...updateData };
  
  // 通知所有订阅者
  mfeSubscribers.forEach(callback => {
    try {
      callback(updateData);
    } catch (error) {
      console.error('❌ 订阅回调错误:', error);
    }
  });
  
  console.log('📨 数据更新已推送给', mfeSubscribers.length, '个 MFE 订阅者');
}

// 每3秒自动推送更新
setInterval(pushDataUpdate, 3000);

console.log('✅ Host 订阅系统已设置');
```

### 方法 2: URL 参数测试

#### 2.1 基础 URL 参数测试
```
http://localhost:4200/with-params?userId=url-user-123&claimType=medical&language=en&context=url-test
```

#### 2.2 复杂 URL 参数测试
```
http://localhost:4200/with-params/456?userId=complex-user-456&claimType=dental&language=km&context=complex-test&priority=high&source=mobile&version=2.1.0
```

### 方法 3: 创建 Host 应用测试页面

如果您有一个实际的 Host 应用，可以创建以下测试页面：

#### 3.1 HTML 测试页面
```html
<!DOCTYPE html>
<html>
<head>
    <title>Host 应用 - MFE 测试</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        button { margin: 5px; padding: 10px 15px; background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
        iframe { width: 100%; height: 600px; border: 1px solid #ccc; }
        .data-display { background: #f5f5f5; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🏠 Host 应用 - MFE Remote 测试</h1>
    
    <div class="test-section">
        <h2>🎛️ 数据控制面板</h2>
        <button onclick="setBasicData()">设置基础数据</button>
        <button onclick="setAdvancedData()">设置高级数据</button>
        <button onclick="setKhmerData()">设置高棉语数据</button>
        <button onclick="clearData()">清除数据</button>
        <button onclick="updateData()">更新数据</button>
        
        <div class="data-display">
            <h3>当前 Host 数据:</h3>
            <pre id="currentData">无数据</pre>
        </div>
    </div>
    
    <div class="test-section">
        <h2>📱 MFE Remote 应用</h2>
        <iframe id="mfeFrame" src="http://localhost:4200/test-host-data"></iframe>
    </div>

    <script>
        // 数据更新显示
        function updateDataDisplay() {
            document.getElementById('currentData').textContent = 
                JSON.stringify(window.hostSharedData || {}, null, 2);
        }

        // 设置基础数据
        function setBasicData() {
            window.hostSharedData = {
                userId: 'host-user-123',
                userProfile: {
                    name: 'Host Test User',
                    email: 'host.test@example.com',
                    phone: '+1234567890',
                    userId: 'host-user-123',
                    language: 'en'
                },
                claimType: 'medical',
                language: 'en',
                sessionData: {
                    isLoggedIn: true,
                    token: 'host-token-123'
                },
                pageContext: 'host-test'
            };
            updateDataDisplay();
            console.log('✅ 基础数据已设置');
        }

        // 设置高级数据
        function setAdvancedData() {
            window.hostSharedData = {
                userId: 'host-advanced-456',
                userProfile: {
                    name: 'Advanced Host User',
                    email: 'advanced.host@example.com',
                    phone: '+0987654321',
                    userId: 'host-advanced-456',
                    language: 'en',
                    department: 'Claims Processing',
                    role: 'Senior Analyst',
                    preferences: {
                        theme: 'light',
                        notifications: true,
                        autoSave: true
                    }
                },
                claimType: 'comprehensive',
                language: 'en',
                sessionData: {
                    isLoggedIn: true,
                    token: 'advanced-host-token-456',
                    permissions: ['read', 'write', 'approve', 'admin'],
                    sessionTimeout: 3600
                },
                pageContext: 'claims-dashboard',
                workflowData: {
                    currentStep: 'review',
                    totalSteps: 5,
                    priority: 'high',
                    assignedTo: 'host-advanced-456'
                },
                systemInfo: {
                    version: '3.2.1',
                    environment: 'production',
                    region: 'us-east-1'
                }
            };
            updateDataDisplay();
            console.log('✅ 高级数据已设置');
        }

        // 设置高棉语数据
        function setKhmerData() {
            window.hostSharedData = {
                userId: 'host-khmer-789',
                userProfile: {
                    name: 'សុខ វិចិត្រ',
                    email: 'sok.vichit@example.com',
                    phone: '+855123456789',
                    userId: 'host-khmer-789',
                    language: 'km'
                },
                claimType: 'medical',
                language: 'km',
                sessionData: {
                    isLoggedIn: true,
                    token: 'khmer-token-789'
                },
                pageContext: 'khmer-test',
                localizedData: {
                    welcomeMessage: 'ស្វាគមន៍',
                    currency: 'KHR',
                    dateFormat: 'dd/mm/yyyy'
                }
            };
            updateDataDisplay();
            console.log('✅ 高棉语数据已设置');
        }

        // 清除数据
        function clearData() {
            delete window.hostSharedData;
            delete window.getMfeData;
            updateDataDisplay();
            console.log('✅ 数据已清除');
        }

        // 更新数据
        function updateData() {
            if (window.hostSharedData) {
                window.hostSharedData.lastUpdate = new Date().toISOString();
                window.hostSharedData.updateCounter = (window.hostSharedData.updateCounter || 0) + 1;
                updateDataDisplay();
                console.log('✅ 数据已更新');
            } else {
                alert('请先设置数据');
            }
        }

        // 初始化
        updateDataDisplay();
        
        // 设置动态数据函数
        window.getMfeData = function() {
            return window.hostSharedData || {};
        };
    </script>
</body>
</html>
```

#### 3.2 Angular Host 应用示例

如果您的 Host 应用是 Angular 应用，可以创建以下组件：

```typescript
// host-mfe-test.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-host-mfe-test',
  template: `
    <div class="host-test-container">
      <h1>🏠 Host 应用 - MFE 测试</h1>
      
      <div class="control-panel">
        <h2>🎛️ 数据控制面板</h2>
        <button (click)="setBasicData()">设置基础数据</button>
        <button (click)="setAdvancedData()">设置高级数据</button>
        <button (click)="setKhmerData()">设置高棉语数据</button>
        <button (click)="clearData()">清除数据</button>
        <button (click)="updateData()">更新数据</button>
        
        <div class="data-display">
          <h3>当前 Host 数据:</h3>
          <pre>{{ currentData | json }}</pre>
        </div>
      </div>
      
      <div class="mfe-container">
        <h2>📱 MFE Remote 应用</h2>
        <iframe 
          src="http://localhost:4200/test-host-data" 
          width="100%" 
          height="600px">
        </iframe>
      </div>
    </div>
  `,
  styles: [`
    .host-test-container { padding: 20px; }
    .control-panel { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
    button { margin: 5px; padding: 10px 15px; background: #007bff; color: white; border: none; cursor: pointer; }
    button:hover { background: #0056b3; }
    .data-display { background: #f5f5f5; padding: 10px; margin: 10px 0; }
    .mfe-container { margin: 20px 0; }
  `]
})
export class HostMfeTestComponent {
  currentData: any = {};

  setBasicData(): void {
    const data = {
      userId: 'angular-host-123',
      userProfile: {
        name: 'Angular Host User',
        email: 'angular.host@example.com',
        phone: '+1234567890',
        userId: 'angular-host-123',
        language: 'en'
      },
      claimType: 'medical',
      language: 'en',
      sessionData: {
        isLoggedIn: true,
        token: 'angular-token-123'
      },
      pageContext: 'angular-host-test'
    };
    
    (window as any).hostSharedData = data;
    this.currentData = data;
    console.log('✅ Angular Host 基础数据已设置');
  }

  setAdvancedData(): void {
    const data = {
      userId: 'angular-advanced-456',
      userProfile: {
        name: 'Advanced Angular User',
        email: 'advanced.angular@example.com',
        phone: '+0987654321',
        userId: 'angular-advanced-456',
        language: 'en',
        department: 'Development',
        role: 'Senior Developer'
      },
      claimType: 'comprehensive',
      language: 'en',
      sessionData: {
        isLoggedIn: true,
        token: 'advanced-angular-token-456',
        permissions: ['read', 'write', 'deploy']
      },
      pageContext: 'angular-advanced-test',
      frameworkInfo: {
        name: 'Angular',
        version: '15.x',
        mode: 'development'
      }
    };
    
    (window as any).hostSharedData = data;
    this.currentData = data;
    console.log('✅ Angular Host 高级数据已设置');
  }

  setKhmerData(): void {
    const data = {
      userId: 'angular-khmer-789',
      userProfile: {
        name: 'អ្នកប្រើប្រាស់ Angular',
        email: 'angular.khmer@example.com',
        phone: '+855987654321',
        userId: 'angular-khmer-789',
        language: 'km'
      },
      claimType: 'medical',
      language: 'km',
      sessionData: {
        isLoggedIn: true,
        token: 'angular-khmer-token-789'
      },
      pageContext: 'angular-khmer-test'
    };
    
    (window as any).hostSharedData = data;
    this.currentData = data;
    console.log('✅ Angular Host 高棉语数据已设置');
  }

  clearData(): void {
    delete (window as any).hostSharedData;
    this.currentData = {};
    console.log('✅ Angular Host 数据已清除');
  }

  updateData(): void {
    if ((window as any).hostSharedData) {
      (window as any).hostSharedData.lastUpdate = new Date().toISOString();
      (window as any).hostSharedData.updateCounter = 
        ((window as any).hostSharedData.updateCounter || 0) + 1;
      this.currentData = (window as any).hostSharedData;
      console.log('✅ Angular Host 数据已更新');
    }
  }
}
```

## 🔍 测试步骤

### 步骤 1: 启动 MFE Remote 应用
```bash
cd your-mfe-remote-app
npm start
```

### 步骤 2: 打开测试页面
访问: `http://localhost:4200/test-host-data`

### 步骤 3: 执行测试
1. 打开浏览器开发者工具
2. 在控制台中执行上述测试代码
3. 观察 MFE 应用中的数据变化
4. 检查控制台日志输出

### 步骤 4: 验证功能
- ✅ 数据是否正确传递
- ✅ 实时更新是否工作
- ✅ 多语言切换是否正常
- ✅ 错误处理是否正确

## 📊 预期结果

### 成功的测试应该显示:
1. **MFE 测试页面**显示接收到的数据
2. **控制台日志**显示数据传递过程
3. **实时更新**在数据变化时自动刷新
4. **多语言支持**正确显示不同语言内容

### 控制台日志示例:
```
🔧 MFE Host Data Service initialized
📨 MFE 接收到 Host 数据: {userId: "test-user-123", ...}
🔄 Host 数据更新: {...}
✅ Host 数据监听器设置成功
```

## 🚨 故障排除

### 如果数据没有传递:
1. 检查 MFE 应用是否正在运行
2. 确认在正确的窗口对象上设置数据
3. 检查浏览器控制台是否有错误
4. 验证数据格式是否正确

### 如果实时更新不工作:
1. 检查订阅函数是否正确设置
2. 确认数据变化检测是否启用
3. 查看控制台是否有相关日志

现在您可以使用这些方法在 Host 应用中全面测试 MFE Remote 的参数传递功能了！🎉

### 方法 3: URL 参数测试 (兼容您的 MfeNavigationService)

#### 3.1 基础 URL 参数测试 (模拟您的 navigateToTermsConditions)
```
http://localhost:4200/with-params?userId=url-user-123&claimType=medical&lang=en&context=terms-conditions
```

#### 3.2 声明提交 URL 参数测试 (模拟您的 navigateToClaimSubmission)
```
http://localhost:4200/with-params/456?userId=claim-user-456&claimType=medicash&lang=km&context=claim-submission
```

#### 3.3 复杂 URL 参数测试
```
http://localhost:4200/with-params?userId=complex-user-789&claimType=comprehensive&lang=en&context=advanced-test&priority=high&source=host-app&version=3.2.1
```

### 方法 4: 在您的 Host 应用中创建测试页面

#### 4.1 完整的 Host 测试组件

```typescript
// host-mfe-integration-test.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MfeSharedDataService } from '../services/mfe-shared-data.service';
import { MfeNavigationService } from '../services/mfe-navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-host-mfe-integration-test',
  template: `
    <div class="host-integration-test">
      <h1>🏠 Host-MFE 集成测试面板</h1>
      
      <!-- 数据控制面板 -->
      <div class="control-panel">
        <h2>🎛️ 数据控制面板</h2>
        
        <div class="button-group">
          <button (click)="setBasicUserData()" class="test-btn primary">
            👤 设置基础用户数据
          </button>
          
          <button (click)="setAdvancedUserData()" class="test-btn primary">
            🔧 设置高级用户数据
          </button>
          
          <button (click)="setKhmerUserData()" class="test-btn primary">
            🇰🇭 设置高棉语用户数据
          </button>
          
          <button (click)="clearAllData()" class="test-btn danger">
            🗑️ 清除所有数据
          </button>
        </div>
        
        <div class="button-group">
          <button (click)="testTermsNavigation()" class="test-btn success">
            📋 测试 Terms & Conditions 导航
          </button>
          
          <button (click)="testClaimSubmissionNavigation()" class="test-btn success">
            🏥 测试 Claim Submission 导航
          </button>
          
          <button (click)="testDataUpdate()" class="test-btn info">
            🔄 测试数据实时更新
          </button>
        </div>
      </div>
      
      <!-- 当前数据显示 -->
      <div class="data-display">
        <h3>📊 当前 Host 数据</h3>
        <pre>{{ currentHostData | json }}</pre>
      </div>
      
      <!-- MFE 嵌入区域 -->
      <div class="mfe-container">
        <h2>📱 MFE Remote 应用</h2>
        <iframe 
          [src]="mfeUrl" 
          width="100%" 
          height="700px"
          frameborder="0">
        </iframe>
      </div>
      
      <!-- 测试日志 -->
      <div class="test-logs">
        <h3>📝 测试日志</h3>
        <div class="log-container">
          <div *ngFor="let log of testLogs" [class]="'log-entry ' + log.type">
            <span class="timestamp">{{ log.timestamp }}</span>
            <span class="message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .host-integration-test {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .control-panel {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .button-group {
      margin: 15px 0;
    }
    
    .test-btn {
      margin: 5px;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .test-btn.primary { background: #007bff; color: white; }
    .test-btn.success { background: #28a745; color: white; }
    .test-btn.info { background: #17a2b8; color: white; }
    .test-btn.danger { background: #dc3545; color: white; }
    
    .test-btn:hover { opacity: 0.8; }
    
    .data-display {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .data-display pre {
      background: white;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
    
    .mfe-container {
      margin: 20px 0;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .test-logs {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .log-container {
      max-height: 300px;
      overflow-y: auto;
      background: white;
      padding: 10px;
      border-radius: 4px;
    }
    
    .log-entry {
      padding: 5px;
      margin: 2px 0;
      border-radius: 3px;
    }
    
    .log-entry.info { background: #d1ecf1; }
    .log-entry.success { background: #d4edda; }
    .log-entry.warning { background: #fff3cd; }
    .log-entry.error { background: #f8d7da; }
    
    .timestamp {
      font-size: 12px;
      color: #6c757d;
      margin-right: 10px;
    }
  `]
})
export class HostMfeIntegrationTestComponent implements OnInit, OnDestroy {
  currentHostData: any = {};
  mfeUrl = 'http://localhost:4200/test-host-data';
  testLogs: any[] = [];
  private dataSubscription?: Subscription;

  constructor(
    private mfeSharedDataService: MfeSharedDataService,
    private mfeNavigationService: MfeNavigationService
  ) {}

  ngOnInit(): void {
    this.addLog('info', 'Host-MFE 集成测试组件已初始化');
    
    // 订阅数据变化
    this.dataSubscription = this.mfeSharedDataService.hostData$.subscribe(data => {
      this.currentHostData = data;
      this.addLog('info', '数据已更新: ' + JSON.stringify(data, null, 2));
    });
    
    // 设置 MFE 辅助函数
    this.mfeSharedDataService.setupMfeHelpers();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  setBasicUserData(): void {
    const userData = {
      userId: 'host-basic-' + Date.now(),
      userProfile: {
        name: 'Host Basic User',
        email: 'basic@host.com',
        phone: '+1234567890',
        userId: 'host-basic-' + Date.now(),
        language: 'en'
      },
      claimType: 'medical',
      language: 'en',
      sessionData: {
        isLoggedIn: true,
        token: 'basic-token-' + Date.now()
      },
      pageContext: 'basic-test',
      timestamp: new Date().toISOString()
    };

    this.mfeSharedDataService.setHostData(userData);
    this.addLog('success', '基础用户数据已设置');
  }

  setAdvancedUserData(): void {
    const userData = {
      userId: 'host-advanced-' + Date.now(),
      userProfile: {
        name: 'Host Advanced User',
        email: 'advanced@host.com',
        phone: '+0987654321',
        userId: 'host-advanced-' + Date.now(),
        language: 'en',
        department: 'Claims Processing',
        role: 'Senior Manager',
        preferences: {
          theme: 'dark',
          notifications: true,
          autoSave: true
        }
      },
      claimType: 'comprehensive',
      language: 'en',
      sessionData: {
        isLoggedIn: true,
        token: 'advanced-token-' + Date.now(),
        permissions: ['read', 'write', 'approve', 'admin']
      },
      pageContext: 'advanced-test',
      claimData: {
        claimId: 'CLM-' + Date.now(),
        amount: 2500.00,
        currency: 'USD',
        status: 'pending'
      },
      timestamp: new Date().toISOString()
    };

    this.mfeSharedDataService.setHostData(userData);
    this.addLog('success', '高级用户数据已设置');
  }

  setKhmerUserData(): void {
    const userData = {
      userId: 'host-khmer-' + Date.now(),
      userProfile: {
        name: 'អ្នកប្រើប្រាស់ Host',
        email: 'khmer@host.com',
        phone: '+855123456789',
        userId: 'host-khmer-' + Date.now(),
        language: 'km'
      },
      claimType: 'medical',
      language: 'km',
      sessionData: {
        isLoggedIn: true,
        token: 'khmer-token-' + Date.now()
      },
      pageContext: 'khmer-test',
      localizedData: {
        welcomeMessage: 'ស្វាគមន៍',
        currency: 'KHR',
        dateFormat: 'dd/mm/yyyy'
      },
      timestamp: new Date().toISOString()
    };

    this.mfeSharedDataService.setHostData(userData);
    this.addLog('success', '高棉语用户数据已设置');
  }

  clearAllData(): void {
    this.mfeSharedDataService.clearHostData();
    this.addLog('warning', '所有数据已清除');
  }

  testTermsNavigation(): void {
    const userId = 'nav-terms-' + Date.now();
    this.mfeNavigationService.navigateToTermsConditions(userId, 'en');
    this.addLog('info', `已导航到 Terms & Conditions，用户ID: ${userId}`);
  }

  testClaimSubmissionNavigation(): void {
    const claimData = {
      userId: 'nav-claim-' + Date.now(),
      claimType: 'medicash',
      language: 'km',
      amount: 1500.00,
      description: 'Navigation test claim'
    };

    this.mfeNavigationService.navigateToClaimSubmission(claimData);
    this.addLog('info', '已导航到 Claim Submission 并传递声明数据');
  }

  testDataUpdate(): void {
    const updateData = {
      language: Math.random() > 0.5 ? 'en' : 'km',
      claimType: ['medical', 'dental', 'vision'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString(),
      updateReason: 'Real-time update test',
      randomValue: Math.floor(Math.random() * 1000)
    };

    this.mfeNavigationService.updateMfeData(updateData);
    this.addLog('info', '数据实时更新测试已执行');
  }

  private addLog(type: string, message: string): void {
    this.testLogs.unshift({
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    });

    // 保持日志数量在合理范围内
    if (this.testLogs.length > 50) {
      this.testLogs = this.testLogs.slice(0, 50);
    }
  }
}
```

## 🔍 测试步骤

### 步骤 1: 启动 MFE Remote 应用
```bash
cd your-mfe-remote-app
npm start
```

### 步骤 2: 在您的 Host 应用中测试

#### 选项 A: 使用您现有的服务
```typescript
// 在任何 Host 组件中
constructor(
  private mfeSharedDataService: MfeSharedDataService,
  private mfeNavigationService: MfeNavigationService
) {}

// 测试数据传递
testDataPassing() {
  this.mfeSharedDataService.setHostData({
    userId: 'test-123',
    userProfile: { name: 'Test User', language: 'en' },
    claimType: 'medical'
  });
}

// 测试导航
testNavigation() {
  this.mfeNavigationService.navigateToTermsConditions('user-456', 'km');
}
```

#### 选项 B: 使用浏览器控制台
1. 打开 `http://localhost:4200/test-host-data`
2. 在控制台执行上述模拟代码
3. 观察 MFE 应用中的数据变化

### 步骤 3: 验证功能
- ✅ 数据是否正确传递到 MFE
- ✅ 实时更新是否工作
- ✅ 多语言切换 (en/km) 是否正常
- ✅ 控制台日志是否显示正确信息
- ✅ 您的三种传递方法是否都正常工作

## 📊 预期结果

### 成功的测试应该显示:
1. **MFE 测试页面**显示接收到的 Host 数据
2. **控制台日志**显示数据传递过程
3. **实时更新**在数据变化时自动刷新
4. **多语言支持**正确显示不同语言内容

### 控制台日志示例:
```
🔧 MFE Host Data Service initialized
🚀 MFE 开始初始化 Host 数据接收...
📦 从 Host Window.hostSharedData 获取数据: {...}
🔗 设置 Host 数据订阅...
✅ Host 数据订阅设置成功
📨 MFE 接收到 Host 数据: {...}
🔄 MFE Host 数据已更新: {...}
```

## 🚨 故障排除

### 如果数据没有传递:
1. 检查 MFE 应用是否正在运行
2. 确认您的 Host 服务是否正确初始化
3. 检查浏览器控制台是否有错误
4. 验证数据格式是否与接口匹配

### 如果实时更新不工作:
1. 检查您的 `subscribeMfeData` 是否正确设置
2. 确认 MFE 的订阅回调是否正常工作
3. 查看控制台是否有相关日志

## 🎯 与您的系统完美集成

您的 Host 端系统特点：
- ✅ **MfeSharedDataService** - 已完美适配
- ✅ **MfeNavigationService** - 已完美适配  
- ✅ **三种传递方法** - 全部支持
- ✅ **自动集成** - MFE 端自动检测和处理

现在您可以使用这些方法在 Host 应用中全面测试 MFE Remote 的参数传递功能了！🎉