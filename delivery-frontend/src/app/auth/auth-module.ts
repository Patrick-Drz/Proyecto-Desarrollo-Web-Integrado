import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 

import { AuthRoutingModule } from './auth-routing-module';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';

@NgModule({
  declarations: [
    LoginComponent,     
    RegisterComponent,  
    ForgotPassword,
    ResetPassword
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule 
  ]
})
export class AuthModule { }