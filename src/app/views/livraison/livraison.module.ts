import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivraisonlistComponent } from './livraisonlist/livraisonlist.component';
import { LivraisondetailsComponent } from './livraisondetails/livraisondetails.component';
import { LivraisonRoutingModule } from './livraison-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';




@NgModule({
  imports: [
    CommonModule,
    LivraisonRoutingModule,
      FormsModule,
        ReactiveFormsModule,
        SharedComponentsModule,
        NgbModule,
  ],
  declarations: [LivraisonlistComponent,LivraisondetailsComponent],

})
export class LivraisonModule { }
