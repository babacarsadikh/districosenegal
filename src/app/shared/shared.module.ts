import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchModule } from './components/search/search.module';
import { SharedComponentsModule } from './components/shared-components.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    ToastrModule.forRoot(),
    NgbModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedPipesModule,
    RouterModule,
    HttpClientModule
  ]
})
export class SharedModule { }
