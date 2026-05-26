# Análisis del Sistema: Proyecto Instituto El Saber

Este documento presenta un análisis exhaustivo de la arquitectura, estructura, librerías y buenas prácticas implementadas en el sistema, abarcando tanto el Backend como el Frontend. Su propósito es servir de guía para mantener la consistencia y la calidad en el desarrollo de futuras funcionalidades.

---

## 1. Arquitectura General
El proyecto sigue una arquitectura **Cliente-Servidor** separada, donde el frontend es una Single Page Application (SPA) y el backend expone una API RESTful.
- **Frontend**: SPA construida con React y Vite.
- **Backend**: API RESTful construida con Spring Boot (Java).
- **Base de Datos**: Relacional (PostgreSQL).

---

## 2. Backend (`backend-DevOps`)

### Tecnologías y Librerías Principales
- **Lenguaje y Framework**: Java 21 con Spring Boot 4.0.5.
- **Persistencia**: Spring Data JPA interactuando con **PostgreSQL**.
- **Migraciones de BD**: **Flyway** (`flyway-database-postgresql`) para el versionado de esquemas y migraciones controladas de la base de datos.
- **Seguridad**: Spring Security con **JWT** (`jjwt-api`, `jjwt-impl`, `jjwt-jackson` v0.12.6) para autenticación sin estado (stateless).
- **Documentación de API**: **Springdoc OpenAPI** (Swagger UI) para documentar y probar los endpoints (anotaciones `@Tag`, `@Operation`, `@ApiResponses`).
- **Validaciones**: `spring-boot-starter-validation` (Jakarta Validation) para validar los payloads de entrada.
- **Utilidades**: **Lombok** para reducir el código repetitivo (getters, setters, constructores) y **Spring Boot Mail** para envío de correos electrónicos (ej. recuperación de contraseñas).

### Estructura y Buenas Prácticas (Package-by-Feature)
El backend utiliza una arquitectura modular orientada a funcionalidades (**Package-by-Feature**). En `src/main/java/com/devops/backend` encontramos dominios bien separados: `auth`, `usuario`, `rol`, `evento`, `sesion`, `acceso`, `funcionalidad`, etc.

Dentro de cada módulo de funcionalidad (ej. `auth`), se respeta la arquitectura de capas estándar de Spring:
- `controller/`: Controladores REST. Manejan las peticiones HTTP, delegan la lógica al servicio y retornan los DTOs adecuados.
- `service/`: Contiene toda la lógica de negocio.
- `repository/`: Interfaces de Spring Data JPA para la abstracción del acceso a datos.
- `entity/`: Entidades JPA que mapean las tablas de la base de datos.
- `dto/`: Objetos de Transferencia de Datos. Se utilizan para separar el modelo de dominio de lo que se expone o recibe en la API (ej. `SignUpRequest`, `LoginRequest`).

**Buenas Prácticas observadas en el Backend**:
1. **Uso de DTOs**: Nunca se exponen las entidades de la base de datos directamente al cliente.
2. **Validación a nivel de controlador**: Uso de `@Valid` en los métodos del controlador para validar los requests antes de procesarlos.
3. **Manejo de Excepciones**: Respuestas tipadas con mensajes claros (ej. devolviendo un Map o clases como `PasswordResetResponse`).
4. **Documentación OpenAPI**: Los controladores están fuertemente documentados con descripciones detalladas de los endpoints y los posibles códigos de respuesta HTTP (`200`, `400`, `401`, `404`, `500`).
5. **Seguridad Robusta**: Manejo de tokens en el header `Authorization`, gestión de listas negras para logout, encriptación de contraseñas y mecanismos de bloqueo de cuenta ante múltiples intentos fallidos.

---

## 3. Frontend (`frontend-DevOps`)

### Tecnologías y Librerías Principales
- **Core**: React 19.2.4 con TypeScript 6.0.2.
- **Bundler**: Vite 8.0.7 para un entorno de desarrollo rápido y construcción optimizada.
- **Estilos y UI**: **Tailwind CSS 4.2.2** para utilidades CSS, combinado con componentes de **Shadcn UI** (como se evidencia en `components.json` y la dependencia `class-variance-authority`, `clsx`, `tailwind-merge`). Iconografía gestionada con `lucide-react`.
- **Enrutamiento**: **React Router DOM 7.14.0**.
- **Gestión de Estado**: 
  - Estado Global/Cliente: **Zustand 5.0.12** (ligero y escalable).
  - Estado del Servidor/Caché: **React Query** (`@tanstack/react-query`) para fetching, caching, sincronización y actualización del estado asíncrono.
