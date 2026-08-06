"use strict";

/* ============================================================
   CINEPREDICT
   script.js
   Form Validation + Result Handling + Charts
============================================================ */


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================================
       FORM VALIDATION
    ======================================================== */

    const form = document.getElementById("predictionForm");

    if (form) {

        form.addEventListener("submit", function (event) {

            let valid = true;

            /* ------------------------------------------------
               Remove previous errors
            ------------------------------------------------ */

            const fields = form.querySelectorAll(
                "input, select"
            );

            fields.forEach(function (field) {
                field.classList.remove("input-error");
            });


            /* ------------------------------------------------
               Required field validation
            ------------------------------------------------ */

            const requiredFields = form.querySelectorAll(
                "[required]"
            );

            requiredFields.forEach(function (field) {

                const value = String(field.value || "").trim();

                if (!value) {

                    field.classList.add("input-error");

                    valid = false;
                }

            });


            /* =================================================
               MOVIE NAME
            ================================================= */

            const name = form.querySelector("[name='name']");

            if (name && name.value.trim()) {

                if (
                    name.value.trim().length < 2 ||
                    name.value.trim().length > 100
                ) {

                    name.classList.add("input-error");

                    valid = false;
                }

            }


            /* =================================================
               RELEASE YEAR
            ================================================= */

            const year = form.querySelector("[name='year']");

            if (year && year.value) {

                const yearValue = Number(year.value);

                if (
                    !Number.isInteger(yearValue) ||
                    yearValue < 1900 ||
                    yearValue > 2100
                ) {

                    year.classList.add("input-error");

                    valid = false;
                }

            }


            /* =================================================
               IMDb SCORE
            ================================================= */

            const score = form.querySelector("[name='score']");

            if (score && score.value) {

                const scoreValue = Number(score.value);

                if (
                    !Number.isFinite(scoreValue) ||
                    scoreValue < 0 ||
                    scoreValue > 10
                ) {

                    score.classList.add("input-error");

                    valid = false;
                }

            }


            /* =================================================
               IMDb VOTES
            ================================================= */

            const votes = form.querySelector("[name='votes']");

            if (votes && votes.value) {

                const votesValue = Number(votes.value);

                if (
                    !Number.isFinite(votesValue) ||
                    votesValue < 0
                ) {

                    votes.classList.add("input-error");

                    valid = false;
                }

            }


            /* =================================================
               BUDGET
            ================================================= */

            const budget = form.querySelector("[name='budget']");

            if (budget && budget.value) {

                const budgetValue = Number(budget.value);

                if (
                    !Number.isFinite(budgetValue) ||
                    budgetValue <= 0
                ) {

                    budget.classList.add("input-error");

                    valid = false;
                }

            }


            /* =================================================
               RUNTIME
            ================================================= */

            const runtime = form.querySelector("[name='runtime']");

            if (runtime && runtime.value) {

                const runtimeValue = Number(runtime.value);

                if (
                    !Number.isInteger(runtimeValue) ||
                    runtimeValue < 1 ||
                    runtimeValue > 600
                ) {

                    runtime.classList.add("input-error");

                    valid = false;
                }

            }


            /* =================================================
               RELEASE DATE
            ================================================= */

            const released = form.querySelector(
                "[name='released']"
            );

            if (released && released.value) {

                const date = new Date(released.value);

                if (Number.isNaN(date.getTime())) {

                    released.classList.add("input-error");

                    valid = false;
                }

            }


            /* =================================================
               STOP INVALID FORM
            ================================================= */

            if (!valid) {

                event.preventDefault();

                alert(
                    "Please check the highlighted fields and enter valid values."
                );

                return;
            }


            /* =================================================
               BUTTON LOADING STATE
            ================================================= */

            const button = document.getElementById(
                "predictButton"
            );

            if (button) {

                button.disabled = true;

                const span = button.querySelector("span");

                if (span) {

                    span.textContent =
                        "Analyzing Movie...";

                } else {

                    button.textContent =
                        "Analyzing Movie...";

                }

            }

            /*
             * IMPORTANT:
             * We DO NOT preventDefault() here.
             *
             * Flask will receive the form normally.
             */

        });


        /* ====================================================
           LIVE ERROR REMOVAL
        ==================================================== */

        const allInputs = form.querySelectorAll(
            "input, select"
        );

        allInputs.forEach(function (field) {

            field.addEventListener(
                "input",
                function () {

                    this.classList.remove(
                        "input-error"
                    );

                }
            );


            field.addEventListener(
                "change",
                function () {

                    this.classList.remove(
                        "input-error"
                    );

                }
            );

        });

    }


    /* ========================================================
       RESULT PAGE
    ======================================================== */

    let prediction = null;


    /* ========================================================
       METHOD 1
       Flask Embedded JSON
    ======================================================== */

    const dataElement = document.getElementById(
        "prediction-data"
    );


    if (dataElement) {

        try {

            const jsonText =
                dataElement.textContent.trim();

            if (jsonText) {

                prediction =
                    JSON.parse(jsonText);

            }

        } catch (error) {

            console.error(
                "Flask prediction JSON error:",
                error
            );

        }

    }


    /* ========================================================
       METHOD 2
       LocalStorage Fallback
    ======================================================== */

    if (!prediction) {

        try {

            const storedData =
                localStorage.getItem(
                    "prediction"
                );

            if (storedData) {

                prediction =
                    JSON.parse(storedData);

            }

        } catch (error) {

            console.error(
                "LocalStorage prediction error:",
                error
            );

        }

    }


    /* ========================================================
       HELPER: SAFE TEXT
    ======================================================== */

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            element.textContent = "-";

        } else {

            element.textContent = String(value);

        }

    }


    /* ========================================================
       HELPER: MONEY FORMAT
    ======================================================== */

    function formatMoney(value) {

        const number =
            Number(value);

        if (!Number.isFinite(number)) {

            return "$0";

        }


        const absolute =
            Math.abs(number);


        if (absolute >= 1000000000) {

            return (
                "$" +
                (number / 1000000000).toFixed(2) +
                " Billion"
            );

        }


        if (absolute >= 1000000) {

            return (
                "$" +
                (number / 1000000).toFixed(2) +
                " Million"
            );

        }


        if (absolute >= 1000) {

            return (
                "$" +
                (number / 1000).toFixed(2) +
                " Thousand"
            );

        }


        return (
            "$" +
            number.toLocaleString(
                "en-US",
                {
                    maximumFractionDigits: 0
                }
            )
        );

    }


    /* ========================================================
       HELPER: NUMBER FORMAT
    ======================================================== */

    function formatNumber(value) {

        const number =
            Number(value);

        if (!Number.isFinite(number)) {

            return "0";

        }

        return number.toLocaleString("en-US");

    }


    /* ========================================================
       LOAD RESULT
    ======================================================== */

    if (prediction) {


        /* ====================================================
           MOVIE INFORMATION
        ==================================================== */

        setText(
            "movieName",
            prediction.name
        );

        setText(
            "movieGenre",
            prediction.genre
        );

        setText(
            "movieRating",
            prediction.rating
        );

        setText(
            "movieYear",
            prediction.year
        );

        setText(
            "movieReleased",
            prediction.released
        );


        /* ====================================================
           SCORE
        ==================================================== */

        const score =
            Number(prediction.score);

        setText(
            "movieScore",
            Number.isFinite(score)
                ? score.toFixed(1)
                : "-"
        );


        /* ====================================================
           VOTES
        ==================================================== */

        setText(
            "movieVotes",
            formatNumber(
                prediction.votes
            )
        );


        /* ====================================================
           PEOPLE / COMPANY
        ==================================================== */

        setText(
            "movieDirector",
            prediction.director
        );

        setText(
            "movieWriter",
            prediction.writer
        );

        setText(
            "movieStar",
            prediction.star
        );

        setText(
            "movieCountry",
            prediction.country
        );

        setText(
            "movieCompany",
            prediction.company
        );


        /* ====================================================
           RUNTIME
        ==================================================== */

        const runtime =
            Number(prediction.runtime);

        setText(
            "movieRuntime",
            Number.isFinite(runtime)
                ? runtime + " Min"
                : "-"
        );


        /* ====================================================
           FINANCIAL VALUES
        ==================================================== */

        const budget =
            Number(prediction.budget) || 0;

        const revenue =
            Number(prediction.revenue) || 0;

        let profit =
            Number(prediction.profit);


        if (!Number.isFinite(profit)) {

            profit =
                revenue - budget;

        }


        let roi =
            Number(prediction.roi);


        if (!Number.isFinite(roi)) {

            roi =
                budget > 0
                    ? (profit / budget) * 100
                    : 0;

        }


        /* ====================================================
           RESULT SUMMARY
        ==================================================== */

        setText(
            "budgetResult",
            formatMoney(budget)
        );

        setText(
            "summaryBudget",
            formatMoney(budget)
        );


        setText(
            "revenue",
            formatMoney(revenue)
        );

        setText(
            "summaryRevenue",
            formatMoney(revenue)
        );


        setText(
            "profit",
            formatMoney(profit)
        );


        setText(
            "roi",
            roi.toFixed(2) + "%"
        );

        setText(
            "summaryROI",
            roi.toFixed(2) + "%"
        );


        /* ====================================================
           PERFORMANCE
        ==================================================== */

        const category =
            prediction.category ||
            getCategory(roi);


        setText(
            "category",
            category
        );

        setText(
            "summaryCategory",
            category
        );


        /* ====================================================
           RECENT PREDICTION
        ==================================================== */

        setText(
            "historyMovie",
            prediction.name
        );

        setText(
            "historyRevenue",
            formatMoney(revenue)
        );

        setText(
            "historyROI",
            roi.toFixed(2) + "%"
        );

        setText(
            "historyCategory",
            category
        );


        /* ====================================================
           CREATE ACTUAL CHARTS
        ==================================================== */

        createRevenueChart(
            budget,
            revenue,
            profit
        );


        createBudgetRevenueChart(
            budget,
            revenue
        );

    }


    /* ========================================================
       PERFORMANCE CATEGORY
    ======================================================== */

    function getCategory(roi) {

        if (roi < 0) {

            return "Flop";

        }

        if (roi < 100) {

            return "Average";

        }

        if (roi < 250) {

            return "Hit";

        }

        return "Blockbuster";

    }


    /* ========================================================
       CHART 1
       BUDGET vs REVENUE vs PROFIT
    ======================================================== */

    function createRevenueChart(
        budget,
        revenue,
        profit
    ) {

        const canvas =
            document.getElementById(
                "revenueChart"
            );


        if (!canvas) {

            console.warn(
                "revenueChart canvas not found."
            );

            return;

        }


        if (
            typeof Chart === "undefined"
        ) {

            console.error(
                "Chart.js is not loaded."
            );

            return;

        }


        /* Destroy previous chart */

        if (
            window.revenueChartInstance
        ) {

            window.revenueChartInstance.destroy();

        }


        window.revenueChartInstance =
            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: [
                            "Budget",
                            "Revenue",
                            "Profit"
                        ],

                        datasets: [

                            {

                                label:
                                    "Financial Analysis",

                                data: [
                                    budget,
                                    revenue,
                                    Math.max(
                                        profit,
                                        0
                                    )
                                ],

                                backgroundColor: [

                                    "rgba(255, 152, 0, 0.78)",

                                    "rgba(46, 204, 113, 0.78)",

                                    "rgba(229, 9, 20, 0.78)"

                                ],

                                borderColor: [

                                    "#ff9800",

                                    "#2ecc71",

                                    "#e50914"

                                ],

                                borderWidth: 2,

                                borderRadius: 12,

                                barPercentage: 0.55,

                                categoryPercentage: 0.65

                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,


                        animation: {

                            duration: 1200,

                            easing: "easeOutQuart"

                        },


                        plugins: {

                            legend: {

                                display: false

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            return (
                                                " $" +
                                                Number(
                                                    context.raw
                                                ).toLocaleString(
                                                    "en-US"
                                                )
                                            );

                                        }

                                }

                            }

                        },


                        scales: {

                            x: {

                                grid: {

                                    display: false

                                },

                                ticks: {

                                    color:
                                        "#cccccc",

                                    font: {

                                        size: 13,

                                        weight: "500"

                                    }

                                }

                            },


                            y: {

                                beginAtZero: true,


                                grid: {

                                    color:
                                        "rgba(255,255,255,0.07)"

                                },


                                ticks: {

                                    color:
                                        "#cccccc",


                                    callback:
                                        function (value) {

                                            return shortMoney(
                                                value
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    /* ========================================================
       CHART 2
       BUDGET vs PREDICTED REVENUE
    ======================================================== */

    function createBudgetRevenueChart(
        budget,
        revenue
    ) {

        const canvas =
            document.getElementById(
                "budgetChart"
            );


        if (!canvas) {

            console.warn(
                "budgetChart canvas not found."
            );

            return;

        }


        if (
            typeof Chart === "undefined"
        ) {

            console.error(
                "Chart.js is not loaded."
            );

            return;

        }


        if (
            window.budgetChartInstance
        ) {

            window.budgetChartInstance.destroy();

        }


        window.budgetChartInstance =
            new Chart(
                canvas,
                {

                    type: "doughnut",


                    data: {

                        labels: [

                            "Production Budget",

                            "Predicted Revenue"

                        ],


                        datasets: [

                            {

                                data: [

                                    budget,

                                    revenue

                                ],


                                backgroundColor: [

                                    "rgba(255, 152, 0, 0.85)",

                                    "rgba(46, 204, 113, 0.85)"

                                ],


                                borderColor: [

                                    "#ff9800",

                                    "#2ecc71"

                                ],


                                borderWidth: 2,

                                hoverOffset: 15

                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "68%",


                        animation: {

                            animateRotate: true,

                            duration: 1300

                        },


                        plugins: {

                            legend: {

                                position: "bottom",


                                labels: {

                                    color:
                                        "#ffffff",

                                    padding: 20,

                                    usePointStyle:
                                        true,

                                    pointStyle:
                                        "circle"

                                }

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            return (
                                                " " +
                                                context.label +
                                                ": " +
                                                formatMoney(
                                                    context.raw
                                                )
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    /* ========================================================
       SHORT MONEY
    ======================================================== */

    function shortMoney(value) {

        const number =
            Number(value) || 0;


        if (
            number >= 1000000000
        ) {

            return (
                "$" +
                (
                    number /
                    1000000000
                ).toFixed(1) +
                "B"
            );

        }


        if (
            number >= 1000000
        ) {

            return (
                "$" +
                (
                    number /
                    1000000
                ).toFixed(1) +
                "M"
            );

        }


        if (
            number >= 1000
        ) {

            return (
                "$" +
                (
                    number /
                    1000
                ).toFixed(1) +
                "K"
            );

        }


        return "$" + number;

    }


    /* ========================================================
       BACK BUTTON
    ======================================================== */

    const backButton =
        document.getElementById(
            "backButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "index.html";

            }
        );

    }


    /* ========================================================
       DOWNLOAD / PRINT REPORT
    ======================================================== */

    const downloadButton =
        document.getElementById(
            "downloadPDF"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }


    /* ========================================================
       SAVE PREDICTION
       Optional fallback
    ======================================================== */

    if (
        prediction &&
        !localStorage.getItem("prediction")
    ) {

        try {

            localStorage.setItem(
                "prediction",
                JSON.stringify(prediction)
            );

        } catch (error) {

            console.warn(
                "Could not save prediction.",
                error
            );

        }

    }

});