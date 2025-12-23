import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RemoteHomeComponent } from './remote-home/remote-home.component';

const routes: Routes = [
  { path: '', component: RemoteHomeComponent },
];

@NgModule({
  declarations: [RemoteHomeComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class RemoteEntryModule {}
