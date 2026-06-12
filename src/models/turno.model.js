//*src/models/turno.model.js
import pool from "../config/db.js";

const TurnoModel = {
  //*Crear turno con transacción y cálculo de valor_total
  create: async (id_medico, id_paciente, fecha_hora) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Obtener datos del médico y su valor de consulta
      const [medicoRows] = await connection.query(
        `SELECT m.valor_consulta, m.id_medico
             FROM medicos m
             WHERE m.id_medico = ?`,
        [id_medico],
      );

      if (medicoRows.length === 0) {
        throw new Error("Médico no encontrado");
      }

      const { valor_consulta } = medicoRows[0];

      // 2. Obtener la obra social del paciente
      const [pacienteRows] = await connection.query(
        `SELECT p.id_obra_social, os.porcentaje_descuento, os.es_particular, os.nombre
             FROM pacientes p
             JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
             WHERE p.id_paciente = ?`,
        [id_paciente],
      );

      if (pacienteRows.length === 0) {
        throw new Error("Paciente no encontrado");
      }

      let id_obra_social = pacienteRows[0].id_obra_social;
      let porcentaje_descuento = pacienteRows[0].porcentaje_descuento;
      let es_particular = pacienteRows[0].es_particular;
      let valor_total;

      // 3. Verificar si el médico atiende la obra social del paciente
      const [asociacionRows] = await connection.query(
        `SELECT * FROM medicos_obras_sociales 
             WHERE id_medico = ? AND id_obra_social = ? AND activo = 1`,
        [id_medico, id_obra_social],
      );

      // 4. Si el médico NO atiende esa obra social, se trata como PARTICULAR
      if (asociacionRows.length === 0) {
        es_particular = 1;
        // Buscar o crear la obra social "Particular" (id = 4 en tus datos)
        const [particularRows] = await connection.query(
          `SELECT id_obra_social, porcentaje_descuento 
                 FROM obras_sociales 
                 WHERE es_particular = 1 AND activo = 1 
                 LIMIT 1`,
        );

        if (particularRows.length > 0) {
          id_obra_social = particularRows[0].id_obra_social;
          porcentaje_descuento = particularRows[0].porcentaje_descuento;
        }
      }

      // 5. Calcular valor_total según regla de negocio
      if (es_particular === 1) {
        valor_total = parseFloat(valor_consulta);
      } else {
        valor_total =
          parseFloat(valor_consulta) -
          parseFloat(porcentaje_descuento) * parseFloat(valor_consulta);
      }

      // 6. Verificar que no exista otro turno para el mismo médico en la misma fecha_hora
      const [existingTurno] = await connection.query(
        `SELECT id_turno_reserva FROM turnos_reservas 
             WHERE id_medico = ? AND fecha_hora = ? AND activo = 1`,
        [id_medico, fecha_hora],
      );

      if (existingTurno.length > 0) {
        throw new Error("El médico ya tiene un turno reservado en ese horario");
      }

      // 7. Insertar el turno
      const [result] = await connection.query(
        `INSERT INTO turnos_reservas 
             (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido, activo)
             VALUES (?, ?, ?, ?, ?, 0, 1)`,
        [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total],
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  //*Listar turnos de un médico
  findByMedico: async (id_medico) => {
    const [rows] = await pool.query(
      `
            SELECT t.*, p.id_paciente, u.apellido as paciente_apellido, u.nombres as paciente_nombres,
                   os.nombre as obra_social
            FROM turnos_reservas t
            JOIN pacientes p ON t.id_paciente = p.id_paciente
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.id_medico = ? AND t.activo = 1
            ORDER BY t.fecha_hora DESC`,
      [id_medico],
    );
    return rows;
  },

  //*Listar turnos de un paciente
  findByPaciente: async (id_paciente) => {
    const [rows] = await pool.query(
      `
            SELECT t.id_turno_reserva, t.fecha_hora, t.valor_total, t.atendido, t.activo,
                   m.id_medico,
                   CONCAT(u_medico.apellido, ', ', u_medico.nombres) as medico_nombre,
                   e.nombre as especialidad,
                   os.nombre as obra_social_nombre
            FROM turnos_reservas t
            JOIN medicos m ON t.id_medico = m.id_medico
            JOIN usuarios u_medico ON m.id_usuario = u_medico.id_usuario
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.id_paciente = ? AND t.activo = 1
            ORDER BY t.fecha_hora DESC`,
      [id_paciente],
    );
    return rows;
  },

  //*Marcar turno como atendido
  marcarAtendido: async (id_turno) => {
    const [result] = await pool.query(
      "UPDATE turnos_reservas SET atendido = 1 WHERE id_turno_reserva = ? AND activo = 1",
      [id_turno],
    );
    return result.affectedRows;
  },

  //*Listar todos los turnos (para Admin)
  findAll: async () => {
    const [rows] = await pool.query(`
            SELECT t.*, 
                   CONCAT(u_paciente.apellido, ', ', u_paciente.nombres) as paciente_nombre,
                   CONCAT(u_medico.apellido, ', ', u_medico.nombres) as medico_nombre,
                   e.nombre as especialidad,
                   os.nombre as obra_social
            FROM turnos_reservas t
            JOIN pacientes p ON t.id_paciente = p.id_paciente
            JOIN usuarios u_paciente ON p.id_usuario = u_paciente.id_usuario
            JOIN medicos m ON t.id_medico = m.id_medico
            JOIN usuarios u_medico ON m.id_usuario = u_medico.id_usuario
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.activo = 1
            ORDER BY t.fecha_hora DESC`);
    return rows;
  },

  //* Cancelar turno (soft delete)
  cancelar: async (id_turno, id_usuario, rol) => {
    let query = `UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ? AND activo = 1`;
    let params = [id_turno];

    // Si es paciente, verificar que el turno le pertenezca
    if (rol === 2) {
      query = `
            UPDATE turnos_reservas t
            JOIN pacientes p ON t.id_paciente = p.id_paciente
            SET t.activo = 0
            WHERE t.id_turno_reserva = ? 
            AND t.activo = 1
            AND p.id_usuario = ?`;
      params = [id_turno, id_usuario];
    }

    // Si es médico, verificar que el turno le pertenezca
    if (rol === 1) {
      query = `
            UPDATE turnos_reservas t
            JOIN medicos m ON t.id_medico = m.id_medico
            SET t.activo = 0
            WHERE t.id_turno_reserva = ? 
            AND t.activo = 1
            AND m.id_usuario = ?`;
      params = [id_turno, id_usuario];
    }

    const [result] = await pool.query(query, params);
    return result.affectedRows;
  },
  //*Llamar al Stored Procedure para estadísticas (solo Admin)
  getEstadisticas: async () => {
    const [rows] = await pool.query("CALL sp_estadisticas_atenciones()");
    return rows; // ahora rows tiene dos elementos: [generales, por_especialidad]
  },
};

export default TurnoModel;
