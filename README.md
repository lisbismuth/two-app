# Двое

Минималистичное PWA-приложение для пары: общие задачи, календарь, вишлисты, скидочные карты, учёт трат 50/50 и личная статистика.

<p align="center">
  <a href="https://two-lissy1.vercel.app/?demo=true" target="_blank" rel="noopener noreferrer">
    <img src="./screenshots/demo-button.svg" alt="Live Demo · Try App" height="40">
  </a>
</p>

<p align="center">
  <img src="./screenshots/tech-chips.svg" alt="MIT · React 19 · TypeScript 5.7 · Vite 8" height="28">
</p>

<p align="center">
  <a href="https://two-lissy1.vercel.app/?demo=true" target="_blank" rel="noopener noreferrer">
    <img src="./screenshots/demo-card.svg" width="640" alt="Демо-режим · Guest Mode — откройте с ?demo=true">
  </a>
</p>

Альтернатива громоздким сервисам учёта: простые 50/50 траты, совместные списки и визуальные карточки для пары — без подписок, рекламы и лишних аккаунтов.

Данные моментально синхронизируются через сервер и Postgres — не нужно находиться в приложении одновременно.

**Лицензия:** [MIT](./LICENSE)

---

## Интерфейс

<p align="center">
  <img src="https://github.com/user-attachments/assets/ee79c460-279a-4599-91d5-7b0ab2697bc3" width="260" alt="Совместные дела и календарь">
  <img src="https://github.com/user-attachments/assets/50fedaa3-cd06-4432-956f-425a2575e2fc" width="260" alt="Список хотелок и планов">
  <img src="https://github.com/user-attachments/assets/fd986271-8978-4673-ba20-4ec940a53ba3" width="260" alt="Статистика пары и дни вместе">
</p>

---

## Возможности

| Раздел | Что внутри |
|--------|------------|
| **Дела** | Задачи с фильтрами (все / общие / по партнёру / готово), повторяющиеся задачи, календарь |
| **Хотелки** | Общий вишлист с ссылками, ценами и авто-подтягиванием метаданных URL |
| **Траты** | Трекер трат 50/50, категории, погашение долгов и баланс «кто кому должен» |
| **Карты** | Скидочные карты (генерация QR/штрихкодов, сканер) и хранилище PDF |
| **Мы** | Планы, капсулы времени, голосования и «мы»-статистика |

<p align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/d927cc93-e9e3-483b-aa7a-61d83da80834" width="280" alt="Демо работы приложения Двое">
</p>

- **iOS Native Look:** закреплённая нижняя навигация, адаптив под mobile Safari, поддержка PWA (установка на домашний экран).
- **Синхронизация:** опрос `/api/state` ~каждые 8 секунд + при возврате во вкладку; конфликт записи → 409, подтягивается актуальная версия.
- **Демо по ссылке:** `/?demo=true` или `/?guest=true` — гостевой режим с демо-данными (работает и при выключенном auth).
- **Режим без авторизации:** при `VITE_AUTH_ENABLED=false` приложение работает с dev-пользователем (удобно для локальной разработки без БД).

---

## Стек

- **Framework:** TanStack Start (React 19, Router, SSR)
- **Build & Host:** Vite + Nitro (Vercel)
- **Styling:** Tailwind CSS v4 + Radix UI
- **State:** Zustand (+ persist)
- **Database:** Postgres (Neon / PGLite) + Kysely (миграции при сборке)
- **Auth:** Better Auth (email/password + allowlist на 2 адреса)
- **Client Utils:** `jsbarcode`, `qrcode`, `@zxing/browser` — генерация и считывание штрихкодов локально на устройстве
- Написано в связке с AI-ассистентами

---

## Переменные окружения

Секреты и личные данные **не коммитятся**. Задаются в Vercel (Settings → Environment Variables) или в локальном `.env`.

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `DATABASE_URL` | Prod | Connection string к Postgres |
| `BETTER_AUTH_SECRET` | Prod | Длинная случайная строка для сессий |
| `BETTER_AUTH_URL` | Рекомендуется | Публичный URL приложения (`https://your-app.vercel.app`) |
| `PARTNER_EMAIL_A` | Да (Auth) | Email первого партнёра |
| `PARTNER_EMAIL_B` | Да (Auth) | Email второго партнёра |
| `PARTNER_NAME_A` | Нет | Отображаемое имя A |
| `PARTNER_NAME_B` | Нет | Отображаемое имя B |
| `VITE_AUTH_ENABLED` | Нет | `false` — auth выключен (dev-режим без БД) |

Без `PARTNER_EMAIL_A` / `PARTNER_EMAIL_B` регистрация и вход закрыты (fail-closed).

Пример локального `.env` (файл в `.gitignore`):

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
BETTER_AUTH_SECRET=your_super_secret_string
BETTER_AUTH_URL=http://localhost:8080
PARTNER_EMAIL_A=you@example.com
PARTNER_EMAIL_B=partner@example.com
```

---

## Локальный запуск

```bash
npm install
npm run dev
```

Приложение: `http://localhost:5173` (после запуска `npm run dev`)
Демо сразу: `http://localhost:5173/?demo=true`

