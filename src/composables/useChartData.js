import { ref } from 'vue';

/**
 * Hook pour gérer les données et les options du graphique d'évolution des inscriptions.
 * @returns {object} Les données et options du graphique.
 */
export function useEvolutionInscriptionsChart() {

    // --- Données Statiques/Mock pour le Graphique ---
    // Ces données seront remplacées par des données d'API réelles plus tard.
    const inscriptionsData = ref({
        labels: ['Sept', 'Oct', 'Nov', 'Déc','Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', ],
        datasets: [
            {
                label: 'Nouvelles Inscriptions',
                data: [5, 19, 40, 61, 76, 85, 9,115,115,115],
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.3,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(75, 192, 192)'
            },
        ],
    });

    // --- Options pour le Graphique (Thème Sombre) ---
    const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.9)'
                }
            },
            title: {
                display: true,
                text: 'Évolution des Inscriptions',
                color: 'rgba(255, 255, 255, 0.9)'
            }
        }
    });

    return {
        inscriptionsData,
        chartOptions
    };
}
