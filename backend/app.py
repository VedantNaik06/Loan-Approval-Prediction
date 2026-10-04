from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime


# ==========================================
# Flask App
# ==========================================

app = Flask(__name__)
CORS(app)


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")


# ==========================================
# MongoDB Connection
# ==========================================

client = MongoClient(MONGO_URI)

db = client["loan_approval_db"]

predictions_collection = db["predictions"]

print("MongoDB connected successfully!")


# ==========================================
# Load Machine Learning Model
# ==========================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "loan_approval_model.pkl"
)

model = joblib.load(MODEL_PATH)

print("Loan approval model loaded successfully!")


# ==========================================
# Home / Health Check
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "Loan Approval Prediction API is running"
    })


# ==========================================
# Prediction API
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # Get JSON data from frontend
        data = request.get_json()

        # ------------------------------------------
        # Required fields
        # ------------------------------------------

        required_fields = [
            "no_of_dependents",
            "education",
            "self_employed",
            "income_annum",
            "loan_amount",
            "loan_term",
            "cibil_score",
            "residential_assets_value",
            "commercial_assets_value",
            "luxury_assets_value",
            "bank_asset_value"
        ]

        # ------------------------------------------
        # Check missing fields
        # ------------------------------------------

        missing_fields = [
            field
            for field in required_fields
            if field not in data
        ]

        if missing_fields:

            return jsonify({
                "success": False,
                "error": "Missing required fields",
                "fields": missing_fields
            }), 400

        # ------------------------------------------
        # Prepare input for ML model
        # ------------------------------------------

        input_data = pd.DataFrame([{

            "no_of_dependents":
                data["no_of_dependents"],

            "education":
                data["education"],

            "self_employed":
                data["self_employed"],

            "income_annum":
                data["income_annum"],

            "loan_amount":
                data["loan_amount"],

            "loan_term":
                data["loan_term"],

            "cibil_score":
                data["cibil_score"],

            "residential_assets_value":
                data["residential_assets_value"],

            "commercial_assets_value":
                data["commercial_assets_value"],

            "luxury_assets_value":
                data["luxury_assets_value"],

            "bank_asset_value":
                data["bank_asset_value"]

        }])


        # ==========================================
        # Make Prediction
        # ==========================================

        prediction = model.predict(input_data)[0]


        if prediction == 1:

            result = "Approved"

        else:

            result = "Rejected"


        # ==========================================
        # Save Prediction to MongoDB
        # ==========================================

        prediction_record = {

            "no_of_dependents":
                data["no_of_dependents"],

            "education":
                data["education"],

            "self_employed":
                data["self_employed"],

            "income_annum":
                data["income_annum"],

            "loan_amount":
                data["loan_amount"],

            "loan_term":
                data["loan_term"],

            "cibil_score":
                data["cibil_score"],

            "residential_assets_value":
                data["residential_assets_value"],

            "commercial_assets_value":
                data["commercial_assets_value"],

            "luxury_assets_value":
                data["luxury_assets_value"],

            "bank_asset_value":
                data["bank_asset_value"],

            "prediction":
                result,

            "model":
                "Random Forest",

            "created_at":
                datetime.utcnow()
        }


        predictions_collection.insert_one(
            prediction_record
        )


        # ==========================================
        # Return Prediction
        # ==========================================

        return jsonify({

            "success": True,

            "prediction": result,

            "message":
                "Prediction saved successfully"

        })


    except Exception as e:

        print("Prediction error:", e)

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ==========================================
# Prediction History API
# ==========================================

@app.route("/predictions", methods=["GET"])
def get_predictions():

    try:

        predictions = list(

            predictions_collection
            .find(
                {},
                {
                    "_id": 0
                }
            )
            .sort(
                "created_at",
                -1
            )

        )


        return jsonify({

            "success": True,

            "count":
                len(predictions),

            "predictions":
                predictions

        })


    except Exception as e:

        print("History error:", e)

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ==========================================
# Run Flask Server
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )