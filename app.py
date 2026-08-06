# ============================================================
# CinePredict Flask Application
# ============================================================

import os
import secrets
import time
import joblib
import numpy as np

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    session,
    flash
)

from werkzeug.middleware.proxy_fix import ProxyFix


# ============================================================
# APP
# ============================================================

app = Flask(__name__)

app.config.update(

    SECRET_KEY=os.environ.get(
        "FLASK_SECRET_KEY",
        secrets.token_hex(32)
    ),

    SESSION_COOKIE_HTTPONLY=True,

    SESSION_COOKIE_SAMESITE="Lax",

    SESSION_COOKIE_SECURE=False,

    MAX_CONTENT_LENGTH=16 * 1024
)


# ============================================================
# PROXY
# ============================================================

app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_for=1,
    x_proto=1
)


# ============================================================
# LOAD MODEL
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.joblib"
)

if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(
        "model.joblib not found. "
        "Run: python model.py"
    )


model_package = joblib.load(
    MODEL_PATH
)

model = model_package["model"]

FEATURES = model_package["features"]


# ============================================================
# RATE LIMIT
# ============================================================

REQUEST_LOG = {}

RATE_LIMIT = 20

RATE_WINDOW = 60


def rate_limit():

    ip = request.remote_addr or "unknown"

    now = time.time()

    timestamps = REQUEST_LOG.get(
        ip,
        []
    )

    timestamps = [
        timestamp
        for timestamp in timestamps
        if now - timestamp < RATE_WINDOW
    ]

    if len(timestamps) >= RATE_LIMIT:

        return False

    timestamps.append(now)

    REQUEST_LOG[ip] = timestamps

    return True


# ============================================================
# CSRF
# ============================================================

def get_csrf_token():

    if "csrf_token" not in session:

        session["csrf_token"] = secrets.token_urlsafe(
            32
        )

    return session["csrf_token"]


@app.context_processor
def inject_csrf():

    return {
        "csrf_token": get_csrf_token()
    }


# ============================================================
# SECURITY HEADERS
# ============================================================

@app.after_request
def security_headers(response):

    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"

    response.headers[
        "X-Frame-Options"
    ] = "SAMEORIGIN"

    response.headers[
        "Referrer-Policy"
    ] = "strict-origin-when-cross-origin"

    response.headers[
        "Permissions-Policy"
    ] = (
        "camera=(), "
        "microphone=(), "
        "geolocation=()"
    )

    response.headers[
        "Content-Security-Policy"
    ] = (
        "default-src 'self'; "
        "style-src 'self' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "script-src 'self' https://cdn.jsdelivr.net; "
        "img-src 'self' data:; "
        "connect-src 'self'; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "frame-ancestors 'self';"
    )

    return response


# ============================================================
# HELPERS
# ============================================================

def clean_text(value, max_length=100):

    if value is None:

        return ""

    value = value.strip()

    return value[:max_length]


def parse_float(
    value,
    minimum=None,
    maximum=None
):

    try:

        number = float(value)

    except (ValueError, TypeError):

        raise ValueError(
            "Invalid numeric value."
        )

    if not np.isfinite(number):

        raise ValueError(
            "Invalid numeric value."
        )

    if minimum is not None and number < minimum:

        raise ValueError(
            "Value is below allowed range."
        )

    if maximum is not None and number > maximum:

        raise ValueError(
            "Value is above allowed range."
        )

    return number


def parse_int(
    value,
    minimum=None,
    maximum=None
):

    try:

        number = int(value)

    except (ValueError, TypeError):

        raise ValueError(
            "Invalid integer value."
        )

    if minimum is not None and number < minimum:

        raise ValueError(
            "Value is below allowed range."
        )

    if maximum is not None and number > maximum:

        raise ValueError(
            "Value is above allowed range."
        )

    return number


