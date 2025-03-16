import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-operateur',
  templateUrl: './operateur.component.html',
  styleUrls: ['./operateur.component.scss']
})
export class OperateurComponent implements OnInit {
  operateurs: any[] = []; // Liste des opérateurs
  newOperateurForm: FormGroup; // Formulaire pour créer un nouvel opérateur
  editOperateurForm: FormGroup;
  selectedOperateur: any;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,

  ) {
    // Initialisation du formulaire
    this.newOperateurForm = this.fb.group({
      nomoperateur: ['', Validators.required],
      adresse_email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      motdepasse: ['', Validators.required]
    });
    this.editOperateurForm = this.fb.group({
      nomoperateur: ['', Validators.required],
      adresse_email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      motdepasse: ['']
    });
  }

  ngOnInit(): void {
    this.loadOperateurs(); // Charger la liste des opérateurs au démarrage
  }

  // Charger la liste des opérateurs
  loadOperateurs() {
    this.http.get<any[]>('http://localhost:5000/operateurs').subscribe(
      (data) => {
        this.operateurs = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des opérateurs', error);
      }
    );
  }

  // Ouvrir la modale pour créer un nouvel opérateur
  openNewOperateurModal(modal: TemplateRef<any>) {
    this.newOperateurForm.reset(); // Réinitialiser le formulaire
    this.modalService.open(modal, { size: 'lg' });
  }
  openEditOperateurModal(operateur: any, modal: TemplateRef<any>) {
    this.selectedOperateur = operateur; // Stocker l'opérateur sélectionné
    this.editOperateurForm.patchValue({
      nomoperateur: operateur.nomoperateur,
      adresse_email: operateur.adresse_email,
      telephone: operateur.telephone,
      motdepasse: '' // Laisser le mot de passe vide par défaut
    });
    this.modalService.open(modal, { size: 'lg' });
  }
  // Créer un nouvel opérateur
  createOperateur() {
    if (this.newOperateurForm.invalid) {
      return;
    }

    const newOperateur = {
      nomoperateur: this.newOperateurForm.value.nomoperateur,
      adresse_email: this.newOperateurForm.value.adresse_email,
      telephone: this.newOperateurForm.value.telephone,
      motdepasse: this.newOperateurForm.value.motdepasse, // Note : Hasher le mot de passe côté serveur
      etat_connexion: false // Par défaut, l'opérateur est déconnecté
    };

    this.http.post('http://localhost:5000/operateurs', newOperateur).subscribe(
      (response) => {
        this.modalService.dismissAll();
        this.loadOperateurs(); // Recharger la liste des opérateurs
      },
      (error) => {
        console.error("Erreur lors de la création de l'opérateur", error);
      }
    );
  }

  // Supprimer un opérateur
  deleteOperateur(id: number, modal: TemplateRef<any>) {
    this.modalService.open(modal).result.then(
      (result) => {
        if (result === 'Ok') {
          this.http.delete(`http://localhost:5000/operateurs/${id}`).subscribe(
            (response) => {
              this.toastr.success('Supprimer avec succès !', 'Succès');

              this.loadOperateurs(); // Recharger la liste des opérateurs
            },
            (error) => {
              console.error("Erreur lors de la suppression de l'opérateur", error);
            }
          );
        }
      },
      (reason) => {
        // Annulation de la suppression
      }
    );
  }
  updateOperateur() {
    if (this.editOperateurForm.invalid) {
      return;
    }

    const updatedOperateur = {
      nomoperateur: this.editOperateurForm.value.nomoperateur,
      adresse_email: this.editOperateurForm.value.adresse_email,
      telephone: this.editOperateurForm.value.telephone,
      motdepasse: this.editOperateurForm.value.motdepasse || undefined // Ne pas envoyer le mot de passe s'il est vide
    };

    this.http.put(`http://localhost:5000/operateurs/${this.selectedOperateur.id}`, updatedOperateur).subscribe(
      (response) => {
        console.log(response)
        this.modalService.dismissAll();
        this.toastr.success('Mise à jour avec succès !', 'Succès');

        this.loadOperateurs(); // Recharger la liste des opérateurs
      },
      (error) => {
        console.error("Erreur lors de la mise à jour de l'opérateur", error);
      }
    );
  }
}
