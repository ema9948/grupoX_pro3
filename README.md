# 🏥 API Clínica de Turnos - Programación III

Backend de una API REST para la gestión de turnos médicos.  
Proyecto desarrollado para **Programación III (UNER - 2026)**.
Primer entrega..
---

## 📦 Tecnologías usadas

- Node.js + Express
- MySQL
- JWT (Autenticación)
- express-validator
- Morgan + CORS

---

## 📁 Estructura del proyecto

```
src/
 ├── config/        # Conexión a DB + init automático
 ├── controllers/   # Lógica de negocio
 ├── models/        # Acceso a datos
 ├── routes/        # Endpoints
 ├── middlewares/   # Auth + validaciones
database/
 └── init.sql       # Script base
```

---

## 🚀 Funcionalidades actuales

- 🔐 Login con JWT
- 👥 Sistema de roles (Admin, Médico, Paciente)
- 🏥 CRUD Especialidades
- 💳 CRUD Obras Sociales
- ♻️ Soft Delete (activo = 0)
- ✅ Validaciones con middleware
- ⚡ Inicialización automática de base de datos

---

## ⚙️ Instalación

```bash
git clone https://github.com/ema9948/grupoX_pro3.git
cd grupoX_pro3
npm install
```

Crear `.env`:

```
PORT=3600
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=prog3_turnos
JWT_SECRET=tu_secreto
```

Ejecutar:

```bash
npm run dev
```

---

## 🔑 Autenticación

Endpoint:
```
POST /api/auth/login
```

Devuelve un token JWT necesario para acceder al resto de endpoints.

---

## 📌 Endpoints principales

### Especialidades
- GET `/api/especialidades`
- GET `/api/especialidades/:id`
- POST `/api/especialidades`
- PUT `/api/especialidades/:id`
- DELETE `/api/especialidades/:id`

### Obras Sociales
- GET `/api/obras-sociales`
- GET `/api/obras-sociales/:id`
- POST `/api/obras-sociales`
- PUT `/api/obras-sociales/:id`
- DELETE `/api/obras-sociales/:id`

---

## 🧪 Base de datos

El proyecto incluye:
- Script SQL inicial (`database/init.sql`)
- Inicialización automática al levantar el servidor

---

## 👨‍💻 Integrantes

- Marco Cippitelli  
- Sofia Mohr  
- José Maria Monzon Eberle  
- Néstor Picasso  
- Gabriel Alejandro Riveiro  
- Cristian Albornoz  

---

## 🚧 Próximos pasos

- CRUD Médicos
- CRUD Pacientes
- Gestión de Turnos
- Exportación PDF
- Stored Procedures
- Documentación Swagger

---

## 💬 Notas

- Todas las rutas (excepto login) requieren JWT
- Se utiliza arquitectura en capas (routes → controllers → models)
- Soft delete aplicado en entidades principales

---

