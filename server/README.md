# Backend App San Juan Grande

## Despliegue en Render

El backend está configurado para ser desplegado automáticamente en Render. La configuración se encuentra en el archivo `render.yaml` en la raíz del proyecto.

### Variables de Entorno Requeridas

Configura las siguientes variables de entorno en el panel de control de Render:

- `NODE_ENV`: production
- `PORT`: 10000
- `DB_USER`: Usuario de la base de datos PostgreSQL
- `DB_HOST`: Host de la base de datos
- `DB_NAME`: Nombre de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_PORT`: 5432
- `JWT_SECRET`: Clave secreta para JWT
- `CLIENT_URL`: URL del frontend (https://san-juan-grande.onrender.com)

### Base de Datos

1. Crear una nueva base de datos PostgreSQL en Render
2. Conectar la base de datos con el servicio web
3. Ejecutar las migraciones automáticamente durante el despliegue

### Proceso de Despliegue

1. Conectar el repositorio con Render
2. Render detectará automáticamente la configuración en `render.yaml`
3. El servicio se desplegará automáticamente con cada push a la rama principal

### Comandos de Despliegue

```bash
# Instalación de dependencias
npm install

# Ejecución de migraciones
npm run db:migrate

# Inicio del servidor
npm start
```

### Monitoreo

El servidor utiliza Winston para el registro de logs, que se pueden visualizar en el panel de Render.