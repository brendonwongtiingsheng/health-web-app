# 条款和条件功能实现

## 功能概述

实现了在用户点击"Submit a Claim"后显示条款和条件页面的功能，用户需要滚动到底部才能继续提交理赔申请。

## 实现的功能

### 1. 条款和条件服务 (`TermsConditionsService`)
- 调用API获取条款和条件内容
- API地址: `https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale?locale=en`
- 支持多语言（通过locale参数）
- 包含错误处理和默认内容

### 2. 条款和条件组件 (`TermsConditionsComponent`)
- 显示从API获取的条款和条件内容
- 滚动检测功能 - 用户必须滚动到底部
- 滚动指示器提示用户需要滚动
- 只有滚动到底部后才能点击"Continue"按钮
- 响应式设计，适配移动端

### 3. 提交理赔表单组件 (`SubmitClaimFormComponent`)
- 用户确认条款后跳转到的实际提交页面
- 包含基本的表单字段（政策号码、理赔类型、描述、文档上传）
- 可以根据实际需求进一步定制

## 用户流程

1. 用户在主页点击"Submit a Claim"
2. 跳转到条款和条件页面 (`/claims/terms-conditions`)
3. 用户阅读条款并滚动到底部
4. 滚动到底部后，"Continue"按钮变为可用状态
5. 点击"Continue"跳转到实际的提交表单页面 (`/claims/submit-form`)

## 路由配置

```typescript
const routes: Routes = [
  { path: '', component: RemoteHomeComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'submit-form', component: SubmitClaimFormComponent },
];
```

## API集成

服务会自动调用您提供的API：
```
GET https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale?locale=en
```

如果API调用失败，会显示默认的条款和条件内容。

## 样式特点

- 现代化的移动端优先设计
- 平滑的滚动动画和过渡效果
- 清晰的视觉反馈（滚动指示器、按钮状态变化）
- 符合无障碍访问标准

## 自定义选项

### 修改API地址
在 `src/app/services/terms-conditions.service.ts` 中修改 `apiUrl`

### 修改默认内容
在 `TermsConditionsComponent` 的 `getDefaultTermsContent()` 方法中修改

### 调整样式
修改对应的 `.scss` 文件来自定义外观

## 注意事项

- 确保应用已包含 `HttpClientModule` 用于API调用
- 条款和条件内容支持HTML格式
- 滚动检测有10px的容错范围，确保在不同设备上都能正常工作