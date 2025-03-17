import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private router: Router,
        private toastr: ToastrService,

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

  this.loading = true;
  this.errorMessage = null;

  const credentials = {
    adresse_email: this.signinForm.value.email, // Changer 'email' en 'adresse_email'
    motdepasse: this.signinForm.value.password // Changer 'password' en 'motdepasse'
  };

  //console.log("Données envoyées :", credentials); // Vérifier si les champs sont corrects

  this.authService.signin(credentials).subscribe(
    (response) => {
      this.loading = false;

      if (response?.data?.statut === true) {
        this.toastr.success('Connexion réussie !', 'Succès', { timeOut: 3000 });
       // this.router.navigate(['/invoice']);
      }
    },
    (error) => {
      this.loading = false;
      this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      this.toastr.error(this.errorMessage, 'Erreur', { timeOut: 3000 });
      console.error('Erreur de connexion', error);
    }
  );
}


}
