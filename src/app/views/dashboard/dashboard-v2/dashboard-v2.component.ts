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
  nmbrelivraison;
  Datedujour;
  dateDebut;
  totalalivre;
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
    this.getCommande();
    this.getLivraisonToday();
  }
  openraaportmodel () {
    this.modalService.open(this.generationrapport, { centered: true });

  }
  print(data: any) {
    console.log("Données à imprimer >", data);

    // Vérifier que les données sont valides
    if (!data || !data.data || typeof data.total_charge === "undefined") {
      console.error("Données invalides ou manquantes.");
      return;
    }

    const pdf = new jsPDF();
    const img = new Image();
    img.src = "assets/images/logobeton.png";

    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.width;
      const logoWidth = 70;
      const logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2;

      // Ajouter le logo
      pdf.addImage(img, "PNG", logoX, 10, logoWidth, logoHeight);

      // Titre du rapport
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("RAPPORT DE PRODUCTION", pageWidth / 2, 55, { align: "center" });

      // Date et heure du rapport
      const now = new Date();
      const dateReport = now.toLocaleDateString();
      const heureReport = now.toLocaleTimeString();

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(`TOTAL PRODUCTION: ${data.total_charge} m³`, 10, 65);
      pdf.text(`Date: ${dateReport} ${heureReport}`, 10, 72);

      // Ligne de séparation
      pdf.line(10, 78, pageWidth - 10, 78);

      // Préparer les données du tableau récapitulatif
      const summaryData = [];

      for (const client in data.data) {
        if (data.data.hasOwnProperty(client)) {
          for (const formule in data.data[client]) {
            if (data.data[client].hasOwnProperty(formule)) {
              const formuleData = data.data[client][formule];

              // Utiliser les totaux fournis plutôt que de recalculer
              const totalCommandee = formuleData.total_commandee;
              const totalChargee = formuleData.total_chargee;

              // Ajouter les totaux au tableau récapitulatif
              summaryData.push([
                client,
                formule,
                `${totalCommandee} m³`,
                `${totalChargee} m³`
              ]);
            }
          }
        }
      }

      // Ajouter le tableau récapitulatif des totaux par client et formule
      autoTable(pdf, {
        startY: 85,
        head: [["Clients", "Formulations", "Total Commandé", "Total Livré"]],
        body: summaryData,
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

      // Ouvrir le PDF dans un nouvel onglet
      pdf.autoPrint();
      const pdfBlob = pdf.output("bloburl");
      window.open(pdfBlob);
    };

    img.onerror = () => {
      console.error("Erreur lors du chargement de l'image.");
    };
  }

  getCommandeLength (){
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.dl.getCommandesbyDATE(formattedDate)
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
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.dl.getCommandesbyDATE(formattedDate)
    .subscribe(res => {
        this.qtecommandes = res['total_quantite'];
        console.log('bi',this.qtecommandes)
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
  getLivraisonToday (){
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.dl.getLivraisonPlageDate(formattedDate, formattedDate)
    .subscribe(res => {
      console.log('today :',res)
        this.totalalivre = res['total_charge']
        this.nmbrelivraison = res['length']
       // this.print(res)



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
