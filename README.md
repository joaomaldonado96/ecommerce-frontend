# eCommerce Frontend

Este proyecto es el frontend de un eCommerce desarrollado con Next.js 15. Implementa Server Components y Client Components, junto con autenticación y conexión a un backend en Spring Boot.

## 🚀 Características
- Next.js 15 con Server Components y Client Components.
- Autenticación de usuarios.
- Gestión de productos y usuarios (solo admin).
- Carrito de compras con descuento especial.
- CI/CD con GitHub Actions.
- Contenerización con Docker.
- Uso de Zustand para la gestión de estado global.
- Generación de reportes en PDF con jsPDF y jsPDF-AutoTable.
- Soporte para archivos Excel con xlsx.
- Estilos con Tailwind CSS.

## 📌 Requisitos previos
Asegúrate de tener instalado lo siguiente:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## 📂 Estructura del Proyecto
```
/src
  ├── app
  │   ├── cart/page.tsx  # Página del carrito de compras
  │   ├── page1
  │   ├── page2
  │   ├── page3
  │   ├── page4
  ├── components
  │   ├── component1.tsx
  │   ├── component2.tsx
  ├── lib
  │   ├── api.ts  # Peticiones al backend
```

## 📦 Dependencias principales
- `@heroicons/react` → Iconos para la interfaz.
- `@tailwindcss/forms` → Extensión de Tailwind CSS para formularios.
- `axios` → Cliente HTTP para consumir APIs.
- `jspdf` y `jspdf-autotable` → Generación de reportes en PDF.
- `next` → Framework principal.
- `react` y `react-dom` → Librerías base para la UI.
- `xlsx` → Manejo de archivos Excel.
- `zustand` → Gestión de estado global.

## 🔧 Dependencias de desarrollo
- `@testing-library/react`, `@testing-library/jest-dom`, `jest`, `jest-environment-jsdom` → Testing.
- `eslint`, `eslint-config-next` → Linter para asegurar calidad del código.
- `prettier` → Formateador de código.
- `tailwindcss`, `postcss`, `autoprefixer` → Estilización.
- `typescript`, `ts-node`, `@types/react`, `@types/node` → Tipado estático con TypeScript.

## 🛠 Instalación y Ejecución
Clona el repositorio y ejecuta los siguientes comandos:
```bash
# Instalar dependencias
npm install

# Ejecutar el entorno de desarrollo
npm run dev
```
Por defecto, la aplicación estará disponible en `http://localhost:3000`.

## ⚙️ Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y configura las siguientes variables:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_AUTH_SECRET=tu_secreto
```

## 📜 Comandos Útiles
```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Construir la aplicación
npm run start    # Ejecutar la aplicación en producción
npm run lint     # Ejecutar ESLint
npm run format   # Ejecutar Prettier para formatear el código
npm run test     # Ejecutar pruebas unitarias con Jest
npm run test:watch  # Ejecutar pruebas en modo watch
```

## 📝 Análisis estático de código
Para asegurar la calidad del código, este proyecto utiliza **ESLint** y **Prettier**.

### **Linting**
Para revisar y corregir problemas de estilo y errores en el código:
```bash
npm run lint
```

## 📜 Documentación de la API
El backend proporciona documentación interactiva con **Swagger**. Para acceder a ella, consulta:

```
http://localhost:8080/swagger-ui/
```

## 🚀 Despliegue
El proyecto está configurado para CI/CD con GitHub Actions. Para desplegar manualmente:
```bash
docker build -t ecommerce-frontend .
docker run -p 3000:3000 ecommerce-frontend
```

## 📄 Licencia
Este proyecto está bajo la licencia MIT.

