# Unit Converter

A small, self-contained web application for converting **length**, **weight**, and **temperature** units.

This project was built as a **practice exercise in core JavaScript and UI fundamentals**, with an emphasis on clean data modeling, validation logic, and accessible user interfaces — without relying on frameworks or libraries.

## Key Features

- Unit conversion for:
  - **Length** (meter, centimeter, kilometer, inch, foot)
  - **Weight** (gram, kilogram, pound)
  - **Temperature** (Celsius, Fahrenheit)
- Instant conversion on input change
- Data-driven configuration per unit type:
  - Negative values allowed only where meaningful
  - Maximum input limits per unit category
  - Configurable numeric precision
- Clear, readable number formatting
- Proper singular / plural unit labels (`1 Meter` vs `2 Meters`)
- Short unit symbols in results (`km`, `kg`, `°C`)
- Accessible error handling without excessive screen reader announcements
- No external dependencies

## Tech Stack

- **HTML**
- **CSS**
- **Vanilla JavaScript**

No frameworks, build tools, or libraries were used.

## Engineering Focus

This project intentionally focuses on fundamentals rather than features:

- Data-driven application design
- Separation of concerns (data, logic, UI)
- Input validation strategies
- Floating-point precision handling
- DOM manipulation and event handling
- Preventing layout shifts in dynamic interfaces
- Accessible form feedback patterns

## Implementation Overview

- Each unit category (Length, Weight, Temperature) is defined in a centralized data model.
- All conversions are performed via a **base unit** (e.g. meters, grams, celsius).
- Validation rules (negative values, maximum input, precision) are defined per unit category rather than hard-coded.
- The UI updates immediately as the user types or changes units.

## Accessibility Notes

- Errors are presented visually without overusing `aria-live`
- No repeated announcements on every keystroke
- Consistent focus styles across inputs and selects
- Stable layout when results or errors appear

## Scope Decisions

The following features were intentionally omitted to keep the project focused:

- Keyboard shortcuts
- Unit swap button
- Persistent state (e.g. saved preferences)

## Live Demo

https://rastislavelias.github.io/unit-converter

## Author

**Rastislav Elias**  
https://rastislavelias.com
