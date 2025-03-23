import { useState } from "react";

function OperatingHours({ value, onChange }) {
  const dias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Helper functions for specific field types
  const getHorario = (dia, campo) => {
    if (!value) return "";
    const horarioDia = value.find((h) => h.dia === dia);
    return horarioDia ? horarioDia[campo] : "";
  };

  const updateHorario = (dia, campo, valor) => {
    const horarioOperacion = [...(value || [])];
    const index = horarioOperacion.findIndex((h) => h.dia === dia);

    if (index >= 0) {
      horarioOperacion[index] = {
        ...horarioOperacion[index],
        [campo]: valor,
      };
    } else {
      horarioOperacion.push({ dia, [campo]: valor });
    }

    onChange(horarioOperacion, "horarioOperacion");
  };

  // Apply preset schedules to all days or specific days
  const applyPresetHorario = (preset) => {
    let nuevoHorario = [];

    switch (preset) {
      case "fullDay":
        // 8:00 - 20:00 todos los días
        dias.forEach((dia) => {
          nuevoHorario.push({ dia, apertura: "08:00", cierre: "20:00" });
        });
        break;
      case "halfDay":
        // 8:00 - 14:00 todos los días
        dias.forEach((dia) => {
          nuevoHorario.push({ dia, apertura: "08:00", cierre: "14:00" });
        });
        break;
      case "noWeekends":
        // 8:00 - 18:00 de lunes a viernes, cerrado en fin de semana
        dias.forEach((dia) => {
          if (dia === "Sábado" || dia === "Domingo") {
            nuevoHorario.push({ dia, apertura: "", cierre: "" });
          } else {
            nuevoHorario.push({ dia, apertura: "08:00", cierre: "18:00" });
          }
        });
        break;
    }

    onChange(nuevoHorario, "horarioOperacion");
  };

  return (
    <div className="form-control" data-theme="light">
      <label className="label">
        <span className="label-text text-lg">Horario de operación</span>
      </label>

      {/* Preset Schedule Buttons */}
      <div className="my-4">
        <p className="text-sm text-gray-500 mb-2">
          Selecciona un horario común o define uno personalizado:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => applyPresetHorario("fullDay")}
          >
            Jornada completa (8:00-20:00)
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => applyPresetHorario("halfDay")}
          >
            Media jornada (8:00-14:00)
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => applyPresetHorario("noWeekends")}
          >
            Lun-Vie (8:00-18:00)
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        {dias.map((day) => {
          const apertura = getHorario(day, "apertura");
          const cierre = getHorario(day, "cierre");
          const isClosed = !apertura && !cierre;

          return (
            <div key={day} className="flex items-center gap-2">
              <span className="w-24 text-sm font-medium">{day}</span>

              {/* Toggle for open/closed */}
              <div className="form-control mr-2">
                <label className="label cursor-pointer p-0">
                  <input
                    type="checkbox"
                    className="toggle toggle-xs"
                    checked={!isClosed}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Set default hours if toggling to open
                        updateHorario(day, "apertura", "09:00");
                        updateHorario(day, "cierre", "18:00");
                      } else {
                        // Clear hours if toggling to closed
                        updateHorario(day, "apertura", "");
                        updateHorario(day, "cierre", "");
                      }
                    }}
                  />
                </label>
              </div>

              {/* Time inputs */}
              {!isClosed ? (
                <>
                  <input
                    type="time"
                    className="input input-bordered input-sm w-28"
                    value={apertura}
                    onChange={(e) =>
                      updateHorario(day, "apertura", e.target.value)
                    }
                  />
                  <span>a</span>
                  <input
                    type="time"
                    className="input input-bordered input-sm w-28"
                    value={cierre}
                    onChange={(e) =>
                      updateHorario(day, "cierre", e.target.value)
                    }
                  />
                </>
              ) : (
                <span className="text-sm italic text-gray-500">Cerrado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OperatingHours;
