import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RemoteHomeComponent } from './remote-home/remote-home.component';
import { TermsConditionsComponent } from '../components/terms-conditions/terms-conditions.component';
import { SubmitClaimFormComponent } from '../components/submit-claim-form/submit-claim-form.component';
import { TermsConditionsService } from '../services/terms-conditions.service';

const routes: Routes = [
  { path: '', component: RemoteHomeComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'submit-form', component: SubmitClaimFormComponent },
];

@NgModule({
  declarations: [
    RemoteHomeComponent,
    TermsConditionsComponent,
    SubmitClaimFormComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  providers: [TermsConditionsService],
})
export class RemoteEntryModule {}
