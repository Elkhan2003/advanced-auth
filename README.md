# Supabase Auth System 🚀

Полноценная система авторизации с современным стеком технологий: Express.js + Next.js + Supabase + Prisma.

## 📋 Обзор проекта

Это full-stack приложение для управления задачами (Todo List) с продвинутой системой авторизации. Проект состоит из двух частей:

- **Backend (express-auth)** - API сервер на Express.js с Supabase Auth
- **Frontend (todo-list)** - Next.js приложение с красивым UI

## 🎯 Ключевые возможности

### 🔐 Авторизация

- ✅ Регистрация и вход через email/password
- ✅ JWT токены с автоматическим refresh
- ✅ Защищенные маршруты
- ✅ Глобальное состояние авторизации
- ✅ Автоматический выход при истечении сессии

### 📝 Управление задачами

- ✅ CRUD операции с задачами
- ✅ Привязка задач к пользователю
- ✅ Real-time обновления через React Query

### 🎨 Современный UI

- ✅ Темно-фиолетовая тема
- ✅ Стеклянные эффекты (glassmorphism)
- ✅ Плавные анимации и transitions
- ✅ Адаптивный дизайн

## 📁 Структура проекта

```
supabase-auth/
├── express-auth/          # Backend API сервер
│   ├── src/
│   │   ├── middleware/    # Auth middleware
│   │   ├── modules/       # API модули
│   │   ├── plugins/       # Prisma, Supabase clients
│   │   └── routes/        # Маршруты API
│   ├── prisma/           # База данных схемы
│   └── README.md         # Backend документация
└── todo-list/            # Frontend приложение
    ├── src/
    │   ├── app/          # Next.js App Router
    │   ├── components/   # React компоненты
    │   ├── api/         # API интеграция
    │   └── stores/      # Zustand state management
    └── README.md        # Frontend документация
```

## 🛠 Технологический стек

### Backend

- **Node.js + Express.js** - веб-сервер
- **TypeScript** - типизация
- **Supabase Auth** - аутентификация
- **Prisma ORM** - работа с БД
- **PostgreSQL** - база данных

### Frontend

- **Next.js 15** - React фреймворк
- **TypeScript** - типизация
- **Zustand** - state management
- **React Query** - серверное состояние
- **SCSS** - стилизация
- **Axios** - HTTP запросы

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd supabase-auth
```

### 2. Настройка Backend

```bash
cd express-auth
npm install
cp .env.example .env
# Настроить переменные окружения
npx prisma migrate dev
npm run dev
```

### 3. Настройка Frontend

```bash
cd ../todo-list
npm install
cp .env.example .env.local
# Настроить NEXT_PUBLIC_API
npm run dev
```

### 4. Открыть приложение

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Как работает авторизация

### 1. Поток регистрации

```
User Registration Form
    ↓
Next.js Frontend (Zustand)
    ↓
Express.js API (/user/sign-up)
    ↓
Supabase Auth (создание пользователя)
    ↓
Prisma (сохранение профиля)
    ↓
JWT Tokens → Frontend Store
```

### 2. Поток аутентификации

```
Every API Request
    ↓
Axios Interceptor (добавляет Bearer token)
    ↓
Express.js Middleware (проверка токена)
    ↓
Supabase Auth (валидация)
    ↓
Request.user = Supabase User Object
```

### 3. Автоматический Refresh Token

```
API Request → 401 Error
    ↓
Axios Interceptor перехватывает
    ↓
POST /user/refresh-token
    ↓
Supabase обновляет токены
    ↓
Zustand Store обновляется
    ↓
Оригинальный запрос повторяется
```

## 📡 API Endpoints

### Аутентификация

```
POST /api/v1/user/sign-up        # Регистрация
POST /api/v1/user/sign-in        # Вход
POST /api/v1/user/refresh-token  # Обновление токена
POST /api/v1/user/sign-out       # Выход
GET  /api/v1/user/me            # Профиль пользователя
```

### Задачи (Todo)

```
GET    /api/v1/todo-prisma/get-all     # Все задачи
POST   /api/v1/todo-prisma/create      # Создать задачу
GET    /api/v1/todo-prisma/get/:id     # Задача по ID
PATCH  /api/v1/todo-prisma/update/:id  # Обновить задачу
DELETE /api/v1/todo-prisma/delete      # Удалить задачу
```

## 🎨 Дизайн система

### Цветовая палитра

- **Primary**: #8b5cf6 (фиолетовый)
- **Secondary**: #a855f7 (светло-фиолетовый)
- **Background**: rgba(15, 23, 42, 0.95) (темно-синий)
- **Card**: rgba(30, 41, 59, 0.6) (полупрозрачный)

### Эффекты

- **Glassmorphism** - стеклянные поверхности
- **Backdrop-filter** - размытие фона
- **Gradients** - плавные переходы цветов
- **Smooth animations** - плавные анимации

## 🔧 Продвинутые возможности

### Zustand Persist

Автоматическое сохранение состояния авторизации в localStorage:

```typescript
const useAuthStore = create(
	persist(
		(set, get) => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			// ...
		}),
		{ name: "auth_store" }
	)
);
```

### React Query с оптимизацией

Кэширование и синхронизация серверного состояния:

```typescript
const { data: todosData } = useGetTodosQuery({
	enabled: isAuthenticated(),
	staleTime: 5 * 60 * 1000, // 5 минут
});
```

### Типизированные API

Полная типизация всех API запросов и ответов:

```typescript
namespace USER {
	type SignInReq = {
		email: string;
		password: string;
	};

	type SignInRes = {
		success: boolean;
		data: {
			user: ISupabaseUser;
			session: ISession;
			localUser: IUser;
		};
	};
}
```

## 🛡 Безопасность

- ✅ JWT токены с коротким временем жизни
- ✅ Refresh токены для продления сессии
- ✅ Middleware защита всех приватных маршрутов
- ✅ Валидация данных на frontend и backend
- ✅ CORS настройки
- ✅ Безопасное хранение токенов

## 📚 Документация

Детальная документация доступна в каждом модуле:

- 📖 [Backend API Documentation](./express-auth/README.md)
- 📖 [Frontend Documentation](./todo-list/README.md)

## 🎓 Для начинающих

### Как изучить проект:

1. **Начните с Backend README** - поймите API структуру
2. **Изучите Frontend README** - разберите React компоненты
3. **Посмотрите код auth middleware** - как работает защита
4. **Изучите Zustand store** - как управляется состояние
5. **Разберите API интеграцию** - как фронт общается с бэком

### Ключевые концепции:

- **JWT токены** - что это и как работают
- **Middleware** - промежуточные функции в Express
- **State management** - управление состоянием в React
- **API interceptors** - перехват HTTP запросов
- **React Query** - кэширование серверных данных

## 🤝 Вклад в разработку

1. Fork репозитория
2. Создайте feature branch
3. Сделайте изменения
4. Добавьте тесты (если необходимо)
5. Создайте Pull Request

## 📄 Лицензия

MIT License - используйте свободно для обучения и коммерческих проектов.

---

**Автор**: ElchoDev  
**Версия**: 1.0.0  
**Последнее обновление**: 2024

Создано с ❤️ для изучения современной веб-разработки
