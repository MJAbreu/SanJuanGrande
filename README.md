# App San Juan Grande

Aplicación de gestión integral para residencia de ancianos y centro de día, que facilita el control de asistencia, gestión de menús y comunicación entre personal y familiares.

## Características Principales

- Control de asistencia de residentes y usuarios
- Gestión de pedidos de menús
- Comunicación en tiempo real entre personal y familiares
- Panel de control para diferentes tipos de usuarios
- Sistema de notificaciones automáticas

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd app-san-juan-grande
```

2. Instalar dependencias del servidor:
```bash
npm install
```

3. Instalar dependencias del cliente:
```bash
cd client
npm install
```

4. Configurar variables de entorno:
- Copiar el archivo `.env.example` a `.env`
- Actualizar las variables con los valores correspondientes

## Ejecución

### Desarrollo

Iniciar servidor y cliente en modo desarrollo:
```bash
npm run dev
```

O iniciar por separado:

Servidor:
```bash
npm run server
```

Cliente:
```bash
npm run client
```

### Producción

Construir el cliente:
```bash
cd client
npm run build
```

Iniciar el servidor:
```bash
npm start
```

## Estructura del Proyecto

```
├── client/             # Frontend React
├── server/             # Backend Node.js
│   ├── routes/         # Rutas de la API
│   └── index.js        # Punto de entrada del servidor
├── .env                # Variables de entorno
└── package.json        # Dependencias y scripts
```

## Módulos

### 1. Control de Asistencia
- Registro de entrada/salida
- Seguimiento de actividades
- Notificaciones automáticas

### 2. Gestión de Menús
- Selección de menús personalizados
- Registro de preferencias y alergias
- Sistema de pedidos

### 3. Comunicación
- Chat en tiempo real
- Sistema de notificaciones
- Gestión de mensajes

### 4. Panel de Control
- Gestión de usuarios
- Reportes y estadísticas
- Configuración del sistema

## Seguridad

- Autenticación mediante JWT
- Roles y permisos diferenciados
- Cifrado de datos sensibles
- Cumplimiento de LOPD

## Soporte

Para soporte técnico o consultas, contactar a:
[Información de contacto]

## Licencia

[Tipo de licencia]