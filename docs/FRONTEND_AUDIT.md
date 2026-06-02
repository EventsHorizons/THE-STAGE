# Reporte — Auditoría Frontend (Fase 1)

## Tipos (`src/types/`)

| Cambio | Detalle |
|--------|---------|
| **Fuente única de dominio** | `models.ts` con enums alineados al backend (`UserRole`, `ConnectionAction`, `AvailabilityStatus`) |
| **Separación UI** | `artist-profile.ts` para `ArtistProfile` (pantallas) sin mezclar entidades ORM |
| **Eliminación de redundancia** | `CastingMatch`, `AuthStatus`, `Project` viven solo en `models.ts`; `index.ts` re-exporta |
| **Mappers** | `mappers.ts`: `feedCardToArtistProfile`, `profileDetailToArtistProfile`, `mockArtistToFeedCard` |
| **DTOs API** | `ProfileFeedCard`, `ProfileDetail`, `SwipeRequest/Response` |

## Store (`src/store/`)

| Cambio | Detalle |
|--------|---------|
| **Store duplicado eliminado** | `store/index.ts` ya no redefine un segundo `create()`; exporta solo `useStageStore` |
| **`subscribeWithSelector`** | Suscripciones granulares |
| **`applySwipe`** | Una acción atómica: optimista en feed + `POST /discover/swipe/` |
| **Selectores** | `useDiscoverFeedState()` con `useShallow` para evitar re-renders del árbol completo |
| **Auth wiring** | `configureApiAuth` enlaza JWT del store con interceptores Axios |

## Servicios (`src/services/`)

| Cambio | Detalle |
|--------|---------|
| **Base URL** | `EXPO_PUBLIC_API_URL` → `http://127.0.0.1:8000/api/v1` |
| **Refresh JWT** | Cola de peticiones en 401 + `token/refresh/` |
| **Normalización** | `normalize.ts` convierte snake_case Django → camelCase TS |
| **Endpoints** | `fetchDiscoverFeed`, `postDiscoverSwipe`, `fetchProfileDetail`, `login`, `register`, `verifyOtp` |

## Componentes / hooks

| Archivo | Mejora |
|---------|--------|
| `MultimediaCarousel.tsx` | `expo-image`, lazy por viewport (±1 slide), `removeClippedSubviews`, cleanup de caché |
| `useMediaCleanup.ts` | Teardown al desmontar; `useAudioSession` en perfil Bento |
| `ArtistProfileScreen.tsx` | Play/pause con cleanup al salir |
| `SpotlightFeedScreen.tsx` | Usa `useDiscoverFeedState`; swipe ya no llama `dismiss` duplicado |
| `useCasting.ts` | Envía `artist.uuid` (user PK) al backend |

## Estilos

No se modificaron tokens de color, tipografía Outfit ni layouts Figma de las pantallas existentes.
