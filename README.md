# UPI Fraud Detection & Risk Analysis

An experimental machine-learning system for detecting potentially fraudulent UPI-style transactions using behavioral, transactional, and contextual features.

The project combines a **Random Forest classifier**, a **FastAPI inference backend**, and a **React frontend** to provide real-time transaction risk predictions.

> **Important:** The dataset used in this project is synthetic. The reported model performance should therefore be interpreted as experimental results on this dataset and **not as evidence of real-world UPI fraud-detection performance**.

---

## Overview

UPI transactions are fast, convenient, and widely used for digital payments. A fraud-detection system needs to distinguish potentially suspicious transactions from legitimate activity while keeping false positives under control.

This project explores that problem through a complete ML engineering pipeline:

```text
Synthetic UPI-style Dataset
          ↓
Data Analysis
          ↓
Leakage Investigation
          ↓
Feature Selection
          ↓
Train / Validation / Test Split
          ↓
Random Forest Classifier
          ↓
Model Evaluation
          ↓
Saved Model Artifact
          ↓
FastAPI Backend
          ↓
React Web Application
```

The system accepts transaction characteristics through the web interface and returns:

* Fraud probability
* Binary prediction
* `FRAUD` or `LEGITIMATE` classification

---

## Features

### Machine Learning

* Exploratory data analysis
* Class-distribution analysis
* Missing-value investigation
* Identifier analysis
* Categorical feature auditing
* Synthetic leakage investigation
* Feature selection
* Stratified train/validation/test splitting
* Logistic Regression baseline
* Random Forest classifier
* 5-fold stratified cross-validation
* ROC-AUC evaluation
* PR-AUC evaluation
* Precision, recall, and F1 evaluation
* Threshold analysis
* Permutation feature importance
* False-positive and false-negative analysis

### Application

* React frontend
* FastAPI REST API
* Real-time model inference
* JSON-based API communication
* CORS configuration
* Transaction input form
* Fraud probability display
* Risk result visualization
* Loading and error states
* Form reset functionality
* Responsive interface

---

## Dataset

The project uses a synthetic UPI-style fraud dataset containing approximately:

* **26,393 transactions**
* **65 original columns**
* Approximately **17.2% fraud transactions**

The dataset contains transactional, behavioral, device, network, and contextual attributes.

### Dataset limitation

The dataset is synthetic and contains several patterns that would not necessarily exist in genuine production UPI transaction data.

During the analysis, several features exhibited behavior consistent with synthetic target construction or leakage.

Examples included:

* Missingness patterns that were almost perfectly associated with fraud
* Certain categorical values appearing exclusively in fraudulent transactions
* Certain user/device/merchant frequency patterns strongly tied to the target
* `receiver_transaction_history` showing a sharp synthetic boundary where fraud disappeared above a particular value
* Other categorical fields directly encoding suspicious scenarios

These features were investigated rather than blindly included in the final model.

Therefore, the project is best described as:

> **An experimental UPI-style fraud detection and risk analysis system using synthetic transaction data.**

It should not be presented as a validated production fraud-detection system.

---

## Data Leakage Investigation

A major part of the project was identifying features that could make the model appear artificially accurate.

For example, `receiver_transaction_history` showed a very strong relationship with the target:

* Legitimate transactions had a much higher average value.
* Fraudulent transactions were concentrated at low values.
* Fraud was absent across the higher range of the feature.

A single-feature Logistic Regression model using this variable produced approximately:

```text
ROC-AUC: 0.948
PR-AUC:  0.689
```

This indicated that the feature contained an unusually large amount of predictive information.

Rather than allowing the model to exploit this synthetic shortcut, the feature was excluded from the final model.

Other suspicious features were also removed after detailed analysis.

This resulted in a final model based on **12 selected features**.

---

## Final Feature Set

The final Random Forest model uses:

```text
amount
session_duration
transaction_amount_vs_sender_history
transaction_time_of_day
input_timing_consistency
keyboard_input_speed
input_pause_patterns
screen_active_time
geographic_location_vs_ip
background_data_usage
pin_entry_speed
request_amount_roundness
```

