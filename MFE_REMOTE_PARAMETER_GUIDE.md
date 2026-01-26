# MFE Remote 端参数接收指南

## 概述
这个指南展示了如何在 MFE (Remote) 应用中接收和处理从 Host 应用传递过来的参数。

## 🔧 在 MFE 中创建参数接收服务

### 1. Host Data Service 已创建
位置：`src/app/services/host-data.service.ts`

这个服务提供了完整的参数接收功能：
- 从 Window 对象获取数据
- 从 URL 参数获取数据  
- 监听 Host 应用的数据更新
- 定期检查数据变化

### 2. Host Data Mixin 已创建
位置：`src/app/mixins/host-data.mixin.ts`

提供了便捷的 Mixin 类，组件可以继承使用。

## 🎯 在 MFE 组件中使用

### 方法 1: 使用 Mixin (推荐)

```typescript
// 示例：TermsConditionsComponent
export class TermsConditionsComponent extends HostDataMixin implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private termsService: TermsConditionsService,
    hostDataService: HostDataService
  ) {
    super(hostDataService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeComponent();
  }

  private initializeComponent(): void {
    // 使用从 Host 接收到的数据
    this.userInfo = this.getUserProfile();
    this.currentLanguage = this.getLanguage();
  }

  protected onHostDataUpdated(data: HostData): void {
    super.onHostDataUpdated(data);
    // 处理数据更新
    if (data.language && data.language !== this.currentLanguage) {
      this.currentLanguage = data.language;
      this.loadTermsConditions();
    }
  }
}
```

### 方法 2: 直接使用服务

```typescript
export class YourComponent implements OnInit, OnDestroy {
  hostData: HostData = {};
  private hostDataSubscription?: Subscription;

  constructor(private hostDataService: HostDataService) {}

  ngOnInit(): void {
    this.hostData = this.hostDataService.getHostData();
    
    this.hostDataSubscription = this.hostDataService.hostData$.subscribe(data => {
      this.hostData = data;
      console.log('收到数据更新:', data);
    });
  }

  ngOnDestroy(): void {
    if (this.hostDataSubscription) {
      this.hostDataSubscription.unsubscribe();
    }
  }
}
```

## 🧪 测试功能

### 访问测试页面
访问 `/test-host-data` 路由可以看到完整的测试界面，包括：
- 实时显示接收到的 Host 数据
- 解析后的数据展示
- 调试工具和模拟数据功能

### 可用的测试路由

1. **主页面**: `/` 
2. **参数处理器**: `/with-params` 或 `/with-params/123`
3. **测试页面**: `/test-host-data`
4. **条款页面**: `/terms-conditions`
5. **提交表单**: `/submit-form`

## 🔍 Host 应用如何传递参数

### 方法 1: Window 对象传递

```javascript
// 在 Host 应用中设置数据
window.hostSharedData = {
  userId: '12345',
  userProfile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    userId: '12345',
    language: 'en'
  },
  claimType: 'medical',
  language: 'en',
  sessionData: {
    isLoggedIn: true,
    token: 'abc123'
  }
};
```

### 方法 2: 提供获取函数

```javascript
// 在 Host 应用中提供函数
window.getMfeData = function() {
  return {
    userId: getCurrentUserId(),
    userProfile: getCurrentUserProfile(),
    claimType: getCurrentClaimType(),
    language: getCurrentLanguage()
  };
};
```

### 方法 3: 订阅数据更新

```javascript
// 在 Host 应用中提供订阅函数
window.subscribeMfeData = function(callback) {
  // 当数据更新时调用 callback
  userDataService.subscribe(callback);
};
```

### 方法 4: URL 参数传递

```typescript
// 在 Host 应用中导航时传递参数
this.router.navigate(['/remote-app/with-params'], {
  queryParams: {
    userId: '12345',
    claimType: 'medical',
    language: 'en'
  }
});
```

## 📊 支持的数据格式

```typescript
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
```

## 🎯 使用示例

### 在组件中获取用户信息

```typescript
export class YourMfeComponent extends HostDataMixin {
  ngOnInit(): void {
    super.ngOnInit();
    
    const userId = this.getUserId();
    const userProfile = this.getUserProfile();
    const claimType = this.getClaimType();
    const language = this.getLanguage();
    
    console.log('MFE 接收到的数据:', {
      userId,
      userProfile,
      claimType,
      language
    });
  }
}
```

### 根据语言显示不同内容

```typescript
getWelcomeMessage(): string {
  const name = this.hostData.userProfile?.name || 'User';
  const language = this.getLanguage();
  
  if (language === 'km') {
    return `ស្វាគមន៍ ${name}`;
  } else {
    return `Welcome ${name}`;
  }
}
```

## 🔧 调试和故障排除

### 1. 检查数据接收
访问 `/test-host-data` 页面查看实时数据接收情况。

### 2. 控制台日志
服务会在控制台输出详细的调试信息：
- `🔧 MFE Host Data Service initialized`
- `📨 MFE 接收到 Host 数据`
- `🔄 检测到数据变化，更新中...`

### 3. 手动测试
在测试页面点击"模拟 Host 数据"按钮可以模拟数据传递。

## ✅ 功能特点

- ✅ 多种数据源支持（Window 对象、URL 参数）
- ✅ 实时数据监听和更新
- ✅ 便捷的 Mixin 继承方式
- ✅ 完整的 TypeScript 类型支持
- ✅ 详细的调试和测试工具
- ✅ 多语言支持
- ✅ 自动数据变化检测

现在你的 MFE 应用已经完全支持从 Host 应用接收和处理参数了！🎉