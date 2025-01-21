import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './livraisondetails.component.html',
  styleUrls: ['./livraisondetails.component.scss'],
})
export class LivraisondetailsComponent implements OnInit, OnDestroy {
  updata
   today = new Date(); // Obtenir la date d'aujourd'hui
   formattedToday = this.today.toISOString().split('T')[0];
  drivers = ['FALLOU', 'MBACKE', 'ZALE']; // Liste des chauffeurs disponibles
  chauffeur;
  viewMode: 'edit' | 'print' = 'edit'; // Mode de vue
  id: string; // ID de la facture
  isNew: boolean; // Indique si c'est une nouvelle facture
  invoice: any = {}; // Données de la facture
  invoiceForm: UntypedFormGroup; // Formulaire de la facture
  invoiceFormSub: Subscription; // Subscription pour écouter les changements du formulaire
  subTotal: number = 0; // Sous-total calculé
  saving: boolean = false; // Indique si une sauvegarde est en cours
  dataCommande = {
    nomclient: "mbaye",
    adresse_chantier: "MERMOZ",
    quantite_commande: 25,
    quantite_charge: 25,
    quantite_restante: 0,
    formulation: "C30",
    plaque_camion: "AA-3823EE",
    livraison_type: "toupie",
    statut: "Livrée",
    date_commande: "2025-01-09",
    date_production: this.formattedToday,
    heure_depart: "10:00",
    heure_darrive: null,
    chauffeur: "MODOU fkk",
  };
  selectedPlaqueCamion: string = '';



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    private dl: DataLayerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id']; // Récupère l'ID de l'URL
    this.isNew = !this.id; // Vérifie si c'est une nouvelle facture
    this.loadChauffeur();

    this.buildInvoiceForm(this.invoice);

