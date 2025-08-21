# Express-Auth Backend 🚀

Бэкенд приложение для авторизации с использованием Express.js, Supabase Auth и Prisma ORM.

## 📋 Содержание

- [Технологии](#технологии)
- [Установка](#установка)
- [Настройка](#настройка)
- [Архитектура](#архитектура)
- [API Endpoints](#api-endpoints)
- [Аутентификация](#аутентификация)
- [База данных](#база-данных)

## 🛠 Технологии

- **Node.js** - JavaScript runtime
- **Express.js** - веб-фреймворк
- **TypeScript** - типизированный JavaScript
- **Supabase Auth** - сервис аутентификации
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - база данных

## 📦 Установка

1. **Клонирование репозитория**

   ```bash
   cd express-auth
   ```

2. **Установка зависимостей**

   ```bash
   npm install
   # или
   bun install
   ```

3. **Настройка переменных окружения**
   ```bash
   cp .env.example .env
   ```

## ⚙️ Настройка

### Переменные окружения (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"

# Supabase
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Server
PORT=3001
```

### Миграции базы данных

```bash
# Генерация Prisma Client
npx prisma generate

# Применить миграции
npx prisma migrate dev
```

## 🏗 Архитектура

```
src/
├── app.ts                 # Настройка Express приложения
├── index.ts              # Точка входа
├── middleware/           # Middleware функции
│   └── auth.ts          # Middleware для авторизации
├── modules/             # Модули приложения
│   ├── user/           # Модуль пользователей
│   │   ├── user.controllers.ts
│   │   └── user.routes.ts
│   └── todo-prisma/    # Модуль задач
│       ├── todo-prisma.controllers.ts
│       └── todo-prisma.routes.ts
├── plugins/            # Плагины и конфигурация
│   ├── prisma.ts      # Prisma client
│   └── supabase.ts    # Supabase client
└── routes/            # Главные маршруты
    └── index.ts
```

## 🔐 Аутентификация

### Как работает авторизация

1. **Регистрация пользователя**
   - Создается аккаунт в Supabase Auth
   - Сохраняется профиль в локальной базе данных
   - Возвращается JWT токен

2. **Вход в систему**
   - Проверка credentials в Supabase
   - Получение JWT токена
   - Связка с локальным профилем

3. **Защищенные маршруты**
   - Проверка Bearer токена в заголовке
   - Валидация токена через Supabase
   - Добавление user объекта в request

### Auth Middleware

```typescript
// Автоматически добавляет user в request
declare global {
	namespace Express {
		interface Request {
			user?: User; // Supabase User объект
		}
	}
}

// Использование в контроллерах
const getMe = async (req: Request, res: Response) => {
	const userId = req.user?.id; // Доступ к Supabase User ID
	// ...
};
```

## 📡 API Endpoints

### Аутентификация

| Метод | Endpoint                     | Описание             | Защищен |
| ----- | ---------------------------- | -------------------- | ------- |
| POST  | `/api/v1/user/sign-up`       | Регистрация          | ❌      |
| POST  | `/api/v1/user/sign-in`       | Вход                 | ❌      |
| POST  | `/api/v1/user/refresh-token` | Обновление токена    | ❌      |
| POST  | `/api/v1/user/sign-out`      | Выход                | ✅      |
| GET   | `/api/v1/user/me`            | Профиль пользователя | ✅      |

### Задачи (Todo)

| Метод  | Endpoint                         | Описание                | Защищен |
| ------ | -------------------------------- | ----------------------- | ------- |
| GET    | `/api/v1/todo-prisma/get-all`    | Все задачи пользователя | ✅      |
| POST   | `/api/v1/todo-prisma/create`     | Создать задачу          | ✅      |
| GET    | `/api/v1/todo-prisma/get/:id`    | Задача по ID            | ✅      |
| PATCH  | `/api/v1/todo-prisma/update/:id` | Обновить задачу         | ✅      |
| DELETE | `/api/v1/todo-prisma/delete`     | Удалить задачу          | ✅      |

### Примеры запросов

**Регистрация**

```bash
curl -X POST http://localhost:3001/api/v1/user/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "age": 25
  }'
```

**Создание задачи**

```bash
curl -X POST http://localhost:3001/api/v1/todo-prisma/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Моя задача",
    "description": "Описание задачи"
  }'
```

## 🗄 База данных

### Модель User

```prisma
model User {
  id         Int    @id @default(autoincrement())
  email      String @unique
  fullName   String
  age        Int?
  supabaseId String @unique  // Связь с Supabase User
  todos      Todo[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Модель Todo

```prisma
model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🚀 Запуск

### Разработка

```bash
npm run dev
# или
bun run dev
```

### Продакшн

```bash
npm run build
npm start
```

## 🔧 Refresh Token Flow

1. **Клиент получает 401 ошибку**
2. **Автоматический запрос на `/refresh-token`** с refresh_token
3. **Supabase валидирует и обновляет токены**
4. **Повтор оригинального запроса** с новым токеном

## 🛡 Безопасность

- **JWT токены** для аутентификации
- **Middleware защита** для приватных маршрутов
- **Валидация данных** на уровне контроллеров
- **CORS настройки** для фронтенда
- **Хэширование паролей** через Supabase

## 📝 Логирование и ошибки

```typescript
// Стандартный формат ответа
{
  "success": boolean,
  "data": any,        // при успехе
  "message": string   // при ошибке
}
```

## 🤝 Вклад в разработку

1. Fork репозитория
2. Создайте feature branch
3. Сделайте изменения
4. Создайте Pull Request

---

**Автор**: ElchoDev  
**Лицензия**: MIT
