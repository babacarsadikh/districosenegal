import { Component, OnInit, ViewChild ,TemplateRef} from '@angular/core';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  selectedCommande: any = null;
  ajoutQuantite: number = 0;
  allSelected: boolean;
  page = 1;
  pageSize = 8;
  @ViewChild('confirmationLivraisonModal') confirmationLivraisonModal: any;
  @ViewChild('editQuantiteModal') editQuantiteModal!: TemplateRef<any>;

    formules = ['C10','C15','C20','C25','C30','C35', 'BÉTON CHAPE','C15 hydrofuge','C25 hydrofuge', 'C30 hydrofuge','C35/40 hydrofuge']
    commandes;
    commandeSelectionnee: any = null;
    quantiteChargee: number = 0;
    erreurQuantiteChargee: boolean = false;
    quantitedeCommande: number = 0;
   // chauffeurSelectionne: number =0;
    clienselectione: number = 0;
    formuleselectione;
    datecommande;
    plaqueCamion: string = '';
    chauffeurSelectionne: number | null = null; // ID du chauffeur sélectionné
    Clients;
    chauffeurs; // Charger les chauffeurs si nécessaire
    adresses: any[] = []; // Liste des adresses disponibles
    adresseSelectionnee: number = 0;
    adresseLivraison: string = '';
    filteredAdresses!: Observable<any[]>;
    adresseCtrl = new FormControl('');

    constructor(
        private dl: DataLayerService,
        private modalService: NgbModal,
        private toastr: ToastrService,

    ) {

     }
     openEditQuantiteModal(commande: any) {
      this.selectedCommande = commande;
      this.ajoutQuantite = 0;
      this.modalService.open(this.editQuantiteModal);
    }
    ngOnInit() {
        this.loadCommandes();
        this.loadChauffeurs();
        this.loadAdresses();
        this.loadClient();

    }
    private _filter(value: string): any[] {
      const filterValue = value.toLowerCase();
      return this.adresses.filter(adresse =>
        adresse.adresse.toLowerCase().includes(filterValue)
      );
    }
    updateCommande(modal: any) {
      if (!this.selectedCommande || !this.ajoutQuantite || this.ajoutQuantite <= 0) {
        return; // sécurité
      }
      const ancienneQuantite = parseFloat(this.selectedCommande.quantite_commandee);
      const ajout = parseFloat(this.ajoutQuantite.toString());

      const nouvelleQuantite = ancienneQuantite + ajout;
      const dateProduction = this.selectedCommande.date_production?.split('T')[0]; // '2025-05-09T00:00:00.000Z' → '2025-05-09'

      const updatedCommande = {
        id_client: this.selectedCommande.id_client,
        formule: this.selectedCommande.formule,
        quantite_commandee: nouvelleQuantite,
        date_production: dateProduction
      };

      this.dl.updateCommande(this.selectedCommande.id_commande, updatedCommande)
        .subscribe({
          next: (res) => {
            this.selectedCommande.quantite_commandee = nouvelleQuantite;
            modal.close();
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour :", err);
          }
        });
    }
    onChauffeurChange() {

      // Trouver le chauffeur sélectionné dans la liste des chauffeurs
      const chauffeur = this.chauffeurs.find(c => c.id_chauffeur === +this.chauffeurSelectionne);

      if (chauffeur) {
        // Pré-remplir la plaque du camion avec celle du chauffeur sélectionné
        this.plaqueCamion = chauffeur.plaque_camion || '';
      } else {
        // Réinitialiser la plaque du camion si aucun chauffeur n'est sélectionné
        this.plaqueCamion = '';
      }
    }
    validerQuantiteChargee() {
      if (this.commandeSelectionnee && this.quantiteChargee > this.commandeSelectionnee.quantite_restante) {
        this.erreurQuantiteChargee = true; // Afficher l'erreur
      } else {
        this.erreurQuantiteChargee = false; // Cacher l'erreur
      }
    }
    loadAdresses() {
      this.dl.getAdressesChantier().subscribe(res => {
        this.adresses = res['data'];
        console.log(this.adresses);
        this.filteredAdresses = this.adresseCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      });
    }
    loadClient() {
      this.dl.getClients().subscribe(res => {
        this.Clients = res['data'];
      });
    }
    loadCommandes() {
        this.dl.getCommandes()
            .subscribe(res => {
                this.commandes = res['data'];
              //  this.totalItems = this.commandes.length;
               // console.log(this.commandes);
            });
    }


    loadChauffeurs() {
        this.dl.getAllchauffer()
            .subscribe(res => {
                this.chauffeurs = res['data'];
                console.log(this.chauffeurs);
            });
    }
    afficherPlaque() {
      const chauffeur = this.chauffeurs.find(c => c.id === this.chauffeurSelectionne);
      this.plaqueCamion = chauffeur ? chauffeur.plaque_camion : '';
    }
    openLivraisonModal(commande, modal: any) {
        this.commandeSelectionnee = commande;
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true });
    }
    openCommandeModal (modal: any) {
      this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true });

    }

    confirmerLivraison(modal: any) {
      // Vérification des champs obligatoires
      if (!this.quantiteChargee || !this.chauffeurSelectionne || !this.adresseLivraison || !this.plaqueCamion) {
        this.toastr.warning('Veuillez renseigner tous les champs.', 'Attention');
        return;
      }

      // Vérification de la commande sélectionnée
      if (!this.commandeSelectionnee) {
        this.toastr.error('Aucune commande sélectionnée.', 'Erreur');
        return;
      }

      // Validation de la quantité chargée
      if (this.quantiteChargee > this.commandeSelectionnee.quantite_restante) {
        this.toastr.warning('La quantité chargée ne peut pas dépasser la quantité restante.', 'Attention');
        return;
      }

      // Préparation des données pour l'API
      const livraisonData = {
        id_commande: this.commandeSelectionnee.id_commande,
        id_chauffeur: this.chauffeurSelectionne,
        adresse: this.adresseLivraison,
        plaque_camion: this.plaqueCamion, // Utiliser la valeur saisie par l'utilisateur
        quantite_chargee: this.quantiteChargee,
        heure_depart: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date_production: new Date().toISOString().split('T')[0]
      };

      console.log("Données envoyées à l'API :", livraisonData);

      // Appel à l'API pour créer la livraison
      this.dl.createLivraison(livraisonData).subscribe(
        (res) => {
          if (res) {
            this.toastr.success('Livraison ajoutée avec succès !', 'Succès');
            modal.close(); // Fermer la modal après succès

            // Ajouter la plaque saisie par l'utilisateur à la réponse de l'API
            const donnee = { ...res['data'], plaque_camion: this.plaqueCamion };

            // Générer le PDF avec les données mises à jour
            this.print(donnee); // Imprimer le bon de livraison
            this.loadCommandes(); // Recharger la liste des commandes

            // Réinitialiser les champs après succès
            this.commandeSelectionnee = null;
            this.quantiteChargee = null;
            this.chauffeurSelectionne = null;
            this.adresseLivraison = null;
            this.plaqueCamion = ''; // Réinitialiser la plaque du camion
          } else {
            this.toastr.error('Réponse invalide du serveur.', 'Erreur');
          }
        },
        (err) => {
          console.error("Erreur API :", err);
          this.toastr.error('Erreur lors de l’ajout de la livraison.', 'Erreur');
        }
      );
    }

     print(element: any) {
         console.log('Données à imprimer > ', element);

         // Créer une instance jsPDF
         const pdf = new jsPDF();
         // Convertir l'image en Base64 et l'ajouter
         const img = new Image();
         img.src = 'assets/images/logobeton.png'; // Chemin relatif vers l'image
         img.onload = () => {
           // Ajouter le logo en haut au centre
           const pageWidth = pdf.internal.pageSize.width; // Largeur de la page
           const logoWidth = 70; // Largeur du logo
           const logoHeight = 40; // Hauteur du logo
           const logoX = 1; // Position X du logo (à gauche avec une marge de 10 unités)
           const logoY = 10; // Position Y du logo (en haut de la page)

           pdf.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);
           // Ajouter un en-tête
           pdf.setFontSize(18);
           pdf.setFont("helvetica", "bold");
           pdf.text("BON DE LIVRAISON", pageWidth / 2, 50, { align: "center" });
           // Obtenir l'heure actuelle
           const now = new Date();
           const heureDepart = now.toLocaleTimeString();
           pdf.setFontSize(14);
           pdf.setFont("helvetica", "normal");
           pdf.text("CLIENT: " + element.nom_client, 10, 60);
           pdf.text("Adresse Chantier : " + (element.adresseLivraison || element.adresse || "Non spécifiée"), 10, 65);
           pdf.text("Heure départ : " + heureDepart, 10, 70);
          // pdf.text("Heure depart : ", 10, 70);

           // Ligne séparatrice
           pdf.line(10, 75, 200, 75);

           // Tableau des données
           autoTable(pdf, {
             startY: 80,
             head: [["Libelle", "Valeur"]], // Entêtes des colonnes
             body: [
               ["Date de commande", element.date_production],
               ["Date de production", element.date_production],
               ["Formulation", element.formule],
               ["Quantité Commandée", `${element.quantite_commandee} m³`],
               ["Quantité chargée", `${element.quantite_chargee} m³`],
               ["Quantité total chargée", `${element.quantite_totale_chargee} m³`],

               ["Quantité restante", `${element.quantite_restante} m³`],
               ["Chauffeur", `${element.nom_chauffeur} `],
               ["Plaque Camion", `${element.plaque_camion} `],
              ],
             theme: "grid",
             styles: {
               fontSize: 11,
               cellPadding: 3,
             },
             headStyles: {
               fillColor: [41, 128, 185],
               textColor: 255,
               halign: "center",
             },
             bodyStyles: {
               halign: "left",
             },
             alternateRowStyles: {
               fillColor: [245, 245, 245],
             },
           });

           // Ajouter un espace pour la signature du client
           const finalY = pdf.lastAutoTable.finalY + 20; // Position après le tableau
           pdf.setFontSize(12);
           pdf.text("Client :", 10, finalY);
           pdf.line(30, finalY, 50, finalY); // Ligne horizontale

           // Texte "Chauffeur" avec une ligne après
           pdf.text("Chauffeur :", 75, finalY);
           pdf.line(100, finalY, 140, finalY); // Ligne horizontale

           // Texte "Opérateur" avec une ligne après
           pdf.text("Opérateur :", 145, finalY);
           pdf.line(175, finalY, 200, finalY);

           // Ajouter un pied de page
           const pageHeight = pdf.internal.pageSize.height;
           pdf.setFontSize(10);
           pdf.text("Merci pour votre confiance.", 10, pageHeight - 20);
           pdf.text("DC BETON - Tous droits réservés.", 10, pageHeight - 10);

           // Activer l'impression directe
           pdf.autoPrint(); // Activer le mode d'impression
           const pdfBlob = pdf.output('bloburl'); // Obtenir un URL blob
            window.open(pdfBlob); // Lancer directement la fenêtre d'impression
         };

         img.onerror = () => {
           console.error("Erreur lors du chargement de l'image.");
         };
       }

    confirmAddCommande (modal) {
        const CommandeData = {
          id_client : this.clienselectione,
          formule : this.formuleselectione,
          quantite_commandee: this.quantitedeCommande,
          quantite_restante: this.quantitedeCommande,
          date_production: this.datecommande
        }
        console.log(CommandeData)
        this.dl.createCommande(CommandeData)
        .subscribe(res =>  {

          this.toastr.success('Commande ajoutée avec succès !', 'Succès');
          modal.close();  // Ferme le modal après confirmation
          this.loadCommandes();  // Recharge la liste des commandes
          //this.modalService.open(this.confirmationLivraisonModal, { centered: true });

        },
        (err) => {
          this.toastr.error('Erreur lors de l’ajout de la commande.', 'Erreur');
        });
    }
    deleteInvoice(idCommande: number, deleteConfirmModal: any): void {
      // Ouvrir la modal de confirmation
      console.log(idCommande)
      this.modalService.open(deleteConfirmModal).result.then(
        (result) => {
          if (result === 'confirm') {
            // Si l'utilisateur confirme, supprimer la commande
            this.dl.supprimerCommande(idCommande).subscribe(
              (response) => {
                this.toastr.success('Bon de commande supprimé !', 'Succès!', { timeOut: 3000 });
                this.loadCommandes(); // Recharger la liste des commandes
              },
              (error) => {
                console.error('Erreur lors de la suppression de la commande', error);
              }
            );
          }
        },
        (reason) => {
          console.log('Modal annulée', reason);
        }
      );
    }


}
