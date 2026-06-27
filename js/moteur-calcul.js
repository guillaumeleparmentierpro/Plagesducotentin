/**
 * Moteur de calcul - Cotentin Web Studio
 * Centralise le croisement des données (Météo, Marée, Vent)
 */

export const MoteurCalcul = {
  
  // 1. Analyse pour le mode Pêche à pied
  // On passe les données de marée, et l'heure de consultation du téléphone
  analyserPeche(donneesMaree, dateActuelle = new Date()) {
    const { coef, heureBasseMer } = donneesMaree;

    // RÈGLE 1 : Le coefficient est-il suffisant ?
    if (coef < 70) {
      return {
        statut: "ROUGE",
        message: `Coefficient trop faible (${coef}). La mer ne se retirera pas assez pour une bonne pêche.`
      };
    }

    // RÈGLE 2 : Calcul du timing (La fenêtre de tir)
    // On calcule la différence en minutes entre maintenant et l'heure de la basse mer
    const msDifference = heureBasseMer.getTime() - dateActuelle.getTime();
    const minutesAvantBasseMer = Math.floor(msDifference / (1000 * 60));

    // Si on a dépassé l'heure de la basse mer de plus de 45 minutes -> DANGER
    if (minutesAvantBasseMer < -45) {
      return {
        statut: "ROUGE",
        message: "Danger : La mer remonte ! Il faut regagner la côte immédiatement."
      };
    }

    // Si on est dans la bonne fenêtre : entre 2h (120 min) avant et 45 min après
    if (minutesAvantBasseMer <= 120 && minutesAvantBasseMer >= -45) {
      let precisionCoef = coef >= 90 ? "Grandes marées !" : "Bons coefficients.";
      return {
        statut: "VERT",
        message: `${precisionCoef} L'eau est au plus bas, c'est le moment parfait.`
      };
    }

    // Si on est trop en avance (plus de 2h avant la basse mer)
    if (minutesAvantBasseMer > 120) {
      // Calcul pour un affichage propre du temps d'attente
      const heuresAttente = Math.floor(minutesAvantBasseMer / 60);
      const minutesRestantes = minutesAvantBasseMer % 60;
      return {
        statut: "ORANGE",
        message: `Patience, l'eau descend... La bonne fenêtre s'ouvre dans ${heuresAttente}h et ${minutesRestantes}m.`
      };
    }

    // Sécurité par défaut
    return {
      statut: "ORANGE",
      message: "Analyse des conditions maritimes en cours..."
    };
  },

  // 2. Analyse pour le mode Bronzette / Plage (à venir)
  analyserPlage(donneesMeteo, donneesMaree, configurationPlage) {
    return {
      statut: "ROUGE",
      message: "Logique Météo à définir"
    };
  }
};
