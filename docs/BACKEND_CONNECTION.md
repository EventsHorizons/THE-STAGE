# Guía de conexión Frontend ↔ Django

## 1. Variables de entorno (Expo)

Copia en la raíz del app móvil:

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

En dispositivo físico usa la IP LAN de tu PC, por ejemplo `http://192.168.1.10:8000/api/v1`.

## 2. Arrancar el backend

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

## 3. Login y token en la app

```typescript
import { login } from './src/services/api';
import { useStageStore } from './src/store';

const tokens = await login('scout@thestage.dev', 'your-password');
useStageStore.getState().setTokens(tokens);
useStageStore.getState().setAuth({
  isAuthenticated: true,
  token: tokens.access,
  refreshToken: tokens.refresh,
  userRole: 'scout',
  userId: '1',
});
```

Los interceptores de `api.ts` ya leen el token vía `configureApiAuth` (configurado dentro de `useStageStore`).

## 4. Flujos enlazados

| Acción móvil | Método Axios | Endpoint Django |
|--------------|--------------|-----------------|
| Cargar Discover | `fetchDiscoverFeed()` | `GET /discover/feed/` |
| Swipe derecha | `postDiscoverSwipe(userId, 'like')` | `POST /discover/swipe/` |
| Swipe izquierda | `postDiscoverSwipe(userId, 'pass')` | idem |
| Swipe arriba | `postDiscoverSwipe(userId, 'bookmark')` | idem |
| Ver Bento | `fetchProfileDetail(profileId)` | `GET /profiles/:id/` |
| Registro | `register({ email, password, role })` | `POST /auth/register/` |
| OTP | `verifyOtp(email, code)` | `POST /auth/otp/verify/` |

## 5. IDs importantes

- **Feed card `id`** → PK del `Profile` (para abrir detalle).
- **Feed card `userId`** → PK del `CustomUser` (para swipe / Connection).
- El hook `useCasting` envía `artist.uuid` (= `userId` del backend).

## 6. CORS

En `backend/.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:8081,http://127.0.0.1:8081
```

Añade el origen de Expo Web si corres `npm run web`.

## 7. Sin backend (mock)

Si el servidor no responde, `fetchDiscoverFeed` hace fallback automático a `MOCK_TALENTS` para no bloquear la UI.
