# Генератор форм на Typescript

[![hexlet-check](https://github.com/kla1mn/react-urfu-project-81/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kla1mn/react-urfu-project-81/actions)
[![CI](https://github.com/kla1mn/react-urfu-project-81/actions/workflows/ci.yml/badge.svg)](https://github.com/kla1mn/react-urfu-project-81/actions/workflows/ci.yml)

Библиотека, с помощью которой удобно создавать формы в шаблонах сайтов. Она заметно сокращает код описания формы за счет автоматической обработки ошибок и различных контролов.

Учебный проект Хекслета: https://ru.hexlet.io/
Как это должно работать: https://files.hexlet.app/a/100lcl

## Стек

- TypeScript
- Vitest — тесты и покрытие
- oxlint, oxfmt — линтер и форматтер

## Установка

Требуется Node.js 22 или новее.

```bash
git clone https://github.com/kla1mn/react-urfu-project-81.git
cd react-urfu-project-81
make install
```

## Команды

| Команда          | Что делает                          |
| ---------------- | ----------------------------------- |
| `make install`   | установка зависимостей (`npm ci`)   |
| `make lint`      | линтер и проверка форматирования    |
| `make lint-fix`  | автоисправление и форматирование    |
| `make typecheck` | проверка типов TypeScript           |
| `make test`      | запуск тестов                       |
| `make test-coverage` | тесты с покрытием и порогом 80% |
| `make build`     | сборка пакета в `dist/`             |

## Использование

```ts
import HexletCode from "@hexlet/code";

const template = { name: "rob", job: "hexlet", gender: "m" };

const form = HexletCode.formFor(template, { url: "/users" }, (f) => {
  f.input("name", { class: "user-input" });
  f.input("job", { as: "textarea", rows: 50 });
  f.submit("Wow");
});

console.log(form);
// Переносы строк добавлены для читаемости, генератор выдаёт HTML в одну строку:
// <form action="/users" method="post">
//   <label for="name">Name</label>
//   <input name="name" type="text" value="rob" class="user-input">
//   <label for="job">Job</label>
//   <textarea cols="20" rows="50" name="job">hexlet</textarea>
//   <input type="submit" value="Wow">
// </form>
```

- `formFor(template, options, callback)`: `options.url` задаёт `action` (по умолчанию `#`), `options.method` задаёт метод (по умолчанию `post`).
- `f.input(name, options)` добавляет поле со значением из `template`. По умолчанию это `<input type="text">`, а с `as: "textarea"` — `<textarea>` размером `cols="20" rows="40"`. Остальные опции становятся атрибутами поля и могут переопределить значения по умолчанию. Перед каждым полем выводится `<label>` с именем поля, начинающимся с заглавной буквы.
- `f.submit(value)` добавляет кнопку отправки `<input type="submit">` с текстом `value` (по умолчанию `Save`).
- Если поля нет в `template`, выбрасывается ошибка `Field '<name>' does not exist in the template.`

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
