/**
 * 快速 Host 测试脚本
 * 在浏览器控制台中运行此脚本来测试 Host-MFE 参数传递
 * 
 * 使用方法:
 * 1. 启动 MFE 应用: npm start
 * 2. 访问: http://localhost:4200/test-host-data
 * 3. 在浏览器控制台粘贴并运行此脚本
 */

console.log('🚀 开始 Host-MFE 参数传递快速测试...');

// 模拟您的 Host 系统
function setupHostSystem() {
  console.log('🔧 设置 Host 系统模拟...');
  
  // 模拟 MfeSharedDataService 的 hostSharedData
  window.hostSharedData = {};
  
  // 模拟 getMfeData 函数
  window.getMfeData = function() {
    return window.hostSharedData;
  };
  
  // 模拟 mfeSharedDataService 实例
  window.mfeSharedDataService = {
    getHostData: () => window.hostSharedData,
    setHostData: (data) => {
      window.hostSharedData = { ...window.hostSharedData, ...data };
      console.log('📤 Host 数据已更新:', window.hostSharedData);
      
      // 通知订阅者
      if (window._mfeSubscribers) {
        window._mfeSubscribers.forEach(callback => {
          try {
            callback(window.hostSharedData);
          } catch (error) {
            console.error('❌ 订阅回调错误:', error);
          }
        });
      }
    }
  };
  
  // 模拟订阅系统
  window._mfeSubscribers = [];
  window.subscribeMfeData = function(callback) {
    window._mfeSubscribers.push(callback);
    console.log('🔗 MFE 订阅者已添加，总数:', window._mfeSubscribers.length);
    
    return {
      unsubscribe: () => {
        const index = window._mfeSubscribers.indexOf(callback);
        if (index > -1) {
          window._mfeSubscribers.splice(index, 1);
          console.log('🔌 MFE 订阅已取消');
        }
      }
    };
  };
  
  console.log('✅ Host 系统模拟设置完成');
}

// 测试基础数据传递
function testBasicData() {
  console.log('🧪 测试 1: 基础数据传递');
  
  const basicData = {
    userId: 'quick-test-' + Date.now(),
    userProfile: {
      name: 'Quick Test User',
      email: 'quick.test@example.com',
      phone: '+1234567890',
      userId: 'quick-test-' + Date.now(),
      language: 'en'
    },
    claimType: 'medical',
    language: 'en',
    sessionData: {
      isLoggedIn: true,
      token: 'quick-token-' + Date.now()
    },
    pageContext: 'quick-test',
    timestamp: new Date().toISOString()
  };
  
  window.mfeSharedDataService.setHostData(basicData);
  console.log('✅ 基础数据测试完成');
}

// 测试高级数据传递
function testAdvancedData() {
  console.log('🧪 测试 2: 高级数据传递');
  
  const advancedData = {
    userId: 'advanced-test-' + Date.now(),
    userProfile: {
      name: 'Advanced Test User',
      email: 'advanced@example.com',
      phone: '+0987654321',
      userId: 'advanced-test-' + Date.now(),
      language: 'en',
      department: 'Testing',
      role: 'QA Engineer',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    },
    claimType: 'comprehensive',
    language: 'en',
    sessionData: {
      isLoggedIn: true,
      token: 'advanced-token-' + Date.now(),
      permissions: ['read', 'write', 'test']
    },
    pageContext: 'advanced-test',
    claimData: {
      claimId: 'CLM-TEST-' + Date.now(),
      amount: 1500.00,
      currency: 'USD',
      status: 'testing'
    },
    timestamp: new Date().toISOString()
  };
  
  window.mfeSharedDataService.setHostData(advancedData);
  console.log('✅ 高级数据测试完成');
}

// 测试高棉语数据
function testKhmerData() {
  console.log('🧪 测试 3: 高棉语数据传递');
  
  const khmerData = {
    userId: 'khmer-test-' + Date.now(),
    userProfile: {
      name: 'អ្នកសាកល្បង',
      email: 'khmer.test@example.com',
      phone: '+855123456789',
      userId: 'khmer-test-' + Date.now(),
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
  
  window.mfeSharedDataService.setHostData(khmerData);
  console.log('✅ 高棉语数据测试完成');
}

// 测试实时数据更新
function testRealTimeUpdates() {
  console.log('🧪 测试 4: 实时数据更新');
  
  let updateCounter = 0;
  const updateInterval = setInterval(() => {
    updateCounter++;
    
    const updateData = {
      language: Math.random() > 0.5 ? 'en' : 'km',
      claimType: ['medical', 'dental', 'vision'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString(),
      updateCounter: updateCounter,
      randomValue: Math.floor(Math.random() * 1000)
    };
    
    window.mfeSharedDataService.setHostData(updateData);
    console.log(`🔄 实时更新 #${updateCounter}:`, updateData);
    
    // 5次更新后停止
    if (updateCounter >= 5) {
      clearInterval(updateInterval);
      console.log('✅ 实时更新测试完成');
    }
  }, 2000);
}

// 测试数据清除
function testDataClear() {
  console.log('🧪 测试 5: 数据清除');
  
  setTimeout(() => {
    window.hostSharedData = {};
    window.mfeSharedDataService.setHostData({});
    console.log('🗑️ 数据已清除');
    console.log('✅ 数据清除测试完成');
  }, 12000); // 在实时更新测试完成后执行
}

// 运行所有测试
function runAllTests() {
  console.log('🎯 开始运行所有测试...');
  
  setupHostSystem();
  
  setTimeout(() => testBasicData(), 1000);
  setTimeout(() => testAdvancedData(), 3000);
  setTimeout(() => testKhmerData(), 5000);
  setTimeout(() => testRealTimeUpdates(), 7000);
  setTimeout(() => testDataClear(), 15000);
  
  setTimeout(() => {
    console.log('🎉 所有测试完成！');
    console.log('📊 请查看 MFE 应用页面确认数据接收情况');
  }, 17000);
}

// 提供单独的测试函数
window.hostTestFunctions = {
  setupHostSystem,
  testBasicData,
  testAdvancedData,
  testKhmerData,
  testRealTimeUpdates,
  testDataClear,
  runAllTests
};

// 自动运行所有测试
console.log('🚀 自动运行所有测试...');
console.log('💡 您也可以单独调用: window.hostTestFunctions.testBasicData() 等');
runAllTests();