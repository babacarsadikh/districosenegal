import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../utils';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SortColumn, SortDirection } from '../directives/sortable.directive';
import { Chauffeur } from '../models/chauffeur.model';

interface SearchResult {
  countries: Chauffeur[];
  total: number;
}
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _chauffeur$ = new BehaviorSubject<Chauffeur[]>([]);
    private _total$ = new BehaviorSubject<number>(0);


    // L'URL de base de l'API Flask locale
    //private apiUrl = 'http://localhost:5000';
   private apiUrl = 'http://50.62.180.5:5000';

    constructor(private http: HttpClient) { }

    getInvoices() : Observable<any[]>{
        return this.http.get<any[]>(`${this.apiUrl}/rapports`);
    }
    getLivraison () :Observable<any[]>{
      return this.http.get<any[]>(`${this.apiUrl}/livraisons`);
  }
  getLivraisonEvolution (date ) :Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/livraisons/evolution/date?date=${date}`);
}
getLivraisonPlageDate(date_debut: string, date_fin: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/livraisons/evolution/plage-dates?date_debut=${date_debut}&date_fin=${date_fin}`);
}

    getCommandes(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/commandes`);
    }
    getCommandesbyDATE(date): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/commandes/date?date=${date}`);
    }
  supprimerCommande(idCommande: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commandes/${idCommande}`);
  }
    getCommandesLen(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/commandes/date?date=`);
    }
    getClients(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/clients`);
    }
    addClient(client: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/clients`, client);
    }
    createLivraison (livraisons: any){
      return this.http.post<any[]>(`${this.apiUrl}/livraisons`, livraisons);

     }
     createCommande (livraisons: any){
      return this.http.post<any[]>(`${this.apiUrl}/commandes`, livraisons);

     }
     getAdressesChantier () {
      return this.http.get<any[]>(`${this.apiUrl}/adresses`);

     }
     AdressesChantier (adresses : any) {
      return this.http.post<any[]>(`${this.apiUrl}/adresses`, adresses);

     }
    getInvoice(id) {
        return this.http.get<any[]>(`${this.apiUrl}/commande/${id}`);
    }
    ajouterchauffeur (chauffeur){
      return this.http.post<any[]>(`${this.apiUrl}/chauffeurs`, chauffeur);

    }
    getAllchauffer () {
      return this.http.get<any[]>(`${this.apiUrl}/chauffeurs`);

    }
    getTotalChauffeurs(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/getAllChauffeurs`);
    }

    saveInvoice(invoice: any) {
        if (invoice.id) {
            return this.http.put<any[]>(`${this.apiUrl}/commande/${invoice.id}`, invoice);
        } else {
            invoice.id = Utils.genId();
            return this.http.post<any[]>(`${this.apiUrl}/ajouterBonCommande`, invoice);
        }
    }
    updateNomcommande (commande, id: string){
      return this.http.put<any[]>(`${this.apiUrl}/updateCommande/${id}`, commande);

    }
   ajouterBon (commande: any){
    return this.http.post<any[]>(`${this.apiUrl}/ajouterBonCommande`, commande);

   }
   getBoncommande (id){
    return this.http.get<any[]>(`${this.apiUrl}/commande/${id}`);

   }

    deleteInvoice(id: number) {
        return this.http.delete<any[]>(`${this.apiUrl}/invoices/${id}`);
    }

    getMails() {
        return this.http.get<any[]>(`${this.apiUrl}/mails`);
    }

    getCountries() {
        return this.http.get<any[]>(`${this.apiUrl}/countries`);
    }

    getProducts() {
        return this.http.get<any[]>(`${this.apiUrl}/products`);
    }
}
