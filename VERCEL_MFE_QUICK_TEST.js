// 🌐 Vercel MFE 快速测试脚本
// 在您的 Host 应用 (http://localhost:8100/health) 控制台中执行

(function() {
  console.log('🌐 Vercel MFE 快速参数传递测试');
  
  // ⚠️ 请替换为您的实际 Vercel URL
  const VERCEL_MFE_URL = 'https://your-mfe-app.vercel.app';
  
  // 如果您知道确切的 URL，请在这里修改：
  // const VERCEL_MFE_URL = 'https://mfe-remote-claims.vercel.app';
  
  console.log('🎯 目标 Vercel MFE:', VERCEL_MFE_URL);
  
  // 设置完整的测试数据
  window.hostSharedData = {
    // 基础用户信息
    userId: 'vercel-health-' + Date.now(),
    userProfile: {
      name: 'Vercel Health User',
      email: 'vercel.health@example.com',
      phone: '+855123456789',
      userId: 'vercel-health-' + Date.now(),
      language: 'en',
      department: 'Health Claims',
      role: 'patient'
    },
    
    // 声明信息
    claimType: 'medical',
    language: 'en',
    
    // 会话数据
    sessionData: {
      isLoggedIn: true,
      token: 'vercel-health-token-' + Date.now(),
      permissions: ['read', 'write', 'submit'],
      loginTime: new Date().toISOString()
    },
    
    // 页面上下文
    pageContext: 'health-claims-vercel',
    
    // 健康相关数据
    healthData: {
      patientId: 'PAT-VERCEL-001',
      membershipId: 'MEM-' + Date.now(),
      policyNumber: 'POL-HEALTH-001',
      coverageType: 'comprehensive'
    },
    
    // 部署信息
    deploymentInfo: {
      platform: 'vercel',
      environment: 'production',
      testType: 'host-to-vercel-mfe',
      hostUrl: window.location.href,
      timestamp: new Date().toISOString()
    },
    
    // 时间戳
    timestamp: new Date().toISOString(),
    source: 'host-health-page'
  };
  
  // 设置 MFE 兼容函数
  window.getMfeData = function() {
    console.log('📤 Host getMfeData() 被调用');
    return window.hostSharedData;
  };
  
  // 设置订阅系统
  window._mfeSubscribers = [];
  window.subscribeMfeData = function(callback) {
    console.log('📡 MFE 订阅已设置');
    window._mfeSubscribers.push(callback);
    
    // 立即发送当前数据
    if (window.hostSharedData) {
      callback(window.hostSharedData);
    }
    
    return {
      unsubscribe: function() {
        const index = window._mfeSubscribers.indexOf(callback);
        if (index > -1) {
          window._mfeSubscribers.splice(index, 1);
        }
        console.log('📡 MFE 订阅已取消');
      }
    };
  };
  
  // 模拟 mfeSharedDataService
  window.mfeSharedDataService = {
    getHostData: () => window.hostSharedData,
    setHostData: (data) => {
      window.hostSharedData = { ...window.hostSharedData, ...data };
      console.log('📤 Host 数据已更新:', window.hostSharedData);
      
      // 通知所有订阅者
      window._mfeSubscribers.forEach(callback => {
        try {
          callback(window.hostSharedData);
        } catch (error) {
          console.error('❌ 订阅回调错误:', error);
        }
      });
    }
  };
  
  console.log('✅ Host 数据已设置:', window.hostSharedData);
  console.log('✅ MFE 兼容系统已设置');
  
  // 打开不同的 Vercel MFE 页面进行测试
  function openMfePages() {
    console.log('🚀 打开 Vercel MFE 测试页面...');
    
    // 1. 主要测试页面
    const testUrl = VERCEL_MFE_URL + '/test-host-data';
    window.open(testUrl, 'vercel-mfe-test', 'width=1200,height=800');
    console.log('📋 测试页面已打开:', testUrl);
    
    // 2. 条款页面（3秒后）
    setTimeout(() => {
      const termsUrl = VERCEL_MFE_URL + '/terms-conditions?userId=' + window.hostSharedData.userId + '&lang=en';
      window.open(termsUrl, 'vercel-mfe-terms', 'width=1000,height=700');
      console.log('📜 条款页面已打开:', termsUrl);
    }, 3000);
    
    // 3. 提交表单页面（6秒后）
    setTimeout(() => {
      const formUrl = VERCEL_MFE_URL + '/submit-form?userId=' + window.hostSharedData.userId + '&claimType=medical';
      window.open(formUrl, 'vercel-mfe-form', 'width=1000,height=700');
      console.log('📝 表单页面已打开:', formUrl);
    }, 6000);
  }
  
  // 测试数据更新
  function testDataUpdates() {
    console.log('🔄 开始测试数据更新...');
    
    // 5秒后：更新基础数据
    setTimeout(() => {
      window.mfeSharedDataService.setHostData({
        lastUpdate: new Date().toISOString(),
        updateCount: 1,
        message: '第一次数据更新 - 来自 Host Health 页面',
        updateType: 'basic_update'
      });
      console.log('🔄 第一次数据更新完成');
    }, 5000);
    
    // 10秒后：更新为高棉语
    setTimeout(() => {
      window.mfeSharedDataService.setHostData({
        language: 'km',
        userProfile: {
          ...window.hostSharedData.userProfile,
          name: 'អ្នកប្រើប្រាស់ Vercel',
          language: 'km'
        },
        localizedData: {
          welcomeMessage: 'ស្វាគមន៍មកកាន់ Vercel MFE',
          currency: 'KHR',
          locale: 'km-KH'
        },
        lastUpdate: new Date().toISOString(),
        updateCount: 2,
        message: 'ទិន្នន័យភាសាខ្មែរ - ពី Host Health',
        updateType: 'language_update'
      });
      console.log('🇰🇭 高棉语数据更新完成');
    }, 10000);
    
    // 15秒后：更新声明数据
    setTimeout(() => {
      window.mfeSharedDataService.setHostData({
        claimType: 'comprehensive',
        claimData: {
          claimId: 'CLM-VERCEL-' + Date.now(),
          amount: 2500.00,
          currency: 'USD',
          status: 'draft',
          description: 'Comprehensive medical claim via Vercel MFE',
          submissionDate: new Date().toISOString(),
          documents: ['health_receipt.pdf', 'medical_report.pdf']
        },
        workflowData: {
          currentStep: 'document_upload',
          nextStep: 'review',
          allowedActions: ['save', 'submit', 'cancel']
        },
        lastUpdate: new Date().toISOString(),
        updateCount: 3,
        message: '声明数据更新 - 准备提交',
        updateType: 'claim_update'
      });
      console.log('📋 声明数据更新完成');
    }, 15000);
  }
  
  // 提供手动测试函数
  window.testVercelMfe = {
    openPages: openMfePages,
    updateData: testDataUpdates,
    
    // 快速测试函数
    quickTest: function() {
      openMfePages();
      testDataUpdates();
    },
    
    // 设置自定义数据
    setCustomData: function(customData) {
      window.mfeSharedDataService.setHostData(customData);
      console.log('✅ 自定义数据已设置');
    },
    
    // 查看当前数据
    getCurrentData: function() {
      console.log('📊 当前 Host 数据:', window.hostSharedData);
      return window.hostSharedData;
    }
  };
  
  // 自动执行测试
  console.log('⏳ 3秒后自动开始测试...');
  setTimeout(() => {
    openMfePages();
    testDataUpdates();
  }, 3000);
  
  // 显示使用说明
  console.log('');
  console.log('🎯 测试说明:');
  console.log('1. 请确保将 VERCEL_MFE_URL 替换为您的实际 Vercel URL');
  console.log('2. 观察打开的 MFE 页面中的数据接收情况');
  console.log('3. 查看控制台日志了解数据传递过程');
  console.log('');
  console.log('🛠️ 手动测试函数:');
  console.log('- testVercelMfe.quickTest() : 快速测试');
  console.log('- testVercelMfe.openPages() : 打开测试页面');
  console.log('- testVercelMfe.updateData() : 测试数据更新');
  console.log('- testVercelMfe.getCurrentData() : 查看当前数据');
  console.log('- testVercelMfe.setCustomData({...}) : 设置自定义数据');
  console.log('');
  
})();