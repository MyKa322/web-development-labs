# Основи веб-розробки

Результати лабораторних робіт Рибчинського Б.І., група **ІПЗм-41**.
Контакт: [профіль MyKa322 на GitHub](https://github.com/MyKa322).

## Лабораторна робота 1

**Тема:** Система контролю версій Git та робота з віддаленими Git репозиторіями.

**Мета:** навчитися використовувати Git для управління версіями проєктів,
освоїти роботу з віддаленими репозиторіями для спільної розробки,
зберігання та обміну кодом на платформі GitHub.

Виконані кроки:

1. Ініціалізація репозиторію та `Initial commit`.
2. Створення `new-feature`, додавання CSS, злиття в `main`, видалення гілки.
3. Створення `custom-feature`, push і pull request на GitHub.
4. Клонування в окрему папку, зміни з клону та другий pull request.
5. Отримання змін за допомогою `git fetch` і `git pull`.

Відкрийте `index.html` у браузері. Інсталяція залежностей для першої роботи не потрібна.

```powershell
git clone https://github.com/MyKa322/web-development-labs.git
cd web-development-labs
git log --oneline --graph --all
```

Документація: [Git](https://git-scm.com/doc), [Markdown](https://docs.github.com/en/get-started/writing-on-github).

## Лабораторні роботи 2 і 3

Номер студента у списку групи — **11**, відповідний варіант — **3**.

| Робота | Результат | Гілка |
| --- | --- | --- |
| 1 | Історія Git, гілки, злиття та GitHub | [тег lab-1](https://github.com/MyKa322/web-development-labs/tree/lab-1) |
| 2 | Чотири адаптивні секції з Tailwind CSS | [lab-2](https://github.com/MyKa322/web-development-labs/tree/lab-2) |
| 3 | Конвертер довжини та історія операцій | [lab-3](https://github.com/MyKa322/web-development-labs/tree/lab-3) |

```powershell
npm ci
npm run build
npm start
```

Відкрити [макет](http://127.0.0.1:4173/lab2/) або
[конвертер](http://127.0.0.1:4173/lab3/). Також можна відкрити HTML-файли напряму:
зібраний CSS та всі зображення локальні, CDN не використовується.

`npm test` запускає п’ять браузерних тестів у Microsoft Edge. Перевіряються всі
16 пар одиниць, історія, валідація та адаптивні макети від 320 до 1440 px.
Докладніше: [робота 2](lab2/README.md), [робота 3](lab3/README.md).
