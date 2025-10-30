import { ref, computed } from 'vue';

// Noms des mois en français
const MOIS_FR = ['Janv', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

// 💥 MISE À JOUR : Mapping fixe des couleurs pour les disciplines connues (avec plus de contrastes si possible)
const DISCIPLINE_COLOR_MAP = {
    'Judo': { bg: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)' },        // Rouge
    'Aïkido': { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' },      // Bleu
    'Jujitsu': { bg: 'rgba(255, 206, 86, 0.7)', border: 'rgba(255, 206, 86, 1)' }, // Jaune
    'Judo Détente': { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)' },     // Turquoise
};

// Couleurs de secours si d'autres disciplines apparaissent
const FALLBACK_COLORS = [
    { bg: 'rgba(153, 102, 255, 0.7)', border: 'rgba(153, 102, 255, 1)' }, // Violet
    { bg: 'rgba(255, 159, 64, 0.7)', border: 'rgba(255, 159, 64, 1)' }   // Orange
];

/**
 * Hook pour générer les données et options du graphique des dépenses par discipline
 * ventilées par mois, à partir des transactions filtrées.
 *
 * @param {ComputedRef<Array<Transaction>>} filteredTransactions Transactions du compte sélectionné
 * @param {ComputedRef<number>} currentYear L'année d'agrégation
 * @returns {object} { depensesDisciplinesData, chartOptions }
 */
export function useDepensesDisciplinesChart(filteredTransactions, currentYear) {

    const depensesDisciplinesData = computed(() => {
        const annualExpenses = filteredTransactions.value.filter(t => {
            const date = new Date(t.dateTransaction);
            // On filtre sur l'année en cours, les montants négatifs (dépenses) et les transactions ayant une discipline
            return date.getFullYear() === currentYear.value && t.montant < 0 && t.discipline?.nom;
        });

        // Map pour stocker la somme des dépenses par discipline et par mois
        // Format : { "Judo": [0, 0, 500, 0, ...], "Aïkido": [0, 200, 0, ...] }
        const monthlyExpensesByDiscipline = new Map();

        // 1. Agréger les données par discipline et par mois
        annualExpenses.forEach(t => {
            const disciplineName = t.discipline.nom;
            const monthIndex = new Date(t.dateTransaction).getMonth(); // 0 (Janv) à 11 (Déc)
            const expense = Math.abs(t.montant);

            // S'assurer que le tableau de 12 mois existe pour cette discipline
            if (!monthlyExpensesByDiscipline.has(disciplineName)) {
                 monthlyExpensesByDiscipline.set(disciplineName, new Array(12).fill(0));
            }

            // Ajouter la dépense au mois correspondant
            monthlyExpensesByDiscipline.get(disciplineName)[monthIndex] += expense;
        });

        // 2. Créer les datasets pour Chart.js (un dataset par discipline)
        const datasets = Array.from(monthlyExpensesByDiscipline.entries()).map(([disciplineName, monthlyData], index) => {

            // Logique de couleur prioritaire (fixe) ou de secours (cyclique)
            let colorSet;
            if (DISCIPLINE_COLOR_MAP[disciplineName]) {
                colorSet = DISCIPLINE_COLOR_MAP[disciplineName];
            } else {
                // Utilise une couleur de secours en cyclant si la discipline n'est pas dans le mapping fixe
                const fallbackIndex = index % FALLBACK_COLORS.length;
                colorSet = FALLBACK_COLORS[fallbackIndex];
            }

            return {
                label: disciplineName,
                data: monthlyData,
                backgroundColor: colorSet.bg,
                borderColor: colorSet.border,
                borderWidth: 2,
                // Ces paramètres sont optimaux pour une série temporelle (Barres groupées ou Lignes)
                fill: false,
                tension: 0.3,
            };
        });

        return {
            // Les labels sont maintenant les 12 mois
            labels: MOIS_FR,
            datasets: datasets,
        };
    });

    // Options du graphique Bar/Ligne (adaptées au multi-dataset)
    const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#fff',
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                // 💥 MISE À JOUR DU TITRE
                display: true,
                text: `Dépenses Mensuelles par Discipline (Année ${currentYear.value})`,
                color: '#fff',
                font: {
                    size: 18
                }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#fff' }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#fff', callback: function(value) { return value + ' €'; } } // Ajout de l'unité
            }
        }
    });

    return { depensesDisciplinesData, chartOptions };
}
