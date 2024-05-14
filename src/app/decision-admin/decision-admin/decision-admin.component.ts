import { Component } from '@angular/core';
import { DecisionService } from 'app/shared/API_service/decision.service';
import { Decision } from 'app/shared/model/decision';
import Swal from 'sweetalert2';
import { Like } from 'app/shared/model/like';

@Component({
  selector: 'app-decision-admin',
  templateUrl: './decision-admin.component.html',
  styleUrls: ['./decision-admin.component.css']
})
export class DecisionAdminComponent {
  decisions: Decision[] = [];
  like:Like[];

  constructor(private decisionService: DecisionService) { 
    this.getDecisions();
  }

  getDecisions() {
    this.decisionService.getDecisions().subscribe(
      (data: any) => {
        this.decisions = data.decisions;
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des décisions : ', error);
      }
    );
  }

  ajouterDecision() {
    Swal.fire({
      title: 'Ajouter une décision',
      html:
        '<input id="title" class="swal2-input" placeholder="Titre">' +
        '<input id="description" class="swal2-input" placeholder="Description">',
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;

        if (titleInput && descriptionInput) {
          const newDecision: Decision = {
            title: titleInput.value,
            description: descriptionInput.value
          };
          
          // Appeler la méthode du service pour ajouter une décision
          this.decisionService.addDecision(newDecision).subscribe(
            (data: any) => {
              // Rafraîchir la liste des décisions après l'ajout
              this.getDecisions();
              
              // Afficher une alerte de confirmation
              Swal.fire('Ajouté!', 'La décision a été ajoutée avec succès.', 'success');
            },
            (error: any) => {
              console.error('Une erreur s\'est produite lors de l\'ajout de la décision : ', error);
              Swal.fire('Erreur!', 'Une erreur s\'est produite lors de l\'ajout de la décision.', 'error');
            }
          );
        }
      }
    });
  }modifierDecision(decision: Decision) {
    Swal.fire({
      title: 'Modifier la décision',
      html:
        '<input id="title" class="swal2-input" placeholder="Titre" value="' + decision.title + '">' +
        '<input id="description" class="swal2-input" placeholder="Description" value="' + decision.description + '">',
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;
  
        if (titleInput && descriptionInput) {
          const updatedDecision: Decision = {
            id: decision.id,
            title: titleInput.value,
            description: descriptionInput.value,
    
          };
  
          this.decisionService.updateDecision(decision.id, updatedDecision).subscribe(
            (data: any) => {
              this.getDecisions();
              Swal.fire('Modifié!', 'La décision a été modifiée avec succès.', 'success');
            },
            (error: any) => {
              console.error('Une erreur s\'est produite lors de la modification de la décision : ', error);
              Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la modification de la décision.', 'error');
            }
          );
        }
      }
    });
  }
  supprimerDecision(decision: Decision) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas récupérer cette décision!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appeler la méthode du service pour supprimer la décision
        this.decisionService.deleteDecision(decision.id).subscribe(
          (data: any) => {
            // Rafraîchir la liste des décisions après la suppression
            this.getDecisions();
            
            // Afficher une alerte de confirmation
            Swal.fire('Supprimé!', 'Votre décision a été supprimée.', 'success');
          },
          (error: any) => {
            console.error('Une erreur s\'est produite lors de la suppression de la décision : ', error);
            Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la suppression de la décision.', 'error');
          }
        );
      }
    });
  }

    getLikesForDecision(decisionId: number): void {
    this.decisionService.getLikesForDecision(decisionId).subscribe(
      (likes: Like[]) => {
        // Mettez à jour les likes pour la décision
        const decision = this.decisions.find(dec => dec.id === decisionId);
        if (decision) {
          decision.likes = likes.length; // Utiliser la longueur du tableau de likes comme nombre de likes
        }
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des likes : ', error);
      }
    );
  }
  getDislikesForDecision(decisionId: number): void {
    this.decisionService.getDislikesForDecision(decisionId).subscribe(
      (dislikes: Like[]) => {
        // Mettez à jour les dislikes pour la décision
        const decision = this.decisions.find(dec => dec.id === decisionId);
        if (decision) {
          decision.dislikes = dislikes.length; // Utiliser la longueur du tableau de dislikes comme nombre de dislikes
        }
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des dislikes : ', error);
      }
    );
  }

  
}