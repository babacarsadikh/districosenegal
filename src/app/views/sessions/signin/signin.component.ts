import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup; // Formulaire de connexion
  loading = false; // État de chargement
  loadingText = 'Connexion en cours...'; // Texte de chargement
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Utiliser AuthService
    private router: Router
  ) {
    // Initialisation du formulaire
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Fonction pour gérer la connexion
  signin() {
    if (this.signinForm.invalid) {
      return;
    }

    this.loading = true; // Activer l'état de chargement
    this.errorMessage = null; // Réinitialiser le message d'erreur

    const credentials = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    };

    // Appel au service d'authentification
    this.authService.signin(credentials).subscribe(
      (response) => {
        this.loading = false; // Désactiver l'état de chargement

        // Rediriger en fonction du rôle
        const role = this.authService.store.getItem("role");
        if (role === 'admin') {
          this.router.navigate(['/admin']); // Redirection vers le tableau de bord admin
        } else if (role === 'operateur') {
          this.router.navigate(['/operateur']); // Redirection vers le tableau de bord opérateur
        }
      },
      (error) => {
        this.loading = false; // Désactiver l'état de chargement
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.'; // Afficher un message d'erreur
        console.error('Erreur de connexion', error);
      }
    );
  }
}
