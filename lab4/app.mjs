import {runDemo,createMultiplier} from './functions.mjs';
(function () {
  const platform = window.clientInformation.userAgentData?.platform ?? window.clientInformation.platform ?? 'Невідомо';
  const result = runDemo(platform);
  console.log('Лабораторна №4, варіант 3', result);
  for (const [key, value] of Object.entries(result)) {
    const output = document.getElementById(key);
    if (output) output.textContent = Array.isArray(value) ? value.join(', ') : typeof value === 'string' ? value : JSON.stringify(value,null,2);
  }
})();
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  const output=document.getElementById('multiply-result');
  try {
    const factor=document.getElementById('factor').value.trim();
    const value=document.getElementById('value').value.trim();
    if (!factor || !value) throw new Error('Заповніть обидва поля.');
    output.textContent=String(createMultiplier(Number(factor))(Number(value)));
  } catch (error) { output.textContent=error.message; }
});
