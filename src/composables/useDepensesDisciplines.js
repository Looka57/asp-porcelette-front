// 📁 src/composables/useDepensesDisciplines.js
import { ref } from 'vue';

export function useDepensesDisciplines() {
  const depensesChart = ref({
    labels: ['Judo', 'Aïkido', 'Judo Détente', 'Jujitsu'],
    datasets: [
      {
        label: 'Dépenses annuelles (en €)',
        data: [4200, 1800, 900, 1300], // 💰 Valeurs exemple
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',   // Judo
          'rgba(54, 162, 235, 0.7)',   // Aïkido
          'rgba(255, 206, 86, 0.7)',   // Judo détente
          'rgba(75, 192, 192, 0.7)'    // Jujitsu
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 12
      }
    ]
  });

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
        display: true,
        text: 'Répartition des Dépenses par Discipline (Année)',
        color: '#fff',
        font: {
          size: 18
        }
      }
    }
  });

  return { depensesChart, chartOptions };
}
