# MFE API Integration Guide

## 🎯 Overview

This MFE (Micro Frontend) now supports receiving access tokens from the Host application and calling authenticated APIs using the `getInsured` method with SecureStorage support.

## 🏗️ Architecture

```
Host Application (Ionic/Angular)
    ↓ Pass API Credentials
MFE Application (Remote Module)
    ↓ Use Credentials to Call API
Backend API Server
```

## 🔧 Implementation Status

### ✅ Completed Features

1. **HostDataService** - Enhanced to support API credentials
   - `getApiCredentialsFromHost()` - Get credentials from Host
   - `refreshApiCredentialsFromHost()` - Refresh expired tokens
   - Multiple fallback methods for credential retrieval

2. **AuthenticatedApiService** - New service for API calls
   - `getInsured(policyNo)` - Get insured information with SecureStorage support
   - `callAuthenticatedApi()` - Generic authenticated API caller
   - Automatic 401 error handling with token refresh
   - SecureStorage integration with localStorage fallback

3. **TestHostDataComponent** - Comprehensive testing interface
   - Test API credential retrieval
   - Test API connection
   - Test insured information retrieval
   - Debug and export functionality

4. **Integration in SubmitClaimFormComponent**
   - API testing functionality added
   - Real-time credential status checking

## 🚀 How to Use

### 1. Access the Test Interface

Navigate to `/test-host-data` or click the "🧪 Test API Integration" button on the home page.

### 2. Test API Integration

1. **Check Status**: View Host data and API credentials status
2. **Test Credentials**: Verify credential retrieval from Host
3. **Test Connection**: Check API service availability
4. **Test Insured API**: Call the `getInsured` method

### 3. Use in Your Code

```typescript
// Inject the service
constructor(private authenticatedApiService: AuthenticatedApiService) {}

// Call the API method
async testInsured() {
  try {
    const result = await this.authenticatedApiService.getInsured('POLICY123');
    console.log('API Result:', result);
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

## 🔑 API Credentials Flow

### Host Application Setup
The Host application should provide API credentials via:

1. `window.getMfeApiCredentials()` - Direct credential getter
2. `window.hostSharedData.apiCredentials` - Shared data object
3. `window.refreshMfeApiCredentials()` - Token refresh method

### Expected Credential Format
```typescript
interface ApiCredentials {
  accessToken: string;      // Bearer token
  xApiKey: string;         // API key
  baseUrlBFF: string;      // Base API URL
  refreshToken?: string;   // Optional refresh token
  tokenExpiry?: string;    // Optional expiry time
}
```

## 🧪 Testing Features

### Test Host Data Component (`/test-host-data`)

**Features:**
- 📊 Real-time status monitoring
- 🔑 API credential testing
- 🌐 Connection testing
- 👤 Insured information retrieval testing
- 🐛 Debug information export
- 📁 Test data export

**Test Scenarios:**
1. **Credential Retrieval**: Tests all fallback methods
2. **API Connection**: Validates credentials and connectivity
3. **Insured API**: Calls the `getInsured` method
4. **Token Refresh**: Tests automatic token refresh on 401 errors

## 🔄 Error Handling

### Automatic 401 Handling
- Detects 401 Unauthorized responses
- Automatically refreshes tokens via Host
- Retries the original request
- Falls back to error if refresh fails

### Error Types
- **No Credentials**: Host hasn't provided API credentials
- **Invalid Credentials**: Credentials are malformed or expired
- **Network Error**: API service unavailable
- **401 Unauthorized**: Token expired (auto-handled)
- **Other API Errors**: Passed through to caller

## 🔧 Configuration

### Development Mode
Set `showDebugOptions = true` in `RemoteHomeComponent` to show the test link.

### Production Mode
Set `showDebugOptions = false` to hide debug features.

## 📝 API Method Details

### `getInsured(policyNo: string)`

This method retrieves insured information with enhanced features:
- SecureStorage integration for mobile environments
- localStorage fallback for web environments
- Host credential integration
- Automatic token refresh
- Error handling
- Logging

**Implementation Details:**
- Endpoint: `/v1/policies/insured`
- Headers: Authorization, x-api-key, security headers
- Timeout: 30 seconds
- Storage: SecureStorage with localStorage fallback

## 🐛 Debugging

### Console Logs
All services provide detailed console logging:
- 🔑 Credential retrieval attempts
- 🌐 API calls and responses
- ❌ Error details
- 🔄 Token refresh operations

### Debug Tools
1. **Browser Console**: Check for detailed logs
2. **Test Component**: Use `/test-host-data` for interactive testing
3. **Export Data**: Download test results as JSON
4. **Debug Info**: View complete system state

## 🔒 Security Considerations

- Credentials only passed in memory (not localStorage)
- SecureStorage used for sensitive data in mobile environments
- Automatic token refresh prevents expired token issues
- Secure headers included in all requests
- No credential storage in MFE

## 📋 Troubleshooting

### Common Issues

1. **"Cannot get API credentials"**
   - Check if Host application is properly setting credentials
   - Verify Host has called `setApiCredentials()`

2. **401 Errors**
   - Usually auto-handled by token refresh
   - Check if Host provides `refreshMfeApiCredentials()`

3. **Network Errors**
   - Verify API service is running
   - Check CORS configuration
   - Validate base URL

### Debug Commands
```javascript
// In browser console
window.getMfeApiCredentials()
window.hostSharedData
window.refreshMfeApiCredentials()
```

## ✅ Next Steps

1. **Host Integration**: Ensure Host app provides credentials correctly
2. **Production Testing**: Test with real API endpoints
3. **Error Monitoring**: Add production error tracking
4. **Performance**: Monitor API call performance

## 📞 Support

For issues or questions:
1. Check browser console for detailed logs
2. Use the test component for debugging
3. Export test data for analysis
4. Review this guide for troubleshooting steps

---

**Status**: ✅ Implementation Complete
**Last Updated**: January 2026
**Version**: 1.1.0