function BusinessMetrics({ answers, handleAnswer, field }) {
  // Define budget ranges for marketing budget slider
  const marketingBudgetRanges = [1000, 2000, 3000, 5000, 7500, 10000];

  // Mark this section as completed
  if (!answers[field] && field) {
    handleAnswer(true, field);
  }

  // Get displayed value for marketing budget
  const getMarketingBudgetValue = (sliderPosition) => {
    if (!sliderPosition) return 0;
    const position = parseInt(sliderPosition);
    const value = marketingBudgetRanges[position - 1];
    return position === marketingBudgetRanges.length ? value + "+" : value;
  };

  // Current displayed values
  const marketingBudgetValue = getMarketingBudgetValue(
    answers.marketingBudgetPosition || 1
  );

  return (
    <div className="space-y-6" data-theme="light">
      <h2 className="text-xl font-semibold text-gray-800">
        Información adicional
      </h2>

      {/* Featured Products - Slider */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Número de productos/platos principales
          </span>
          <span className="label-text-alt font-medium text-gray-700">
            {answers.numeroPlatosPrincipales || 1}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={answers.numeroPlatosPrincipales || 1}
          onChange={(e) => {
            handleAnswer(parseInt(e.target.value), "numeroPlatosPrincipales");
            // Also mark the parent field as completed
            handleAnswer(true, field);
          }}
          className="range range-primary w-full red-range"
          style={{
            "--range-shdw": "#F4262F",
            "--range-color": "#F4262F",
          }}
        />
        <div className="w-full flex justify-between text-xs px-2 mt-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <span key={num} className="font-medium">
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Marketing Budget - Slider */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Presupuesto mensual para marketing (MXN)
          </span>
          <span className="label-text-alt font-medium text-gray-700">
            ${marketingBudgetValue}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max={marketingBudgetRanges.length}
          step="1"
          value={answers.marketingBudgetPosition || 1}
          onChange={(e) => {
            const position = parseInt(e.target.value);
            const actualValue = marketingBudgetRanges[position - 1];

            // Store both the position and actual value
            handleAnswer(position, "marketingBudgetPosition");
            handleAnswer(actualValue, "presupuestoMarketing");
            // Also mark the parent field as completed
            handleAnswer(true, field);
          }}
          className="range range-primary w-full red-range"
          style={{
            "--range-shdw": "#F4262F",
            "--range-color": "#F4262F",
          }}
        />
        <div className="w-full flex justify-between text-xs px-2 mt-2">
          {marketingBudgetRanges.map((value, index) => (
            <span key={index} className="font-medium">
              {index === 0
                ? "$1K"
                : index === marketingBudgetRanges.length - 1
                ? "$10K+"
                : value >= 10000
                ? "$" + value / 1000 + "K"
                : "$" + value / 1000 + "K"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BusinessMetrics;
