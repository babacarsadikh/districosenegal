import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';



@NgModule({
  declarations: [],
  imports: [
       CommonModule,
        ClientRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        SharedComponentsModule,
  ]
})
export class ClientModule { }
