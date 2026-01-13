# Vercel部署解决方案

## 问题分析

在Vercel上部署时，API调用失败的原因：
1. **代理配置不生效** - Vercel是静态托管，不支持开发时的代理配置
2. **CORS问题** - 直接从浏览器调用外部API会被CORS策略阻止
3. **环境差异** - 本地开发和生产环境的API调用方式不同

## 解决方案

### 1. 创建Vercel API路由 (`api/terms-conditions.js`)
- 作为服务器端代理，避免CORS问题
- 在Vercel的Node.js环境中运行
- 代理请求到实际的API端点

### 2. 环境检测 (`TermsConditionsService`)
```typescript
// 自动检测环境并选择合适的API URL
const isProduction = window.location.hostname !== 'localhost';

if (isProduction) {
  // 生产环境：使用Vercel API路由
  this.apiUrl = '/api/terms-conditions';
} else {
  // 开发环境：使用代理配置
  this.apiUrl = '/api/graphql/execute.json/insurance/getKHTermConditionsByLocale';
}
```

### 3. 多层错误处理
1. **首先尝试** - 环境对应的API调用
2. **备用方案** - 直接API调用（可能有CORS问题）
3. **最终回退** - 显示默认条款内容

### 4. Vercel配置更新 (`vercel.json`)
- 添加API路由重写规则
- 保持现有的CORS头配置

## 部署步骤

1. **提交代码到Git仓库**
2. **在Vercel中重新部署**
3. **测试API调用**

## 测试方法

### 本地测试
```bash
npm start
# 访问 http://localhost:4200
# 应该使用代理配置调用API
```

### 生产环境测试
```bash
# 部署到Vercel后
# 访问 https://your-app.vercel.app
# 应该使用Vercel API路由调用API
```

## 调试信息

在浏览器控制台中查看：
- 🌍 Environment: Production/Development
- 🔗 API URL: 实际使用的API地址
- 🌐 Making API call to: 具体的请求URL
- 📦 Raw API response: API响应数据

## 备用方案

如果Vercel API路由仍然失败：
1. 应用会自动尝试直接API调用
2. 如果直接调用也失败（CORS），会显示默认条款内容
3. 用户功能不会受到影响，仍然可以正常使用条款确认流程

## 优势

- ✅ 开发和生产环境都能正常工作
- ✅ 自动环境检测，无需手动配置
- ✅ 多层错误处理，确保功能可用性
- ✅ 保持用户体验一致性