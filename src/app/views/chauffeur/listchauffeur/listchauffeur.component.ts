import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Country } from '../../../shared/models/country.model';
import { CountryService } from '../../../shared/services/country.service';
import { NgbdSortableHeader, SortEvent } from '../../../shared/directives/sortable.directive';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-listchauffeur',
  standalone: false,
  templateUrl: './listchauffeur.component.html',
  styleUrl: './listchauffeur.component.scss',
  providers: [CountryService, DecimalPipe],

})
export class ListchauffeurComponent {
  chauffeurForm: FormGroup;

  confirmResut;
  chauffeurs: any=[];
  countries$: Observable<Country[]>;
  total$: Observable<number>;
  chauffeur = {
    nom_chauffeur: '',
    telephone: '',
    plaque_camion: ''
  };

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(

    public service: CountryService,
    private dl: DataLayerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {

  }
  ngOnInit() {

    this.loadChauffeurs();


}
saveitfist (valeur){
  this.dl.ajouterchauffeur(valeur)
      .subscribe(res => {
          console.log(res)
      })
}
// onSaveChauffeur(modal: any): void {

//   if (this.chauffeur) {
//     this.saveitfist (this.chauffeur)
//     this.loadChauffeurs();
//      modal.close();
//   } else {
//     console.error('Formulaire invalide');
//   }
// }
onSaveChauffeur(modal: any): void {
  if (this.chauffeur && this.chauffeur.nom_chauffeur && this.chauffeur.telephone && this.chauffeur.plaque_camion) {
    try {
      this.saveitfist(this.chauffeur);
      this.loadChauffeurs();
      modal.close();
    } catch (error) {
    // console.error('Erreur lors de l’enregistrement du chauffeur :', error);
      this.toastr.error('veuillez remplir tous les champs.', 'Erreur');

    }
  } else {
   // console.error('Formulaire invalide : veuillez remplir tous les champs.');
    this.toastr.error('veuillez remplir tous les champs.', 'Erreur');

  }
}


  loadChauffeurs() {
    this.dl.getAllchauffer()
        .subscribe(res => {
            this.chauffeurs=res['data']
           console.log('-->',this.chauffeurs)

        });
}
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }
  openSmall(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }

  confirm(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    .result.then((result) => {
      this.confirmResut = `Closed with: ${result}`;
    }, (reason) => {
      this.confirmResut = `Dismissed with: ${reason}`;
    });
  }
}

