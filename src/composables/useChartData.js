import { ref, computed } from 'vue'

// 🎨 Définition des couleurs pour la cohérence avec useDepensesDisciplinesChart
const DISCIPLINE_COLORS = {
    'Judo': '#FF6384',        // Bleu
    'Aïkido': '#3B82F6',      // Vert
    'Jujitsu': '#efd844ff',     // Rouge
    'Judo Détente': '#10B981' // Violet
};

export function useEvolutionInscriptionsChart() {
    const labels = ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];

    // 🛑 DONNÉES SIMULÉES PAR DISCIPLINE (Exemple)
    const dataJudo = [5, 8, 3, 7, 5, 10, 15, 20, 15, 18];
    const dataAikido = [3, 4, 2, 4, 3, 5, 6, 7, 5, 6];
    const dataJujitsu = [1, 2, 1, 1, 1, 2, 3, 3, 2, 3];
    const dataJudoDetente = [1, 2, 1, 1, 0, 1, 2, 2, 1, 1];

    // Le total mensuel (pour référence): [12, 19, 8, 15, 10, 21, 30, 37, 27, 33]

    const inscriptionsData = ref({
        labels: labels,
        datasets: [
            {
                label: 'Judo',
                backgroundColor: DISCIPLINE_COLORS.Judo,
                data: dataJudo,
            },
            {
                label: 'Aïkido',
                backgroundColor: DISCIPLINE_COLORS.Aïkido,
                data: dataAikido,
            },
            {
                label: 'Jujitsu',
                backgroundColor: DISCIPLINE_COLORS.Jujitsu,
                data: dataJujitsu,
            },
            {
                label: 'Judo Détente',
                backgroundColor: DISCIPLINE_COLORS['Judo Détente'],
                data: dataJudoDetente,
            },
        ]
    })

    // Calcul du total des inscrits (pour votre carte du haut)
    const totalInscriptions = computed(() => {
        return inscriptionsData.value.datasets.reduce((total, dataset) => {
            return total + dataset.data.reduce((sum, value) => sum + value, 0);
        }, 0);
    });

    const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: 'rgba(255, 255, 255, 0.9)' }
            },
            title: {
                display: true,
                text: 'Évolution des Inscriptions par Discipline (Groupées)',
                color: 'rgba(255, 255, 255, 0.9)'
            }
        },
        scales: {
            x: {
                stacked: false, // 🛑 CLÉ 1 : Désactive l'empilement sur l'axe X (Barres Groupées)
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            y: {
                stacked: false, // 🛑 CLÉ 2 : Désactive l'empilement sur l'axe Y
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
        }
    })

    return { inscriptionsData, chartOptions, totalInscriptions }
}

// 💡 Laissez useDepensesDisciplinesChart inchangé
export function useDepensesDisciplinesChart() {
    const DISCIPLINE_COLORS = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];
    const depensesDisciplinesData = ref({
        labels: ['Judo', 'Aïkido', 'Jujitsu', 'Judo Détente'],
        datasets: [
            {
                label: 'Dépenses',
                backgroundColor: DISCIPLINE_COLORS,
                data: [3200, 2100, 1800, 900, 1200]
            }
        ]
    })
    // ... (Reste inchangé) ...
    const chartOptions = ref({
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: { position: 'bottom' },
            title: {
                display: true,
                text: 'Dépenses par discipline'
            }
        }
    })

    return { depensesDisciplinesData, chartOptions }
}

// export function useDepensesDisciplinesChart() {
//   const depensesDisciplinesData = ref({
//     labels: ['Judo', 'Aïkido', 'Karaté', 'Jujitsu', 'Judo Détente'],
//     datasets: [
//       {
//         label: 'Dépenses',
//         backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
//         data: [3200, 2100, 1800, 900, 1200]
//       }
//     ]
//   })

//   const chartOptions = ref({
//     responsive: true,
//     cutout: '60%',
//     plugins: {
//       legend: { position: 'bottom' },
//       title: {
//         display: true,
//         text: 'Dépenses par discipline'
//       }
//     }
//   })

//   return { depensesDisciplinesData, chartOptions }
// }
