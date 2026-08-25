import { ref, computed } from 'vue';

export function useDepensesGeneralesChart(filteredTransactions, currentYear) {

    const MOIS_SAISON = [
        'Sept', 'Oct', 'Nov', 'Déc',
        'Janv', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'
    ];

    const depensesData = computed(() => {

        // Tableau de 10 mois : septembre → juin
        const monthlyData = new Array(10).fill(0);

        const seasonStartYear = currentYear.value;

        const seasonStart = new Date(seasonStartYear, 8, 1);
        const seasonEnd = new Date(seasonStartYear + 1, 5, 30);

        // Filtrer les dépenses de la saison
        const annualExpenses = filteredTransactions.value.filter(t => {

            const date = new Date(t.dateTransaction);

            return (
                date >= seasonStart &&
                date <= seasonEnd &&
                t.montant < 0
            );
        });

        // Agréger les dépenses dans les 10 mois de la saison
        annualExpenses.forEach(t => {

            const date = new Date(t.dateTransaction);
            const month = date.getMonth();

            // Septembre → décembre
            let seasonMonthIndex;

            if (month >= 8) {
                seasonMonthIndex = month - 8;
            }
            // Janvier → juin
            else {
                seasonMonthIndex = month + 4;
            }

            monthlyData[seasonMonthIndex] += Math.abs(t.montant);
        });

        return {
            labels: MOIS_SAISON,

            datasets: [
                {
                    label: `Dépenses Saison ${currentYear.value}-${currentYear.value + 1} (€)`,
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
            legend: {
                labels: { color: '#fff' }
            },

            title: {
                display: true,
                text: 'Dépenses Mensuelles',
                color: '#fff'
            }
        }
    });

    return { depensesData, chartOptions };
}
