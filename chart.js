document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
  
    // Generate random data
    function generateRandomData() {
      const numExpenses = 5;
      const labels = ['Rent', 'Groceries', 'Utilities', 'Transport', 'Others'];
      const data = Array.from({ length: numExpenses }, () => Math.floor(Math.random() * 500) + 100);
      
      return { labels, data };
    }
  
    // Get random data
    const randomData = generateRandomData();
  
    // Create Pie Chart
    const expenseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: randomData.labels,
        datasets: [{
          label: 'Expenses',
          data: randomData.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  });
  