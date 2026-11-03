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

## Лабораторні роботи 4–8

| Робота | Результат | Варіант і гілка |
| --- | --- | --- |
| 4 | IIFE, масиви, Map, контекст і замикання | Варіант 3, [lab-4](https://github.com/MyKa322/web-development-labs/tree/lab-4) |
| 5 | Паркінг з автомобілями, вантажівками й мотоциклами | Варіант 1, [lab-5](https://github.com/MyKa322/web-development-labs/tree/lab-5) |
| 6 | Три консольні програми PHP | Завдання 1–3, [lab-6](https://github.com/MyKa322/web-development-labs/tree/lab-6) |
| 7 | Журнал вимірювань, форма POST і MySQL | [lab-7](https://github.com/MyKa322/web-development-labs/tree/lab-7) |
| 8 | Редагування й видалення, MVC, Singleton, Factory | [lab-8](https://github.com/MyKa322/web-development-labs/tree/lab-8) |

Роботи №4–5 відкриваються через `npm start`. Для №6 потрібен PHP CLI; команди наведені
в [lab6/README.md](lab6/README.md). Для №7–8 потрібен Apache з PHP 8.1 або новішим,
розширеннями `pdo_mysql`, `mbstring` і MySQL. Імпортуйте `database/schema.sql`
і передайте параметри з’єднання змінними середовища. Докладніше в
[lab7/README.md](lab7/README.md) і [lab8/README.md](lab8/README.md).

У поточному навчальному середовищі Apache доступний на `http://127.0.0.1:8088/`;
Node-сервер перенаправляє сторінки №7–8 на цей порт. Сам Node не виконує PHP.
Команда `npm run test:unit` перевіряє моделі JavaScript. Команда `php lab6/tests.php`
виконує 26 перевірок консольних програм. Повний `npm test` містить 10 браузерних
сценаріїв і потребує запущеного Apache та бази для №7–8. Якщо адреса інша,
задайте `LAB_APP_URL` перед запуском тестів.
