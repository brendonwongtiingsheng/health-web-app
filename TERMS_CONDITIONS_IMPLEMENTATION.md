# 条款和条件功能实现 - Module Federation版本

## 问题修复

修复了Module Federation项目中的路由配置问题：

### 1. 主要问题
- 原始路由配置使用了绝对路径 `/claims/terms-conditions`
- 在Module Federation环境中，remote应用需要使用相对路径
- 主应用路由配置需要正确加载remote模块

### 2. 修复内容

#### 路由配置修复
- **app-routing.module.ts**: 配置为直接加载remote-entry模块
- **remote-entry.module.ts**: 使用相对路径配置子路由
- **组件导航**: 所有导航都改为相对路径

#### 路径变更
```typescript
// 修复前
onSubmitClaim() { this.router.navigateByUrl('/claims/terms-conditions'); }

// 修复后  
onSubmitClaim() { this.router.navigateByUrl('/terms-conditions'); }
```

### 3. 当前用户流程

1. **点击"Submit a Claim"** → 导航到 `/terms-conditions`
2. **阅读条款和条件** → 用户滚动到底部
3. **点击"Confirm"** → 导航到 `/submit-form`
4. **填写并提交表单** → 完成提交并返回主页

### 4. Module Federation配置

项目配置为remote应用：
- **name**: 'healthWebApp'
- **filename**: 'remoteEntry.js'
- **exposes**: './Module' → remote-entry.module.ts

### 5. 运行方式

作为standalone应用：
```bash
npm start
```

作为remote模块（被host应用加载）：
```bash
npm run run:all
```

### 6. API集成

条款和条件内容从以下API获取：
```
GET https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale?locale=en
```

### 7. 错误处理

- 如果API调用失败，显示默认条款内容
- 包含加载状态和错误提示
- 路由错误会回退到主页

## 测试

1. 启动应用: `npm start`
2. 访问: `http://localhost:4200`
3. 点击"Submit a Claim"测试流程

## 注意事项

- 确保host应用正确配置了这个remote模块
- 路由路径都是相对于remote模块的根路径
- CORS已在webpack配置中启用