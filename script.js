/* =========================================
   SaiCalc - Smart Scientific Calculator
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const expressionDisplay =
    document.getElementById("expression");

const resultDisplay =
    document.getElementById("result");

const scientificBtn =
    document.getElementById("scientificBtn");

const scientificPanel =
    document.getElementById("scientificPanel");

const themeBtn =
    document.getElementById("themeBtn");

const angleBtn =
    document.getElementById("angleBtn");

const modeIndicator =
    document.getElementById("modeIndicator");

const copyBtn =
    document.getElementById("copyBtn");

const historyList =
    document.getElementById("historyList");

const clearHistoryBtn =
    document.getElementById("clearHistory");


/* =========================================
   VARIABLES
========================================= */

let expression = "";

let angleMode =
    localStorage.getItem("saiCalcAngleMode") || "DEG";

let history =
    JSON.parse(
        localStorage.getItem("saiCalcHistory")
    ) || [];


/* =========================================
   DISPLAY
========================================= */

function updateDisplay() {

    expressionDisplay.textContent =
        expression || "0";

    modeIndicator.textContent =
        angleMode;

    try {

        if (
            expression &&
            !/[+\-*/^%.(]$/.test(expression)
        ) {

            const value =
                calculateExpression(expression);

            if (
                value !== undefined &&
                value !== null &&
                Number.isFinite(value)
            ) {

                resultDisplay.textContent =
                    formatNumber(value);

            } else {

                resultDisplay.textContent = "0";
            }

        } else {

            resultDisplay.textContent = "0";
        }

    } catch {

        resultDisplay.textContent = "0";
    }
}


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(number) {

    if (!Number.isFinite(number)) {

        return "Error";
    }

    if (Math.abs(number) < 0.0000000001) {

        number = 0;
    }

    return Number(
        number.toFixed(10)
    ).toString();
}


/* =========================================
   CALCULATE EXPRESSION
========================================= */

function calculateExpression(input) {

    let clean = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**");


    /* -------------------------------------
       Convert π
    ------------------------------------- */

    clean = clean.replace(
        /π/g,
        String(Math.PI)
    );


    /* -------------------------------------
       Convert e
    ------------------------------------- */

    clean = clean.replace(
        /e/g,
        String(Math.E)
    );


    /* -------------------------------------
       Percentage
    ------------------------------------- */

    clean = clean.replace(
        /(\d+(?:\.\d+)?)%/g,
        "($1/100)"
    );


    /* -------------------------------------
       Allowed characters
    ------------------------------------- */

    if (
        !/^[0-9+\-*/().%\s*]+$/.test(clean)
    ) {

        throw new Error(
            "Invalid expression"
        );
    }


    /* -------------------------------------
       Incomplete expression
    ------------------------------------- */

    if (
        /[+\-*/.%]$/.test(clean)
    ) {

        throw new Error(
            "Incomplete expression"
        );
    }


    /* -------------------------------------
       Evaluate
    ------------------------------------- */

    const result =
        Function(
            `"use strict"; return (${clean})`
        )();


    if (
        typeof result !== "number" ||
        !Number.isFinite(result)
    ) {

        throw new Error(
            "Invalid result"
        );
    }


    return result;
}


/* =========================================
   ADD VALUE
========================================= */

function addValue(value) {

    /* -------------------------------------
       Decimal protection
    ------------------------------------- */

    if (value === ".") {

        const parts =
            expression.split(
                /[+\-×÷*/%^()]/
            );

        const currentNumber =
            parts[parts.length - 1];

        if (
            currentNumber.includes(".")
        ) {

            return;
        }
    }


    /* -------------------------------------
       Operator protection
    ------------------------------------- */

    if (
        "+-*/^".includes(value)
    ) {

        if (
            expression === "" &&
            value !== "-"
        ) {

            return;
        }

        const lastChar =
            expression.slice(-1);

        if (
            "+-*/^".includes(lastChar)
        ) {

            expression =
                expression.slice(0, -1);
        }
    }


    expression += value;

    updateDisplay();
}


/* =========================================
   CLEAR
========================================= */

function clearCalculator() {

    expression = "";

    expressionDisplay.textContent = "0";

    resultDisplay.textContent = "0";
}


/* =========================================
   DELETE
========================================= */

function deleteLast() {

    expression =
        expression.slice(0, -1);

    updateDisplay();
}


/* =========================================
   PERCENTAGE
========================================= */

function addPercentage() {

    if (!expression) {

        return;
    }

    const lastChar =
        expression.slice(-1);

    if (
        !/[0-9)]/.test(lastChar)
    ) {

        return;
    }

    expression += "%";

    updateDisplay();
}


