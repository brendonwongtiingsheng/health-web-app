import { Routes } from '@angular/router';
import { RemoteHomeComponent } from './remote-home/remote-home.component';
import { TermsConditionsComponent } from '../components/terms-conditions/terms-conditions.component';
import { SubmitClaimFormComponent } from '../components/submit-claim-form/submit-claim-form.component';

export const remoteRoutes: Routes = [
  { path: '', component: RemoteHomeComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'submit-form', component: SubmitClaimFormComponent },
];
