/* ==========================================================
   CinePredict
   script.js - Part 1
   Form Handling + Local Storage
========================================================== */

const form = document.getElementById("predictionForm");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const movieData = {

            name: document.querySelector("[name='name']").value.trim(),

            rating: document.querySelector("[name='rating']").value,

            genre: document.querySelector("[name='genre']").value,

            year: Number(document.querySelector("[name='year']").value),

            released: document.querySelector("[name='released']").value,

            score: Number(document.querySelector("[name='score']").value),

            votes: Number(document.querySelector("[name='votes']").value),

            director: document.querySelector("[name='director']").value.trim(),

            writer: document.querySelector("[name='writer']").value.trim(),

            star: document.querySelector("[name='star']").value.trim(),

            country: document.querySelector("[name='country']").value,

            budget: Number(document.querySelector("[name='budget']").value),

            company: document.querySelector("[name='company']").value.trim(),

            runtime: Number(document.querySelector("[name='runtime']").value)

        };

        /* ==========================
           Basic Validation
        ========================== */

        if (

            movieData.name === "" ||

            movieData.director === "" ||

            movieData.writer === "" ||

            movieData.star === "" ||

            movieData.company === ""

        ) {

            alert("Please fill all required fields.");

            return;

        }

        /* ==========================
           Dummy Prediction Formula
        ========================== */

        const factor =

            (movieData.score / 10) * 1.8 +

            (movieData.votes / 1000000) * 0.8 +

            Math.random();

        movieData.revenue = Math.round(movieData.budget * (1 + factor));

        movieData.profit =

            movieData.revenue - movieData.budget;

        movieData.roi = Math.round(

            (movieData.profit / movieData.budget) * 100

        );

        /* ==========================
           Performance Category
        ========================== */

        if (movieData.roi < 0) {

            movieData.category = "Flop";

        }

        else if (movieData.roi < 100) {

            movieData.category = "Average";

        }

        else if (movieData.roi < 250) {

            movieData.category = "Hit";

        }

        else {

            movieData.category = "Blockbuster";

        }

        /* ==========================
           Save Data
        ========================== */

        localStorage.setItem(

            "prediction",

            JSON.stringify(movieData)

        );

        /* ==========================
           Open Result Page
        ========================== */

        window.location.href = "result.html";

    });

}
/* ==========================================================
   CinePredict
   script.js - Part 2
   Result Page
========================================================== */

const prediction = JSON.parse(localStorage.getItem("prediction"));

/* ==========================
   Currency Formatter
========================== */

function formatMoney(amount){

    if(amount >= 1000000000){

        return "$" + (amount/1000000000).toFixed(2) + " Billion";

    }

    if(amount >= 1000000){

        return "$" + (amount/1000000).toFixed(2) + " Million";

    }

    if(amount >= 1000){

        return "$" + (amount/1000).toFixed(2) + " Thousand";

    }

    return "$" + amount.toLocaleString();

}

/* ==========================
   Load Result
========================== */

if(prediction){

    /* Movie Details */

    document.getElementById("movieName").textContent =
        prediction.name;

    document.getElementById("movieGenre").textContent =
        prediction.genre;

    document.getElementById("movieRating").textContent =
        prediction.rating;

    document.getElementById("movieYear").textContent =
        prediction.year;

    document.getElementById("movieReleased").textContent =
        prediction.released;

    document.getElementById("movieScore").textContent =
        prediction.score;

    document.getElementById("movieVotes").textContent =
        prediction.votes.toLocaleString();

    document.getElementById("movieDirector").textContent =
        prediction.director;

    document.getElementById("movieWriter").textContent =
        prediction.writer;

    document.getElementById("movieStar").textContent =
        prediction.star;

    document.getElementById("movieCountry").textContent =
        prediction.country;

    document.getElementById("movieCompany").textContent =
        prediction.company;

    document.getElementById("movieRuntime").textContent =
        prediction.runtime + " Min";

    /* Prediction Summary */

    document.getElementById("budgetResult").textContent =
        formatMoney(prediction.budget);

    document.getElementById("revenue").textContent =
        formatMoney(prediction.revenue);

    document.getElementById("profit").textContent =
        formatMoney(prediction.profit);

    document.getElementById("roi").textContent =
        prediction.roi + "%";

    document.getElementById("category").textContent =
        prediction.category;

    /* History */

    document.getElementById("historyMovie").textContent =
        prediction.name;

    document.getElementById("historyRevenue").textContent =
        formatMoney(prediction.revenue);

    document.getElementById("historyROI").textContent =
        prediction.roi + "%";

    document.getElementById("historyCategory").textContent =
        prediction.category;

}

/* ==========================
   Back Button
========================== */

const backButton =
document.getElementById("backButton");

if(backButton){

    backButton.addEventListener("click",function(){

        window.location.href="index.html";

    });

}
/* ==========================================================
   CinePredict
   script.js - Part 3
   Charts (Chart.js)
========================================================== */

if (prediction) {

    /* ==========================================
       Revenue Analytics Chart
    ========================================== */

    const revenueChart =
        document.getElementById("revenueChart");

    if (revenueChart) {

        new Chart(revenueChart, {

            type: "bar",

            data: {

                labels: [

                    "Budget",
                    "Revenue",
                    "Profit"

                ],

                datasets: [{

                    label: "USD",

                    data: [

                        prediction.budget,

                        prediction.revenue,

                        prediction.profit

                    ],

                    backgroundColor: [

                        "#ff9800",

                        "#2ecc71",

                        "#e50914"

                    ],

                    borderRadius: 10

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

    }

    /* ==========================================
       Budget vs Revenue Chart
    ========================================== */

    const budgetChart =
        document.getElementById("budgetChart");

    if (budgetChart) {

        new Chart(budgetChart, {

            type: "doughnut",

            data: {

                labels: [

                    "Budget",

                    "Revenue"

                ],

                datasets: [{

                    data: [

                        prediction.budget,

                        prediction.revenue

                    ],

                    backgroundColor: [

                        "#ff9800",

                        "#4caf50"

                    ],

                    hoverOffset: 12

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    }

}