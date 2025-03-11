import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Select, Textarea, Switch } from "../ui";
import { Calendar, Clock, Users, Tag, FileText, Settings } from "lucide-react";

const PromoForm = ({ data, onChange }) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: data,
  });

  const onSubmit = (formData) => {
    onChange(formData);
  };

  const tipoPromo = watch("tipoPromo.tipo");

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Información Básica
        </h3>
        <div className="space-y-4">
          <Controller
            name="titulo"
            control={control}
            rules={{ required: "El título es requerido" }}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Título de la Promoción"
                placeholder="Ej: 2x1 en Bebidas"
                error={error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="descripcion"
            control={control}
            rules={{ required: "La descripción es requerida" }}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                label="Descripción"
                placeholder="Describe los detalles de la promoción"
                error={error?.message}
                {...field}
              />
            )}
          />
        </div>
      </section>

      {/* Promotion Type */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Tipo de Promoción
        </h3>
        <div className="space-y-4">
          <Controller
            name="tipoPromo.tipo"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo"
                options={[
                  { value: "regular", label: "Regular" },
                  { value: "programa", label: "Programada" },
                  { value: "periodo", label: "Por Periodo" },
                  { value: "exclusivo", label: "Exclusiva" },
                ]}
                {...field}
              />
            )}
          />

          {tipoPromo === "programa" && (
            <div className="space-y-4">
              <Controller
                name="tipoPromo.programa.diaSemana"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Día de la Semana"
                    options={[
                      { value: 1, label: "Lunes" },
                      { value: 2, label: "Martes" },
                      { value: 3, label: "Miércoles" },
                      { value: 4, label: "Jueves" },
                      { value: 5, label: "Viernes" },
                      { value: 6, label: "Sábado" },
                      { value: 0, label: "Domingo" },
                    ]}
                    {...field}
                  />
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="tipoPromo.programa.horaInicio"
                  control={control}
                  render={({ field }) => (
                    <Input type="time" label="Hora de Inicio" {...field} />
                  )}
                />
                <Controller
                  name="tipoPromo.programa.horaFin"
                  control={control}
                  render={({ field }) => (
                    <Input type="time" label="Hora de Fin" {...field} />
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Usage Limits */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Límites de Uso
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="limiteDeUsos.porUsuario.diario"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Límite Diario por Usuario"
                  placeholder="Sin límite"
                  {...field}
                />
              )}
            />
            <Controller
              name="limiteDeUsos.totalGlobal"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Límite Total Global"
                  placeholder="Sin límite"
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Términos y Condiciones
        </h3>
        <Controller
          name="terminos"
          control={control}
          render={({ field }) => (
            <Textarea
              label="Términos y Condiciones"
              placeholder="Especifica los términos y condiciones de la promoción"
              rows={4}
              {...field}
            />
          )}
        />
      </section>

      {/* Status */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuración
        </h3>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Switch
              label="Promoción Activa"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </section>
    </form>
  );
};

export default PromoForm;