Features such as raw identifiers, highly suspicious categorical indicators, and synthetic shortcut variables were excluded.

---

## Model

### Final model

```text
Algorithm:        Random Forest Classifier
Number of trees:  300
Random state:      42
Features:         12
Decision threshold: 0.50
```

The model was trained on the cleaned feature set.

The trained model is saved as:

```text
models/upi_fraud_model.joblib
```

The artifact contains:

```python
{
    "model": ...,
    "features": [...],
    "threshold": 0.5,
    "model_type": "RandomForestClassifier",
    "n_estimators": 300,
    "random_state": 42
}
```

This allows the inference layer to use the exact feature ordering and decision threshold used during model development.

---

## Data Splitting

The data was separated into three stages:

```text
Full Dataset
     │
     ├── 80% Development Data
     │       │
     │       ├── 80% Training
     │       └── 20% Validation
     │
     └── 20% Locked Test Data
```

The split was stratified to preserve the fraud/legitimate class distribution.

Approximate sizes:

| Split      | Samples |
| ---------- | ------: |
| Training   |  16,891 |
| Validation |   4,223 |
| Test       |   5,279 |

The test set was kept untouched during threshold selection and model evaluation.

---

## Cross-Validation

A 5-fold `StratifiedKFold` evaluation was performed on the final training data.

### ROC-AUC

```text
Fold 1: 0.9727
Fold 2: 0.9531
Fold 3: 0.9650
Fold 4: 0.9579
Fold 5: 0.9651

Mean: 0.9627
Std:  0.0067
```

### PR-AUC

```text
Fold 1: 0.9527
Fold 2: 0.9291
Fold 3: 0.9509
Fold 4: 0.9313
Fold 5: 0.9434

Mean: 0.9414
Std:  0.0098
```

---

## Validation Performance

The validation set was used for threshold analysis.

The selected decision threshold was:

```text
0.50
```

At this threshold:

```text
Precision: 0.9876
Recall:    0.8762
F1-score:  0.9286
ROC-AUC:   0.9655
PR-AUC:    0.9432
```

The threshold was selected using validation data rather than the final test set.

---

## Final Test Performance

The final model was evaluated once on the untouched test set.

### Metrics

| Metric    |      Score |
| --------- | ---------: |
| ROC-AUC   | **0.9662** |
| PR-AUC    | **0.9457** |
| Precision | **0.9864** |
| Recall    | **0.8801** |
| F1-score  | **0.9302** |

### Confusion Matrix

```text
                  Predicted
                Legit   Fraud

Actual Legit     4359      11
Actual Fraud      109     800
```

Therefore:

* **800 fraudulent transactions** were correctly detected.
* **109 fraudulent transactions** were missed.
* **4,359 legitimate transactions** were correctly classified.
* **11 legitimate transactions** were incorrectly flagged.

These results apply only to the synthetic test set described above.

---

## Feature Importance

Permutation importance was calculated on the validation set.

The most influential features were:

| Feature                                | Mean Importance |
| -------------------------------------- | --------------: |
| `amount`                               |          0.0704 |
| `request_amount_roundness`             |          0.0493 |
| `transaction_time_of_day`              |          0.0185 |
| `transaction_amount_vs_sender_history` |          0.0064 |
| `input_timing_consistency`             |          0.0049 |
| `pin_entry_speed`                      |          0.0044 |
| `keyboard_input_speed`                 |          0.0041 |
| `input_pause_patterns`                 |          0.0027 |
| `background_data_usage`                |          0.0022 |
| `session_duration`                     |          0.0020 |
| `screen_active_time`                   |          0.0002 |
| `geographic_location_vs_ip`            |         -0.0008 |

`amount` provided the largest measured incremental contribution under this permutation-importance analysis.

A near-zero or negative permutation importance should not automatically be interpreted as a feature being harmful; correlated features can share predictive information.

