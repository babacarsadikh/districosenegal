import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurd {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(): boolean {
    // Vérifie si l'utilisateur est authentifié
    if (this.auth.authenticated) {
      return true;  // Si authentifié, permet l'accès à la route protégée
    } else {
      // Si non authentifié, redirige vers la page de connexion
      this.router.navigate(['/sessions/signin']);
      return false;  // Empêche l'accès à la route protégée
    }
  }
}
