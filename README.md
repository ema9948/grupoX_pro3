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

La base de datos, tablas, stored procedures y datos de prueba se crean automáticamente al levantar el servidor por primera vez.

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

# 📡 Endpoints

## 🔓 Auth — Endpoints públicos

| Método | Ruta                 | Descripción    |
| ------ | -------------------- | -------------- |
| POST   | `/api/v1/auth/login` | Iniciar sesión |

## 🔒 Auth — Endpoints protegidos (requieren JWT)

| Método | Ruta                | Descripción          |
| ------ | ------------------- | -------------------- |
| PUT    | `/api/v1/auth/foto` | Subir foto de perfil |

---

## 🏥 Especialidades

| Método | Ruta                         | Descripción  | Roles |
| ------ | ---------------------------- | ------------ | ----- |
| GET    | `/api/v1/especialidades`     | Listar todas | 2, 3  |
| GET    | `/api/v1/especialidades/:id` | Obtener una  | 2, 3  |
| POST   | `/api/v1/especialidades`     | Crear        | 3     |
| PUT    | `/api/v1/especialidades/:id` | Editar       | 3     |
| DELETE | `/api/v1/especialidades/:id` | Eliminar     | 3     |

---

## 🏦 Obras Sociales

| Método | Ruta                         | Descripción  | Roles |
| ------ | ---------------------------- | ------------ | ----- |
| GET    | `/api/v1/obras-sociales`     | Listar todas | 3     |
| GET    | `/api/v1/obras-sociales/:id` | Obtener una  | 3     |
| POST   | `/api/v1/obras-sociales`     | Crear        | 3     |
| PUT    | `/api/v1/obras-sociales/:id` | Editar       | 3     |
| DELETE | `/api/v1/obras-sociales/:id` | Eliminar     | 3     |

---

## 👨‍⚕️ Médicos

| Método | Ruta                  | Descripción  | Roles |
| ------ | --------------------- | ------------ | ----- |
| GET    | `/api/v1/medicos`     | Listar todos | 2, 3  |
| GET    | `/api/v1/medicos/:id` | Obtener uno  | 2, 3  |
| POST   | `/api/v1/medicos`     | Crear        | 3     |
| PUT    | `/api/v1/medicos/:id` | Editar       | 3     |
| DELETE | `/api/v1/medicos/:id` | Eliminar     | 3     |

---

## 🧑‍🤝‍🧑 Pacientes

| Método | Ruta                    | Descripción  | Roles |
| ------ | ----------------------- | ------------ | ----- |
| GET    | `/api/v1/pacientes`     | Listar todos | 3     |
| GET    | `/api/v1/pacientes/:id` | Obtener uno  | 3     |
| POST   | `/api/v1/pacientes`     | Crear        | 3     |
| PUT    | `/api/v1/pacientes/:id` | Editar       | 3     |
| DELETE | `/api/v1/pacientes/:id` | Eliminar     | 3     |

---

## 📅 Turnos

| Método | Ruta                          | Descripción           | Roles   |
| ------ | ----------------------------- | --------------------- | ------- |
| POST   | `/api/v1/turnos`              | Crear turno           | 2, 3    |
| GET    | `/api/v1/turnos/mis-turnos`   | Ver turnos propios    | 1, 2, 3 |
| PUT    | `/api/v1/turnos/:id/atender`  | Marcar atendido       | 1       |
| GET    | `/api/v1/turnos/estadisticas` | Estadísticas en JSON  | 3       |
| GET    | `/api/v1/turnos/informe-pdf`  | Descargar informe PDF | 3       |
| DELETE | `/api/v1/turnos/:id/cancelar` | Cancelar turno        | 1, 2, 3 |

---

## 📖 Documentación Swagger

Con el servidor corriendo entrá a:

```text
http://localhost:3600/api-docs
```

---

## 🧪 Guía rápida de pruebas

Las pruebas fueron realizadas utilizando **Postman** y **Swagger**.

### 1. Login

Realizar login con alguno de los usuarios de prueba.

Endpoint:

```http
POST /api/v1/auth/login
```

Copiar el token JWT recibido y utilizarlo en los endpoints protegidos:

```http
Authorization: Bearer <token>
```

---

### 2. Pruebas como Paciente

#### Especialidades

```http
GET /api/v1/especialidades
```

#### Médicos

```http
GET /api/v1/medicos
```

#### Filtrar por especialidad

```http
GET /api/v1/medicos?id_especialidad=1
```

#### Crear turno

```http
POST /api/v1/turnos
```

```json
{
  "id_medico": 3,
  "fecha_hora": "2026-08-21T13:00:00"
}
```

#### Consultar turnos propios

```http
GET /api/v1/turnos/mis-turnos
```

#### Cancelar turno

```http
DELETE /api/v1/turnos/:id/cancelar
```

### Caso especial validado

Se verificó que cuando un médico no atiende la obra social del paciente:

- Se asigna automáticamente la obra social **PARTICULAR**.
- No se aplica descuento.
- El valor total coincide con el valor de consulta.

---

### 3. Pruebas como Médico

#### Ver turnos asignados

```http
GET /api/v1/turnos/mis-turnos
```

#### Marcar turno como atendido

```http
PUT /api/v1/turnos/:id/atender
```

---

### 4. Pruebas como Administrador

#### Especialidades

```http
GET /api/v1/especialidades
POST /api/v1/especialidades
PUT /api/v1/especialidades/:id
DELETE /api/v1/especialidades/:id
```

#### Obras Sociales

```http
GET /api/v1/obras-sociales
POST /api/v1/obras-sociales
PUT /api/v1/obras-sociales/:id
DELETE /api/v1/obras-sociales/:id
```

#### Asociación Médico - Obra Social

```http
POST /api/v1/medicos/:id/obras-sociales
DELETE /api/v1/medicos/:id/obras-sociales/:id_obra_social
```

#### Pacientes

```http
GET /api/v1/pacientes
```

#### Estadísticas

```http
GET /api/v1/turnos/estadisticas
```

#### Informe PDF

```http
GET /api/v1/turnos/informe-pdf
```

---

### 5. Carga de foto de perfil

Endpoint:

```http
PUT /api/v1/auth/foto
```

Requisitos:

- JWT válido.
- multipart/form-data.
- Campo de archivo: `foto`.

Resultado esperado:

- La imagen se almacena correctamente.
- Se actualiza la ruta de la foto del usuario.

---

## ❓ Problemas comunes

### Error: `ER_ACCESS_DENIED_ERROR`

Usuario o contraseña de MySQL incorrectos en el `.env`.

### Error: `ECONNREFUSED`

MySQL no está corriendo.

### Error: `Cannot find module`

No corriste:

```bash
npm install
```

### Error: `401 Unauthorized`

El token expiró (dura 8 horas). Realizar login nuevamente.
