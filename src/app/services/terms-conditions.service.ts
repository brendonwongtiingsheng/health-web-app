import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface TermsConditions {
  content: string;
  locale: string;
}

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // 检测是否在生产环境（Vercel）
    const isProduction = window.location.hostname !== 'localhost';
    const port = window.location.port;
    
    // 检测是否被 host 加载（通常 host 运行在 8100，remote 在 4200）
    const isLoadedByHost = port === '8100';
    
    if (isProduction) {
      // 在生产环境先尝试Vercel API路由，如果失败再尝试直接调用
      this.apiUrl = '/api/terms-conditions';
    } else if (isLoadedByHost) {
      // 如果被 host 加载，检查 host 是否有 proxy，如果没有则使用直接 URL
      // 先尝试使用 host 的 proxy
      this.apiUrl = '/api/graphql/execute.json/insurance/getKHTermConditionsByLocale';
    } else {
      // 在开发环境使用代理
      this.apiUrl = '/api/graphql/execute.json/insurance/getKHTermConditionsByLocale';
    }
    
    console.log('🌍 Environment:', isProduction ? 'Production' : 'Development');
    console.log('🔗 API URL:', this.apiUrl);
    console.log('🏠 Port:', port, 'Loaded by host:', isLoadedByHost);
  }

  getTermsConditions(locale: string = 'en'): Observable<TermsConditions> {
    const url = `${this.apiUrl}?locale=${locale}`;
    console.log('🌐 Making API call to:', url);
    
    return this.http.get<any>(url).pipe(
      timeout(15000), // 15秒超时
      map(response => this.processApiResponse(response, locale)),
      catchError((error: HttpErrorResponse) => {
        console.error('🚨 API call failed:', error);
        console.log('🔄 Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        // 在生产环境如果Vercel API失败，尝试直接调用
        const isProduction = window.location.hostname !== 'localhost';
        if (isProduction) {
          console.log('🔄 Vercel API failed, trying direct call...');
          return this.tryDirectCall(locale);
        }
        
        console.log('� Using defpault content');
        return of({
          content: this.getDefaultTermsContent(),
          locale: locale
        });
      })
    );
  }

  private tryDirectCall(locale: string): Observable<TermsConditions> {
    const directUrl = `https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale?locale=${locale}`;
    console.log('🌐 Trying direct API call:', directUrl);
    
    return this.http.get<any>(directUrl).pipe(
      timeout(10000),
      map(response => this.processApiResponse(response, locale)),
      catchError((error: HttpErrorResponse) => {
        console.error('🚨 Direct API call also failed:', error);
        console.log('🔄 Trying static file fallback...');
        return this.tryStaticFile(locale);
      })
    );
  }

  private tryStaticFile(locale: string): Observable<TermsConditions> {
    console.log('📁 Loading terms from static file...');
    
    return this.http.get<any>('/assets/terms-conditions.json').pipe(
      map(response => this.processApiResponse(response, locale)),
      catchError((error: HttpErrorResponse) => {
        console.error('🚨 Static file also failed:', error);
        console.log('🔄 Using default content');
        return of({
          content: this.getDefaultTermsContent(),
          locale: locale
        });
      })
    );
  }

  private processApiResponse(response: any, locale: string): TermsConditions {
    console.log('📦 Raw API response:', response);
    
    // 检查是否是Vercel API的错误响应
    if (response?.error) {
      console.log('⚠️ Vercel API returned error:', response.error);
      return {
        content: this.getDefaultTermsContent(),
        locale: locale
      };
    }
    
    // 解析API响应的数据结构
    if (response?.data?.termConditionList?.items && response.data.termConditionList.items.length > 0) {
      // 提取所有条款项目的HTML内容
      const htmlContent = response.data.termConditionList.items
        .map((item: any) => item.mainContent?.html || '')
        .join('\n');
      
      console.log('✅ Extracted HTML content:', htmlContent.substring(0, 200) + '...');
      
      return {
        content: htmlContent,
        locale: locale
      };
    } else {
      console.log('⚠️ No terms found in API response, using default content');
      return {
        content: this.getDefaultTermsContent(),
        locale: locale
      };
    }
  }

  private getDefaultTermsContent(): string {
    return `
      <h2>I hereby DECLARE, UNDERSTAND and AGREE that:</h2>
      
      <ol>
        <li>I confirm that I am not a US citizen or have tax declaration obligation in USA or at least have one of the following indicia:
          <ul>
            <li>US passport or US resident documents</li>
            <li>US tax identification number, or</li>
            <li>US birthplace, US telephone, US address at the of request for change.</li>
          </ul>
        </li>
        
        <li>All information provided by me for this claim is completed and true to the best of my knowledge and belief.</li>
        
        <li>I confirm I am policyowner or beneficiary. The identity information I provide herein is owned by me as the policyowner or beneficiary as part of this claim submission process. I understand that "Submit eClaim application" is part of the claim process and I will not be entitled to any payment of claim until the entire claim process is considered by Manulife (Cambodia PLC) to be completed.</li>
        
        <li>I also hereby agree with and authorize Manulife to deduct from the claim payment, in the event that, I have any shortfall, for whatever reason. Manulife also has the right to reverse / claim back any incorrect payments caused by incorrect/ omission of required information provided in processing the claim.</li>
        
        <li>If a claim is submitted by me as policyowner or beneficiary, then I confirm that I have obtained the necessary authorization from the Insured to submit this claim on their behalf.</li>
        
        <li>I understand that for the purpose of auditing any of my successful claim submission, I may be requested by Manulife to submit any or all original supporting document(s). If I receive such a request, I undertake and agree to immediately submit the Original Documents to Manulife. In the event that I fail to accede to such request or the submitted Original Documents are found to be untrue, fake or misleading, Manulife reserves all the rights including but without limitation not to accept any further eClaim application from me or the Dependent.</li>
        
        <li>I also undertake to notify Manulife if any event within 30 calendar days from the date of change.</li>
        
        <li>I agree to provide my mobile phone number to Manulife in order to keep I informed of any information related to my claim submission.</li>
        
        <li>I agree to allow and authorize Manulife to implement necessary acts subject to applicable law or regulation, including information that need to be collect and disclose my/our information to domestic and oversea authority, regulators to comply with any law requirements</li>
      </ol>
    `;
  }
}