/* =========================================
   PLUS / MINUS
========================================= */

function toggleSign() {

    if (!expression) {

        expression = "-";

        updateDisplay();

        return;
    }

    try {

        const value =
            calculateExpression(expression);

        expression =
            formatNumber(-value);

        updateDisplay();

    } catch {

        showError();
    }
}


/* =========================================
   MAIN CALCULATION
========================================= */

function calculate() {

    if (!expression) {

        return;
    }

    try {

        const oldExpression =
            expression;

        const result =
            calculateExpression(expression);

        expression =
            formatNumber(result);

        expressionDisplay.textContent =
            oldExpression;

        resultDisplay.textContent =
            expression;

        addHistory(
            oldExpression,
            expression
        );

    } catch (error) {

        console.error(error);

        showError();
    }
}


/* =========================================
   ERROR
========================================= */

function showError() {

    expressionDisplay.textContent =
        "Invalid calculation";

    resultDisplay.textContent =
        "Error";
}


/* =========================================
   SCIENTIFIC FUNCTIONS
========================================= */

function scientificFunction(type) {

    try {

        let value;


        /* ---------------------------------
           Get current value
        --------------------------------- */

        if (expression) {

            value =
                calculateExpression(expression);

        } else {

            value = 0;
        }


        let result;


        /* ---------------------------------
           SIN
        --------------------------------- */

        if (type === "sin") {

            if (angleMode === "DEG") {

                result =
                    Math.sin(
                        value * Math.PI / 180
                    );

            } else {

                result =
                    Math.sin(value);
            }
        }


        /* ---------------------------------
           COS
        --------------------------------- */

        else if (type === "cos") {

            if (angleMode === "DEG") {

                result =
                    Math.cos(
                        value * Math.PI / 180
                    );

            } else {

                result =
                    Math.cos(value);
            }
        }


        /* ---------------------------------
           TAN
        --------------------------------- */

        else if (type === "tan") {

            if (angleMode === "DEG") {

                result =
                    Math.tan(
                        value * Math.PI / 180
                    );

            } else {

                result =
                    Math.tan(value);
            }
        }


        /* ---------------------------------
           SQUARE ROOT
        --------------------------------- */

        else if (type === "sqrt") {

            if (value < 0) {

                throw new Error(
                    "Negative square root"
                );
            }

            result =
                Math.sqrt(value);
        }


        /* ---------------------------------
           SQUARE
        --------------------------------- */

        else if (type === "square") {

            result =
                value * value;
        }


        /* ---------------------------------
           POWER
        --------------------------------- */

        else if (type === "power") {

            expression += "^";

            updateDisplay();

            return;
        }


        /* ---------------------------------
           PI
        --------------------------------- */

        else if (type === "pi") {

            if (
                expression &&
                /[0-9)]$/.test(expression)
            ) {

                expression += "*";
            }

            expression += "π";

            updateDisplay();

            return;
        }


        /* ---------------------------------
           EULER NUMBER
        --------------------------------- */

        else if (type === "e") {

            if (
                expression &&
                /[0-9)]$/.test(expression)
            ) {

                expression += "*";
            }

            expression += "e";

            updateDisplay();

            return;
        }


        else {

            return;
        }


        /* ---------------------------------
           Remove floating point error
        --------------------------------- */

        if (
            Math.abs(result) <
            0.0000000001
        ) {

            result = 0;
        }


        expression =
            formatNumber(result);

        updateDisplay();

    } catch (error) {

        console.error(error);

        showError();
    }
}


/* =========================================
   HISTORY
========================================= */

function addHistory(
    expressionValue,
    resultValue
) {

    history.unshift({

        expression: expressionValue,

        result: resultValue
    });


    /* Keep only 20 */

    history =
        history.slice(0, 20);


    localStorage.setItem(
        "saiCalcHistory",
        JSON.stringify(history)
    );


    displayHistory();
}


/* =========================================
   DISPLAY HISTORY
========================================= */

