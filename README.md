# App San Juan Grande

Aplicación de gestión integral para residencia de ancianos y centro de día, que facilita el control de asistencia, gestión de menús y comunicación entre personal y familiares.

## Características Principales

- Control de asistencia de residentes y usuarios
- Gestión de pedidos de menús
- Comunicación en tiempo real entre personal y familiares
- Panel de control para diferentes tipos de usuarios
- Sistema de notificaciones automáticas

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn
- Git

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/MJAbreu/SanJuanGrande.git
cd SanJuanGrande
```

2. Instalar dependencias del servidor:
```bash
cd server
npm install
```

3. Instalar dependencias del cliente:
```bash
cd ../client
npm install
```

4. Configurar variables de entorno:
- Copiar el archivo `.env.example` a `.env` en la carpeta server
- Actualizar las variables con los valores correspondientes:
  ```
  NODE_ENV=development
  PORT=3000
  DATABASE_URL=[URL de tu base de datos PostgreSQL]
  JWT_SECRET=[Tu secreto JWT]
  CLIENT_URL=http://localhost:5173
  ```

5. Configurar la base de datos:
```bash
cd ../server
npm run migrate
npm run seed
```

## Ejecución

### Desarrollo

1. Iniciar el servidor (desde la carpeta server):
```bash
npm run dev
```

2. Iniciar el cliente (desde la carpeta client):
```bash
npm run dev
```

### Producción

1. Construir el cliente:
```bash
cd client
npm run build
```

2. Iniciar el servidor en modo producción:
```bash
cd ../server
NODE_ENV=production npm start
```

## Estructura del Proyecto

```
├── client/             # Frontend React + Vite
│   ├── src/            # Código fuente del cliente
│   │   ├── components/ # Componentes React
│   │   ├── context/    # Contextos de React
│   │   ├── styles/     # Estilos CSS
│   │   └── assets/     # Recursos estáticos
│   └── public/         # Archivos públicos
├── server/             # Backend Node.js
│   ├── config/         # Configuración
│   ├── models/         # Modelos de datos
│   ├── routes/         # Rutas de la API
│   ├── middleware/     # Middleware personalizado
│   ├── migrations/     # Migraciones de base de datos
│   └── seeders/        # Datos iniciales
├── RENDER.md          # Guía de despliegue
└── render.yaml        # Configuración de despliegue
```

## Módulos

### 1. Control de Asistencia
- Registro de entrada/salida
- Seguimiento de actividades
- Notificaciones automáticas
- Reportes de asistencia

### 2. Gestión de Menús
- Selección de menús personalizados
- Registro de preferencias y alergias
- Sistema de pedidos
- Planificación semanal

### 3. Comunicación
- Chat en tiempo real con Socket.IO
- Notificaciones push
- Historial de mensajes
- Sistema de notificaciones
- Gestión de mensajes grupales

### 4. Panel de Control
- Gestión de usuarios y roles
- Reportes y estadísticas
- Configuración del sistema
- Monitoreo en tiempo real

## Seguridad

- Autenticación mediante JWT
- Roles y permisos diferenciados
- Cifrado de datos sensibles
- Cumplimiento de LOPD
- Rate limiting para prevención de ataques
- Validación de datos en frontend y backend

## Despliegue

La aplicación está configurada para despliegue automático en Render. Para más detalles sobre el proceso de despliegue y solución de problemas comunes, consulta el archivo `RENDER.md`.

## Soporte

Para soporte técnico o consultas:
- Email: support@sanjuangrande.com
- Documentación: [Wiki del proyecto](https://github.com/MJAbreu/SanJuanGrande/wiki)
- Issues: [GitHub Issues](https://github.com/MJAbreu/SanJuanGrande/issues)

## Licencia

Copyright © 2023 San Juan Grande. Todos los derechos reservados.