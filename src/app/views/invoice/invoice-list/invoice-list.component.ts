import { Component, OnInit } from '@angular/core';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
    commandes: any=[];

    constructor(
        private dl: DataLayerService,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loadInvoices();
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
