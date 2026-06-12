# 🏥 API Clínica de Turnos

Backend desarrollado para la materia **Programación III** (1er cuatrimestre 2026)  
Tecnicatura Universitaria en Desarrollo Web - UNER

---

## 👥 Integrantes

| Apellido      | Nombre            |
| ------------- | ----------------- |
| Albornoz      | Cristian          |
| Cippitelli    | Marco             |
| Mohr          | Sofia             |
| Monzon Eberle | José Maria        |
| Picasso       | Néstor            |
| Riveiro       | Gabriel Alejandro |

---

## 🛠️ Stack tecnológico

- **Node.js** + **Express** — servidor y API REST
- **MySQL** — base de datos relacional
- **JWT** — autenticación y autorización por roles
- **SHA2-256** — encriptación de contraseñas
- **express-validator** — validación de datos
- **Morgan** — registro de solicitudes HTTP
- **Multer** — carga de archivos (foto de perfil)
- **pdfkit** — generación de informes PDF
- **Swagger** — documentación de la API
- **dotenv** — variables de entorno
- **ES Modules** — módulos modernos de JavaScript

---

## ✅ Requisitos previos

- Node.js v18 o superior
- MySQL (XAMPP, Laragon, Workbench, Docker, etc.)

---

## 🚀 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd clinica-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editá el `.env` con tus datos de MySQL:

```env
PORT=3600
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=prog3_turnos
JWT_SECRET=una_clave_secreta_larga
```

### 4. Iniciar el servidor

```bash
npm run dev
```

La base de datos, tablas, stored procedures y datos de prueba se crean **automáticamente** al levantar el servidor por primera vez.

---

## 🔑 Usuarios de prueba

| Email             | Password | Rol           |
| ----------------- | -------- | ------------- |
| admin@clinica.com | admin123 | Administrador |
| lopmar@correo.com | lopmar   | Médico        |
| benhor@correo.com | benhor   | Médico        |
| lopjac@correo.com | lopjac   | Paciente      |
| hunlor@correo.com | hunlor   | Paciente      |

> La contraseña de cada usuario es la parte antes del `@` de su email.

---

## 📋 Roles del sistema

| Rol           | Valor | Permisos                                             |
| ------------- | ----- | ---------------------------------------------------- |
| Médico        | 1     | Login, ver y atender sus turnos                      |
| Paciente      | 2     | Login, reservar turnos, ver especialidades y médicos |
| Administrador | 3     | Acceso completo al sistema                           |

---

## 📡 Endpoints

### 🔓 Auth — Público

| Método | Ruta                 | Descripción          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/v1/auth/login` | Iniciar sesión       |
| PUT    | `/api/v1/auth/foto`  | Subir foto de perfil |

### 🏥 Especialidades

| Método | Ruta                         | Descripción  | Roles |
| ------ | ---------------------------- | ------------ | ----- |
| GET    | `/api/v1/especialidades`     | Listar todas | 2, 3  |
| GET    | `/api/v1/especialidades/:id` | Obtener una  | 2, 3  |
| POST   | `/api/v1/especialidades`     | Crear        | 3     |
| PUT    | `/api/v1/especialidades/:id` | Editar       | 3     |
| DELETE | `/api/v1/especialidades/:id` | Eliminar     | 3     |

### 🏦 Obras Sociales

| Método | Ruta                         | Descripción  | Roles |
| ------ | ---------------------------- | ------------ | ----- |
| GET    | `/api/v1/obras-sociales`     | Listar todas | 3     |
| GET    | `/api/v1/obras-sociales/:id` | Obtener una  | 3     |
| POST   | `/api/v1/obras-sociales`     | Crear        | 3     |
| PUT    | `/api/v1/obras-sociales/:id` | Editar       | 3     |
| DELETE | `/api/v1/obras-sociales/:id` | Eliminar     | 3     |

### 👨‍⚕️ Médicos

| Método | Ruta                  | Descripción  | Roles |
| ------ | --------------------- | ------------ | ----- |
| GET    | `/api/v1/medicos`     | Listar todos | 2, 3  |
| GET    | `/api/v1/medicos/:id` | Obtener uno  | 2, 3  |
| POST   | `/api/v1/medicos`     | Crear        | 3     |
| PUT    | `/api/v1/medicos/:id` | Editar       | 3     |
| DELETE | `/api/v1/medicos/:id` | Eliminar     | 3     |

### 🧑‍🤝‍🧑 Pacientes

| Método | Ruta                    | Descripción  | Roles |
| ------ | ----------------------- | ------------ | ----- |
| GET    | `/api/v1/pacientes`     | Listar todos | 3     |
| GET    | `/api/v1/pacientes/:id` | Obtener uno  | 3     |
| POST   | `/api/v1/pacientes`     | Crear        | 3     |
| PUT    | `/api/v1/pacientes/:id` | Editar       | 3     |
| DELETE | `/api/v1/pacientes/:id` | Eliminar     | 3     |

### 📅 Turnos

| Método | Ruta                          | Descripción           | Roles   |
| ------ | ----------------------------- | --------------------- | ------- |
| POST   | `/api/v1/turnos`              | Crear turno           | 2, 3    |
| GET    | `/api/v1/turnos/mis-turnos`   | Ver turnos propios    | 1, 2, 3 |
| PUT    | `/api/v1/turnos/:id/atender`  | Marcar atendido       | 1       |
| GET    | `/api/v1/turnos/informe-pdf`  | Generar PDF           | 3       |
| GET    | `/api/v1/turnos/estadisticas` | Estadísticas en JSON  | 3       |
| GET    | `/api/v1/turnos/informe-pdf`  | Descargar informe PDF | 3       |
| DELETE | `/api/v1/turnos/:id/cancelar` | Cancelar turno        | 1,2,3   |

---

## 📖 Documentación Swagger

Con el servidor corriendo entrá a:

```
http://localhost:3600/api-docs
```

---

## ❓ Problemas comunes

**Error: `ER_ACCESS_DENIED_ERROR`**
→ Usuario o contraseña de MySQL incorrectos en el `.env`

**Error: `ECONNREFUSED`**
→ MySQL no está corriendo

**Error: `Cannot find module`**
→ No corriste `npm install`

**Token `401 Unauthorized`**
→ El token expiró (dura 8 horas), hacé login de nuevo
