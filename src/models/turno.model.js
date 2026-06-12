// src/models/turno.model.js
import pool from '../config/db.js';

const TurnoModel = {

    // Crear turno con transacción y cálculo de valor_total
    create: async (id_medico, id_paciente, fecha_hora) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Obtener datos necesarios
            const [medicoData] = await connection.query(
                `SELECT m.valor_consulta, mos.id_obra_social, os.porcentaje_descuento, os.es_particular
                 FROM medicos m
                 JOIN pacientes p ON p.id_paciente = ?
                 JOIN medicos_obras_sociales mos ON mos.id_medico = m.id_medico 
                    AND mos.id_obra_social = p.id_obra_social AND mos.activo = 1
                 JOIN obras_sociales os ON os.id_obra_social = mos.id_obra_social
                 WHERE m.id_medico = ? AND m.id_usuario IN (SELECT id_usuario FROM usuarios WHERE activo = 1)
                 LIMIT 1`,
                [id_paciente, id_medico]
            );

            if (medicoData.length === 0) {
                throw new Error("No se encontró relación válida entre médico, paciente y obra social");
            }

            const { valor_consulta, porcentaje_descuento, es_particular } = medicoData[0];

            // Calcular valor_total según regla de negocio
            let valor_total;
            if (es_particular === 1) {
                valor_total = valor_consulta;
            } else {
                valor_total = valor_consulta - (porcentaje_descuento * valor_consulta / 100);
            }

            // Insertar el turno
            const [result] = await connection.query(
                `INSERT INTO turnos_reservas 
                 (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido, activo)
                 VALUES (?, ?, ?, ?, ?, 0, 1)`,
                [id_medico, id_paciente, medicoData[0].id_obra_social, fecha_hora, valor_total]
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

    // Listar turnos de un médico
    findByMedico: async (id_medico) => {
        const [rows] = await pool.query(`
            SELECT t.*, p.id_paciente, u.apellido as paciente_apellido, u.nombres as paciente_nombres,
                   os.nombre as obra_social
            FROM turnos_reservas t
            JOIN pacientes p ON t.id_paciente = p.id_paciente
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.id_medico = ? AND t.activo = 1
            ORDER BY t.fecha_hora DESC`,
            [id_medico]
        );
        return rows;
    },

    // Listar turnos de un paciente
    findByPaciente: async (id_paciente) => {
        const [rows] = await pool.query(`
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
            [id_paciente]
        );
        return rows;
    },

    // Marcar turno como atendido
    marcarAtendido: async (id_turno) => {
        const [result] = await pool.query(
            "UPDATE turnos_reservas SET atendido = 1 WHERE id_turno_reserva = ? AND activo = 1",
            [id_turno]
        );
        return result.affectedRows;
    },

    // Listar todos los turnos (para Admin)
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
        // Llamar al Stored Procedure para estadísticas (solo Admin)
    getEstadisticas: async () => {
        const [rows] = await pool.query("CALL sp_estadisticas_atenciones()");
        return rows[0]; // El primer resultado del procedimiento
    },
};

export default TurnoModel;