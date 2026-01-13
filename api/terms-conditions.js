export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { locale = 'en' } = req.query;
    const apiUrl = `https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale?locale=${locale}`;
    
    console.log('Vercel API: Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-API/1.0)',
      },
    });

    console.log('Vercel API: Response status:', response.status);

    if (!response.ok) {
      console.error('Vercel API: External API error:', response.status, response.statusText);
      
      // 如果外部API失败，返回一个指示，让前端使用默认内容
      return res.status(200).json({
        error: 'External API failed',
        status: response.status,
        data: null
      });
    }

    const data = await response.json();
    console.log('Vercel API: Success, data received');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Vercel API: Catch error:', error.message);
    
    // 返回错误信息，但不要让前端看到500错误
    res.status(200).json({ 
      error: 'API call failed',
      message: error.message,
      data: null
    });
  }
}