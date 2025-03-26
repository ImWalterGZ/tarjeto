import React, { useState } from "react";
import apiClient from "../../config/axios";

const PromoCreator = ({ negocio, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic fields
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivelReq, setNivelReq] = useState(0);
  const [status, setStatus] = useState(true);
  const [categoriaFavorita, setCategoriaFavorita] = useState([]);

  // Promotion type fields
  const [tipoPromocion, setTipoPromocion] = useState("PERIODO");

  // PROGRAMA type fields
  const [diaSemana, setDiaSemana] = useState(1); // Monday by default
  const [horaInicio, setHoraInicio] = useState("18:00");
  const [horaFin, setHoraFin] = useState("22:00");
  const [zonaHoraria, setZonaHoraria] = useState("America/Mexico_City");

  // PERIODO type fields
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // EXCLUSIVO type fields
  const [totalInicial, setTotalInicial] = useState(100);
  const [fechaLimite, setFechaLimite] = useState("");

  // Usage limits
  const [limiteDiario, setLimiteDiario] = useState(1);
  const [limiteSemanal, setLimiteSemanal] = useState(3);
  const [limiteTotal, setLimiteTotal] = useState(5);
  const [limiteTotalGlobal, setLimiteTotalGlobal] = useState(500);

  // Handle category input
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory && !categoriaFavorita.includes(newCategory)) {
      setCategoriaFavorita([...categoriaFavorita, newCategory]);
      setNewCategory("");
    }
  };

  const removeCategory = (cat) => {
    setCategoriaFavorita(categoriaFavorita.filter((c) => c !== cat));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 PromoCreator: Form submitted");
    setLoading(true);
    setError("");

    try {
      // Build the tipoPromo object based on selected type
      let tipoPromo = { tipo: tipoPromocion };

      if (tipoPromocion === "PROGRAMA") {
        tipoPromo.programa = {
          diaSemana,
          horaInicio,
          horaFin,
          zonaHoraria,
        };
      } else if (tipoPromocion === "PERIODO") {
        tipoPromo.periodo = {
          fechaInicio: new Date(fechaInicio),
          fechaFin: new Date(fechaFin),
        };
      } else if (tipoPromocion === "EXCLUSIVO") {
        tipoPromo.exclusivo = {
          totalInicial,
          restantes: totalInicial,
          fechaLimite: new Date(fechaLimite),
        };
      }

      const promocionData = {
        negocioID: negocio.publicID,
        titulo,
        descripcion,
        nivelReq: Number(nivelReq),
        status,
        categoriaFavorita,
        tipoPromo,
        limiteDeUsos: {
          porUsuario: {
            diario: Number(limiteDiario),
            semanal: Number(limiteSemanal),
            total: Number(limiteTotal),
          },
          totalGlobal: Number(limiteTotalGlobal),
        },
        creadoPor: "admin", // This should be replaced with the current user's info
      };

      console.log("📤 PromoCreator: Sending promotion data:", promocionData);
      console.log(`🌐 PromoCreator: Making request to: /api/promocion`);

      // Make API call to create promotion
      const response = await apiClient.post("/api/promocion", promocionData);
      console.log("✅ PromoCreator: API response received", response);

      // Reset form
      setTitulo("");
      setDescripcion("");
      setNivelReq(0);
      setCategoriaFavorita([]);
      console.log("🔄 PromoCreator: Form reset");

      if (onSuccess) {
        console.log("🎉 PromoCreator: Calling onSuccess callback");
        onSuccess(response.data.data);
      }
    } catch (err) {
      console.error("❌ PromoCreator: Error creating promotion:", err);
      console.log(
        "❌ PromoCreator: Error details:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Error al crear la promoción");
    } finally {
      setLoading(false);
      console.log("🏁 PromoCreator: Loading state set to false");
    }
  };

  // Helper function to get today's date formatted for input
  const getTodayFormatted = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Helper function to get a date 30 days from now
  const getNext30DaysFormatted = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4">Crear Nueva Promoción</h3>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título*
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción*
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={3}
            required
          />
        </div>
        <div className="flex flex-row gap-4">
          <div className="w-3/4">
            <label className="block text-sm font-medium text-gray-700">
              Nivel Requerido*
            </label>
            <select
              value={nivelReq}
              onChange={(e) => setNivelReq(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="0">Nivel 0 (Todos)</option>
              <option value="1">Nivel 1 (Bronce)</option>
              <option value="2">Nivel 2 (Plata)</option>
              <option value="3">Nivel 3 (Oro)</option>
              <option value="4">Nivel 4 (Rubi)</option>
            </select>
          </div>
          <div className="w-1/4">
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Activa</span>
              </label>
            </div>
          </div>
        </div>

        {/* Categories 
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categorías Favoritas
          </label>
          <div className="flex mt-1">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="block w-full border border-gray-300 rounded-l-md shadow-sm p-2"
              placeholder="Añadir categoría"
            />
            <button
              type="button"
              onClick={addCategory}
              className="bg-gray-200 px-4 rounded-r-md"
            >
              +
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {categoriaFavorita.map((cat, index) => (
              <span
                key={index}
                className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        */}

        {/* Promotion Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Promoción*
          </label>
          <select
            value={tipoPromocion}
            onChange={(e) => setTipoPromocion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="PROGRAMA">Programa Semanal</option>
            <option value="PERIODO">Periodo de Tiempo</option>
            <option value="EXCLUSIVO">Cantidad Limitada</option>
          </select>
        </div>

        {/* Conditional Fields Based on Promotion Type */}
        {tipoPromocion === "PROGRAMA" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Día de la Semana
              </label>
              <select
                value={diaSemana}
                onChange={(e) => setDiaSemana(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="0">Domingo</option>
                <option value="1">Lunes</option>
                <option value="2">Martes</option>
                <option value="3">Miércoles</option>
                <option value="4">Jueves</option>
                <option value="5">Viernes</option>
                <option value="6">Sábado</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>
        )}

        {tipoPromocion === "PERIODO" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio || getTodayFormatted()}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min={getTodayFormatted()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin || getNext30DaysFormatted()}
                onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min={fechaInicio || getTodayFormatted()}
              />
            </div>
          </div>
        )}

        {tipoPromocion === "EXCLUSIVO" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cantidad Total
              </label>
              <input
                type="number"
                value={totalInicial}
                onChange={(e) => setTotalInicial(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Límite
              </label>
              <input
                type="date"
                value={fechaLimite || getNext30DaysFormatted()}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min={getTodayFormatted()}
              />
            </div>
          </div>
        )}

        {/* Usage Limits */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Límites de Uso</h4>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Por Usuario/Día
                </label>
                <input
                  type="number"
                  value={limiteDiario}
                  onChange={(e) => setLimiteDiario(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Por Usuario/Semana
                </label>
                <input
                  type="number"
                  value={limiteSemanal}
                  onChange={(e) => setLimiteSemanal(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total por Usuario
                </label>
                <input
                  type="number"
                  value={limiteTotal}
                  onChange={(e) => setLimiteTotal(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Global
                </label>
                <input
                  type="number"
                  value={limiteTotalGlobal}
                  onChange={(e) => setLimiteTotalGlobal(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Promoción"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromoCreator;
