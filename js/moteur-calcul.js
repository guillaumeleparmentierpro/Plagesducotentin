/**
 * Moteur de calcul - Cotentin Web Studio
 * Centralise le croisement des données (Météo, Marée, Vent)
 */

export const MoteurCalcul = {
  
  // 1. Analyse pour le mode Pêche à pied
  // On passe les données de marée, et l'heure de consultation du téléphone
 analyserPeche(donneesMaree, dateActuelle = new Date()) {
    const { coef, heureBasseMer } = donneesMaree;

    // RÈGLE 1 : Le coefficient
    if (coef < 70) {
      return {
        statut: "ROUGE",
        message: `Coefficient trop faible (${coef}). La mer ne se retirera pas assez.`
      };
    }

    // Calcul du timing en minutes
    const msDifference = heureBasseMer.getTime() - dateActuelle.getTime();
    const minutesAvantBasseMer = Math.floor(msDifference / (1000 * 60));

    // RÈGLE 2 : SÉCURITÉ ABSOLUE (Le changement est ici)
    // Dès que l'heure de la basse mer est atteinte (0 min) ou dépassée -> DANGER
    if (minutesAvantBasseMer <= 0) {
      return {
        statut: "ROUGE",
        message: "🚨 Basse mer atteinte ! La marée remonte, regagnez la côte immédiatement."
      };
    }

    // RÈGLE 3 : La fenêtre de descente (entre 2h avant et la basse mer)
    if (minutesAvantBasseMer <= 120 && minutesAvantBasseMer > 0) {
      let precisionCoef = coef >= 90 ? "Grandes marées !" : "Bons coefficients.";
      return {
        statut: "VERT",
        message: `${precisionCoef} La mer descend, suivez l'eau en toute sécurité.`
      };
    }

    // RÈGLE 4 : Trop en avance
    if (minutesAvantBasseMer > 120) {
      const heuresAttente = Math.floor(minutesAvantBasseMer / 60);
      const minutesRestantes = minutesAvantBasseMer % 60;
      return {
        statut: "ORANGE",
        message: `Patience, l'eau descend... Départ conseillé dans ${heuresAttente}h et ${minutesRestantes}m.`
      };
    }

    return { statut: "ORANGE", message: "Analyse en cours..." };
  },

  // 2. Analyse pour le mode Bronzette / Plage (à venir)
  analyserPlage(donneesMeteo, donneesMaree, configurationPlage) {
    return {
      statut: "ROUGE",
      message: "Logique Météo à définir"
    };
  }
};
