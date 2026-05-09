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
