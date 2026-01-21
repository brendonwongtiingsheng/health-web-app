# 文档上传功能实现 (修正版)

## 概述
根据你的需求，我已经成功实现了在step 2选择claim type后，在step 3让用户上传必要文档的功能。

## 实现的功能

### 1. 正确的步骤流程
- **Step 1**: Your information (用户信息)
- **Step 2**: Claim event information (理赔事件信息 - 选择理赔类型)
- **Step 3**: Documents (文档上传) - **在选择理赔类型后**
- **Step 4**: Review your claim (审核理赔)

### 2. 文档上传页面 (Step 3)
实现了动态的文档上传界面，根据在Step 2选择的理赔类型显示相应的文档要求：

#### 页面结构
- 进度指示器显示当前在第3步 (Documents)
- 动态页面标题: 根据选择的理赔类型显示相应标题
  - Medicash documents
  - Critical illness documents
  - Total disability documents
  - 等等
- 说明文字: "These are required documents that you need to submit to be able to file a claim request."
- 上传限制说明: "You may upload up to 15 files, each with a maximum size of 20MB. We accept JPG, PNG, and PDF formats."

#### 动态文档类别

**对于Medicash理赔类型:**
1. **Medical Discharge Summary/Letter**
2. **Hospital Receipt/Invoice**
3. **Attended Physician's Statement Form** (带下载按钮)
4. **Supporting documents** - Evidence of medical treatment and diagnosis documents

**对于其他理赔类型 (Critical illness, Total disability, etc.):**
1. **Supporting documents** - 通用文档上传区域

#### 特殊功能
- **View sample document** 按钮
- **Download form** 按钮 (用于Physician's Statement Form)
- 根据理赔类型显示相应的医疗文档提示

### 3. 用户流程
1. **Step 1**: 用户填写个人信息和银行信息
2. **Step 2**: 用户选择理赔类型 (Medicash, Critical illness, etc.) 并填写相关详情
3. **Step 3**: 根据选择的理赔类型，显示相应的文档上传页面
4. **Step 4**: 审核所有信息并提交理赔

### 4. 技术实现

#### 动态内容显示
- 根据 `selectedClaimType` 动态显示不同的文档类别
- `getDocumentSectionTitle()` 方法根据理赔类型返回相应标题
- 条件渲染不同的文档上传区域

#### 文件管理
- 扩展了 `uploadedFiles` 对象，支持:
  - `medical-discharge` (Medicash专用)
  - `hospital-receipt` (Medicash专用)
  - `physician-statement` (Medicash专用)
  - `supporting-documents` (Medicash专用)
  - `general-documents` (其他理赔类型)

#### 验证逻辑
- `validateDocumentsUpload()` 根据理赔类型验证相应文档
- Medicash: 至少上传一个医疗相关文档
- 其他类型: 至少上传一个通用支持文档

### 5. 用户体验改进
- 在选择理赔类型后才显示相关文档要求
- 避免用户困惑，只显示与其选择相关的文档类别
- 清晰的步骤指示和进度显示
- 响应式设计支持移动端

## 使用方法
1. 用户在Step 1填写个人信息
2. 点击"Next"进入Step 2选择理赔类型并填写详情
3. 点击"Next"进入Step 3，根据选择的理赔类型上传相应文档
4. 点击"Next"进入Step 4审核并提交理赔

这个实现完全符合你的要求：用户先选择理赔类型，然后根据选择的类型上传相应的必要文档。