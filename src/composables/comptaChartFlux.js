import { ref, watch } from 'vue';

export function useFluxComptaChart(transactionsRef, comptesRef, currentYearRef) {
  const fluxComptaChart = ref({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: []
  });

  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'rgba(255, 255, 255, 0.7)' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'rgba(255, 255, 255, 0.7)' } }
    },
    plugins: {
      legend: { labels: { color: 'rgba(255, 255, 255, 0.9)' } },
      title: { display: true, text: 'Évolution des Comptes', color: 'rgba(255, 255, 255, 0.9)' }
    }
  });

  function calculateMonthlyData() {
    // ✅ Vérifications renforcées
    if (!transactionsRef?.value || !Array.isArray(transactionsRef.value) || transactionsRef.value.length === 0) {

      fluxComptaChart.value.datasets = [];
      return;
    }

    if (!comptesRef?.value || !Array.isArray(comptesRef.value) || comptesRef.value.length === 0) {
      fluxComptaChart.value.datasets = [];
      return;
    }


    const months = [...Array(12).keys()];
    const year = parseInt(currentYearRef.value, 10);


    fluxComptaChart.value.datasets = comptesRef.value.map(compte => {
      if (!compte?.compteId || !compte?.nom) {
        return null;
      }

      // ✅ Parser robuste qui gère les formats ISO avec timezone
      const parseTransactionDate = (dateString) => {
        if (!dateString) return null;

        try {
          // Format attendu: "2025-11-09T00:00:00+01:00"
          // On prend juste la partie date YYYY-MM-DD
          const dateOnly = dateString.split('T')[0];

          const [y, m, d] = dateOnly.split('-').map(Number);

          if (!y || !m || !d) {
            return null;
          }

          const date = new Date(y, m - 1, d);

          if (isNaN(date.getTime())) {
            return null;
          }

          return {
            date: date,
            year: y,
            month: m - 1 // Index 0-11
          };
        } catch (e) {
          console.error("❌ Erreur parsing date:", dateString, e);
          return null;
        }
      };

      // 🔹 Filtrer les transactions du compte
      const transactionsCompte = transactionsRef.value.filter(t => {
        // ✅ Gérer les Proxy Vue
        const transaction = t?.__v_raw || t;

        // ✅ CORRECTION: La transaction contient un objet compte complet
        // Il faut accéder à transaction.compte.compteId (ou transaction.compteId.compteId)
        const tCompteId = transaction?.compte?.compteId || transaction?.compteId?.compteId;
        const cCompteId = compte.compteId;


        const match = tCompteId === cCompteId;
        if (match) {
          console.log(`  ✓ Transaction trouvée: ${transaction.dateTransaction} - ${transaction.montant}€`);
        }
        return match;
      });

      console.log(`  📊 Transactions du compte: ${transactionsCompte.length}`);

      // 🔹 Parser et filtrer par année
      const transactionsYear = transactionsCompte
        .map(t => {
          // ✅ Gérer les Proxy Vue
          const transaction = t?.__v_raw || t;
          const parsed = parseTransactionDate(transaction.dateTransaction);
          if (!parsed) {
            console.log(`  ⚠️ Date invalide: ${transaction.dateTransaction}`);
            return null;
          }
          return {
            ...transaction,
            parsedDate: parsed.date,
            transactionYear: parsed.year,
            transactionMonth: parsed.month,
            montant: parseFloat(transaction.montant) || 0
          };
        })
        .filter(t => t !== null && t.transactionYear === year)
        .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());


      if (transactionsYear.length > 0) {
        console.log(`  📝 Détail:`, transactionsYear.map(t =>
          `${t.dateTransaction} → ${t.montant}€ (Mois ${t.transactionMonth + 1})`
        ));
      }

      // 🔹 Calcul du flux total de l'année
      const totalFluxAnnee = transactionsYear.reduce((sum, t) => sum + t.montant, 0);

      // 🔹 Solde de départ (1er janvier)
      const soldeCurrent = parseFloat(compte.solde) || 0;
      const soldeInitialAnnee = soldeCurrent - totalFluxAnnee;

      // 🔹 Calculer les soldes mensuels
      let cumulative = soldeInitialAnnee;
      const monthlyData = [];

      months.forEach(m => {
        const monthTransactions = transactionsYear.filter(t => t.transactionMonth === m);

        let monthFlow = 0;
        monthTransactions.forEach(t => {
          cumulative += t.montant;
          monthFlow += t.montant;
        });

        monthlyData.push(Number(cumulative.toFixed(2)));

        if (monthFlow !== 0) {
          console.log(`  📆 Mois ${m + 1}: flux=${monthFlow}€, solde=${cumulative.toFixed(2)}€`);
        }
      });

      const colors = compte.compteId === 2
        ? { border: 'rgb(75, 192, 192)', background: 'rgba(75, 192, 192, 0.2)' }
        : { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.2)' };

      return {
        label: compte.nom,
        data: monthlyData,
        fill: true,
        borderColor: colors.border,
        backgroundColor: colors.background,
        tension: 0.3,
        pointBackgroundColor: colors.border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.border
      };
    }).filter(d => d !== null);

  }

  // ✅ Watch avec deep pour détecter les changements dans les tableaux
  watch(
    [transactionsRef, comptesRef, currentYearRef],
    () => {
      calculateMonthlyData();
    },
    { immediate: true, deep: true }
  );

  return { fluxComptaChart, chartOptions };
}
