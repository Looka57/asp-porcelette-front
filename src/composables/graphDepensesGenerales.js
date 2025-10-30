import { ref, computed } from 'vue'

/**
 * Hook pour générer les données et options du graphique des dépenses mensuelles
 * à partir des transactions filtrées.
 *
 * @param {ComputedRef<Array<Transaction>>} filteredTransactions Transactions du compte sélectionné
 * @param {ComputedRef<number>} currentYear L'année d'agrégation
 * @returns {object} { depensesData, chartOptions }
 */
export function useDepensesGeneralesChart(filteredTransactions, currentYear) {
    // Les noms des mois en français
    const MOIS_FR = ['Janv', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

    // Propriété calculée pour générer les données Chart.js
    const depensesData = computed(() => {
        // Initialise un tableau de 12 zéros pour les 12 mois
        const monthlyData = new Array(12).fill(0);

        // 1. Filtrer les transactions par l'année en cours et ne garder que les dépenses
        const annualExpenses = filteredTransactions.value.filter(t => {
            const date = new Date(t.dateTransaction);
            // On ne filtre que sur l'année en cours et les montants négatifs (dépenses)
            return date.getFullYear() === currentYear.value && t.montant < 0;
        });

        // 2. Agréger les dépenses par mois
        annualExpenses.forEach(t => {
            const date = new Date(t.dateTransaction);
            const monthIndex = date.getMonth(); // 0 (janvier) à 11 (décembre)
            // Ajouter la valeur absolue de la dépense au mois correspondant
            monthlyData[monthIndex] += Math.abs(t.montant);
        });

        // 3. Retourner la structure Chart.js
        return {
            labels: MOIS_FR,
            datasets: [
                {
                    label: `Dépenses pour ${currentYear.value} (€)`,
                    data: monthlyData,
                    fill: true,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.3,
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                },
            ],
        };
    });

    // Options du graphique (statiques pour le style)
    const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#fff' }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#fff' }
            }
        },
        plugins: {
            legend: { labels: { color: '#fff' } },
            title: {
                display: true,
                text: 'Dépenses Mensuelles', // Le titre est mis à jour dans le composant parent
                color: '#fff'
            }
        }
    })

    // On retourne la computed property pour les données et l'objet ref pour les options
    return { depensesData, chartOptions }
}
