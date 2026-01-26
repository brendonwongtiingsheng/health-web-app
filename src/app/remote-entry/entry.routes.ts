import { Routes } from '@angular/router';
import { RemoteHomeComponent } from './remote-home/remote-home.component';
import { ParameterHandlerComponent } from './parameter-handler.component';
import { TermsConditionsComponent } from '../components/terms-conditions/terms-conditions.component';
import { SubmitClaimFormComponent } from '../components/submit-claim-form/submit-claim-form.component';
import { TestHostDataComponent } from '../components/test-host-data/test-host-data.component';

export const remoteRoutes: Routes = [
  { path: '', component: RemoteHomeComponent },
  { path: 'with-params/:userId', component: ParameterHandlerComponent },
  { path: 'with-params', component: ParameterHandlerComponent },
  { path: 'test-host-data', component: TestHostDataComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'terms-conditions/:userId', component: TermsConditionsComponent },
  { path: 'submit-form', component: SubmitClaimFormComponent },
  { path: 'submit-form/:userId', component: SubmitClaimFormComponent },
];
