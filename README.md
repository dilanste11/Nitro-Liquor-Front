# 🥃 Nitro Liquor — Frontend

Aplicación web integral desarrollada en **Angular 19** para la administración y venta en línea de una licorera. Combina una **tienda e-commerce (Frontoffice)** orientada a clientes con un **panel administrativo y Punto de Venta (Backoffice / POS)** para la operación diaria del negocio, conectada a una API REST en **.NET / C#**.

---

## ✨ Funcionalidades Principales

### 🛒 Zona Pública (E-commerce)
* **Catálogo de Productos:** Visualización de licores con precios en pesos colombianos (COP), control de disponibilidad y estado de agotado.
* **Carrito de Compras Persistente:** Almacenamiento en `localStorage` para conservar los productos al recargar la página, con control de stock máximo.
* **Proceso de Checkout:** Selección de direcciones guardadas o ingreso de una nueva dirección, cálculo dinámico de costos de envío, formas de pago públicas activas y pantalla de confirmación con número de orden.
* **Autenticación y Registro:** Inicio de sesión y creación de cuenta con validaciones reactivas en tiempo real.

### 👤 Perfil de Cliente
* **Mis Pedidos:** Historial de compras realizadas con seguimiento de estado (*Pendiente, Empacando, Enviado, Entregado*).
* **Libreta de Direcciones:** Creación, visualización y eliminación de direcciones de entrega.
* **Configuración de Perfil:** Actualización de información personal del usuario autenticado.

### 🏪 Operación y Punto de Venta (`ADMIN` y `Trabajador`)
* **Dashboard Analítico:** Indicadores clave de ventas mensuales, producto estrella, botella más valiosa, alertas de stock bajo y gráfico de ingresos de los últimos 7 días con **ApexCharts**.
* **Punto de Venta (POS):** Interfaz rápida de mostrador con buscador de productos por nombre o referencia, control de cantidades, cálculo de total y selección de forma de pago.
* **Auditoría de Inventario:** Cuadre de stock físico vs. stock en sistema con registro de ajustes y observaciones.
* **Ingreso de Mercancía:** Registro de compras y reposiciones a proveedores con actualización automática de inventario.

### ⚙️ Administración del Sistema (Solo `ADMIN`)
* **Gestión de Pedidos E-commerce:** Visualización detallada de órdenes y cambio de estados en tiempo real.
* **Historial de Movimientos:** Registro inmutable de ventas, compras y auditorías con detalle financiero.
* **Módulos CRUD:** Administración completa de Productos (con carga de imágenes mediante `FormData`), Categorías, Proveedores, Impuestos, Formas de Pago, Métodos de Envío, Roles y Usuarios.

---

## 🛠️ Stack Tecnológico

* **Framework:** Angular 19.2 (*Standalone Components*, nueva sintaxis de control de flujo `@if`/`@for`/`@switch` y *Lazy Loading*).
* **Lenguaje:** TypeScript 5.7
* **Estilos:** Tailwind CSS 3.4 & SCSS
* **Visualización de Datos:** ApexCharts
* **Programación Reactiva:** RxJS 7.8
* **Seguridad y UX:**
  * Autenticación basada en **JWT** con verificación de expiración.
  * Protección de rutas mediante `authGuard` y `roleGuard`.
  * `jwtInterceptor` para adjuntar automáticamente el token `Bearer`.
  * `apiInterceptor` para manejo global de spinner de carga, notificaciones *toast* y cierre de sesión automático ante respuestas `401`.

---

## 📂 Estructura del Proyecto

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/         # authGuard y roleGuard
│   │   ├── interceptors/   # jwtInterceptor y apiInterceptor
│   │   └── services/       # Comunicación HTTP, Auth, Cart y UI global
│   ├── features/
│   │   ├── admin/          # Dashboard, POS, inventario, pedidos y CRUDs
│   │   ├── auth/           # Login y Registro
│   │   ├── ecommerce/      # Home, Carrito y Confirmación de compra
│   │   └── profile/        # Direcciones e historial de pedidos del cliente
│   ├── models/             # Interfaces y DTOs tipados
│   └── shared/
│       ├── components/     # GlobalUiComponent (spinner y toasts)
│       └── layouts/        # PublicLayout y AdminLayout
└── environments/           # Configuración de URL de la API
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
* **Node.js** v18 o superior
* **Angular CLI** v19 (`npm install -g @angular/cli`)
* Backend de **Nitro Liquor** (.NET / C#) en ejecución

### Pasos para ejecutar en local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/dilanste11/Nitro-Liquor-Front.git
   cd Nitro-Liquor-Front
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configurar la URL del Backend:**
   Verifica que la propiedad `apiUrl` en `src/environments/environment.development.ts` (y `environment.ts` para producción) apunte al puerto donde corre tu API en C#:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7123/api'
   };
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```
   Abre tu navegador en `http://localhost:4200/`.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Inicia el servidor de desarrollo (`ng serve`). |
| `npm run build` | Compila el proyecto para producción en la carpeta `dist/`. |
| `npm run watch` | Compila en modo desarrollo observando cambios. |
| `npm test` | Ejecuta las pruebas unitarias con Karma y Jasmine. |

---

> ⚠️ *El exceso de alcohol es perjudicial para la salud. Prohíbese el expendio de bebidas embriagantes a menores de edad.*