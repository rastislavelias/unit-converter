const unitTypeEl = document.getElementById('unit-type');
const inputValueEl = document.getElementById('input-value');
const fieldError = document.querySelector('.field-error');
const fromUnitEl = document.getElementById('from-unit');
const toUnitEl = document.getElementById('to-unit');
const resultNumberEl = document.querySelector('.result-number');
const resultUnitEl = document.querySelector('.result-unit');
const resultEmptyEl = document.querySelector('.result-empty');
const resultMeta = document.querySelector('.result-meta');
const emptyResultMessage = 'Enter a value to see result';
const data = [
  {
    unitType: 'Length',
    baseUnit: 'meter',
    allowNegative: false,
    maxValue: 1e7,
    precision: 2,
    units: {
      meter: {
        name: 'Meter',
        symbol: 'm',
        format: (value) => pluralize(value, 'Meter', 'Meters'),
        toBase: (value) => value,
        fromBase: (value) => value
      },
      centimeter: {
        name: 'Centimeter',
        symbol: 'cm',
        format: (value) => pluralize(value, 'Centimeter', 'Centimeters'),
        toBase: (value) => value / 100,
        fromBase: (value) => value * 100
      },
      kilometer: {
        name: 'Kilometer',
        symbol: 'km',
        format: (value) => pluralize(value, 'Kilometer', 'Kilometers'),
        toBase: (value) => value * 1000,
        fromBase: (value) => value / 1000
      },
      inch: {
        name: 'Inch',
        symbol: 'in',
        format: (value) => pluralize(value, 'Inch', 'Inches'),
        toBase: (value) => value * 0.0254,
        fromBase: (value) => value / 0.0254
      },
      foot: {
        name: 'Foot',
        symbol: 'ft',
        format: (value) => pluralize(value, 'Foot', 'Feet'),
        toBase: (value) => value * 0.3048,
        fromBase: (value) => value / 0.3048
      }
    }
  },

  {
    unitType: 'Weight',
    baseUnit: 'gram',
    allowNegative: false,
    maxValue: 1e9,
    precision: 2,
    units: {
      gram: {
        name: 'Gram',
        symbol: 'g',
        format: (value) => pluralize(value, 'Gram', 'Grams'),
        toBase: (value) => value,
        fromBase: (value) => value
      },
      kilogram: {
        name: 'Kilogram',
        symbol: 'kg',
        format: (value) => pluralize(value, 'Kilogram', 'Kilograms'),
        toBase: (value) => value * 1000,
        fromBase: (value) => value / 1000
      },
      pound: {
        name: 'Pound',
        symbol: 'lb',
        format: (value) => pluralize(value, 'Pound', 'Pounds'),
        toBase: (value) => value * 453.59237,
        fromBase: (value) => value / 453.59237
      }
    }
  },

  {
    unitType: 'Temperature',
    baseUnit: 'celsius',
    allowNegative: true,
    maxValue: 1e4,
    precision: 1,
    units: {
      celsius: {
        name: 'Celsius',
        symbol: '°C',
        format: () => '°C',
        toBase: (value) => value,
        fromBase: (value) => value
      },
      fahrenheit: {
        name: 'Fahrenheit',
        symbol: '°F',
        format: () => '°F',
        toBase: (value) => (value - 32) * (5 / 9),
        fromBase: (value) => value * (9 / 5) + 32
      }
    }
  }
];

// Init
populateUnitTypeSelect()
populateUnitSelectsByType(0);
resultEmptyEl.textContent = emptyResultMessage;

// Event listeners
unitTypeEl.addEventListener('change', () => {
  const unitTypeIndex = Number(unitTypeEl.value);

  populateUnitSelectsByType(unitTypeIndex);
  convert();
})
fromUnitEl.addEventListener('change', convert);
toUnitEl.addEventListener('change', convert);
inputValueEl.addEventListener('input', convert);

// Utils
const pluralize = (value, singular, plural) =>
  Math.abs(value - 1) < Number.EPSILON ? singular : plural;

function populateUnitTypeSelect() {
  data.forEach(({ unitType }, index) => {
    const optionEl = document.createElement('option');
    
    optionEl.value = index;
    optionEl.textContent = unitType;
    unitTypeEl.appendChild(optionEl);
  });
}

function populateUnitSelectsByType(unitType) {
  const { units } = data[unitType];

  // Clear existing options
  fromUnitEl.innerHTML = '';
  toUnitEl.innerHTML = '';

  Object.entries(units).forEach(([key, obj], index) => {
    const optionEl = document.createElement('option');
    optionEl.value = key;
    optionEl.textContent = obj.name;
    
    // from-unit: always first option selected
    fromUnitEl.appendChild(optionEl.cloneNode(true));

    // to-unit: second option selected by default (if exists)
    optionEl.selected = index === 1;
    toUnitEl.appendChild(optionEl);
  })
}

function convert() {
  const unitTypeIndex = Number(unitTypeEl.value);
  const rawInputValue = inputValueEl.value;
  const value = Number(rawInputValue);
  const fromUnit = fromUnitEl.value;
  const toUnit = toUnitEl.value;
  const unitTypeConfig = data[unitTypeIndex];
  const { precision } = unitTypeConfig;
  const fromConfig = unitTypeConfig.units[fromUnit];
  const toConfig = unitTypeConfig.units[toUnit];

  if (rawInputValue === '') {
    resetResult();
    return;
  }

  const { error } = validate(value);

  if (error) {
    showError(error);
    return;
  }

  hideError();

  const baseValue = fromConfig.toBase(value);
  const result = toConfig.fromBase(baseValue);

  resultNumberEl.textContent = formatNumber(result, precision);
  resultEmptyEl.textContent = '';
  resultUnitEl.textContent = toConfig.symbol;
  resultMeta.textContent = `(from ${formatNumber(value, precision)} ${fromConfig.format(value)})`;
}

function validate(value) {
  const unitType = unitTypeEl.value;
  const { allowNegative, maxValue } = data[unitType];

  if (!Number.isFinite(value)) {
    return { error: 'Enter a valid number' };
  }

  if (!allowNegative && value < 0) {
    return { error: 'Negative values are not allowed' };
  }

  if (Math.abs(value) > maxValue) {
    return { error: 'Value is too large' };
  }

  return { error: null };
}

function resetResult(){
  resultNumberEl.textContent = '';
  resultUnitEl.textContent = '';
  resultMeta.textContent = '';
  resultEmptyEl.textContent = emptyResultMessage;
}

function formatNumber(value, precision = 2) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

function showError(message) {
  fieldError.textContent = message;
  fieldError.classList.add('show');
  inputValueEl.classList.add('has-error');

  resetResult()
}

function hideError() {
  fieldError.textContent = '';
  fieldError.classList.remove('show');
  inputValueEl.classList.remove('has-error');
}
