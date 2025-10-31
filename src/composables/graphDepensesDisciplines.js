// // Fichier : useDepensesDisciplinesChart.js (UTILITAIRE NON RÉACTIF)

// // Mapping des couleurs pour la cohérence
// const DISCIPLINE_COLOR_MAP = {
// 'Judo': { bg: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)' },
// 'Aïkido': { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' },
// 'Jujitsu': { bg: 'rgba(255, 206, 86, 0.7)', border: 'rgba(255, 206, 86, 1)' },
// 'Judo Détente': { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)' },
// };

// // Couleurs de secours
// const FALLBACK_COLORS = [
// { bg: 'rgba(153, 102, 255, 0.7)', border: 'rgba(153, 102, 255, 1)' }, // Violet
// { bg: 'rgba(255, 159, 64, 0.7)', border: 'rgba(255, 159, 64, 1)' } // Orange
// ];

// /**
// * Fonction pure pour calculer les données du graphique des dépenses TOTALES par discipline.
// * @param {Array} transactions - liste non-réactive des transactions
// * @param {number} currentYear - année de référence
// * @returns {object} Les données formatées pour Chart.js
// */
// export function aggregateDepensesDisciplines(transactions, currentYear) {

//     console.log('--- FONCTION D\'AGRÉGATION EXÉCUTÉE ---');
//     console.log('Année de référence:', currentYear);
//     console.log('Nombre total de transactions reçues:', transactions ? transactions.length : 0);

//   // Vérification initiale
//   if (!transactions || transactions.length === 0) {
//     return { labels: [], datasets: [{ data: [] }] };
//   }

//  // 1. FILTRAGE : Dépenses de l'année qui ont une discipline (filtre strict)
//  const annualExpenses = transactions.filter((t, index) => {
//   const transactionDate = new Date(t.dateTransaction);

//   // Nous réintégrons le filtre d'année !
//   const isCorrectYear = transactionDate.getFullYear() === currentYear;
//   const isDepense = t.montant < 0;
//   const hasDisciplineName = t.discipline?.nom;

//   if (index === 0) {
//     console.log(`[TID: ${t.transactionId}] Année OK (${currentYear})?`, isCorrectYear);
//     console.log(`[TID: ${t.transactionId}] Montant < 0 ?`, isDepense);
//     console.log(`[TID: ${t.transactionId}] Discipline.nom existe ?`, hasDisciplineName ? true : false, `(Valeur: ${hasDisciplineName})`);
//   }

//   return isCorrectYear && isDepense && hasDisciplineName;
//  });

//   console.log('Nombre de transactions après FILTRAGE:', annualExpenses.length);

//   // Si aucune donnée n'est trouvée (après filtre)
//   if (annualExpenses.length === 0) {
//     return { labels: [], datasets: [{ data: [] }] };
//   }

//  // 2. AGRÉGATION : Grouper les montants totaux.
//  const totalExpensesByDiscipline = new Map();
//  const disciplineNames = [];

//  annualExpenses.forEach(t => {
//  const disciplineName = t.discipline.nom;
//  const expense = Math.abs(t.montant);

//  totalExpensesByDiscipline.set(disciplineName,
//   (totalExpensesByDiscipline.get(disciplineName) || 0) + expense
//  );
//  if (!disciplineNames.includes(disciplineName)) {
//   disciplineNames.push(disciplineName);
//  }
//  });


//  // 3. MISE EN FORME : Préparer les données et les couleurs pour Chart.js.
//  const data = [];
//  const backgroundColors = [];
//  const borderColors = [];

//  disciplineNames.forEach((name, index) => {
//  data.push(totalExpensesByDiscipline.get(name));

//  let colorSet = DISCIPLINE_COLOR_MAP[name];

//  if (!colorSet) {
//   const fallbackIndex = index % FALLBACK_COLORS.length;
//   colorSet = FALLBACK_COLORS[fallbackIndex];
//  }

//  backgroundColors.push(colorSet.bg);
//  borderColors.push(colorSet.border);
//  });

//  return {
//  labels: disciplineNames,
//  datasets: [
//   {
//   label: 'Dépenses Totales (€)',
//   data: data,
//   backgroundColor: backgroundColors,
//   borderColor: borderColors,
//   borderWidth: 2
//   }
//  ]
//  };
// }

// // Fonction utilitaire pour générer les options Chart.js
// export function createDepensesOptions(currentYear) {
//     return {
//         responsive: true,
//         maintainAspectRatio: false,
//         indexAxis: 'y',
//         plugins: {
//             legend: { display: false },
//             title: {
//                 display: true,
//                 text: `Dépenses Totales par Discipline (Année ${currentYear})`,
//                 color: '#fff',
//                 font: { size: 16, weight: 'bold' }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: (context) => `${context.label}: ${context.formattedValue} €`
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 ticks: { color: '#fff', callback: function (value) { return value + ' €'; } },
//                 grid: { color: 'rgba(255,255,255,0.1)' },
//                 beginAtZero: true
//             },
//             y: {
//                 ticks: { color: '#fff', font: { size: 12 } },
//                 grid: { color: 'rgba(255,255,255,0.1)' }
//             }
//         }
//     };
// }
