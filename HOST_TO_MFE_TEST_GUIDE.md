# Host 向 MFE 传递数据测试指南

## 🎯 简单测试步骤

### 步骤 1: 启动 MFE 应用
```bash
npm start
```

### 步骤 2: 打开 MFE 测试页面
在浏览器中访问：
```
http://localhost:4200/test-host-data
```

### 步骤 3: 在浏览器控制台测试数据传递

#### 🧪 测试 1: 基础数据传递
在浏览器控制台（F12）中粘贴并运行：

```javascript
// 模拟您的 Host 应用传递基础数据
window.hostSharedData = {
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
    token: 'test-token-123'
  }
};

console.log('✅ Host 数据已设置，请查看 MFE 页面变化');
```

#### 🧪 测试 2: 高棉语数据传递
```javascript
// 测试高棉语数据
window.hostSharedData = {
  userId: 'khmer-user-456',
  userProfile: {
    name: 'សុខ វិចិត្រ',
    email: 'sok.vichit@example.com',
    phone: '+855123456789',
    userId: 'khmer-user-456',
    language: 'km'
  },
  claimType: 'medical',
  language: 'km',
  sessionData: {
    isLoggedIn: true,
    token: 'khmer-token-456'
  }
};

console.log('✅ 高棉语数据已设置');
```

#### 🧪 测试 3: 复杂数据传递
```javascript
// 测试复杂的声明数据
window.hostSharedData = {
  userId: 'complex-user-789',
  userProfile: {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    userId: 'complex-user-789',
    language: 'en',
    department: 'Claims',
    role: 'Manager'
  },
  claimType: 'comprehensive',
  language: 'en',
  sessionData: {
    isLoggedIn: true,
    token: 'complex-token-789',
    permissions: ['read', 'write', 'approve']
  },
  claimData: {
    claimId: 'CLM-2024-001',
    amount: 2500.00,
    currency: 'USD',
    status: 'pending',
    description: 'Medical claim for hospital visit'
  },
  timestamp: new Date().toISOString()
};

console.log('✅ 复杂数据已设置');
```

#### 🧪 测试 4: 实时数据更新
```javascript
// 测试实时数据更新
let counter = 0;
const updateInterval = setInterval(() => {
  counter++;
  
  window.hostSharedData = {
    ...window.hostSharedData,
    language: counter % 2 === 0 ? 'en' : 'km',
    claimType: ['medical', 'dental', 'vision'][counter % 3],
    timestamp: new Date().toISOString(),
    updateCounter: counter
  };
  
  console.log(`🔄 数据更新 #${counter}`);
  
  if (counter >= 5) {
    clearInterval(updateInterval);
    console.log('✅ 实时更新测试完成');
  }
}, 2000);
```

## 🔍 验证测试结果

### 在 MFE 测试页面中您应该看到：

1. **📨 接收到的 Host 数据** - 显示完整的 JSON 数据
2. **📊 解析后的数据** - 显示：
   - 用户 ID
   - 用户配置文件
   - 声明类型
   - 语言设置
   - 欢迎消息（根据语言变化）

3. **🔍 调试信息** - 显示详细的接收日志

### 在浏览器控制台中您应该看到：
```
🔧 MFE Host Data Service initialized
🚀 MFE 开始初始化 Host 数据接收...
📦 从 Host Window.hostSharedData 获取数据: {...}
📨 MFE 接收到 Host 数据: {...}
🔄 检测到 Host 数据变化，更新中...
🔄 MFE Host 数据已更新: {...}
```

## 🚀 在您的实际 Host 应用中测试

### 方法 1: 在 Host 组件中
```typescript
export class YourHostComponent {
  constructor(
    private mfeSharedDataService: MfeSharedDataService,
    private mfeNavigationService: MfeNavigationService
  ) {}

  // 测试基础数据传递
  testBasicData() {
    this.mfeSharedDataService.setHostData({
      userId: 'host-test-123',
      userProfile: {
        name: 'Host Test User',
        email: 'host@example.com',
        phone: '+1234567890',
        userId: 'host-test-123',
        language: 'en'
      },
      claimType: 'medical',
      language: 'en'
    });
    
    console.log('✅ Host 数据已通过服务设置');
  }

  // 测试导航并传递数据
  testNavigationWithData() {
    this.mfeNavigationService.navigateToTermsConditions('nav-user-456', 'km');
    console.log('✅ 已导航到 MFE 并传递数据');
  }
}
```

### 方法 2: 在 Host HTML 模板中
```html
<div class="host-test-buttons">
  <button (click)="testBasicData()">
    📤 测试基础数据传递
  </button>
  
  <button (click)="testNavigationWithData()">
    🔄 测试导航传递数据
  </button>
  
  <div class="current-data">
    <h3>当前数据:</h3>
    <pre>{{ mfeSharedDataService.getHostData() | json }}</pre>
  </div>
</div>
```

## 📱 URL 参数测试

您也可以通过 URL 参数测试：

### 基础 URL 测试
```
http://localhost:4200/with-params?userId=url-test-123&claimType=medical&lang=en
```

### 复杂 URL 测试
```
http://localhost:4200/with-params?userId=url-complex-456&claimType=comprehensive&lang=km&context=test&amount=1500
```

## 🎯 快速一键测试

复制以下代码到浏览器控制台，一键运行所有测试：

```javascript
// 一键测试脚本
(function() {
  console.log('🚀 开始 Host → MFE 数据传递测试');
  
  // 测试 1: 基础数据
  setTimeout(() => {
    window.hostSharedData = {
      userId: 'quick-test-1',
      userProfile: { name: 'Quick Test 1', language: 'en' },
      claimType: 'medical',
      language: 'en'
    };
    console.log('✅ 测试 1 完成: 基础数据');
  }, 1000);
  
  // 测试 2: 高棉语数据
  setTimeout(() => {
    window.hostSharedData = {
      userId: 'quick-test-2',
      userProfile: { name: 'ការសាកល្បង ២', language: 'km' },
      claimType: 'dental',
      language: 'km'
    };
    console.log('✅ 测试 2 完成: 高棉语数据');
  }, 3000);
  
  // 测试 3: 复杂数据
  setTimeout(() => {
    window.hostSharedData = {
      userId: 'quick-test-3',
      userProfile: { 
        name: 'Complex Test', 
        language: 'en',
        department: 'Testing'
      },
      claimType: 'comprehensive',
      language: 'en',
      claimData: {
        amount: 1000,
        currency: 'USD'
      }
    };
    console.log('✅ 测试 3 完成: 复杂数据');
  }, 5000);
  
  setTimeout(() => {
    console.log('🎉 所有测试完成！请查看 MFE 页面的数据变化');
  }, 6000);
})();
```

## ✅ 成功标志

测试成功时您会看到：

1. **MFE 页面实时更新** - 数据立即显示在页面上
2. **控制台日志** - 显示数据接收和处理过程
3. **语言切换** - 欢迎消息根据语言自动变化
4. **数据解析** - 所有字段正确显示

## 🚨 如果测试失败

1. **检查 MFE 是否运行**: 确保 `npm start` 成功启动
2. **检查控制台错误**: 查看是否有 JavaScript 错误
3. **刷新页面**: 有时需要刷新 MFE 页面
4. **检查数据格式**: 确保数据格式正确

现在您可以轻松测试从 Host 向 MFE 传递数据的功能了！🎉