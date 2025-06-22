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

      function roundUp(value) {
        return Math.ceil(value);
      }

      // Divide the calculated amount by 5500 to find the kWh
      const kwhFromAmd = roundUp(amd / 5500);
      resultDiv.textContent = `${amd} դրամը՝ ${kwhFromAmd} կՎտժ`;
    });
  }
});