    if (this.id) {
      this.viewMode = 'edit';
      this.loadInvoice();
    }
  }

  buildInvoiceForm(i: any = {}) {
    this.invoiceForm = this.fb.group({
      nomclient: [i.nomclient || ''],
      adresse_chantier: [i.adresse_chantier || ''],
      quantite_commande: [i.quantite_commande || 0],
      quantite_charge: [i.quantite_charge || 0],
      quantite_restante: [i.quantite_restante || 0],
      formulation: [i.formulation || ''],
      statut: [i.statut || 'Produit'],
      plaque_camion: [i.plaque_camion || ''],
      livraison_type: [i.livraison_type || 'toupie'],
      date_commande: [i.date_commande ? Utils.dateToNgbDate(i.date_commande) : {}],
      date_production: [i.date_production ? Utils.dateToNgbDate(i.date_production) : {}],
      heure_depart: [i.heure_depart || '10:20'],
      heure_darrive: [i.heure_darrive || null],
      chauffeur: [i.chauffeur || null],
    });

    // Abonnement aux changements de la sélection du chauffeur
    this.invoiceForm.get('chauffeur')?.valueChanges.subscribe((selectedChauffeur) => {
      if (selectedChauffeur) {
        // Mettre à jour la plaque camion en fonction du chauffeur sélectionné
        this.invoiceForm.get('plaque_camion')?.setValue(selectedChauffeur.plaque_camion);
      } else {
        this.invoiceForm.get('plaque_camion')?.reset();
      }
    });

    // Abonnement aux changements du formulaire pour le calcul du sous-total
    if (this.invoiceFormSub) {
      this.invoiceFormSub.unsubscribe();
    }
    this.invoiceFormSub = this.invoiceForm.valueChanges.subscribe((formValue) => {
      this.subTotal = this.calculateSubtotal(formValue);
    });
  }

  loadChauffeur(){
    this.dl.getAllchauffer()
    .subscribe(res => {
       this.chauffeur = res;
       this.chauffeur = this.chauffeur.chauffeurs
       console.log(this.chauffeur)



    });
  }
  loadInvoice() {
    this.dl.getBoncommande(this.id)
      .pipe(
        catchError((error) => {
          this.toastr.error('Erreur lors du chargement de la commande', 'Erreur!');
          this.router.navigateByUrl('/bonlivraison');
          throw error; // Rethrow the error
        })
      )
      .subscribe((res) => {
        this.invoice = res;
        console.log(this.invoice)
        this.buildInvoiceForm(this.invoice);
        this.subTotal = this.calculateSubtotal(this.invoiceForm.value);
        const dateCommande = this.invoice.date_commande;
        const dateProduction = this.invoice.date_production;

        this.invoiceForm.get('date_commande').setValue(dateCommande);
        this.invoiceForm.get('date_production').setValue(dateProduction);

      });
  }
  formatDate(date: any): string {
    if (!date) {
      return null;
    }

    // Si c'est un NgbDate, convertissez-le en chaîne
    if (date.year && date.month && date.day) {
      const month = date.month < 10 ? `0${date.month}` : date.month;
      const day = date.day < 10 ? `0${date.day}` : date.day;
      return `${date.year}-${month}-${day}`;
    }

    // Si c'est un objet Date natif
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }
  updateCommande () {
    this.saving = true;
   // console.log (JSON.stringify(this.invoiceForm.value))
    this.updata = {
     // nomclient: this.invoiceForm.get('nomclient').value,
      adresse_chantier: this.invoiceForm.get('adresse_chantier').value,
      quantite_commande: this.invoiceForm.get('quantite_commande').value,
      quantite_charge: this.invoiceForm.get('quantite_charge').value,
      quantite_restante:  this.invoiceForm.get('quantite_commande').value - this.invoiceForm.get('quantite_charge').value,
      formulation: this.invoiceForm.get('formulation').value,
      plaque_camion: this.invoiceForm.get('chauffeur').value?.plaque_camion || '',
      livraison_type: this.invoiceForm.get('livraison_type').value,
      statut: "Produit",

     // date_commande: (this.invoiceForm.get('date_commande').value),
      date_production: (this.invoiceForm.get('date_production').value),
     // heure_depart: this.invoiceForm.get('heure_depart').value,
     // heure_darrive: this.invoiceForm.get('heure_darrive').value,
      chauffeur: this.invoiceForm.get('chauffeur').value?.nom || '',
    }
    this.dl.updateNomcommande(this.updata , this.id ).subscribe(res => {
        console.log(res)
        this.saving = false;
        this.toastr.success('Commande enregistrée avec succès!', 'Succès', { timeOut: 3000 });
        this.invoice
        this.viewMode = 'print';


    })
   // console.log(this.id)

  }
  saveInvoice() {
    this.saving = true;
    this.invoice = this.invoiceForm.value;
    console.log(this.invoiceForm.value)
      this.dataCommande = {
        nomclient: this.invoiceForm.get('nomclient').value,
        adresse_chantier: this.invoiceForm.get('adresse_chantier').value,
        quantite_commande: this.invoiceForm.get('quantite_commande').value,
        quantite_charge: this.invoiceForm.get('quantite_charge').value,
        quantite_restante: this.invoiceForm.get('quantite_restante').value,
        formulation: this.invoiceForm.get('formulation').value,
        plaque_camion: this.invoiceForm.get('chauffeur').value?.plaque_camion || '',
        livraison_type: this.invoiceForm.get('livraison_type').value,
        statut: this.invoiceForm.get('statut').value,
        date_commande: (this.invoiceForm.get('date_commande').value),
        date_production: (this.invoiceForm.get('date_commande').value),
        heure_depart: this.invoiceForm.get('heure_depart').value,
        heure_darrive: this.invoiceForm.get('heure_darrive').value,
        chauffeur: this.invoiceForm.get('chauffeur').value?.nom || '',
      };
 // console.log(this.dataCommande)

     this.dl.updateNomcommande(this.invoiceForm.value , this.id)
     .subscribe(() => {
      this.viewMode = 'print';
      this.saving = false;
      this.toastr.success('Bon de Livraison enregistré avec succès!', 'Succès', { timeOut: 3000 });


    });
    // this.dl.ajouterBon(this.dataCommande)
    //   .pipe(
    //     catchError((error) => {
    //       this.saving = false;
    //       this.toastr.error('Erreur lors de l\'enregistrement de la commande', 'Erreur!');
    //       throw error; // Rethrow the error
    //     })
    //   )
    //   .subscribe(() => {
    //     this.viewMode = 'print';
    //     this.saving = false;
    //     this.toastr.success('Commande enregistrée avec succès!', 'Succès', { timeOut: 3000 });


    //   });
  }

  calculateSubtotal(invoice) {
    let total = 0;
    if (invoice.items) {
      invoice.items.forEach((i) => {
        total += i.unit * i.unitPrice;
      });
    }
    return total;
  }


  print() {
    if (window) {
      window.print();
  }
  }

  ngOnDestroy() {
    if (this.invoiceFormSub) {
      this.invoiceFormSub.unsubscribe();
    }
  }
}
