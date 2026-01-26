/**
 * 简单的 Host → MFE 数据传递测试
 * 
 * 使用方法：
 * 1. 启动 MFE: npm start
 * 2. 访问: http://localhost:4200/test-host-data
 * 3. 在控制台粘贴此脚本并运行
 */

console.log('🎯 开始简单的 Host → MFE 测试');

// 测试函数集合
window.hostToMfeTest = {
  
  // 测试 1: 基础英语数据
  basic: function() {
    console.log('📤 测试 1: 基础英语数据');
    window.hostSharedData = {
      userId: 'basic-123',
      userProfile: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        userId: 'basic-123',
        language: 'en'
      },
      claimType: 'medical',
      language: 'en',
      sessionData: {
        isLoggedIn: true,
        token: 'basic-token'
      }
    };
    console.log('✅ 基础数据已设置，请查看 MFE 页面');
  },
  
  // 测试 2: 高棉语数据
  khmer: function() {
    console.log('📤 测试 2: 高棉语数据');
    window.hostSharedData = {
      userId: 'khmer-456',
      userProfile: {
        name: 'សុខ វិចិត្រ',
        email: 'sok@example.com',
        phone: '+855123456789',
        userId: 'khmer-456',
        language: 'km'
      },
      claimType: 'medical',
      language: 'km',
      sessionData: {
        isLoggedIn: true,
        token: 'khmer-token'
      }
    };
    console.log('✅ 高棉语数据已设置');
  },
  
  // 测试 3: 声明数据
  claim: function() {
    console.log('📤 测试 3: 声明数据');
    window.hostSharedData = {
      userId: 'claim-789',
      userProfile: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        userId: 'claim-789',
        language: 'en'
      },
      claimType: 'comprehensive',
      language: 'en',
      claimData: {
        claimId: 'CLM-001',
        amount: 2500.00,
        currency: 'USD',
        status: 'pending'
      },
      sessionData: {
        isLoggedIn: true,
        token: 'claim-token'
      }
    };
    console.log('✅ 声明数据已设置');
  },
  
  // 测试 4: 实时更新
  realtime: function() {
    console.log('📤 测试 4: 实时更新（每2秒更新一次，共5次）');
    let count = 0;
    const interval = setInterval(() => {
      count++;
      window.hostSharedData = {
        userId: 'realtime-' + count,
        userProfile: {
          name: 'Realtime User ' + count,
          email: 'realtime' + count + '@example.com',
          phone: '+100000000' + count,
          userId: 'realtime-' + count,
          language: count % 2 === 0 ? 'en' : 'km'
        },
        claimType: ['medical', 'dental', 'vision'][count % 3],
        language: count % 2 === 0 ? 'en' : 'km',
        timestamp: new Date().toISOString(),
        updateCount: count
      };
      console.log(`🔄 实时更新 #${count}`);
      
      if (count >= 5) {
        clearInterval(interval);
        console.log('✅ 实时更新测试完成');
      }
    }, 2000);
  },
  
  // 测试 5: 清除数据
  clear: function() {
    console.log('📤 测试 5: 清除数据');
    window.hostSharedData = {};
    console.log('🗑️ 数据已清除');
  },
  
  // 运行所有测试
  all: function() {
    console.log('🚀 运行所有测试...');
    this.basic();
    setTimeout(() => this.khmer(), 3000);
    setTimeout(() => this.claim(), 6000);
    setTimeout(() => this.realtime(), 9000);
    setTimeout(() => this.clear(), 20000);
    setTimeout(() => console.log('🎉 所有测试完成！'), 21000);
  }
};

// 显示使用说明
console.log(`
🎯 可用的测试命令：

hostToMfeTest.basic()    - 测试基础英语数据
hostToMfeTest.khmer()    - 测试高棉语数据  
hostToMfeTest.claim()    - 测试声明数据
hostToMfeTest.realtime() - 测试实时更新
hostToMfeTest.clear()    - 清除数据
hostToMfeTest.all()      - 运行所有测试

💡 建议先运行: hostToMfeTest.basic()
`);

// 自动运行基础测试
console.log('🚀 自动运行基础测试...');
window.hostToMfeTest.basic();