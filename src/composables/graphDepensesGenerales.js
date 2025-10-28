import { ref } from 'vue'

/**
 * Hook pour gérer les données et options du graphique des dépenses générales.
 * @returns {object} { depensesData, chartOptions }
 */
export function useDepensesGeneralesChart() {

  const depensesData = ref({
    labels: ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Dépenses mensuelles (€)',
        data: [450, 1200, 980, 1750, 1340, 1650, 950, 820, 1040, 1500],
        fill: true,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        pointBackgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  })

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
        text: 'Dépenses Mensuelles (toutes disciplines)',
        color: '#fff'
      }
    }
  })

  return { depensesData, chartOptions }
}
