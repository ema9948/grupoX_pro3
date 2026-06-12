import PDFDocument from "pdfkit";

const generateTurnosPDF = async (estadisticas, turnos) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // --- Encabezado ---
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("INFORME DE TURNOS - CLÍNICA", { align: "center" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `Fecha: ${new Date().toLocaleDateString("es-AR")} ${new Date().toLocaleTimeString("es-AR")}`,
        {
          align: "right",
        },
      );
    doc.moveDown();

    // --- Estadísticas generales ---
    const generales = estadisticas.generales || {};
    doc.fontSize(14).font("Helvetica-Bold").text("Estadísticas Generales");
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica");
    doc.text(`Total de turnos:        ${generales.total_turnos || 0}`);
    doc.text(`Turnos atendidos:       ${generales.turnos_atendidos || 0}`);
    doc.text(`Turnos pendientes:      ${generales.turnos_pendientes || 0}`);
    doc.text(
      `Pacientes únicos:       ${generales.total_pacientes_unicos || 0}`,
    );
    doc.text(
      `Médicos activos:        ${generales.total_medicos_que_atendieron || 0}`,
    );
    doc.text(
      `Promedio por turno:     $${parseFloat(generales.promedio_valor_turno || 0).toFixed(2)}`,
    );
    doc.text(
      `Ingreso total:          $${parseFloat(generales.ingreso_total || 0).toFixed(2)}`,
    );
    doc.moveDown();

    // --- Estadísticas por especialidad ---
    const especialidades = estadisticas.por_especialidad || [];
    if (especialidades.length > 0) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Estadísticas por Especialidad");
      doc.moveDown(0.5);
      especialidades.forEach((esp) => {
        doc.fontSize(10).font("Helvetica-Bold").text(`${esp.especialidad}:`);
        doc
          .font("Helvetica")
          .text(`  Cantidad de turnos: ${esp.cantidad_turnos || 0}`)
          .text(
            `  Facturación total: $${parseFloat(esp.facturacion_total || 0).toFixed(2)}`,
          );
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // --- Listado de turnos ---
    doc.fontSize(14).font("Helvetica-Bold").text("Listado de Turnos");
    doc.moveDown(0.5);

    if (turnos.length === 0) {
      doc.fontSize(10).font("Helvetica").text("No hay turnos registrados.");
    } else {
      turnos.forEach((t, index) => {
        const fecha = new Date(t.fecha_hora).toLocaleString("es-AR", {
          dateStyle: "short",
          timeStyle: "short",
        });
        const paciente = t.paciente_nombre || "Sin datos";
        const medico = t.medico_nombre || "Sin datos";
        const estado = t.atendido ? "Atendido" : "Pendiente";

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`#${index + 1} - ${fecha}`);
        doc
          .font("Helvetica")
          .text(`  Paciente:    ${paciente}`)
          .text(`  Médico:      ${medico} (${t.especialidad || ""})`)
          .text(`  Obra Social: ${t.obra_social || "Particular"}`)
          .text(`  Valor:       $${parseFloat(t.valor_total || 0).toFixed(2)}`)
          .text(`  Estado:      ${estado}`);

        doc.moveDown(0.5);
        // línea separadora
        doc
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .strokeColor("#cccccc")
          .stroke();
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });
};

export default generateTurnosPDF;
