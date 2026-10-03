import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function CalcButton({ label, onClick, type = "number", wide = false }) {
  let style = "bg-slate-700 text-white hover:bg-slate-600";

  if (type === "operator") {
    style = "bg-blue-600 text-white hover:bg-blue-500";
  }

  if (type === "utility") {
    style = "bg-slate-600 text-white hover:bg-slate-500";
  }

  if (type === "equals") {
    style = "bg-emerald-500 text-white hover:bg-emerald-400";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${style} ${
        wide ? "col-span-2" : ""
      } min-h-16 w-full rounded-2xl text-xl font-bold transition active:scale-95`}
    >
      {label}
    </button>
  );
}

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);

  function numberClick(number) {
    if (waiting) {
      setDisplay(number);
      setWaiting(false);
      return;
    }

    if (display === "0") {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  }

  function decimalClick() {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  function clearClick() {
    setDisplay("0");
    setFirstNumber(null);
    setOperator(null);
    setWaiting(false);
  }

  function operatorClick(newOperator) {
    const currentNumber = Number(display);

    if (firstNumber === null) {
      setFirstNumber(currentNumber);
    } else if (operator && !waiting) {
      const result = calculate(
        firstNumber,
        operator,
        currentNumber
      );

      if (result === null) {
        setDisplay("Error");
        setFirstNumber(null);
        setOperator(null);
        return;
      }

      setDisplay(String(result));
      setFirstNumber(result);
    }

    setOperator(newOperator);
    setWaiting(true);
  }

  function equalsClick() {
    if (firstNumber === null || operator === null) {
      return;
    }

    const result = calculate(
      firstNumber,
      operator,
      Number(display)
    );

    if (result === null) {
      setDisplay("Cannot divide by 0");
    } else {
      setDisplay(String(result));
    }

    setFirstNumber(null);
    setOperator(null);
    setWaiting(true);
  }

  function calculate(a, op, b) {
    if (op === "+") return a + b;
    if (op === "−") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") {
      if (b === 0) return null;
      return a / b;
    }

    return b;
  }

  function toggleSign() {
    if (display === "0" || display === "Error") return;

    setDisplay(
      display.startsWith("-")
        ? display.substring(1)
        : "-" + display
    );
  }

  function percentClick() {
    if (display === "Error") return;

    setDisplay(String(Number(display) / 100));
  }

  function backspaceClick() {
    if (display.length <= 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  }

  useEffect(() => {
    function handleKeyboard(event) {
      const key = event.key;

      if (key >= "0" && key <= "9") {
        numberClick(key);
      } else if (key === ".") {
        decimalClick();
      } else if (key === "+") {
        operatorClick("+");
      } else if (key === "-") {
        operatorClick("−");
      } else if (key === "*") {
        operatorClick("×");
      } else if (key === "/") {
        event.preventDefault();
        operatorClick("÷");
      } else if (key === "Enter" || key === "=") {
        equalsClick();
      } else if (key === "Escape") {
        clearClick();
      } else if (key === "Backspace") {
        backspaceClick();
      } else if (key === "%") {
        percentClick();
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  });

  return (
    <div className="w-full max-w-md rounded-[2rem] bg-slate-900 p-5 shadow-2xl">

      {/* DISPLAY */}
      <div className="mb-5 rounded-3xl bg-slate-800 p-6 text-right">
        <div className="mb-2 text-sm text-slate-400">
          {operator
            ? `Operation: ${operator}`
            : "Ready to calculate"}
        </div>

        <div className="min-h-16 break-all text-4xl font-bold text-white sm:text-5xl">
          {display}
        </div>
      </div>

      {/* BUTTON GRID */}
      <div className="grid w-full grid-cols-4 gap-3">

        {/* ROW 1 */}
        <CalcButton
          label="AC"
          onClick={clearClick}
          type="utility"
        />

        <CalcButton
          label="±"
          onClick={toggleSign}
          type="utility"
        />

        <CalcButton
          label="%"
          onClick={percentClick}
          type="utility"
        />

        <CalcButton
          label="÷"
          onClick={() => operatorClick("÷")}
          type="operator"
        />

        {/* ROW 2 */}
        <CalcButton
          label="7"
          onClick={() => numberClick("7")}
        />

        <CalcButton
          label="8"
          onClick={() => numberClick("8")}
        />

        <CalcButton
          label="9"
          onClick={() => numberClick("9")}
        />

        <CalcButton
          label="×"
          onClick={() => operatorClick("×")}
          type="operator"
        />

        {/* ROW 3 */}
        <CalcButton
          label="4"
          onClick={() => numberClick("4")}
        />

        <CalcButton
          label="5"
          onClick={() => numberClick("5")}
        />

        <CalcButton
          label="6"
          onClick={() => numberClick("6")}
        />

        <CalcButton
          label="−"
          onClick={() => operatorClick("−")}
          type="operator"
        />

        {/* ROW 4 */}
        <CalcButton
          label="1"
          onClick={() => numberClick("1")}
        />

        <CalcButton
          label="2"
          onClick={() => numberClick("2")}
        />

        <CalcButton
          label="3"
          onClick={() => numberClick("3")}
        />

        <CalcButton
          label="+"
          onClick={() => operatorClick("+")}
          type="operator"
        />

        {/* ROW 5 */}
        <CalcButton
          label="0"
          onClick={() => numberClick("0")}
          wide
        />

        <CalcButton
          label="."
          onClick={decimalClick}
        />

        <CalcButton
          label="="
          onClick={equalsClick}
          type="equals"
        />

      </div>

      {/* BACKSPACE */}
      <button
        type="button"
        onClick={backspaceClick}
        className="mt-3 w-full rounded-2xl bg-slate-800 py-3 font-semibold text-slate-300 hover:bg-slate-700"
      >
        Backspace
      </button>

    </div>
  );
}

function GuideCard({ title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 font-bold text-blue-700">
        ✓
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="text-xl font-extrabold text-slate-900">
            Calc<span className="text-blue-600">ura</span>
          </div>

          <a
            href="#guide"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            User Guide
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2">

        <div>
          <div className="mb-5 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            DCIT 26 • Laboratory 1
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-950">
            A simple calculator built with React.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Perform everyday arithmetic with a responsive
            interface, React state management, keyboard
            support, and error handling.
          </p>

          <div className="mt-7 flex gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200">
              React
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200">
              Tailwind CSS
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200">
              Responsive
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Calculator />
        </div>

      </section>

      {/* USER GUIDE */}
      <section
        id="guide"
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-5 py-16">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Instructions
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-950">
            How to use the calculator
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            Use the buttons on screen or your keyboard.
            The calculator uses React state and event handling
            for interactive calculations.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <GuideCard
              title="Basic Operations"
              text="Perform addition, subtraction, multiplication, and division."
            />

            <GuideCard
              title="Clear / Reset"
              text="Press AC to clear the current calculation."
            />

            <GuideCard
              title="Keyboard Support"
              text="Use numbers, operators, Enter, Escape, Backspace, and percentage."
            />

            <GuideCard
              title="Decimal Numbers"
              text="Use the decimal button to calculate decimal values."
            />

            <GuideCard
              title="Error Handling"
              text="Division by zero is detected and displayed as an error."
            />

            <GuideCard
              title="Responsive Design"
              text="The calculator works on desktop and mobile screen sizes."
            />

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-10 text-center text-white">
        <p className="text-sm text-slate-400">
          Application Development and Emerging Technologies
        </p>

        <p className="mt-2 font-semibold">
          Built with React • Tailwind CSS • Vite
        </p>
      </footer>

    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);