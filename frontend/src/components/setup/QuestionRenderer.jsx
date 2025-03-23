import { motion } from "framer-motion";
import ImageUploader from "./ImageUploader";
import GradientSelector from "./GradientSelector";
import OperatingHours from "./OperatingHours";
import CategorySelector from "../../components/profile/CategorySelector";
import BusinessMetrics from "./BusinessMetrics";

function QuestionRenderer({ currentQuestion, answers, handleAnswer }) {
  if (!currentQuestion) return null;

  if (currentQuestion.type === "establishment") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.pregunta}
        </h2>
        {currentQuestion.fields.map((field) => (
          <input
            key={field.name}
            type={field.type}
            placeholder={field.label}
            className="input input-bordered w-full"
            value={answers[currentQuestion.field]?.[field.name] || ""}
            onChange={(e) =>
              handleAnswer(
                {
                  ...answers[currentQuestion.field],
                  [field.name]: e.target.value,
                },
                currentQuestion.field
              )
            }
            required={field.required}
          />
        ))}
      </div>
    );
  }

  if (currentQuestion.type === "image") {
    return (
      <ImageUploader
        fieldName={currentQuestion.field}
        value={answers[currentQuestion.field]}
        onChange={handleAnswer}
      />
    );
  }

  if (currentQuestion.type === "gradient") {
    return (
      <GradientSelector
        value={answers[currentQuestion.field]}
        onChange={handleAnswer}
      />
    );
  }

  if (currentQuestion.type === "price-range") {
    return (
      <div className="form-control" data-theme="light">
        <label className="label">
          <span className="label-text text-lg">{currentQuestion.pregunta}</span>
        </label>
        <div className="flex justify-center gap-3">
          {[
            { value: "low", label: "60 - 199" },
            { value: "mid", label: "200 - 245" },
            { value: "high", label: "250 - 449" },
            { value: "premium", label: "500+" },
          ].map((range) => (
            <button
              key={range.value}
              type="button"
              className={`btn ${
                answers[currentQuestion.field] === range.value
                  ? "btn-primary"
                  : ""
              } flex-1`}
              onClick={() => handleAnswer(range.value, currentQuestion.field)}
              style={
                answers[currentQuestion.field] === range.value
                  ? { color: "#E0E0E0" }
                  : {}
              }
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (currentQuestion.type === "range") {
    // Create a mapping between slider position and employee count values
    const employeeCountMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 50];

    // Get the displayed value from the map or use default
    const getDisplayValue = (sliderPosition) => {
      if (!sliderPosition) return 0;
      const position = parseInt(sliderPosition);
      const value = employeeCountMap[position - 1];
      return position === employeeCountMap.length ? value + "+" : value;
    };

    // Current slider position (not the actual value)
    const currentPosition = answers[currentQuestion.field + "_position"] || 1;

    // Current display value based on the position
    const displayValue = getDisplayValue(currentPosition);

    return (
      <div className="form-control" data-theme="light">
        <label className="label">
          <span className="label-text text-lg">{currentQuestion.pregunta}</span>
          <span className="label-text-alt font-medium text-gray-700">
            {displayValue} empleados
          </span>
        </label>
        <input
          type="range"
          min="1"
          max={employeeCountMap.length}
          step="1"
          value={currentPosition}
          onChange={(e) => {
            const sliderPosition = parseInt(e.target.value);
            const actualValue = employeeCountMap[sliderPosition - 1];

            // Store both the position and the actual value
            handleAnswer(sliderPosition, currentQuestion.field + "_position");
            handleAnswer(actualValue, currentQuestion.field);
          }}
          className="range range-primary range-lg w-full red-range py-7"
          style={{
            "--range-shdw": "#F4262F",
            "--range-color": "#FEF2F2",
          }}
        />
        <div className="w-full flex justify-between text-xs px-2 mt-2">
          {employeeCountMap.map((value, index) => (
            <span key={index} className="font-medium">
              {index === employeeCountMap.length - 1 ? "50+" : value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (currentQuestion.type === "operating-hours") {
    return (
      <OperatingHours
        value={answers[currentQuestion.field]}
        onChange={handleAnswer}
      />
    );
  }

  if (currentQuestion.type === "business-metrics") {
    return (
      <BusinessMetrics
        answers={answers}
        handleAnswer={handleAnswer}
        field={currentQuestion.field}
      />
    );
  }

  if (currentQuestion.type === "category") {
    return (
      <div data-theme="light">
        <CategorySelector
          selectedCategories={answers[currentQuestion.field] || []}
          onChange={(value) => handleAnswer(value, currentQuestion.field)}
          maxSelections={currentQuestion.maxSelections || 3}
        />
      </div>
    );
  }

  if (currentQuestion.type === "select") {
    return (
      <div className="form-control w-full" data-theme="light">
        <label className="label">
          <span className="label-text">{currentQuestion.pregunta}</span>
        </label>
        <select
          className="select select-bordered"
          value={answers[currentQuestion.field] || ""}
          onChange={(e) => handleAnswer(e.target.value, currentQuestion.field)}
        >
          <option disabled value="">
            Selecciona una opción
          </option>
          {currentQuestion.opciones.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (currentQuestion.type === "social") {
    return (
      <div className="space-y-4" data-theme="light">
        {currentQuestion.opciones.map((red) => (
          <div key={red} className="form-control">
            <label className="label">
              <span className="label-text">URL de {red}</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={answers[currentQuestion.field]?.[red.toLowerCase()] || ""}
              onChange={(e) =>
                handleAnswer(
                  {
                    ...answers[currentQuestion.field],
                    [red.toLowerCase()]: e.target.value,
                  },
                  currentQuestion.field
                )
              }
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="form-control w-full" data-theme="light">
      <label className="label">
        <span className="label-text">{currentQuestion.pregunta}</span>
      </label>
      <input
        type={currentQuestion.type || "text"}
        className="input input-bordered w-full"
        value={answers[currentQuestion.field] || ""}
        onChange={(e) => handleAnswer(e.target.value, currentQuestion.field)}
        required={currentQuestion.required}
      />
    </div>
  );
}

export default QuestionRenderer;