---

## Error Analysis

The final test set contained:

```text
120 total classification errors
```

consisting of:

```text
109 False Negatives
11 False Positives
```

### False Negatives

Some fraudulent transactions received very low predicted probabilities.

This demonstrates an important limitation of the model:

> A high overall classification score does not mean every fraudulent transaction produces a high fraud probability.

### False Positives

The false-positive transactions showed characteristics such as relatively high transaction amounts combined with other anomalous behavioral signals.

This suggests that the model can sometimes interpret unusual legitimate transactions as suspicious.

Error analysis was performed without changing the locked test-set threshold.

---

## Application Architecture

The web application consists of three primary layers:

```text
┌─────────────────────────┐
│     React Frontend      │
│                         │
│ Transaction Input Form  │
│ Risk Result             │
└────────────┬────────────┘
             │
             │ HTTP / JSON
             ▼
┌─────────────────────────┐
│     FastAPI Backend     │
│                         │
│ POST /predict           │
│ Request Validation      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       predict.py        │
│                         │
│ Load Model Artifact     │
│ Prepare Features        │
│ Generate Probability    │
│ Apply Threshold         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    Random Forest        │
│      300 Trees          │
└─────────────────────────┘
```

The React application communicates with FastAPI using JSON over HTTP. Because the frontend and backend run on different local origins during development, FastAPI is configured with `CORSMiddleware` to permit the React development origin.

---

## API

### Health Check

```http
GET /
```

Response:

```json
{
  "message": "UPI Fraud Detection API is running"
}
```

### Fraud Prediction

```http
POST /predict
```

Example request:

```json
{
  "amount": 7500,
  "session_duration": 120,
  "transaction_amount_vs_sender_history": 2.4,
  "transaction_time_of_day": 18,
  "input_timing_consistency": 0.85,
  "keyboard_input_speed": 0.9,
  "input_pause_patterns": 0.12,
  "screen_active_time": 300,
  "geographic_location_vs_ip": 9000,
  "background_data_usage": 0.25,
  "pin_entry_speed": 1.2,
  "request_amount_roundness": 1.0
}
```

Example response:

```json
{
  "fraud_probability": 0.03666666666666667,
  "prediction": 0,
  "result": "LEGITIMATE"
}
```

The API expects JSON input and returns the model probability and binary prediction. FastAPI supports Pydantic models for defining and validating request bodies.

---

## Project Structure

```text
UPI-Fraud-Detection-India/
│
├── backend/
│   └── main.py
│
├── data/
│   └── fraud_dataset.csv
│
├── models/
│   └── upi_fraud_model.joblib
│
├── notebooks/
│   └── upi_fraud_detection.ipynb
│
├── src/
│   └── predict.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
├── README.md
├── requirements.txt
└── ...
```

---

## Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd UPI-Fraud-Detection-India
```

### 2. Create a Python virtual environment

Windows:

```powershell
py -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\activate
```

### 3. Install Python dependencies

```powershell
py -m pip install -r requirements.txt
```

### 4. Install frontend dependencies

```powershell
cd frontend
npm install
```

Vite provides the React development server and the standard `npm run dev` workflow for a Vite application.

---

## Running the Project

The backend and frontend should run in separate terminals.

### Terminal 1 — FastAPI

From the project root:

```powershell
py -m uvicorn backend.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### Terminal 2 — React

From the frontend directory:

