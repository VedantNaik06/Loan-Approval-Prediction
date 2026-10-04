import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    no_of_dependents: "",
    education: "Graduate",
    self_employed: "No",
    income_annum: "",
    loan_amount: "",
    loan_term: "",
    cibil_score: "",
    residential_assets_value: "",
    commercial_assets_value: "",
    luxury_assets_value: "",
    bank_asset_value: ""
  });

  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  // Prediction History
  const [predictionHistory, setPredictionHistory] = useState([]);
const [historyLoading, setHistoryLoading] = useState(true);
const [showAllHistory, setShowAllHistory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fetch prediction history from Flask + MongoDB
  const fetchPredictionHistory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/predictions"
      );

      setPredictionHistory(response.data.predictions);
    } catch (error) {
      console.error("Error fetching prediction history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch history when application loads
  useEffect(() => {
    fetchPredictionHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPrediction("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        {
          no_of_dependents: Number(formData.no_of_dependents),
          education: formData.education,
          self_employed: formData.self_employed,
          income_annum: Number(formData.income_annum),
          loan_amount: Number(formData.loan_amount),
          loan_term: Number(formData.loan_term),
          cibil_score: Number(formData.cibil_score),
          residential_assets_value: Number(
            formData.residential_assets_value
          ),
          commercial_assets_value: Number(
            formData.commercial_assets_value
          ),
          luxury_assets_value: Number(
            formData.luxury_assets_value
          ),
          bank_asset_value: Number(
            formData.bank_asset_value
          )
        }
      );

      setPrediction(response.data.prediction);

      // Refresh history after a new prediction
      fetchPredictionHistory();

    } catch (error) {
      console.error(error);
      setPrediction("Error connecting to prediction server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <div className="container">

        {/* Header */}
        <div className="header">

          <div className="header-badge">
            MACHINE LEARNING PROJECT
          </div>

          <h1>
            Smart Loan Approval
            <br />
            Prediction System
          </h1>

          <p>
            Analyze applicant financial information and predict
            loan approval using our trained Random Forest model.
          </p>

        </div>

        {/* Form Card */}
        <div className="form-card">

          <form onSubmit={handleSubmit}>

            {/* Personal Information */}
            <div className="form-section">

              <div className="section-title">

                <div className="section-number">
                  1
                </div>

                <h2>
                  Applicant Information
                </h2>

              </div>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Number of Dependents
                  </label>

                  <input
                    type="number"
                    name="no_of_dependents"
                    value={formData.no_of_dependents}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Education
                  </label>

                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                  >

                    <option value="Graduate">
                      Graduate
                    </option>

                    <option value="Not Graduate">
                      Not Graduate
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Self Employed
                  </label>

                  <select
                    name="self_employed"
                    value={formData.self_employed}
                    onChange={handleChange}
                  >

                    <option value="No">
                      No
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                  </select>

                </div>

              </div>

            </div>

            {/* Loan Information */}
            <div className="form-section">

              <div className="section-title">

                <div className="section-number">
                  2
                </div>

                <h2>
                  Loan Information
                </h2>

              </div>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Annual Income
                  </label>

                  <input
                    type="number"
                    name="income_annum"
                    value={formData.income_annum}
                    onChange={handleChange}
                    placeholder="e.g. 500000"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Loan Amount
                  </label>

                  <input
                    type="number"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    placeholder="e.g. 1000000"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Loan Term
                  </label>

                  <input
                    type="number"
                    name="loan_term"
                    value={formData.loan_term}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    min="1"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    CIBIL Score
                  </label>

                  <input
                    type="number"
                    name="cibil_score"
                    value={formData.cibil_score}
                    onChange={handleChange}
                    placeholder="e.g. 750"
                    min="0"
                    max="900"
                    required
                  />

                </div>

              </div>

            </div>

            {/* Assets */}
            <div className="form-section">

              <div className="section-title">

                <div className="section-number">
                  3
                </div>

                <h2>
                  Asset Information
                </h2>

              </div>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Residential Assets Value
                  </label>

                  <input
                    type="number"
                    name="residential_assets_value"
                    value={formData.residential_assets_value}
                    onChange={handleChange}
                    placeholder="e.g. 3000000"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Commercial Assets Value
                  </label>

                  <input
                    type="number"
                    name="commercial_assets_value"
                    value={formData.commercial_assets_value}
                    onChange={handleChange}
                    placeholder="e.g. 1000000"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Luxury Assets Value
                  </label>

                  <input
                    type="number"
                    name="luxury_assets_value"
                    value={formData.luxury_assets_value}
                    onChange={handleChange}
                    placeholder="e.g. 500000"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Bank Asset Value
                  </label>

                  <input
                    type="number"
                    name="bank_asset_value"
                    value={formData.bank_asset_value}
                    onChange={handleChange}
                    placeholder="e.g. 1000000"
                    min="0"
                    required
                  />

                </div>

              </div>

            </div>

            {/* Button */}
            <button
              type="submit"
              className="predict-button"
              disabled={loading}
            >
              {loading
                ? "Analyzing Application..."
                : "Predict Loan Approval"}
            </button>

          </form>

          {/* Result */}
          {prediction && (
            <div className="result-card">

              <p className="result-label">
                Prediction Result
              </p>

              <p className="result-value">
                {prediction}
              </p>

            </div>
          )}

        </div>
  
        {/* Prediction History */}
        <div className="history-card">

          <div className="history-header">
            <div>
              <h2>Prediction History</h2>
              <p>Previously analyzed loan applications</p>
            </div>

            <div className="history-count">
              {predictionHistory.length} Records
            </div>
          </div>

          {historyLoading ? (
            <p className="history-message">
              Loading prediction history...
            </p>
          ) : predictionHistory.length === 0 ? (
            <p className="history-message">
              No prediction history available.
            </p>
          ) : (
          
          <div className="history-list">

          {(showAllHistory ? predictionHistory : predictionHistory.slice(0, 1)).map((item, index) => (

                <div
                  className="history-item"
                  key={item._id || index}
                >

                  {/* History Top */}
                  <div className="history-item-header">

                    <div className="history-number">
                      {index + 1}
                    </div>

                    <div className="history-prediction">

                      <span className="history-label">
                        Prediction Result
                      </span>

                      <span
                        className={`prediction-status ${
                          item.prediction === "Approved"
                            ? "approved"
                            : "rejected"
                        }`}
                      >
                        {item.prediction}
                      </span>

                    </div>

                    <div className="history-model">
                      <span className="history-label">
                        Model
                      </span>

                      <span>
                        {item.model || "Random Forest"}
                      </span>
                    </div>

                  </div>


                  {/* Main Details */}
                  <div className="history-details-grid">

                    <div className="history-detail">
                      <span>CIBIL Score</span>
                      <strong>{item.cibil_score}</strong>
                    </div>

                    <div className="history-detail">
                      <span>Loan Amount</span>
                      <strong>
                        ₹{Number(item.loan_amount).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="history-detail">
                      <span>Annual Income</span>
                      <strong>
                        ₹{Number(item.income_annum).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="history-detail">
                      <span>Loan Term</span>
                      <strong>
                        {item.loan_term} Years
                      </strong>
                    </div>

                    <div className="history-detail">
                      <span>Education</span>
                      <strong>
                        {item.education}
                      </strong>
                    </div>

                    <div className="history-detail">
                      <span>Self Employed</span>
                      <strong>
                        {item.self_employed}
                      </strong>
                    </div>

                    <div className="history-detail">
                      <span>Dependents</span>
                      <strong>
                        {item.no_of_dependents}
                      </strong>
                    </div>

                    <div className="history-detail">
                      <span>Date</span>
                      <strong>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString("en-IN")
                          : "N/A"}
                      </strong>
                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>
        {predictionHistory.length > 1 && (
          <button
            className="history-toggle-button"
            onClick={() => setShowAllHistory(!showAllHistory)}
          >
            {showAllHistory ? "Show Less" : "View More"}
          </button>
        )}


        <div className="footer">
          Powered by Machine Learning • Random Forest Classifier
        </div>

      </div>

    </div>
  );
}

export default App;
