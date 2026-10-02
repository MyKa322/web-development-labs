'use strict';

// Коефіцієнти відносно базової одиниці — метра.
const UNITS = Object.freeze({
  mm: Object.freeze({ label: 'Міліметри (мм)', symbol: 'мм', factor: 0.001 }),
  cm: Object.freeze({ label: 'Сантиметри (см)', symbol: 'см', factor: 0.01 }),
  m: Object.freeze({ label: 'Метри (м)', symbol: 'м', factor: 1 }),
  km: Object.freeze({ label: 'Кілометри (км)', symbol: 'км', factor: 1000 }),
});

const form = document.getElementById('converter-form');
const input = document.getElementById('input-value');
const resultField = document.getElementById('result');
const fromSelect = document.getElementById('from-unit');
const toSelect = document.getElementById('to-unit');
const errorMessage = document.getElementById('error-message');
const historyList = document.getElementById('history-list');
const historyCount = document.getElementById('history-count');
const emptyHistory = document.getElementById('empty-history');
const clearButton = document.getElementById('clear-history');
const conversionStatus = document.getElementById('conversion-status');
const historyStatus = document.getElementById('history-status');
const numberFormat = new Intl.NumberFormat('uk-UA', { maximumSignificantDigits: 12 });
const history = [];

for (const [key, unit] of Object.entries(UNITS)) {
  for (const select of [fromSelect, toSelect]) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = unit.label;
    select.append(option);
  }
}
fromSelect.value = 'm';
toSelect.value = 'cm';

function hideError() {
  errorMessage.hidden = true;
  errorMessage.textContent = '';
  input.removeAttribute('aria-invalid');
}

function showError(message) {
  resultField.value = '';
  conversionStatus.textContent = '';
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

function updateHistoryState() {
  historyCount.textContent = String(history.length);
  emptyHistory.hidden = history.length > 0;
  clearButton.disabled = history.length === 0;
}

function addHistory(entry) {
  history.push(entry);
  const item = document.createElement('li');
  item.className = 'rounded-xl bg-canvas p-4';
  const operation = document.createElement('p');
  operation.className = 'break-words text-sm font-semibold';
  operation.textContent = entry.expression;
  const description = document.createElement('p');
  description.className = 'mt-1 text-xs text-muted';
  description.textContent = `${UNITS[entry.from].label} → ${UNITS[entry.to].label}`;
  item.append(operation, description);
  historyList.prepend(item);
  updateHistoryState();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  hideError();
  const text = input.value.trim().replace(',', '.');
  if (text === '') { showError('Введіть значення довжини.'); return; }
  if (!/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) {
    showError('Введіть невід’ємне число, наприклад 2,5.'); return;
  }
  const value = Number(text);
  if (!Number.isFinite(value)) { showError('Значення завелике. Введіть менше число.'); return; }
  if (value === 0 && /[1-9]/.test(text.split(/[eE]/)[0])) {
    showError('Значення замале для точного обчислення.'); return;
  }
  const from = fromSelect.value;
  const to = toSelect.value;
  const result = value * (UNITS[from].factor / UNITS[to].factor);
  if (!Number.isFinite(result) || (value !== 0 && result === 0)) {
    showError('Результат виходить за допустимий числовий діапазон.'); return;
  }
  const expression = `${numberFormat.format(value)} ${UNITS[from].symbol} = ${numberFormat.format(result)} ${UNITS[to].symbol}`;
  resultField.value = numberFormat.format(result);
  conversionStatus.textContent = expression;
  addHistory({ value, result, from, to, expression });
});

document.getElementById('swap-units').addEventListener('click', () => {
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  resultField.value = '';
  conversionStatus.textContent = '';
  hideError();
});

clearButton.addEventListener('click', () => {
  history.length = 0;
  historyList.replaceChildren();
  updateHistoryState();
  historyStatus.textContent = 'Історію перетворень очищено.';
});

input.addEventListener('input', () => { hideError(); resultField.value = ''; conversionStatus.textContent = ''; });
for (const select of [fromSelect, toSelect]) {
  select.addEventListener('change', () => { hideError(); resultField.value = ''; conversionStatus.textContent = ''; });
}