```powershell
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Vite's development server normally serves the application on port 5173.

---

## Model Inference

The inference layer is implemented in:

```text
src/predict.py
```

The module:

1. Loads the saved model artifact.
2. Retrieves the exact feature list.
3. Constructs a single-row DataFrame.
4. Selects features in the correct order.
5. Generates the fraud probability.
6. Applies the saved `0.5` threshold.
7. Returns a JSON-compatible prediction result.

This keeps model-serving logic separate from the FastAPI route.

---

## Why Random Forest?

Random Forest was selected after comparing the cleaned dataset with a Logistic Regression baseline.

The final Random Forest provided strong validation and test discrimination while naturally capturing nonlinear relationships between transaction and behavioral variables.

The model uses:

```text
300 decision trees
```

and combines their predictions to estimate the probability of fraud.

---

## Baseline Model

A standardized Logistic Regression model was also evaluated.

The clean Logistic Regression baseline achieved approximately:

```text
ROC-AUC: ~0.91
PR-AUC:  ~0.86
```

The Random Forest was subsequently evaluated using the same cleaned feature philosophy and achieved approximately:

```text
Test ROC-AUC: 0.966
Test PR-AUC:  0.946
```

The comparison is experimental and specific to this synthetic dataset.

---

## Limitations

This project has several important limitations.

### 1. Synthetic data

The dataset does not represent the full complexity of real UPI transaction behavior.

### 2. Synthetic feature relationships

Several variables exhibited unusually strong relationships with fraud, requiring explicit leakage investigation.

### 3. No production transaction stream

The current system operates on manually supplied transaction features rather than a live UPI transaction pipeline.

### 4. No real-time behavioral telemetry

Features such as typing behavior, screen activity, and network/location characteristics would require trusted telemetry in a production environment.

### 5. No production fraud labels

Real fraud detection requires continuously updated ground-truth labels and feedback from confirmed fraud cases.

### 6. No calibration study

The predicted probability should not automatically be interpreted as a calibrated real-world probability of fraud.

### 7. No production security layer

The current FastAPI service is a development inference API and does not implement production authentication, authorization, rate limiting, monitoring, or secure deployment.

---

## Future Work

Potential improvements include:

* Train on real-world or carefully validated transaction data
* Develop time-aware validation
* Investigate probability calibration
* Evaluate additional anomaly-detection approaches
* Compare XGBoost/LightGBM with Random Forest
* Perform systematic hyperparameter optimization
* Build model monitoring
* Add drift detection
* Add explainability using SHAP
* Introduce authentication and authorization
* Add API rate limiting
* Containerize the application
* Deploy the backend and frontend
* Add automated testing
* Add CI/CD
* Build a transaction-history and monitoring dashboard

---

## Technologies

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib

### Backend

* FastAPI
* Pydantic
* Uvicorn

### Frontend

* React
* JavaScript
* CSS
* Vite

### Development

* Jupyter Notebook
* Git
* GitHub
* VS Code
* Postman

---

## Development Philosophy

The project emphasizes **data quality and leakage analysis before model optimization**.

Rather than optimizing solely for a high evaluation score, the workflow investigates:

```text
Is the feature meaningful?
        ↓
Could it leak the target?
        ↓
Could the relationship be synthetic?
        ↓
Does it generalize across splits?
        ↓
Does the model behave reasonably on errors?
```

This approach is particularly important for fraud datasets, where artificially constructed features can make a model appear significantly more capable than it actually is.

---

## Disclaimer

This project is an educational and experimental machine-learning system.

It is **not a production UPI fraud-detection service**, does not process actual UPI payment transactions, and should not be used to make financial or security decisions.

The model's reported performance is based on a synthetic dataset and should not be interpreted as real-world fraud-detection accuracy.

---

## Author

**Divyanshu Dubey**

BCA — Assam Down Town University

---

## License

This project is intended for educational and research purposes.

Add an appropriate open-source license to the repository if you intend to distribute or reuse the project publicly.

````

### One important cleanup before you commit

I deliberately left this as:

```text
git clone <YOUR_GITHUB_REPOSITORY_URL>
````

rather than inventing your repository URL.

Also, **don't put `data/fraud_dataset.csv` or the `.joblib` model into Git if your `.gitignore` excludes them**, unless you've intentionally decided to distribute those artifacts. Your existing `.gitignore` already excludes `data/` and `models/`, which is a sensible default.

Once you paste this into `README.md`, the next step is to **review the repository itself and make sure the README, requirements, `.gitignore`, backend, frontend, model, and notebook are internally consistent before the final Git commit/push**.
