import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));

const initDB = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
  });

  const [rows] = await connection.query(
    `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
    [process.env.DB_NAME],
  );

  if (rows.length === 0) {
    console.log("Base de datos no encontrada, creando...");

    // 1. Ejecutar el script SQL completo (tablas, vistas, datos)
    const sql = readFileSync(
      join(__dirname, "../../database/init.sql"),
      "utf8",
    );
    await connection.query(sql);
    console.log("✅ Estructura de base de datos y datos de prueba creados");

    // 2. Crear el Stored Procedure
    await connection.query(
      `DROP PROCEDURE IF EXISTS sp_estadisticas_atenciones`,
    );
    await connection.query(`
      CREATE PROCEDURE sp_estadisticas_atenciones()
      BEGIN
          SELECT
              COUNT(*) as total_turnos,
              SUM(atendido = 1) as turnos_atendidos,
              SUM(atendido = 0) as turnos_pendientes,
              COUNT(DISTINCT id_paciente) as total_pacientes_unicos,
              COUNT(DISTINCT id_medico) as total_medicos_que_atendieron,
              AVG(valor_total) as promedio_valor_turno,
              SUM(valor_total) as ingreso_total
          FROM turnos_reservas
          WHERE activo = 1;

          SELECT
              e.id_especialidad,
              e.nombre AS especialidad,
              COUNT(tr.id_turno_reserva) AS cantidad_turnos,
              COALESCE(SUM(tr.valor_total), 0) AS facturacion_total
          FROM especialidades e
          LEFT JOIN medicos m ON e.id_especialidad = m.id_especialidad
          LEFT JOIN turnos_reservas tr ON m.id_medico = tr.id_medico AND tr.activo = 1
          WHERE e.activo = 1
          GROUP BY e.id_especialidad, e.nombre
          ORDER BY cantidad_turnos DESC;
      END
    `);
    console.log("✅ Stored procedure creado");

    console.log("Base de datos creada correctamente");
    console.log(
      "Usuarios de prueba cargados. Password = parte antes del @ del email",
    );
  } else {
    console.log("Base de datos ya existe, continuando...");
  }
  console.log("Admin: | email:admin@clinica.com | password: admin123");
  await connection.end();
};

export default initDB;
