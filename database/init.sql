-- --------------------------------------------------------
-- Base de datos
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS prog3_turnos;
USE prog3_turnos;

-- --------------------------------------------------------
-- Tablas
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `documento` VARCHAR(20) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `contrasenia` VARCHAR(255) NOT NULL,
  `foto_path` VARCHAR(255) DEFAULT '',
  `rol` TINYINT(3) UNSIGNED NOT NULL,
  `activo` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `especialidades` (
  `id_especialidad` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `activo` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_especialidad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `obras_sociales` (
  `id_obra_social` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL DEFAULT '',
  `porcentaje_descuento` DECIMAL(9,2) NOT NULL DEFAULT 0,
  `es_particular` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  `activo` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_obra_social`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `medicos` (
  `id_medico` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` INT(10) UNSIGNED NOT NULL,
  `id_especialidad` INT(10) UNSIGNED NOT NULL,
  `matricula` INT(10) UNSIGNED NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `valor_consulta` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_medico`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `fk_medicos_especialidades` (`id_especialidad`),
  KEY `fk_medicos_usuarios` (`id_usuario`),
  CONSTRAINT `fk_medicos_especialidades` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_medicos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pacientes` (
  `id_paciente` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` INT(10) UNSIGNED NOT NULL,
  `id_obra_social` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_paciente`),
  KEY `fk_pacientes_obras_sociales` (`id_obra_social`),
  KEY `fk_pacientes_usuarios` (`id_usuario`),
  CONSTRAINT `fk_pacientes_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  CONSTRAINT `fk_pacientes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `medicos_obras_sociales` (
  `id_medico_obra_social` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_medico` INT(10) UNSIGNED NOT NULL,
  `id_obra_social` INT(10) UNSIGNED NOT NULL,
  `activo` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_medico_obra_social`),
  KEY `fk_mos_medico` (`id_medico`),
  KEY `fk_mos_obra_social` (`id_obra_social`),
  CONSTRAINT `fk_mos_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_mos_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `turnos_reservas` (
  `id_turno_reserva` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_medico` INT(10) UNSIGNED NOT NULL,
  `id_paciente` INT(10) UNSIGNED NOT NULL,
  `id_obra_social` INT(10) UNSIGNED NOT NULL,
  `fecha_hora` DATETIME NOT NULL,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `atendido` TINYINT(3) UNSIGNED NOT NULL DEFAULT 0,
  `activo` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_turno_reserva`),
  KEY `fk_turnos_reservas_pacientes` (`id_paciente`),
  KEY `fk_turnos_reservas_medicos` (`id_medico`),
  KEY `fk_turnos_reservas_obras_sociales` (`id_obra_social`),
  CONSTRAINT `fk_turnos_reservas_medicos` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_turnos_reservas_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_turnos_reservas_pacientes` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Vistas
-- --------------------------------------------------------

CREATE OR REPLACE VIEW `v_medicos` AS
SELECT
  m.id_medico,
  m.id_usuario,
  u.apellido,
  u.nombres,
  u.email,
  u.foto_path,
  m.matricula,
  m.descripcion,
  m.valor_consulta,
  e.id_especialidad,
  e.nombre AS especialidad
FROM medicos m
JOIN usuarios u ON m.id_usuario = u.id_usuario
JOIN especialidades e ON m.id_especialidad = e.id_especialidad
WHERE u.activo = 1;

CREATE OR REPLACE VIEW `v_pacientes` AS
SELECT
  p.id_paciente,
  p.id_usuario,
  u.apellido,
  u.nombres,
  u.email,
  u.foto_path,
  os.id_obra_social,
  os.nombre AS nombre_obra_social,
  os.descripcion AS descripcion_obra_social
FROM pacientes p
JOIN usuarios u ON p.id_usuario = u.id_usuario
JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
WHERE u.activo = 1;

-- --------------------------------------------------------
-- Datos de prueba
-- --------------------------------------------------------

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `activo`) VALUES
(1, 'PEDIATRÍA', 1),
(2, 'CLÍNICA', 1),
(3, 'TRAUMATOLOGÍA', 1),
(4, 'INFECTOLOGÍA', 1),
(9, 'NEUROLOGÍA', 1);

INSERT INTO `obras_sociales` (`id_obra_social`, `nombre`, `descripcion`, `porcentaje_descuento`, `es_particular`, `activo`) VALUES
(1, 'Jerárquicos', 'jer', 0.10, 0, 1),
(2, 'OSUNER', 'osu', 0.10, 0, 1),
(3, 'OSECAC', 'ose', 0.11, 0, 1),
(4, 'OSUNER 3', 'OSU', 0.13, 0, 1),
(5, 'PARTICULAR', 'Sin cobertura', 0.00, 1, 1);

-- Contraseñas hasheadas con SHA2-256.
-- La contraseña de cada usuario es la parte antes del '@' de su email.
INSERT INTO `usuarios` (`id_usuario`, `documento`, `apellido`, `nombres`, `email`, `contrasenia`, `foto_path`, `rol`, `activo`) VALUES
(1, '31000111', 'Lopez', 'Marcelo', 'lopmar@correo.com', SHA2('lopmar', 256), '', 1, 1),
(2, '31000112', 'Diaz', 'Juan', 'diajua@correo.com', SHA2('diajua', 256), '', 1, 1),
(3, '31000113', 'Benitez', 'Horacio', 'benhor@correo.com', SHA2('benhor', 256), '', 1, 1),
(4, '31000114', 'Perez', 'Luis', 'perlui@correo.com', SHA2('perlui', 256), '', 1, 1),
(5, '41000111', 'Lopez', 'Jacinto', 'lopjac@correo.com', SHA2('lopjac', 256), '', 2, 1),
(6, '41000112', 'Hunk', 'Lorena', 'hunlor@correo.com', SHA2('hunlor', 256), '', 2, 1),
(7, '41000113', 'Aguirre', 'Brian', 'agubri@correo.com', SHA2('agubri', 256), '', 2, 1),
(8, '51000111', 'Fernandez', 'Benito', 'ferben@correo.com', SHA2('ferben', 256), '', 3, 1),
(10, '51000112', 'Gomez', 'Silvia', 'gomsil@correo.com', SHA2('gomsil', 256), '', 3, 1),
(11, '00000000', 'Admin', 'Sistema', 'admin@clinica.com', SHA2('admin123', 256), '', 3, 1);

INSERT INTO `medicos` (`id_medico`, `id_usuario`, `id_especialidad`, `matricula`, `descripcion`, `valor_consulta`) VALUES
(1, 1, 1, 1000, 'test', 5000.00),
(2, 2, 1, 2000, 'test', 5000.00),
(3, 3, 3, 3000, 'test', 10000.00),
(4, 4, 4, 4000, 'test', 15000.00);

INSERT INTO `pacientes` (`id_paciente`, `id_usuario`, `id_obra_social`) VALUES
(1, 5, 1),
(2, 6, 2),
(3, 7, 3);

INSERT INTO `medicos_obras_sociales` (`id_medico_obra_social`, `id_medico`, `id_obra_social`, `activo`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 2, 1),
(4, 4, 3, 1);

INSERT INTO `turnos_reservas` (`id_turno_reserva`, `id_medico`, `id_paciente`, `id_obra_social`, `fecha_hora`, `valor_total`, `atendido`, `activo`) VALUES
(1, 1, 1, 1, '2026-04-01 17:00:00', 4500.00, 0, 1),
(2, 3, 2, 2, '2026-04-01 18:00:00', 9000.00, 0, 1),
(4, 4, 3, 3, '2026-04-01 19:00:00', 13350.00, 0, 1),
(5, 3, 2, 2, '2026-04-14 18:00:00', 9000.00, 0, 1),
(6, 3, 2, 2, '2026-04-21 18:00:00', 9000.00, 0, 1),
(7, 4, 3, 3, '2026-05-07 16:00:00', 13050.00, 0, 1);