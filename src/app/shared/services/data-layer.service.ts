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
    private apiUrl = 'http://localhost:5000';
   // private apiUrl = 'https://5854-2001-4278-51-4c8e-11ea-2afb-c1b0-b3ce.ngrok-free.app';

    constructor(private http: HttpClient) { }

    getInvoices() {
        return this.http.get<any[]>(`${this.apiUrl}/getAllCommande`);
    }

    getInvoice(id) {
        return this.http.get<any[]>(`${this.apiUrl}/commande/${id}`);
    }
    ajouterchauffeur (chauffeur){
      return this.http.post<any[]>(`${this.apiUrl}/ajouterChauffeur`, chauffeur);

    }
    getAllchauffer () {
      return this.http.get<any[]>(`${this.apiUrl}/getAllChauffeurs`);

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
