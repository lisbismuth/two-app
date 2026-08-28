# Двое

> Минималистичное PWA-приложение для пары: общие задачи, календарь, вишлисты, скидочные карты, учёт трат 50/50 и личная статистика.

<p align="center">
  <a href="https://two-lissy1.vercel.app/?demo=true" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/%E2%9C%A8_Try_Demo-Live_Preview-222222?style=for-the-badge&labelColor=111111" alt="Try Live Demo">
  </a>
</p>

> 💡 **Демо-режим (Guest Mode):** нажмите кнопку выше или откройте приложение с параметром `?demo=true` (или `?guest=true`), чтобы покрутить интерфейс с заготовленными данными пары Ани и Игоря — задачи, траты, хотелки, голосование. Только просмотр, без записи на сервер.

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-18181b?style=flat-square&labelColor=f4f4f5" alt="License">
  <img src="https://img.shields.io/badge/React-19-18181b?style=flat-square&labelColor=f4f4f5" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.7-18181b?style=flat-square&labelColor=f4f4f5" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8-18181b?style=flat-square&labelColor=f4f4f5" alt="Vite">
</p>

Альтернатива громоздким сервисам учёта: простые 50/50 траты, совместные списки и визуальные карточки для пары — без подписок, рекламы и лишних аккаунтов.

Данные моментально синхронизируются через сервер и Postgres — не нужно находиться в приложении одновременно.

**Лицензия:** [MIT](./LICENSE)

---

## Интерфейс

<p align="center">
  <img src="./screenshots/qa-tasks.png" width="30%" alt="Дела" />
  <img src="./screenshots/qa-wishes.png" width="30%" alt="Хотелки" />
  <img src="./screenshots/qa-us.png" width="30%" alt="Мы" />
</p>

<p align="center">
  <img src="./screenshots/qa-calendar.png" width="30%" alt="Календарь" />
  <img src="./screenshots/qa-docs.png" width="30%" alt="Документы" />
  <img src="./screenshots/qa-vote.png" width="30%" alt="Голосования" />
</p>

---

## Возможности

| Раздел | Что внутри |
|--------|------------|
| **Дела** | Задачи с фильтрами (все / общие / по партнёру / готово), повторяющиеся задачи, календарь с событиями и сроками |
| **Хотелки** | Общий вишлист с ссылками, ценами и авто-подтягиванием метаданных URL |
| **Траты** | Трекер трат 50/50, категории, погашение долгов и наглядный баланс «кто кому должен» |
| **Карты** | Скидочные карты (генерация штрихкодов/QR на устройстве, сканер) и хранилище документов (PDF) |
| **Мы** | Планы, капсулы времени, голосования и «мы»-статистика (дни вместе, расходы по категориям) |

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

Приложение: [http://localhost:8080](http://localhost:8080)  
Демо сразу: [http://localhost:8080/?demo=true](http://localhost:8080/?demo=true)

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
```

---

## Безопасность

- **Fail-Closed Auth:** регистрация и доступ разрешены только для двух указанных в `.env` адресов.
- **Client-Side Heavy:** штрихкоды и сканер обрабатываются только на устройстве (ZXing / JsBarcode / QRCode), без отправки на сторонние API.
- **Private Data:** проект рассчитан на приватное использование одной парой (одна JSON-запись в БД, не multi-tenant SaaS).
- Голосования скрывают чужой выбор в UI до завершения; на сервере данные хранятся в общем документе (доверие между партнёрами).
- **Guest / demo:** локальный snapshot, без записи в `/api/state`.

---

## Лицензия

[MIT](./LICENSE)
