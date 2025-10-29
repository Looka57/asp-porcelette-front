// 📁 src/composables/useChartData.js
import { ref, computed } from 'vue';

export function useEvolutionInscriptionsChart() {

  const inscriptionsData = ref({
    labels: ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      { label: 'Judo', data: [10, 20, 35, 50, 60, 75, 80, 90, 100, 120], backgroundColor: 'rgba(255, 99, 132, 0.7)' },
      { label: 'Aïkido', data: [5, 8, 15, 22, 30, 35, 40, 50, 55, 60], backgroundColor: 'rgba(54, 162, 235, 0.7)' },
      { label: 'Jujitsu', data: [3, 6, 10, 15, 20, 25, 28, 35, 40, 45], backgroundColor: 'rgba(255, 206, 86, 0.7)' },
      { label: 'Judo Détente', data: [2, 4, 6, 8, 12, 15, 18, 22, 25, 28], backgroundColor: 'rgba(75, 192, 192, 0.7)' },
    ],
  });

  const totalInscriptions = computed(() =>
    inscriptionsData.value.datasets.reduce(
      (sum, ds) => sum + ds.data.reduce((a, b) => a + b, 0),
      0
    )
  );

  const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.8)' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.8)' },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: { color: 'rgba(255, 255, 255, 0.9)' },
      },
      title: {
        display: true,
        text: `Évolution des Inscriptions (Total : ${totalInscriptions.value})`,
        color: 'rgba(255, 255, 255, 0.9)',
      },
    },
  }));

  return { inscriptionsData, chartOptions, totalInscriptions };
}
