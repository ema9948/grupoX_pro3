import ObraSocialModel from "../models/obraSocial.model.js";

const ObraSocialController = {
  //*GET /api/obras-sociales
  getAll: async (req, res) => {
    try {
      const obrasSociales = await ObraSocialModel.findAll();
      res.status(200).json(obrasSociales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  create: async (req, res) => {
    try {
      const { nombre, descripcion, porcentaje_descuento, es_particular } =
        req.body;

      // Ya viene como decimal (ej: 0.10), se guarda directamente
      const existente = await ObraSocialModel.findByNombre(nombre);
      if (existente) {
        if (!existente.activo) {
          await ObraSocialModel.updateActive(existente.id_obra_social, 1);
          return res.status(200).json({
            message: "Obra social reactivada correctamente",
            id: existente.id_obra_social,
          });
        }
        return res.status(400).json({
          message: "La obra social ya existe",
        });
      }

      const id = await ObraSocialModel.create(
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular,
      );

      res.status(201).json({
        message: "Obra social creada correctamente",
        id,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "La obra social ya existe",
        });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*GET /api/obras-sociales/:id
  getById: async (req, res) => {
    try {
      const obraSocial = await ObraSocialModel.findById(req.params.id);
      if (!obraSocial) {
        return res.status(404).json({ message: "Obra social no encontrada" });
      }
      res.status(200).json(obraSocial);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*PUT /api/obras-sociales/:id
  update: async (req, res) => {
    try {
      const { nombre, descripcion, porcentaje_descuento, es_particular } =
        req.body;

      const affectedRows = await ObraSocialModel.update(
        req.params.id,
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular,
      );

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Obra social no encontrada" });
      }
      res
        .status(200)
        .json({ message: "Obra social actualizada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*DELETE /api/obras-sociales/:id
  remove: async (req, res) => {
    try {
      const affectedRows = await ObraSocialModel.softDelete(req.params.id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Obra social no encontrada" });
      }
      res.status(200).json({ message: "Obra social eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

export default ObraSocialController;