- **Formularios y Validación**: **React Hook Form 7.72.1** integrado con **Zod 4.3.6** (`@hookform/resolvers`) para validaciones estrictas y tipadas de esquemas de datos.
- **Peticiones HTTP**: **Axios 1.14.0** configurado con interceptores.

### Estructura y Buenas Prácticas (Feature-Sliced Design)
El frontend sigue un enfoque altamente modular, similar al **Feature-Sliced Design** o la arquitectura propuesta por "Bulletproof React". La lógica no está agrupada por tipo de archivo globalmente, sino por **funcionalidad**.

En `src/` encontramos:
- `features/`: El núcleo de la aplicación. Contiene subcarpetas por dominio (`auth`, `dashboard`, `users`, `eventos`, etc.).
  - Dentro de cada *feature* (ej. `auth`), el código está co-localizado:
    - `api/`: Definiciones de endpoints e integraciones con React Query.
    - `components/`: Componentes UI específicos de esta funcionalidad.
    - `hooks/`: Custom hooks relacionados a la lógica de negocio del feature.
    - `pages/`: Vistas de página principales de la funcionalidad.
    - `services/`: Lógica para las llamadas a la API (usando Axios).
    - `types/`: Interfaces y tipos de TypeScript para el feature.
    - `validations/`: Esquemas de Zod para validar formularios.
- `app/`: Configuraciones de nivel raíz (Providers, enrutador global, store global de Zustand).
- `components/`: Componentes UI genéricos y reutilizables (ej. los de Shadcn UI).
- `lib/`: Configuraciones de librerías externas (ej. `axios.ts`, configuración de React Query).
- `pages/`: Páginas globales o genéricas (Error 404, Unauthorized, ServerError).
- `assets/`: Recursos estáticos y estilos globales (`index.css`).

**Buenas Prácticas observadas en el Frontend**:
1. **Interceptores de Axios**: Se centraliza la inyección del token JWT en un interceptor (`src/lib/axios.ts`). El token se extrae del storage persistido por Zustand.
2. **Co-locación por Feature**: Hace que la aplicación sea altamente escalable. Si eliminas un feature, eliminas su carpeta sin dejar código huérfano.
3. **Validación Tipada (Zod + RHF)**: Al unificar Zod con React Hook Form, se asegura de que los datos enviados al backend siempre cumplan con el contrato esperado, mejorando drásticamente la Developer Experience (DX) gracias al tipado estricto.
4. **Proxy de Desarrollo**: Vite está configurado (`vite.config.ts`) para redirigir las peticiones `/api` a `http://localhost:3020`, solucionando de manera limpia problemas de CORS durante el desarrollo.

---

## 4. Guía para Futuros Desarrollos

Para mantener este estándar, cuando se solicite desarrollar una nueva funcionalidad o modificar una existente, se deberán seguir las siguientes pautas:

### Si el trabajo es en el Backend:
- Crear el nuevo paquete dentro de `com.devops.backend.nombre_feature`.
- Implementar las capas en el siguiente orden sugerido: `Entity` -> `Repository` -> `DTOs` -> `Service` -> `Controller`.
- **Nunca** devolver entidades completas en los controladores; siempre mapearlas a DTOs.
- Añadir validaciones con `@Valid` y anotaciones de Jakarta en los DTOs.
- Documentar los endpoints usando `@Operation` y `@ApiResponses`.
- Si se alteran tablas, utilizar un nuevo script de migración de **Flyway** (no hacer cambios manuales ni confiar en `hibernate.ddl-auto=update`).

### Si el trabajo es en el Frontend:
- Crear una nueva carpeta en `src/features/nombre_feature` con sus subdirectorios (`api`, `components`, `pages`, `types`, etc.).
- Utilizar **React Query** para cualquier consumo de la API, encapsulando las llamadas dentro de custom hooks en `features/nombre_feature/api/`.
- Construir formularios usando **React Hook Form** y definiendo la validación de sus campos con esquemas de **Zod** en la carpeta `validations/`.
- Mantener los componentes presentacionales desacoplados de la lógica de negocio; utilizar custom hooks para inyectar estado y callbacks.
- Para el estilo, seguir la línea de **Tailwind CSS** y usar/extender los componentes de **Shadcn UI** en `src/components/ui/` cuando se requieran elementos básicos como botones, inputs, diálogos, etc.
