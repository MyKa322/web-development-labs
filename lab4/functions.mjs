export function countCharacters(strings) {
  if (!Array.isArray(strings) || strings.some(value => typeof value !== 'string')) throw new TypeError('Потрібен масив рядків.');
  return strings.reduce((sum, value) => sum + [...value].length, 0);
}
export function createMultiplier(factor) {
  if (!Number.isFinite(factor)) throw new TypeError('Множник має бути скінченним числом.');
  return value => {
    if (!Number.isFinite(value)) throw new TypeError('Аргумент має бути скінченним числом.');
    const result = value * factor;
    if (!Number.isFinite(result)) throw new RangeError('Результат виходить за числові межі.');
    return result;
  };
}
export function greet(prefix = 'Hello') { return `${prefix}, ${this.firstName} ${this.lastName}!`; }
export function runDemo(platform = 'Невідомо') {
  const strings = ['JavaScript', 'масив', 'функція'];
  const first = Array.from({length:10}, (_, i) => i + 1);
  const second = Array.from({length:10}, (_, i) => i + 11);
  const students = new Map([['Богдан', 94], ['Олена', 88], ['Андрій', 91]]);
  const entries = [];
  for (const [name, grade] of students) entries.push(`${name}: ${grade}`);
  const person = {firstName:'Bohdan', lastName:'Rybchynskyi'};
  const other = {firstName:'Olena', lastName:'Koval'};
  return {platform, strings, characterCount:countCharacters(strings), first, second,
    merged:[...first,...second], students:entries,
    call:greet.call(person), apply:greet.apply(other,['Hello']),
    closures:{double:createMultiplier(2)(7), triple:createMultiplier(3)(7)}};
}