function displayHistory() {

    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                No calculations yet
            </div>
        `;

        return;
    }


    history.forEach(
        (item, index) => {

            const historyItem =
                document.createElement("div");

            historyItem.className =
                "history-item";


            historyItem.innerHTML = `

                <div class="history-expression">
                    ${escapeHTML(item.expression)}
                </div>

                <div class="history-result">
                    = ${escapeHTML(item.result)}
                </div>

                <button
                    class="history-use"
                    data-index="${index}">
                    Use
                </button>
            `;


            historyList.appendChild(
                historyItem
            );
        }
    );


    /* -------------------------------------
       Use history buttons
    ------------------------------------- */

    document
        .querySelectorAll(".history-use")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    expression =
                        history[index].result;

                    updateDisplay();
                }
            );
        });
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        localStorage.removeItem(
            "saiCalcHistory"
        );

        displayHistory();
    }
);


/* =========================================
   COPY RESULT
========================================= */

copyBtn.addEventListener(
    "click",
    async () => {

        const result =
            resultDisplay.textContent;


        if (
            !result ||
            result === "0" ||
            result === "Error"
        ) {

            return;
        }


        try {

            await navigator.clipboard
                .writeText(result);

            const oldText =
                copyBtn.textContent;

            copyBtn.textContent = "✓";

            setTimeout(() => {

                copyBtn.textContent =
                    oldText;

            }, 1000);

        } catch (error) {

            console.error(error);
        }
    }
);


/* =========================================
   NORMAL BUTTONS
========================================= */

document
    .querySelectorAll(".btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.value;

                const action =
                    button.dataset.action;


                if (
                    value !== undefined
                ) {

                    addValue(value);

                    return;
                }


                if (
                    action === "clear"
                ) {

                    clearCalculator();

                    return;
                }


                if (
                    action === "delete"
                ) {

                    deleteLast();

                    return;
                }


                if (
                    action === "percentage"
                ) {

                    addPercentage();

                    return;
                }


                if (
                    action === "sign"
                ) {

                    toggleSign();

                    return;
                }


                if (
                    action === "calculate"
                ) {

                    calculate();

                    return;
                }
            }
        );
    });


/* =========================================
   SCIENTIFIC BUTTONS
========================================= */

document
    .querySelectorAll(".scientific-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.value;

                const scientific =
                    button.dataset.scientific;


                if (
                    value !== undefined
                ) {

                    addValue(value);

                    return;
                }


                if (scientific) {

                    scientificFunction(
                        scientific
                    );
                }
            }
        );
    });


/* =========================================
   SCIENTIFIC / BASIC TOGGLE
========================================= */

scientificBtn.addEventListener(
    "click",
    () => {

        scientificPanel
            .classList
            .toggle("show");


        if (
            scientificPanel
                .classList
                .contains("show")
        ) {

            scientificBtn.textContent =
                "BASIC";

        } else {

            scientificBtn.textContent =
                "SCI";
        }
    }
);


/* =========================================
   DEG / RAD TOGGLE
========================================= */

angleBtn.addEventListener(
    "click",
    () => {

        if (angleMode === "DEG") {

            angleMode = "RAD";

        } else {

            angleMode = "DEG";
        }


        localStorage.setItem(
            "saiCalcAngleMode",
            angleMode
        );


        angleBtn.textContent =
            angleMode;

        modeIndicator.textContent =
            angleMode;
    }
);


/* =========================================
   THEME
========================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body
            .classList
            .toggle("light");


        const isLight =
            document.body
                .classList
                .contains("light");


        localStorage.setItem(
            "saiCalcTheme",
            isLight
                ? "light"
                : "dark"
        );


        themeBtn.textContent =
            isLight
                ? "🌙"
                : "☀";
    }
);


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;


        /* Numbers */

        if (/^[0-9]$/.test(key)) {

            addValue(key);

            return;
        }


        /* Decimal */

        if (key === ".") {

            addValue(".");

            return;
        }


        /* Operators */

        if (key === "+") {

            addValue("+");

            return;
        }


        if (key === "-") {

            addValue("-");

            return;
        }


        if (key === "*") {

            addValue("*");

            return;
        }


        if (key === "/") {

            event.preventDefault();

            addValue("/");

            return;
        }


        /* Percentage */

        if (key === "%") {

            addPercentage();

            return;
        }


        /* Parentheses */

        if (
            key === "(" ||
            key === ")"
        ) {

            addValue(key);

            return;
        }


        /* Power */

        if (key === "^") {

            addValue("^");

            return;
        }


        /* Calculate */

        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

            return;
        }


        /* Delete */

        if (key === "Backspace") {

            deleteLast();

            return;
        }


        /* Clear */

        if (key === "Escape") {

            clearCalculator();

            return;
        }
    }
);


/* =========================================
   LOAD SAVED THEME
========================================= */

const savedTheme =
    localStorage.getItem(
        "saiCalcTheme"
    );


if (savedTheme === "light") {

    document.body
        .classList
        .add("light");

    themeBtn.textContent = "🌙";

} else {

    themeBtn.textContent = "☀";
}


/* =========================================
   LOAD SAVED ANGLE MODE
========================================= */

angleBtn.textContent =
    angleMode;

modeIndicator.textContent =
    angleMode;


/* =========================================
   INITIAL LOAD
========================================= */

updateDisplay();

displayHistory();