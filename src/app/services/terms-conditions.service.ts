import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TermsConditions {
  content: string;
  locale: string;
}

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {
  private apiUrl = 'https://preprod-ap.manulife.com.kh/graphql/execute.json/insurance/getKHTermConditionsByLocale';

  constructor(private http: HttpClient) {}

  getTermsConditions(locale: string = 'en'): Observable<TermsConditions> {
    return this.http.get<TermsConditions>(`${this.apiUrl}?locale=${locale}`);
  }
}