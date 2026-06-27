// On importe notre "cerveau" depuis l'autre fichier
import { MoteurCalcul } from './moteur-calcul.js';

// Fonction principale de lancement
async function initApp() {
    console.log("Démarrage de l'application Plages du Cotentin...");

    // 1. Simulation des données brutes (Plus tard, on récupèrera ça de tes API)
    const donneesMaree = {
        coef: 85,
        estHaute: false,
        heuresBasseMaree: "14:30"
    };

    const donneesMeteo = {
        temperatureAir: 20,
        vitesseVent: 12, // en nœuds
        couvertureNuageuse: 20 // en pourcentage
    };

    const configPlage = {
        nom: "Carteret",
        orientation: "Ouest",
        sensibleMareeHaute: true
    };

    // 2. On fait travailler le moteur de calcul
    const resultatPeche = MoteurCalcul.analyserPeche(donneesMaree);
    const resultatPlage = MoteurCalcul.analyserPlage(donneesMeteo, donneesMaree, configPlage);

    // 3. On met à jour l'interface visuelle
    mettreAJourInterface("peche", resultatPeche);
    mettreAJourInterface("plage", resultatPlage);
}

// Fonction utilitaire pour modifier le HTML
function mettreAJourInterface(module, resultat) {
    const badgeStatut = document.getElementById(`statut-${module}`);
    const textMessage = document.getElementById(`message-${module}`);
    const conteneur = badgeStatut.closest('section'); // On récupère la carte entière

    if (!badgeStatut || !textMessage) return;

    // Mise à jour du texte
    badgeStatut.textContent = resultat.statut;
    textMessage.textContent = resultat.message;

    // Réinitialisation des classes Tailwind de couleur
    badgeStatut.className = "px-3 py-1 rounded-full text-xs font-bold";
    conteneur.className = "bg-white rounded-xl shadow p-4 border-l-4";

    // Application des bonnes couleurs selon le statut
    if (resultat.statut === "VERT") {
        badgeStatut.classList.add("bg-green-100", "text-green-800");
        conteneur.classList.add("border-green-500");
    } else if (resultat.statut === "ORANGE") {
        badgeStatut.classList.add("bg-orange-100", "text-orange-800");
        conteneur.classList.add("border-orange-500");
    } else { // ROUGE
        badgeStatut.classList.add("bg-red-100", "text-red-800");
        conteneur.classList.add("border-red-500");
    }
}

// On lance initApp() dès que la page web est complètement chargée
document.addEventListener('DOMContentLoaded', initApp);
