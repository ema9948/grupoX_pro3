import PDFDocument from 'pdfkit';

const generateTurnosPDF = async (estadisticas, turnos) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];

            // Vamos guardando los chunks del PDF en memoria
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // ---- ENCABEZADO ----
            doc.fontSize(18).font('Helvetica-Bold')
               .text('INFORME DE TURNOS - CLÍNICA', { align: 'center' });

            doc.fontSize(10).font('Helvetica')
               .text(`Fecha: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`, 
               { align: 'right' });

            doc.moveDown();

            // ---- ESTADÍSTICAS ----
            doc.fontSize(14).font('Helvetica-Bold').text('Estadísticas Generales');
            doc.moveDown(0.5);

            doc.fontSize(10).font('Helvetica');
            doc.text(`Total de turnos:        ${estadisticas.total_turnos || 0}`);
            doc.text(`Turnos atendidos:       ${estadisticas.turnos_atendidos || 0}`);
            doc.text(`Turnos pendientes:      ${estadisticas.turnos_pendientes || 0}`);
            doc.text(`Pacientes únicos:       ${estadisticas.total_pacientes_unicos || 0}`);
            doc.text(`Médicos activos:        ${estadisticas.total_medicos_que_atendieron || 0}`);
            doc.text(`Promedio por turno:     $${parseFloat(estadisticas.promedio_valor_turno || 0).toFixed(2)}`);
            doc.text(`Ingreso total:          $${parseFloat(estadisticas.ingreso_total || 0).toFixed(2)}`);

            doc.moveDown();

            // ---- LISTADO DE TURNOS ----
            doc.fontSize(14).font('Helvetica-Bold').text('Listado de Turnos');
            doc.moveDown(0.5);

            if (turnos.length === 0) {
                doc.fontSize(10).font('Helvetica').text('No hay turnos registrados.');
            } else {
                turnos.forEach((t, index) => {
                    const fecha = new Date(t.fecha_hora).toLocaleString('es-AR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    });
                    
                    const paciente = t.paciente_nombre || 'Sin datos';
                    const medico = t.medico_nombre || 'Sin datos';
                    const estado = t.atendido ? 'Atendido' : 'Pendiente';

                    doc.fontSize(10).font('Helvetica-Bold')
                       .text(`#${index + 1} - ${fecha}`, { continued: false });

                    doc.font('Helvetica')
                       .text(`  Paciente:    ${paciente}`)
                       .text(`  Médico:      ${medico} (${t.especialidad || ''})`)
                       .text(`  Obra Social: ${t.obra_social || 'Particular'}`)
                       .text(`  Valor:       $${parseFloat(t.valor_total || 0).toFixed(2)}`)
                       .text(`  Estado:      ${estado}`);

                    doc.moveDown(0.5);

                    // Línea separadora cada turno
                    doc.moveTo(50, doc.y)
                       .lineTo(550, doc.y)
                       .strokeColor('#cccccc')
                       .stroke();

                    doc.moveDown(0.5);
                });
            }

            // Cerramos el documento y dispara el evento 'end'
            doc.end();

        } catch (err) {
            reject(err);
        }
    });
};

export default generateTurnosPDF;