# ============================================================
# HOME
# ============================================================

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# ============================================================
# PREDICT
# ============================================================

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    if not rate_limit():

        return (
            "Too many requests. "
            "Please try again later.",
            429
        )


    # --------------------------------------------------------
    # CSRF
    # --------------------------------------------------------

    submitted_token = request.form.get(
        "csrf_token",
        ""
    )

    session_token = session.get(
        "csrf_token",
        ""
    )

    if not submitted_token or not secrets.compare_digest(
        submitted_token,
        session_token
    ):

        return (
            "Invalid request.",
            400
        )


    try:

        # ----------------------------------------------------
        # TEXT
        # ----------------------------------------------------

        rating = clean_text(
            request.form.get("rating"),
            30
        )

        genre = clean_text(
            request.form.get("genre"),
            50
        )

        director = clean_text(
            request.form.get("director"),
            100
        )

        writer = clean_text(
            request.form.get("writer"),
            100
        )

        star = clean_text(
            request.form.get("star"),
            100
        )

        country = clean_text(
            request.form.get("country"),
            60
        )

        company = clean_text(
            request.form.get("company"),
            150
        )


        # ----------------------------------------------------
        # NUMERIC
        # ----------------------------------------------------

        year = parse_int(
            request.form.get("year"),
            1900,
            2100
        )

        score = parse_float(
            request.form.get("score"),
            0,
            10
        )

        votes = parse_int(
            request.form.get("votes"),
            0,
            1000000000
        )

        budget = parse_float(
            request.form.get("budget"),
            0,
            10000000000
        )

        runtime = parse_int(
            request.form.get("runtime"),
            1,
            1000
        )


        # ----------------------------------------------------
        # REQUIRED VALIDATION
        # ----------------------------------------------------

        values = [
            rating,
            genre,
            director,
            writer,
            star,
            country,
            company
        ]

        if not all(values):

            raise ValueError(
                "Please fill all required fields."
            )


        # ----------------------------------------------------
        # DATAFRAME
        # ----------------------------------------------------

        import pandas as pd

        input_data = pd.DataFrame(
            [{
                "rating": rating,
                "genre": genre,
                "year": year,
                "score": score,
                "votes": votes,
                "director": director,
                "writer": writer,
                "star": star,
                "country": country,
                "budget": budget,
                "company": company,
                "runtime": runtime
            }]
        )


        # ----------------------------------------------------
        # PREDICTION
        # ----------------------------------------------------

        predicted_log = model.predict(
            input_data[FEATURES]
        )

        predicted_revenue = float(
            np.expm1(
                predicted_log[0]
            )
        )

        predicted_revenue = max(
            0,
            predicted_revenue
        )


        # ----------------------------------------------------
        # PROFIT
        # ----------------------------------------------------

        profit = (
            predicted_revenue -
            budget
        )


        if budget > 0:

            roi = (
                profit /
                budget
            ) * 100

        else:

            roi = 0


        # ----------------------------------------------------
        # PERFORMANCE
        # ----------------------------------------------------

        if roi < 0:

            category = "Flop"

        elif roi < 100:

            category = "Average"

        elif roi < 250:

            category = "Hit"

        else:

            category = "Blockbuster"


        # ----------------------------------------------------
        # RESULT
        # ----------------------------------------------------

        result = {

            "rating": rating,

            "genre": genre,

            "year": year,

            "score": score,

            "votes": votes,

            "director": director,

            "writer": writer,

            "star": star,

            "country": country,

            "budget": budget,

            "company": company,

            "runtime": runtime,

            "revenue": predicted_revenue,

            "profit": profit,

            "roi": roi,

            "category": category
        }


        return render_template(
            "result.html",
            prediction=result
        )


    except ValueError as error:

        flash(
            str(error),
            "error"
        )

        return redirect(
            url_for("index")
        )

    except Exception:

        app.logger.exception(
            "Prediction failed"
        )

        flash(
            "Unable to process prediction.",
            "error"
        )

        return redirect(
            url_for("index")
        )


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )