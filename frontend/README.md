# Frontend

## Установка и запуск

### 1. Настройка окружения

Переименуйте файл `.env.example` в `.env`:

```bash
cp .env.example .env
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск проекта

#### Локальный запуск

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

#### Запуск через туннель (ngrok)

Для тестирования в Telegram WebApp необходимо использовать ngrok туннель:

1. **Получите токен ngrok**
   - Зарегистрируйтесь на [ngrok.com](https://ngrok.com)
   - Получите authtoken в [личном кабинете](https://dashboard.ngrok.com/get-started/your-authtoken)

2. **Добавьте токен в `.env`**
   ```
   VITE_GROK_TOKEN=ваш_токен_ngrok
   ```

3. **Настройте прокси (обязательно)**
   
   ⚠️ **Важно**: ngrok работает только через прокси. Настройте прокси в терминале:
   
   ```bash
   export http_proxy=http://your-proxy:port
   export https_proxy=http://your-proxy:port
   ```

4. **Запустите с туннелем**
   ```bash
   npm run dev:tunnel
   ```

Скрипт автоматически запустит Vite dev server и создаст публичный URL через ngrok.

## Скрипты

- `npm run dev` - запуск локального dev-сервера
- `npm run dev:tunnel` - запуск с ngrok туннелем
- `npm run build` - сборка для продакшена
- `npm run preview` - предпросмотр production сборки
- `npm run lint` - проверка кода линтером
- `npm run lint:fix` - автоматическое исправление ошибок линтера 
