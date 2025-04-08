-- Esquema de la base de datos para App San Juan Grande

-- Tabla de Usuarios del Sistema
CREATE TABLE usuarios_sistema (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'trabajador', 'familiar', 'residente', 'usuario')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Residentes y Usuarios del Centro
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('residente', 'usuario')),
    fecha_nacimiento DATE NOT NULL,
    estado_asistencia VARCHAR(50) DEFAULT 'asiste',
    necesidades_especiales TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Relaciones Familiares
CREATE TABLE relaciones_familiares (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id),
    familiar_id INTEGER REFERENCES usuarios_sistema(id),
    tipo_relacion VARCHAR(50) NOT NULL,
    es_contacto_emergencia BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Registro de Asistencia
CREATE TABLE registro_asistencia (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id),
    fecha DATE NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('presente', 'ausente', 'justificado')),
    registrado_por INTEGER REFERENCES usuarios_sistema(id),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Menús
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('normal', 'diabetico', 'blando', 'sin_sal', 'vegetariano')),
    descripcion TEXT NOT NULL,
    created_by INTEGER REFERENCES usuarios_sistema(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Preferencias Alimenticias
CREATE TABLE preferencias_alimenticias (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id),
    tipo_menu VARCHAR(50) DEFAULT 'normal',
    alergias TEXT[],
    intolerancias TEXT[],
    notas TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Solicitudes de Cambio de Menú
CREATE TABLE solicitudes_menu (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES personas(id),
    fecha DATE NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    solicitado_por INTEGER REFERENCES usuarios_sistema(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Mensajes
CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    emisor_id INTEGER REFERENCES usuarios_sistema(id),
    receptor_id INTEGER REFERENCES usuarios_sistema(id),
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios_sistema(id),
    tipo VARCHAR(50) NOT NULL,
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);