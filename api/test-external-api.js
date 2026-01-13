export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { locale = 'en' } = req.query;
    const apiUrl = `https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale?locale=${locale}`;
    
    console.log('Testing API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-Test/1.0)',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response text (first 500 chars):', responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      return res.status(200).json({
        error: 'Invalid JSON response',
        status: response.status,
        responseText: responseText.substring(0, 1000)
      });
    }

    res.status(200).json({
      success: true,
      status: response.status,
      data: data,
      apiUrl: apiUrl
    });

  } catch (error) {
    console.error('Test API error:', error);
    res.status(200).json({
      error: 'Network or fetch error',
      message: error.message,
      apiUrl: `https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale?locale=${req.query.locale || 'en'}`
    });
  }
}