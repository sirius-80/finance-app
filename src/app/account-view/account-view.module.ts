import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountViewComponent } from './account-view/account-view.component';



@NgModule({
  declarations: [AccountViewComponent],
  imports: [
    CommonModule
  ],
  exports: [
    AccountViewComponent
  ]
})
export class AccountViewModule { }
