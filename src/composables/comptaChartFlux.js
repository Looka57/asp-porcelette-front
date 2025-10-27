import { ref } from 'vue';

export function useFluxComptaChart() {
  // 🔹 Données pour le graphique
  const fluxComptaChart = ref({
    labels: ['Sept', 'Oct', 'Nov', 'Déc','Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Compte Courant',
        data: [1200, 1350, 1280, 1400, 1500, 1550, 1600, 1650, 1700, 1750],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)'
      },
      {
        label: 'Compte Épargne',
        data: [500, 520, 550, 580, 600, 620, 640, 660, 680, 700],
        fill: true,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.3,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }
    ],
  });

  // 🔹 Options du graphique (thème sombre)
  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
      }
    },
    plugins: {
      legend: { labels: { color: 'rgba(255, 255, 255, 0.9)' } },
      title: { display: true, text: 'Évolution des Comptes', color: 'rgba(255, 255, 255, 0.9)' }
    }
  });

  return {
    fluxComptaChart,
    chartOptions
  };
}
