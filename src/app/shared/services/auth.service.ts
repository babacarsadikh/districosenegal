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
    const token = this.store.getItem("token"); // Récupérer le token du localStorage
    this.authenticated = !!token; // Mettre à jour l'état d'authentification
    return this.authenticated;
  }

  // Obtenir les informations de l'utilisateur
  getuser(): Observable<any> {
    const token = this.store.getItem("token");
    if (token) {
      return this.http.get(`${this.apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return of(null); // Retourner un Observable vide si l'utilisateur n'est pas connecté
  }

  // Se connecter
  signin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/operateurs/connexion`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.store.setItem("token", response.token); // Stocker le token dans le localStorage
          this.store.setItem("role", response.role); // Stocker le rôle de l'utilisateur
          this.authenticated = true; // Mettre à jour l'état d'authentification
        }
      }),
      catchError((error) => {
        console.error("Erreur de connexion", error);
        throw error; // Propager l'erreur pour la gérer dans le composant
      })
    );
  }

  // Se déconnecter
  signout() {
    this.store.removeItem("token"); // Supprimer le token du localStorage
    this.store.removeItem("role"); // Supprimer le rôle de l'utilisateur
    this.authenticated = false; // Mettre à jour l'état d'authentification
    this.router.navigateByUrl("/sessions/signin"); // Rediriger vers la page de connexion
  }
}
