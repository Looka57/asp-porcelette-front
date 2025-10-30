import { ref } from 'vue'

export function useEvolutionInscriptionsChart() {
  const inscriptionsData = ref({
    labels: ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Inscriptions',
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 1,
        data: [12, 19, 8, 15, 10, 18, 25, 30, 22, 28]
      }
    ]
  })

  const chartOptions = ref({
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: {
        display: true,
        text: 'Évolution des inscriptions'
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  })

  return { inscriptionsData, chartOptions }
}

export function useDepensesDisciplinesChart() {
  const depensesDisciplinesData = ref({
    labels: ['Judo', 'Aïkido', 'Karaté', 'Jujitsu', 'Judo Détente'],
    datasets: [
      {
        label: 'Dépenses',
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        data: [3200, 2100, 1800, 900, 1200]
      }
    ]
  })

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
