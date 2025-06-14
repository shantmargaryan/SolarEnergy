document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('amdCalculator');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const amdInput = document.getElementById('totalAmd');
      const resultDiv = document.getElementById('calcResult');

      const amd = parseFloat(amdInput.value);

      if (isNaN(amd) || amd <= 0) {
        resultDiv.textContent = 'Խնդրում ենք մուտքագրել ճիշտ արժեքներ։';
        return;
      }

      // Divide the calculated amount by 5500 to find the kWh
      const kwhFromAmd = (amd / 5500).toFixed(1);
      resultDiv.textContent = `${amd} դրամը՝ ${kwhFromAmd} կՎտժ`;
    });
  }
});