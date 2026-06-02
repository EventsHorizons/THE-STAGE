# Manual Técnico de Configuración y Arquitectura Frontend
## Ecosistema de Reclutamiento de Alto Rendimiento "The Stage"
### Cumplimiento ISO/IEC 27001 & ISO/IEC 27002 — Nivel Corporativo

---

## 1. Arquitectura Técnica y Directorios

El frontend de **The Stage** está estructurado sobre **React Native** y **TypeScript Estricto** (`strict: true`), enfocado en la baja latencia de renderizado y seguridad criptográfica en tránsitos de datos.

```
/src
 ├── /components
 │    ├── BentoGridShowcase.tsx  # Componente modular Bento de perfil (Bajo Latencia)
 │    └── SpotlightFeed.tsx      # Descubrimiento de alto rendimiento (FlatList Snap)
 ├── /services
 │    └── api.ts                 # Integración de red segura con Axios & Sanitización
 ├── /theme
 │    └── index.ts               # Spacing Proporción Áurea & Claroscuro Chiaroscuro
 └── /types
      └── index.ts               # Interfaces estrictas y sanitización OWASP
```

---

## 2. Justificación de Patrones de Diseño

### A. Tipado Estricto de TypeScript (`strict: true`)
Para asegurar la integridad de los datos de contratos y biografías de los artistas, no se permite el uso del tipo `any`. Todos los contratos de datos de la API se parsean recursivamente y se validan en tiempo de compilación. Esto previene bugs de tipo *runtime* y restringe la inyección de payloads inesperados que vulneren la memoria local.

### B. Proporciones Áureas e Spacing de 8pt (Brutalismo Industrial)
El layout abandona métricas visuales corporativas redundantes. La jerarquía geométrica del diseño se rige matemáticamente por el número áureo ($\Phi \approx 1.618$) y cuadrantes de 8pt perfectos. Esto optimiza el cálculo del motor de layouts de React Native (Yoga Engine) reduciendo los tiempos de cálculo posicional del dispositivo a cero decimales flotantes, lo que optimiza significativamente la tasa de refresco (frames por segundo).

### C. Claroscuro y Bokeh Simulado
En lugar de trazar bordes vectoriales sólidos que saturan el renderizado de GPU, se aplican sombras de gran profundidad (Rembrandt Shadowing) y capas difusas translúcidas sobre fotografía digital de alto contraste (bokeh). Esto permite mantener resoluciones nativas sin ralentizar el scroll vertical del feed táctil.

---

## 3. Estándar de Seguridad y Cumplimiento ISO 27001/27002

El resguardo de la confidencialidad de la información biométrica y portafolios se garantiza mediante las siguientes directivas técnicas:

1.  **Cifrado de Tránsito (ISO 27001 - A.12.6.1):** TLS 1.3 forzado en toda la capa de servicio Axios.
2.  **Validación e Input Sanitization (ISO 27002 - 8.28):** El middleware de Axios intercepta todas las peticiones salientes y respuestas entrantes para mapear recursivamente estructuras JSON y desinfectar caracteres especiales (`<`, `>`, `&`, `'`, `"`, `/`) previniendo ataques de tipo inyección o XSS indirectos en render.
3.  **Almacenamiento de Tokens Seguros (ISO 27002 - 8.10):** En entornos reales, `SecureStorageProvider` debe enlazar directamente con `react-native-keychain` (iOS Keychain / Android Keystore) encriptando los tokens JWT con algoritmos AES-256-GCM respaldados por hardware criptográfico de hardware móvil (Secure Enclave).

---

## 4. Integración de Autenticación con Backend Django (SimpleJWT)

Para sincronizar de manera fluida y segura el frontend móvil con el ecosistema de microservicios Django de "The Stage", siga el siguiente protocolo técnico:

### Configuración del Intercambio de Tokens

El backend Django debe utilizar `djangorestframework-simplejwt` configurado con rotación automática de tokens para mitigar el secuestro de credenciales:

```python
# settings.py (Django API)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True, # Rotación estricta tras un solo uso
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'RS256', # Criptografía Asimétrica (Llave Privada firma, Llave Pública valida)
    'SIGNING_KEY': open(BASE_DIR / 'keys/jwt_private.pem').read(),
    'VERIFYING_KEY': open(BASE_DIR / 'keys/jwt_public.pem').read(),
}
```

### Protocolo de Sincronización en el Cliente Móvil (React Native)

1.  **Handshake de Inicio de Sesión (`/auth/token/`):** El cliente envía credenciales sanitizadas al API. Django responde con:
    ```json
    {
      "access": "eyJhbGciOiJSUzI1NiIsIn...",
      "refresh": "eyJhbGciOiJSUzI1NiIsIn..."
    }
    ```
2.  **Almacenamiento Seguro:** El dispositivo almacena el `access` token de forma temporal y el `refresh` token de forma altamente restrictiva en el almacenamiento seguro encriptado de hardware.
3.  **Renovación en Redirección (`/auth/token/refresh/`):** Al detectar un código de error de red `401 Unauthorized` por expiración de access token, el interceptor seguro en `src/services/api.ts` suspende las peticiones en cola, ejecuta la llamada de refresh y re-inyecta de forma transparente el nuevo token para completar las peticiones en curso sin interrumpir la experiencia de usuario.
