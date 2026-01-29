/**
 * 🔍 Access Token 调试脚本
 * 在浏览器控制台运行此脚本来检查 access token
 */

console.log('🔍 ===== ACCESS TOKEN 调试脚本 =====');

// 1. 检查所有可能的 token 来源
function debugAccessToken() {
  const results = {};
  
  console.log('1️⃣ 检查 window.getMfeApiCredentials:');
  if (window.getMfeApiCredentials) {
    try {
      const creds = window.getMfeApiCredentials();
      console.log('   ✅ 函数存在，返回:', creds);
      if (creds?.accessToken) {
        console.log('   🔑 Access Token (前50字符):', creds.accessToken.substring(0, 50) + '...');
        console.log('   📏 Token 长度:', creds.accessToken.length);
        results.getMfeApiCredentials = creds.accessToken;
      }
    } catch (error) {
      console.log('   ❌ 调用失败:', error);
    }
  } else {
    console.log('   ❌ 函数不存在');
  }

  console.log('2️⃣ 检查 window.hostSharedData:');
  if (window.hostSharedData) {
    console.log('   ✅ 对象存在:', window.hostSharedData);
    if (window.hostSharedData.apiCredentials?.accessToken) {
      const token = window.hostSharedData.apiCredentials.accessToken;
      console.log('   🔑 Access Token (前50字符):', token.substring(0, 50) + '...');
      console.log('   📏 Token 长度:', token.length);
      results.hostSharedData = token;
    }
  } else {
    console.log('   ❌ 对象不存在');
  }

  console.log('3️⃣ 检查 window.refreshMfeApiCredentials:');
  if (window.refreshMfeApiCredentials) {
    console.log('   ✅ 刷新函数存在');
    console.log('   💡 可以手动调用: window.refreshMfeApiCredentials()');
  } else {
    console.log('   ❌ 刷新函数不存在');
  }

  console.log('4️⃣ 检查其他可能位置:');
  console.log('   window.mfeSharedDataService:', window.mfeSharedDataService);
  console.log('   window.hostData:', window.hostData);
  console.log('   window.apiCredentials:', window.apiCredentials);

  return results;
}

// 2. 分析 JWT Token
function analyzeJWT(token) {
  if (!token) {
    console.log('❌ 没有提供 token');
    return;
  }

  console.log('🔍 分析 JWT Token:');
  console.log('   完整 Token:', token);
  console.log('   长度:', token.length);
  console.log('   是否为 JWT:', token.startsWith('eyJ'));

  if (token.startsWith('eyJ')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        // 解析 header
        const header = JSON.parse(atob(parts[0]));
        console.log('   📋 JWT Header:', header);

        // 解析 payload
        const payload = JSON.parse(atob(parts[1]));
        console.log('   📋 JWT Payload:', payload);

        // 检查过期时间
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const now = new Date();
          console.log('   ⏰ 过期时间:', expDate.toLocaleString());
          console.log('   ⏰ 当前时间:', now.toLocaleString());
          console.log('   ⏰ 是否已过期:', expDate < now);
          console.log('   ⏰ 剩余时间:', Math.max(0, Math.floor((expDate - now) / 1000 / 60)), '分钟');
        }

        // 检查其他有用信息
        if (payload.iat) {
          const iatDate = new Date(payload.iat * 1000);
          console.log('   📅 签发时间:', iatDate.toLocaleString());
        }
        if (payload.sub) console.log('   👤 用户ID:', payload.sub);
        if (payload.aud) console.log('   🎯 受众:', payload.aud);
        if (payload.iss) console.log('   🏢 签发者:', payload.iss);
      }
    } catch (error) {
      console.log('   ❌ JWT 解析失败:', error);
    }
  }
}

// 3. 测试 token 有效性
async function testTokenValidity(token, baseUrl) {
  if (!token || !baseUrl) {
    console.log('❌ 需要提供 token 和 baseUrl');
    return;
  }

  console.log('🧪 测试 Token 有效性...');
  
  try {
    // 尝试一个简单的 API 调用
    const response = await fetch(`${baseUrl}/health`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('   📊 响应状态:', response.status);
    console.log('   📊 响应头:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      console.log('   ✅ Token 有效');
    } else {
      console.log('   ❌ Token 可能无效或已过期');
    }
  } catch (error) {
    console.log('   ❌ 测试失败:', error);
  }
}

// 运行调试
const tokens = debugAccessToken();

// 如果找到 token，自动分析第一个
const firstToken = Object.values(tokens)[0];
if (firstToken) {
  console.log('\n🔍 自动分析找到的第一个 Token:');
  analyzeJWT(firstToken);
}

// 提供便捷函数
console.log('\n🛠️ 可用的调试函数:');
console.log('   debugAccessToken() - 重新检查所有 token 来源');
console.log('   analyzeJWT(token) - 分析指定的 JWT token');
console.log('   testTokenValidity(token, baseUrl) - 测试 token 有效性');

// 导出到全局作用域
window.debugAccessToken = debugAccessToken;
window.analyzeJWT = analyzeJWT;
window.testTokenValidity = testTokenValidity;

console.log('🔍 ===== 调试脚本加载完成 =====');