# Box-Office-

# 🎬 CinePredict — Movie Box Office Revenue Prediction

CinePredict is a **Machine Learning powered web application** that predicts a movie's potential box-office revenue based on movie-related features such as IMDb score, votes, budget, genre, rating, runtime, production company and other relevant information.

The project combines a **Machine Learning regression model**, **Flask backend**, and a modern **glassmorphism frontend** to provide an interactive movie prediction experience.

---

## 🚀 Features

* 🎬 Movie Box Office Revenue Prediction
* 🤖 Machine Learning regression model
* 🌲 Random Forest Regression
* 📊 Revenue, Budget & Profit analytics
* 📈 ROI calculation
* 🏆 Performance classification
* 📉 Actual prediction charts using Chart.js
* 🔐 Server-side input validation
* 🛡️ Client-side form validation
* 🧹 Input sanitization and validation
* 📱 Responsive UI
* ✨ Glassmorphism design
* 🌌 Modern aesthetic background
* 🎨 3D-style cards and hover effects
* 📄 Printable prediction report
* ⚡ Flask REST-style prediction endpoint
* 📋 Prediction result dashboard

---

# 🧠 Machine Learning

CinePredict uses supervised machine learning to estimate movie revenue.

### Problem Type

**Regression**

The model predicts a continuous numerical value:

```text
Movie → Expected Box Office Revenue
```

---

## 🤖 Models Evaluated

The project can evaluate multiple regression algorithms:

### 1. Linear Regression

Used as a baseline regression model.

### 2. Decision Tree Regressor

Captures nonlinear relationships between movie attributes and revenue.

### 3. Random Forest Regressor

An ensemble of multiple decision trees that generally provides better stability and predictive performance.

The final model can be selected based on validation performance.

---

# 📊 Evaluation Metrics

The models are evaluated using:

* R² Score
* Mean Squared Error (MSE)
* Mean Squared Logarithmic Error (MSLE)
* Mean Absolute Percentage Error (MAPE)

Example:

```text
R² Score
MSE
MSLE
MAPE
```

The model with the strongest validation performance can be used for production predictions.

---

# 🗂️ Dataset

The project expects a CSV dataset containing movie-related information.

Typical features include:

```text
name
rating
genre
year
released
score
votes
director
writer
star
country
budget
company
runtime
gross
```

The exact columns used by the model should match the preprocessing pipeline defined in `model.py`.

---

# 🏗️ Project Architecture

```text
                     ┌──────────────────────┐
                     │      User Input      │
                     │   Movie Information  │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │      Flask App       │
                     │      app.py          │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Input Validation &   │
                     │ Feature Processing   │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   ML Model           │
                     │ Random Forest /      │
                     │ Regression Model     │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Revenue Prediction   │
                     │ Budget / Profit / ROI│
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Result Dashboard     │
                     │ Charts + Analytics   │
                     └──────────────────────┘
```

---

# 📁 Project Structure

```text
CinePredict/
│
├── app.py
├── model.py
├── requirements.txt
├── README.md
│
├── models/
│   ├── revenue_model.pkl
│   └── preprocessing.pkl
│
├── data/
│   └── movies.csv
│
├── templates/
│   ├── index.html
│   └── result.html
│
├── static/
│   ├── style.css
│   └── script.js
│
└── notebooks/
    └── model_training.ipynb
```

---

# ⚙️ Technologies Used

## Frontend

* HTML5
* CSS3
* JavaScript
* Chart.js

## Backend

* Python
* Flask

## Machine Learning

* Pandas
* NumPy
* Scikit-learn

## Model

* Linear Regression
* Decision Tree Regressor
* Random Forest Regressor

## Visualization

* Matplotlib
* Chart.js

---

# 🔄 Machine Learning Workflow

```text
Dataset
   ↓
Data Loading
   ↓
Data Cleaning
   ↓
Missing Value Handling
   ↓
Categorical Encoding
   ↓
Feature Selection
   ↓
Train/Test Split
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Best Model Selection
   ↓
Model Serialization
   ↓
Flask Integration
   ↓
Revenue Prediction
```

---

# 🧹 Data Preprocessing

The dataset is cleaned before training.

Typical preprocessing includes:

### Missing Values

Numerical columns can be processed using median imputation:

```python
SimpleImputer(strategy="median")
```

Categorical columns can be processed using:

```python
SimpleImputer(strategy="most_frequent")
```

### Categorical Features

Movie-related categorical features such as:

```text
Genre
Rating
Country
Director
Company
```

are transformed into numerical representations using suitable encoding techniques.

---

# 🌲 Random Forest Model

The project uses Random Forest Regression to model nonlinear relationships between movie characteristics and revenue.

Example configuration:

```python
RandomForestRegressor(
    n_estimators=200,
    max_depth=12,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
```

Using:

```python
n_jobs=-1
```

allows the model to utilize available CPU cores during training.

---

# 🔮 Prediction Flow

When a user submits the form:

```text
Movie Details
      ↓
Form Validation
      ↓
Flask /predict Endpoint
      ↓
Input Sanitization
      ↓
Feature Transformation
      ↓
Trained ML Model
      ↓
Predicted Revenue
      ↓
Profit Calculation
      ↓
ROI Calculation
      ↓
Performance Category
      ↓
Result Dashboard
```

---

# 💰 Financial Calculations

After predicting revenue:

### Profit

```text
Profit = Predicted Revenue - Budget
```

### ROI

```text
ROI = ((Revenue - Budget) / Budget) × 100
```

---

# 🏆 Performance Classification

CinePredict categorizes movie performance based on ROI.

