# Despliegue en Render

Esta guía detalla el proceso de despliegue de la aplicación App San Juan Grande en Render.

## Configuración de la Base de Datos PostgreSQL

1. En el Dashboard de Render, seleccionar "New PostgreSQL":
   - Nombre: `san-juan-grande-db`
   - Base de datos: `san_juan_grande`
   - Usuario: Generar automáticamente
   - Región: Frankfurt (EU Central)

2. Guardar las credenciales proporcionadas:
   - Internal Database URL
   - External Database URL
   - PSQL Command

## Configuración del Servicio Web

1. En el Dashboard, seleccionar "New Web Service":
   - Conectar con el repositorio de GitHub
   - Nombre: `san-juan-grande-app`
   - Región: Frankfurt (EU Central)
   - Branch: `main`
   - Root Directory: `./`
   - Runtime: `Node`
   - Build Command: `npm install && cd client && npm install && npm run build && cd ..`
   - Start Command: `cd server && npm start`

2. Configurar Variables de Entorno:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=[Internal Database URL de PostgreSQL]
   JWT_SECRET=[Tu secreto JWT]
   ```

## Despliegue Automático

1. El despliegue se activará automáticamente con cada push a la rama main
2. Render ejecutará:
   - Instalación de dependencias
   - Build del cliente
   - Migraciones de base de datos
   - Inicio del servidor

## Monitoreo y Solución de Problemas

### Logs y Monitoreo
- Acceder a los logs desde el dashboard del servicio
- Monitorear métricas de CPU y memoria
- Configurar alertas de disponibilidad

### Problemas Comunes

1. Error de Conexión a Base de Datos:
   - Verificar DATABASE_URL
   - Comprobar reglas de firewall
   - Validar migraciones pendientes

2. Error en Build:
   - Revisar logs de build
   - Verificar dependencias en package.json
   - Comprobar compatibilidad de versiones

3. Error en Runtime:
   - Verificar variables de entorno
   - Revisar logs de aplicación
   - Comprobar puerto configurado

## Mantenimiento

1. Actualizaciones:
   - Realizar en horarios de bajo tráfico
   - Probar en ambiente de staging
   - Mantener respaldos de base de datos

2. Backups:
   - Configurar backups automáticos de PostgreSQL
   - Almacenar en región EU para GDPR
   - Retención mínima de 7 días

## Seguridad

1. SSL/TLS:
   - Certificados gestionados automáticamente
   - Forzar HTTPS en producción

2. Acceso:
   - Usar secretos seguros
   - Rotar credenciales periódicamente
   - Limitar acceso IP cuando sea posible

## Soporte

Para asistencia técnica:
- Consultar documentación de Render
- Contactar al equipo de desarrollo
- Abrir ticket de soporte si es necesario