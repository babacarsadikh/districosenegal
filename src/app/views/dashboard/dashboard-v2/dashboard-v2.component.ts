import { Component, OnInit, ViewChild } from '@angular/core';
import { echartStyles } from 'src/app/shared/echart-styles';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { ProductService } from 'src/app/shared/services/product.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
  xaxis: any; // Ajout de l'axe X
  yaxis: any; // Ajout de l'axe Y
  title: any; // Ajout d'un titre
};
@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild('generationrapport') generationrapport: any;

 // public chartOptions: Partial<ChartOptions>;
  chartPie1: any;
  chartLineOption3: any;
	products$: any;
  commandes;
  livraison;
  qtecommandes;
  commandeData;
  Datedujour;
  dateDebut;
  dateFin;
  rapportData;
  data = [];
  total_quantite_charge;
  chartOptions: any;
  constructor(
		private productService: ProductService,
    private dl : DataLayerService,
    private modalService: NgbModal,

	) {
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Total Commandé', 'Total Chargé']
      },
      xAxis: {
        type: 'category',
        data: this.data.map(item => item.nom_client) // Noms des clients sur l'axe X
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total Commandé',
          type: 'bar',
          data: this.data.map(item => item.quantite_commandee) // Données pour "Total Commandé"
        },
        {
          name: 'Total Chargé',
          type: 'bar',
          data: this.data.map(item => item.quantite_totale_chargee) // Données pour "Total Chargé"
        }
      ]
    };
   }

   ngOnInit() {
    // Configuration du graphique en barres
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "Commandes",
    //       data: [] // Les données seront ajoutées dynamiquement
    //     },
    //     {
    //       name: "Livraisons",
    //       data: [] // Les données seront ajoutées dynamiquement
    //     }
    //   ],
    //   chart: {
    //     type: "bar",
    //     height: 350
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "55%",
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   xaxis: {
    //     categories: [] // Les catégories seront ajoutées dynamiquement
    //   },
    //   yaxis: {
    //     title: {
    //       text: "Quantité"
    //     }
    //   },
    //   title: {
    //     text: "Évolution des Commandes et Livraisons",
    //     align: "center"
    //   },
    //   colors: ["#008FFB", "#00E396"] // Couleurs des barres
    // };

    // Appel des méthodes pour récupérer les données
    this.getLivraison();
    this.getCommandeLength();
    this.getCommandeQte();
    this.getLivraisonEv();
  }
  openraaportmodel () {
    this.modalService.open(this.generationrapport, { centered: true });

  }
  print(data: any[]) {
    console.log('Données à imprimer > ', data);
   // data =
    // Créer une instance jsPDF
    const pdf = new jsPDF();

    // Charger l'image
    const img = new Image();
    img.src = 'assets/images/logobeton.png';

    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.width;
      const logoWidth = 70;
      const logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2;

      // Ajouter le logo
      pdf.addImage(img, 'PNG', logoX, 10, logoWidth, logoHeight);

      // Ajouter le titre du rapport
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("RAPPORT DE PRODUCTION", pageWidth / 2, 55, { align: "center" });


      // Obtenir la date et l'heure actuelles
      const now = new Date();
      const dateReport = now.toLocaleDateString();
      const heureReport = now.toLocaleTimeString();

      // Ajouter la date et l'heure du rapport
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(`TOTAL PRODUCTION: ${data['total_charge']} m³`, 10, 65);
      pdf.text(`Date: ${this.dateFin}`, 10, 72);

      // Ligne séparatrice
      pdf.line(10, 78, 200, 78);

      // Préparer les données pour le tableau
      const tableData = data['data'].map((item) => [
        item.nom_client,
        item.formule,
        item.adresse,
        `${item.total_commandee} m³`,
        `${item.total_chargee} m³`,
      ,
      ]);

      // Générer le tableau
      autoTable(pdf, {
        startY: 85,
        head: [["Clients", "Formulations", "Destinations", "QTé Commandée", "QTé Livrée"]],
        body: tableData,
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

      // Ajouter un pied de page
      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFontSize(10);
      pdf.text("DC BETON - Tous droits réservés.", 10, pageHeight - 10);

      // Ouvrir le PDF pour impression
      pdf.autoPrint();
      const pdfBlob = pdf.output('bloburl');
      window.open(pdfBlob);
    };

    img.onerror = () => {
      console.error("Erreur lors du chargement de l'image.");
    };
  }


  getCommandeLength (){
    this.dl.getCommandes()
    .subscribe(res => {
        this.commandes = res['length'];
      //  console.log(this.commandes)

    });
  }
  getCommandeQte (){
    this.dl.getCommandes()
    .subscribe(res => {
        this.qtecommandes = res['total_quantite'];

    });

  }
  getCommande (){
    this.dl.getCommandes()
    .subscribe(res => {
        this.qtecommandes = res['total_quantite'];
      //  console.log(this.qtecommandes)
    });

  }

  getLivraison () {
    this.dl.getLivraison()
    .subscribe(res => {
        this.livraison = res['length'];
        this.commandeData = res['data']
        this.total_quantite_charge = res['total_quantite_chargee']
       // console.log(this.commandeData)

    });
  }
  getLivraisonPlage (modal) {
   // console.log(this.dateDebut)
    this.dl.getLivraisonPlageDate(this.dateDebut, this.dateFin)
    .subscribe(res => {
      console.log(res)
        this.rapportData = res['data']
        modal.close();  // Ferme le modal après confirmation

        this.print(res)



    });
  }
  getLivraisonEv () {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const formattedDatet = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
  this.Datedujour = formattedDatet

    this.dl.getLivraisonEvolution(formattedDate)
    .subscribe(res => {
        this.data = res['data']
        this.updateChartOptions();


    });
  }
  updateChartOptions() {
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Total Commandé', 'Total Chargé']
      },
      xAxis: {
        type: 'category',
        data: this.data.map(item => item.nom_client) // Noms des clients sur l'axe X
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total Commandé',
          type: 'bar',
          data: this.data.map(item => item.total_commandee) // Données pour "Total Commandé"
        },
        {
          name: 'Total Chargé',
          type: 'bar',
          data: this.data.map(item => item.total_chargee) // Données pour "Total Chargé"
        }
      ]
    };
  }


}
