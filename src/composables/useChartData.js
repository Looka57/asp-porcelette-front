import { ref, computed } from 'vue'

// 🎨 Définition des couleurs (inchangée)
const DISCIPLINE_COLORS = {
 'Judo': '#FF6384',
 'Aïkido': '#3B82F6',
 'Jujitsu': '#efd844ff',
 'Judo Détente': '#10B981'
};

// 💡 Fonction Utilitaire pour le Calcul Cumulatif
const cumulativeSum = (data) => {
 let sum = 0;
 return data.map(value => sum += value);
};

// 🎯 Modification : Accepte la *Ref* contenant les données brutes en paramètre
export function useEvolutionInscriptionsChart(rawInscriptionsDataRef) {
 const labels = ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];

 // 💡 Utilisez un computed pour calculer les datasets DYNAMIQUEMENT
 const inscriptionsData = computed(() => {
  // L'accès à la ref est sécurisé ici :
  const rawData = (rawInscriptionsDataRef && rawInscriptionsDataRef.value) ? rawInscriptionsDataRef.value : {};

  // Calculs sécurisés :
  const dataJudo = rawData.Judo ? cumulativeSum(rawData.Judo) : [];
  const dataAikido = rawData.Aïkido ? cumulativeSum(rawData.Aïkido) : [];
  const dataJujitsu = rawData.Jujitsu ? cumulativeSum(rawData.Jujitsu) : [];
  const dataJudoDetente = rawData['Judo Détente'] ? cumulativeSum(rawData['Judo Détente']) : [];

  return {
   labels: labels,
   datasets: [
    {
     type: 'line',
     label: 'Judo',
     borderColor: DISCIPLINE_COLORS.Judo,
     tension: 0.3,
     pointRadius: 6,
     pointBackgroundColor: DISCIPLINE_COLORS.Judo,
     data: dataJudo,
    },
    {
     type: 'line',
     label: 'Aïkido',
     borderColor: DISCIPLINE_COLORS.Aïkido,
     tension: 0.3,
     pointRadius: 6,
     pointBackgroundColor: DISCIPLINE_COLORS.Aïkido,
     data: dataAikido,
    },
    {
     type: 'line',
     label: 'Jujitsu',
     borderColor: DISCIPLINE_COLORS.Jujitsu,
     tension: 0.3,
     pointRadius: 6,
     pointBackgroundColor: DISCIPLINE_COLORS.Jujitsu,
     data: dataJujitsu,
    },
    {
     type: 'line',
     label: 'Judo Détente',
     borderColor: DISCIPLINE_COLORS['Judo Détente'],
     tension: 0.3,
     pointRadius: 6,
     pointBackgroundColor: DISCIPLINE_COLORS['Judo Détente'],
     data: dataJudoDetente,
    },
   ]
  }
 });

 // Le calcul du totalInscriptions doit aussi utiliser l'objet computed
 const totalInscriptions = computed(() => {
  // La dernière valeur de chaque série cumulée donne le total final
  return inscriptionsData.value.datasets.reduce((total, dataset) => {
   const lastValue = dataset.data.length > 0 ? dataset.data[dataset.data.length - 1] : 0;
   return total + lastValue;
  }, 0);
 });

 // 🎯 OPTIONS pour les INSCRIPTIONS (nombres entiers)
 const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(0); // Affiche sans décimales
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Nombre d'Inscriptions Cumulées"
      },
      ticks: {
        stepSize: 1, // Force les pas à être des entiers
        callback: (value) => {
          if (Number.isInteger(value)) {
            return value;
          }
        }
      }
    },
    x: {
      title: {
        display: true,
        text: "Mois de l'Année en cours"
      }
    }
  }
 });

 return { inscriptionsData, chartOptions, totalInscriptions }
}
