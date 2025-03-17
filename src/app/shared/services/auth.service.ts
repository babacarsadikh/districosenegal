import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { LocalStoreService } from "./local-store.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private apiUrl = "http://localhost:5000"; // URL de votre backend Flask
  authenticated = false; // État d'authentification

  constructor(
    private http: HttpClient,
    public store: LocalStoreService,
    private router: Router
  ) {
    this.checkAuth(); // Vérifier l'état d'authentification au démarrage
  }

  // Vérifier si l'utilisateur est authentifié
  checkAuth() {
    const user = this.store.getItem("user"); // Récupérer les données utilisateur
    this.authenticated = user && user.etat_connexion === 1; // Vérifier si l'utilisateur est connecté
  }

  // Se connecter
  signin(credentials: { adresse_email: string; motdepasse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/operateurs/connexion`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap((response: any) => {
        if (response.statut && response.data.etat_connexion === 1) {
          // Stocker les infos de l'utilisateur
          this.store.setItem("user", response.data);
          this.authenticated = true;
          this.router.navigate(["/dashboard/v2"]); // Rediriger après connexion
        } else {
          console.error("Connexion refusée :", response.message);
        }
      }),
      catchError((error) => {
        console.error("Erreur de connexion", error);
        throw error;
      })
    );
  }

  // Récupérer les infos utilisateur
  getUser(): any {
    return this.store.getItem("user");
  }

  // Se déconnecter
  signout() {
    this.store.removeItem("user"); // Supprimer les données utilisateur
    this.authenticated = false;
    this.router.navigateByUrl("/sessions/signin");
  }
}
