import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));

const initDB = async () => {
  // Conectamos SIN especificar la base de datos porque puede que no exista todavía
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
  });

  // Verificamos si la base de datos existe
  const [rows] = await connection.query(
    `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
    [process.env.DB_NAME],
  );

  if (rows.length === 0) {
    console.log("Base de datos no encontrada, creando...");
    const sql = readFileSync(
      join(__dirname, "../../database/init.sql"),
      "utf8",
    );
    await connection.query(sql);

    // Crear Stored Procedure por separado
    // No puede ir en el init.sql porque DELIMITER no funciona desde Node
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
            END
        `);

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