```text
ROI < 0%
    ↓
Flop

0% – 99%
    ↓
Average

100% – 249%
    ↓
Hit

250%+
    ↓
Blockbuster
```

---

# 📊 Result Dashboard

The result page displays:

### Movie Information

* Movie Name
* Genre
* Rating
* Release Year
* Release Date
* IMDb Score
* IMDb Votes
* Director
* Writer
* Lead Star
* Country
* Production Company
* Runtime

### Prediction Summary

* Predicted Revenue
* Budget
* Estimated Profit
* ROI
* Performance Category

---

# 📈 Analytics

CinePredict generates actual charts from the prediction returned by the ML model.

### Revenue Analytics

The bar chart compares:

```text
Budget
Revenue
Profit
```

### Budget vs Revenue

The doughnut chart compares:

```text
Production Budget
Predicted Revenue
```

Charts are generated dynamically using **Chart.js**.

---

# 🔐 Security & Validation

The application implements validation on both frontend and backend.

## Client-side Validation

JavaScript validates:

* Required fields
* IMDb score range
* Release year
* Numeric inputs
* Empty fields

Example:

```text
IMDb Score: 0–10
Release Year: 1900–2100
Budget: >= 0
Votes: >= 0
Runtime: > 0
```

## Server-side Validation

Flask should independently validate all submitted values.

Client-side validation is **not treated as a security boundary**.

The backend should reject:

* Missing values
* Invalid numbers
* Negative budget
* Invalid score
* Invalid year
* Extremely large values
* Invalid categorical values

---

# 🛡️ Security Practices

The application follows basic web-security practices:

* Server-side validation
* Client-side validation
* Input sanitization
* No direct HTML injection
* Safe template rendering
* Controlled categorical values
* Model loaded server-side
* Sensitive files excluded from Git
* Debug mode disabled in production

Do not expose model files or private configuration unnecessarily.

---

# 📦 Installation

Clone the project:

```bash
git clone https://github.com/yourusername/CinePredict.git
```

Enter the directory:

```bash
cd CinePredict
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

# 📥 Install Dependencies

```bash
pip install -r requirements.txt
```

Example `requirements.txt`:

```text
Flask
numpy
pandas
scikit-learn
matplotlib
joblib
```

---

# ▶️ Run the Application

Start Flask:

```bash
python app.py
```

The application will be available at:

```text
http://127.0.0.1:5000
```

Open the address in your browser.

---

# 🧪 Model Training

If the model has not been trained yet, run:

```bash
python model.py
```

The training pipeline should:

```text
Load Dataset
    ↓
Clean Dataset
    ↓
Preprocess Features
    ↓
Train Models
    ↓
Evaluate Models
    ↓
Select Best Model
    ↓
Save Model
```

Example model saving:

```python
import joblib

joblib.dump(model, "models/revenue_model.pkl")
joblib.dump(preprocessor, "models/preprocessing.pkl")
```

---

# 🌐 Flask API

The primary prediction endpoint is:

```text
POST /predict
```

Example request:

```text
Movie Name
Rating
Genre
Year
Release Date
IMDb Score
IMDb Votes
Director
Writer
Lead Star
Country
Budget
Production Company
Runtime
```

The server processes the input and returns the prediction result page.

---

# 🖥️ UI Design

CinePredict uses a modern cinematic interface featuring:

* Dark aesthetic background
* Glassmorphism cards
* 3D-style depth
* Soft shadows
* Red cinematic accent
* Smooth hover animations
* Responsive grid layout
* Interactive charts
* Mobile-friendly design

The design is inspired by modern movie streaming and analytics dashboards.

---

# 📱 Responsive Design

The application is designed for:

```text
Desktop
Laptop
Tablet
Mobile
```

CSS media queries automatically adjust:

* Grid layout
* Card size
* Typography
* Buttons
* Charts
* Form fields

---

# 📊 Example Prediction

Example:

```text
Movie:
Interstellar

IMDb Score:
8.7

Budget:
$185 Million

Predicted Revenue:
$987 Million

Estimated Profit:
$802 Million

ROI:
433%

Performance:
Blockbuster
```

> The values above are examples for demonstrating the UI and are not guaranteed predictions.

---

# ⚠️ Important Note

Movie revenue prediction is inherently uncertain.

The model's prediction depends on:

* Dataset quality
* Historical movie trends
* Feature selection
* Model architecture
* Data distribution
* Missing information

Therefore, predictions should be treated as **estimated machine-learning outputs**, not guaranteed box-office results.

---

# 🔮 Future Improvements

Possible future improvements include:

* 🔥 XGBoost / Gradient Boosting
* 🧠 Neural Network model
* 🎯 Hyperparameter optimization
* 🔎 SHAP-based explainability
* 🌎 More countries and genres
* 🎭 Actor popularity features
* 📅 Release-season analysis
* 📊 Historical movie comparison
* 🔐 User authentication
* 🗃️ Prediction history database
* ☁️ Cloud deployment
* 📱 PWA support
* 🎞️ Movie poster integration
* 🤖 AI-based movie analysis

---

# 👨‍💻 Author

**Rajan Prajapati**

B.Tech Computer Science Engineering

Project:

**CinePredict — Movie Box Office Revenue Prediction using Machine Learning**

---

# ⭐ Project Highlights

```text
Machine Learning
        +
Flask
        +
HTML / CSS / JavaScript
        +
Chart.js
        +
Glassmorphism UI
        +
Data Analytics
        =
CinePredict 🎬
```

---

## 📜 License

This project is developed for **educational and portfolio purposes**.
