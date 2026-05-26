# DevOps Frontend

Aplicación frontend moderna, escalable y mantenible construida con React, Vite, Tailwind CSS y Shadcn UI, diseñada siguiendo estrictos principios de arquitectura y diseño UI/UX para entorno SaaS.

## 🚀 Funcionalidad

El sistema proporciona la interfaz de usuario para la plataforma DevOps, centrada en ofrecer una experiencia fluida, robusta y con tiempos de respuesta óptimos. Sus principales características incluyen:
- Autenticación segura y control de acceso basado en roles.
- Consumo eficiente de APIs REST con clientes HTTP interceptados.
- Estado del servidor administrado eficientemente (fetching, mutations y caching).
- Formularios interactivos con validación estricta (esquemas).
- Interfaz modular con herramientas de feedback consistentes (modales, loaders, empty states).
- Diseño completamente responsivo (mobile-first), minimalista y unificado.

## 🛠 Tecnologías y Stack

- **Core & Build:** React (Vite) en JavaScript moderno (ES6+).
- **Estilos:** Tailwind CSS.
- **Componentes UI:** Shadcn UI.
- **Enrutamiento:** React Router DOM.
- **Cliente HTTP:** Axios.
- **Estado Asíncrono / Caching:** TanStack Query (React Query).
- **Manejo de Formularios:** React Hook Form.
- **Validación de Datos:** Zod.
- **Estado Global:** Zustand.

## 📂 Estructura del Sistema

La arquitectura está implementada bajo un enfoque orientado a "features" o dominios técnicos, lo que fomenta drásticamente la mantenibilidad de la aplicación a medida que escala:

```text
src/
├── app/               # Configuración central de la app (Proveedores, Router, Store Global)
├── assets/            # Archivos estáticos transversales y estilos CSS globales
├── components/        # UI Kit y bloques de la aplicación global
│   ├── common/        # Elementos atómicos de UI (Botones, Inputs)
│   ├── feedback/      # Sistemas interactivos de estado (Alertas, Spinners, Errores)
│   └── layout/        # Estructura de vistas (Navbars, Footers, Contenedores)
├── config/            # Variables de entorno y utilidades constantes de inicialización
├── features/          # Dominios aislados del negocio (Auth, Módulo Usuarios, Roles, Reportes)
│   └── [feature]/     # Componentes, vistas, lógica (hooks), api y estados correspondientes al subdominio
├── hooks/             # Custom hooks transversales (useDebounce, usePagination)
├── lib/               # Wrappers y configuración de bibliotecas externas (Axios, TanStack)
├── pages/             # Páginas genéricas (404 Not Found, 403 No Autorizado)
├── services/          # Utilidades para interactuar con hardware, localstorage, o tokens
├── utils/             # Funciones puras de ayuda general (formateo de fechas y divisas)
└── tests/             # Tests automatizados, configuraciones y mocks
```

## 🧠 Principios de Desarrollo

- **Separación de Responsabilidades:** Absoluta independencia entre el UI puro (vista) y la lógica de negocio (control y servicios).
- **Evitar la sobrecomplejidad:** Mantener el estado cerca de donde se lo requiere; si no es necesario algo global, no usarlo global.
- **Escalabilidad y Clean Code:** Código autodocumentable y una distribución que minimiza colisiones entre diferentes módulos de desarrollo.
