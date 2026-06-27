// On importe notre "cerveau"
import { MoteurCalcul } from './moteur-calcul.js';

async function initApp() {
    console.log("Démarrage de l'application Plages du Cotentin...");

    // 1. Simulation du temps
    const dateActuelle = new Date();
    
    // Pour le test : on simule une basse mer qui aura lieu dans exactement 1 heure (60 minutes)
    // Modifie le "+ 1" en "+ 3" (pour 3 heures) pour tester le mode ORANGE (attente)
    // Modifie le "+ 1" en "- 2" (passée depuis 2 heures) pour tester le mode ROUGE (danger)
    const fausseHeureBasseMer = new Date(dateActuelle.getTime() + (1 * 60 * 60 * 1000)); 

    // 2. Simulation des données brutes
    const donneesMaree = {
        coef: 95, // Teste en mettant 60 pour voir le ROUGE (coef trop faible)
        heureBasseMer: fausseHeureBasseMer,
        estHaute: false
    };

    const donneesMeteo = {
        temperatureAir: 20,
        vitesseVent: 12,
        couvertureNuageuse: 20
    };

    const configPlage = {
        nom: "Carteret",
        orientation: "Ouest",
        sensibleMareeHaute: true
    };

    // 3. On fait travailler le moteur de calcul
    const resultatPeche = MoteurCalcul.analyserPeche(donneesMaree, dateActuelle);
    const resultatPlage = MoteurCalcul.analyserPlage(donneesMeteo, donneesMaree, configPlage);

    // 4. On met à jour l'interface visuelle
    mettreAJourInterface("peche", resultatPeche);
    mettreAJourInterface("plage", resultatPlage);
}

// Fonction utilitaire pour modifier le HTML (Identique à avant)
function mettreAJourInterface(module, resultat) {
    const badgeStatut = document.getElementById(`statut-${module}`);
    const textMessage = document.getElementById(`message-${module}`);
    const conteneur = badgeStatut.closest('section'); 

    if (!badgeStatut || !textMessage) return;

    badgeStatut.textContent = resultat.statut;
    textMessage.textContent = resultat.message;

    // Réinitialisation des classes
    badgeStatut.className = "px-3 py-1 rounded-full text-xs font-bold";
    conteneur.className = "bg-white rounded-xl shadow p-4 border-l-4";

    // Application des couleurs
    if (resultat.statut === "VERT") {
        badgeStatut.classList.add("bg-green-100", "text-green-800");
        conteneur.classList.add("border-green-500");
    } else if (resultat.statut === "ORANGE") {
        badgeStatut.classList.add("bg-orange-100", "text-orange-800");
        conteneur.classList.add("border-orange-500");
    } else {
        badgeStatut.classList.add("bg-red-100", "text-red-800");
        conteneur.classList.add("border-red-500");
    }
}

// Lancement au chargement
document.addEventListener('DOMContentLoaded', initApp);
