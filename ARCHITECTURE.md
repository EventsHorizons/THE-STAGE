# The Stage — Estructura del Proyecto

## Resumen
Esta app usa React Native + Expo con TypeScript para un descubrimiento de talento tipo Tinder/spotlight. El diseño actual ya implementa:
- Feed de artistas en `src/screens/SpotlightFeedScreen.tsx`
- Dashboard de búsqueda en `src/screens/ScoutDashboardScreen.tsx`
- Perfil de artista en `src/screens/ArtistProfileScreen.tsx`
- Navegación personalizada minimalista en `src/navigation/AppNavigator.tsx`

## Estructura principal del proyecto

- `App.tsx`
  - Punto de entrada de la app.
  - Carga de fuentes y estado de navegación global.

- `src/navigation/`
  - `AppNavigator.tsx` — barra inferior y enrutamiento de pantalla.
  - `types.ts` — tipos de navegación typed, parámetros de tabs y stack.

- `src/screens/`
  - `SpotlightFeedScreen.tsx` — discovery feed con acciones de match.
  - `ScoutDashboardScreen.tsx` — buscador y filtros de talento.
  - `ArtistProfileScreen.tsx` — perfil de artista con métricas y CTA.
  - `CreateScreen.tsx` — placeholder para creación de proyectos.
  - `MessagesScreen.tsx` — placeholder para la bandeja de mensajes.

- `src/components/`
  - Contiene componentes reutilizables visuales como `BentoCard`, `PrimaryButton`, `SpotlightFeed`.

- `src/hooks/`
  - Lógica de negocio encapsulada en hooks:
    - `useCasting.ts`
    - `useTalentSearch.ts`

- `src/services/`
  - `api.ts` — capa de servicio para futuras peticiones reales.
  - `mockData.ts` — datos de talento usados por la demo.

- `src/store/`
  - `useStageStore.ts` — estado global de talento y feed.
  - `index.ts` — exportación centralizada de stores.

- `src/theme/`
  - `constants.ts` — colores, espaciados y tokens comunes.
  - `index.ts` — exportaciones de tema.

- `src/types/`
  - `index.ts` — tipos principal de la app.
  - `models.ts` — modelos estrictos de dominio.

## Arquitectura de navegación tipada

### Tipos de navegación generados
- `RootTabParamList`
  - `Discover`
  - `Explore`
  - `Create`
  - `Messages`
  - `Profile`

- `RootStackParamList`
  - `MainTabs`
  - `TalentDetail` — `{ profileId: string; fromTab?: RootTabScreenName }`
  - `GroupChat` — `{ groupId: string }`
  - `Settings`
  - `Notifications`

### Utility types y metadata
- `RootTabScreenName`
- `RootStackScreenName`
- `TalentSwipeAction`
- `GestureDirection`
- `SwipePayload`
- `ScrollableTabMeta`
- `ROOT_TAB_CONFIG`

## Flujo recomendado de ampliación

1. Migrar `AppNavigator.tsx` a un navigator basado en React Navigation.
2. Mapear las rutas de `ROOT_TAB_CONFIG` a screens reales.
3. Añadir placeholder screens para `Create` y `Messages`.
4. Reemplazar `currentScreen` y `navigateTo` con `navigation.navigate(...)` typed.
5. Conectar `TalentDetail` y `GroupChat` dentro del stack global.

## Notas sobre el estado actual

- El código ya compila con `npx tsc -p . --noEmit`.
- La app actual ya ha sido ampliada a cinco tabs: `Discover`, `Explore`, `Create`, `Messages`, `Profile`.
- `CreateScreen.tsx` y `MessagesScreen.tsx` están implementados como placeholders funcionales.
- La nueva tipología de navegación permite escalar a stack screens adicionales (`TalentDetail`, `GroupChat`, `Settings`, `Notifications`) sin romper la base actual.
