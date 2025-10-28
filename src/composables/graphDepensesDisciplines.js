import { ref } from 'vue'

/**
 * Hook pour gérer les données et options du graphique des dépenses par discipline sur l'année.
 * @returns {object} { depensesDisciplinesData, chartOptions }
 */
export function useDepensesDisciplinesChart() {

  const depensesDisciplinesData = ref({
    labels: ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Judo',
        data: [500, 600, 450, 700, 650, 720, 600, 580, 640, 700],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      },
      {
        label: 'Aïkido',
        data: [300, 350, 320, 400, 380, 420, 410, 390, 370, 400],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Jujitsu',
        data: [450, 480, 500, 520, 510, 530, 500, 490, 470, 520],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgb(255, 206, 86)',
        borderWidth: 1
      },
      {
        label: 'Judo Détente',
        data: [200, 250, 220, 300, 280, 310, 290, 270, 260, 300],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  })

  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#fff' }
      },
      y: {
        stacked: false,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#fff' }
      }
    },
    plugins: {
      legend: { labels: { color: '#fff' } },
      title: {
        display: true,
        text: 'Dépenses par Discipline et par Mois',
        color: '#fff'
      }
    }
  })

  return { depensesDisciplinesData, chartOptions }
}
