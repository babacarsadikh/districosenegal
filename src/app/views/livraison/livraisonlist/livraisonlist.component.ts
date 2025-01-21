import { Component, OnInit } from '@angular/core';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
declare module 'jspdf' {
  interface jsPDF {
      lastAutoTable: { finalY: number };
  }
}
@Component({
    selector: 'app-invoice-list',
    templateUrl: './livraisonlist.component.html',
    styleUrls: ['./livraisonlist.component.scss']
})
export class LivraisonlistComponent implements OnInit {
    commandes: any=[];

    constructor(
        private dl: DataLayerService,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loadInvoices();
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
        const logoX = (pageWidth - logoWidth) / 2; // Centrer horizontalement
        pdf.addImage(img, 'PNG', logoX, 10, logoWidth, logoHeight);

        // Ajouter un en-tête
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("BON DE LIVRAISON", pageWidth / 2, 50, { align: "center" });

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text("CLIENT: " + element.nomclient, 10, 60);
        pdf.text("Adresse Chantier : " + element.adresse_chantier, 10, 65);
        pdf.text("Téléphone : +221 77 123 45 67", 10, 70);

        // Ligne séparatrice
        pdf.line(10, 75, 200, 75);

        // Tableau des données
        autoTable(pdf, {
          startY: 80,
          head: [["Libelle", "Valeur"]], // Entêtes des colonnes
          body: [
            ["Date de commande", element.date_commande],
            ["Date de production", element.date_production],
            ["Formulation", element.formulation],
            ["Quantité Commandée", `${element.quantite_commande} m³`],
            ["Quantité chargée", `${element.quantite_charge} m³`],
            ["Quantité restante", `${element.quantite_restante} m³`],
            ["Chauffeur", `${element.plaque_camion} `],
            ["Plaque Camion", `${element.chauffeur_id} `],
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

        // Ouvrir le PDF dans une nouvelle fenêtre pour impression
        const pdfData = pdf.output("dataurlstring");
        const printWindow = window.open();
        if (printWindow) {
          printWindow.document.write(
            `<iframe width='100%' height='100%' src='${pdfData}' frameborder='0' ></iframe>`
          );
        } else {
          console.error("La fenêtre de l’imprimante ne peut pas être ouverte.");
        }
      };

      img.onerror = () => {
        console.error("Erreur lors du chargement de l'image.");
      };
    }


    loadInvoices() {
      this.dl.getInvoices()
          .subscribe(res => {
              this.commandes=res
              this.commandes = this.commandes.data
              console.log(this.commandes)

          });
  }


    deleteInvoice(id, modal) {
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.dl.deleteInvoice(id)
                    .subscribe(res => {
                        this.toastr.success('Bon de commande supprimé !', 'Succès!', { timeOut: 3000 });
                        this.loadInvoices();  // Recharge la liste après la suppression
                    });
            }, (reason) => {});
    }
}