Без `DATABASE_URL` используется встроенный PGLite (данные сбрасываются при перезапуске). Для постоянного хранения укажите Postgres в `.env`.

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Сборка + применение миграций |
| `npm run typecheck` | Проверка типов TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Тесты |
| `npm run preview` | Превью production-сборки |

---

## Деплой на Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lisbismuth/two)

1. Запушьте репозиторий на GitHub (или нажмите кнопку выше).
2. Импортируйте проект в Vercel.
3. Подключите Postgres (например Neon) — нужна `DATABASE_URL`.
4. Задайте `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PARTNER_EMAIL_A`, `PARTNER_EMAIL_B`.
5. Deploy. Миграции БД применяются автоматически при сборке.

Не коммитьте `.vercel/output` — иначе платформа может отдать старый бандл.

Подробности — в [DEPLOY.md](./DEPLOY.md).

---

## PWA (iPhone)

1. Откройте сайт в Safari.
2. Поделиться → **На экран «Домой»**.
3. Иконка задаётся через `apple-touch-icon` в `public/`.

---

## Структура

```
src/
  routes/           # страницы (file-based routing)
  components/       # UI, сканер штрихкода, оболочка
  lib/
    store.ts        # Zustand
    sync/           # /api/state — общий стейт
    auth/           # Better Auth (server + client)
    guest.ts        # демо-режим (?demo=true)
    partners-auth.ts
    types.ts
migrations/         # SQL
public/             # иконки PWA и статика
screenshots/        # скриншоты для README
scripts/            # CI-инварианты, PWA-плагин, миграции
```

---

## Безопасность

- **Fail-Closed Auth:** регистрация и доступ разрешены только для двух указанных в `.env` адресов.
- **Client-Side Heavy:** штрихкоды и сканер обрабатываются только на устройстве (ZXing / JsBarcode / QRCode), без отправки на сторонние API.
- **Private Data:** проект рассчитан на приватное использование одной парой (одна JSON-запись в БД, не multi-tenant SaaS).
- Голосования скрывают чужой выбор в UI до завершения; на сервере данные хранятся в общем документе (доверие между партнёрами).
- **Guest / demo:** локальный snapshot, без записи в `/api/state`.

---

## CI/CD & Testing Architecture

Проект содержит автоматизированный suite интеграционных тестов (`node --test` / `npm test`), проверяющий сборку, метаданные PWA и корректность конфигураций среды. CI на GitHub Actions гоняет typecheck, lint и этот suite на каждый push в `main`.

### Запуск тестов локально

```bash
npm test
```

Ключевые скрипты и тесты лежат в `scripts/`:

| Файл | За что отвечает |
|------|-----------------|
| `grok-pwa-plugin.mjs` + `grok-pwa-shared.mjs` | Инъекция PWA / Open Graph meta в HTML |
| `grok-pwa-plugin.test.mjs` | Приоритет `og:title`, изоляция от FS проекта |
| `with-app-env.mjs` + `with-app-env.test.mjs` | Чтение `.grok/app-env.json`, merge env |
| `check-auth-invariant.mjs` + `.test.mjs` | Согласованность `VITE_AUTH_ENABLED` и auth-кода |
| `migration-plan.mjs` + `.test.mjs` | Какие SQL-миграции попадают в build |

### Ключевые инварианты CI

#### 1. PWA & Open Graph Meta Injection (`grok-pwa-shared.mjs`)

При динамической трансформации HTML-потока (SSR / PWA-инжектор) соблюдается строго определённый приоритет для заголовка страницы (`og:title` / `<title>`):

1. `src/lib/og/site.json` → `site.title` (у «Двое» это кастомное имя)
2. Заголовок страницы (`<title>` из HTML-документа)
3. Имя приложения из хоста (`appNameFromHost`)
4. Дефолтное имя (`DEFAULT_APP_NAME`)

**Архитектурный нюанс:** `createHeadInjector` **не** фиксирует `appName` на этапе инициализации контекста. Заголовок извлекается непосредственно из входящего HTML-потока (`titleFromDocument`). Так предотвращается подмена заголовков динамических страниц дефолтным именем приложения.

Тесты PWA дополнительно изолируют `cwd` и передают `site: {}`, чтобы не подхватывать `site.json` текущего репозитория и не ломать инварианты шаблона на кастомных проектах.

#### 2. Конфигурация среды и авторизация (`app-env`)

- Основной конфигурационный файл окружения: `.grok/app-env.json` (флаги вроде `VITE_AUTH_ENABLED`, `deploy.database`).
- Схема Better Auth хранится в `migrations/auth/`. При `VITE_AUTH_ENABLED=true` соответствующая миграция должна присутствовать и на верхнем уровне `migrations/` (ожидание template-тестов / migration-plan).
- `check-auth-invariant` сверяет флаг в `app-env` с наличием auth-кода и миграций — рассинхрон роняет CI.
- Guest Mode (`src/lib/guest.ts`, `?demo=true` / `?guest=true`) держит демо-snapshot только в `sessionStorage` / локальном Zustand и **не** пишет в `/api/state`, чтобы не смешивать демо-данные с боевой парой.

Если меняете branding (`site.json`), auth-флаг или структуру миграций — прогоните `npm test` до пуша: suite как раз ловит типичные рассинхроны шаблона и кастомизации.

---

## Лицензия

[MIT](./LICENSE)
