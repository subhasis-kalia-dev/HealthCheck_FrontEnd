import { useState } from "react"
import './App.css'

// Backend URL based on your instructions
const BACKEND_API_BASE_URL = "https://healthcheck-backend-g2hd.onrender.com";

function App() {
  // State to hold the selected File object
  const [selectedFile, setSelectedFile] = useState(null);
  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);

  // Function to save the selected image file
  function saveImage(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSummary(null); // Clear previous results
    setError(null);
    setFileError(null); // Clear local error
  }

  // Function to send the file to FastAPI
  async function sendToFastApi() {
    if (!selectedFile) {
      setFileError("Please select an image file first to upload."); 
      return;
    }

    setLoading(true);
    setSummary(null);
    setError(null);
    setFileError(null);

    // 1. Create a FormData object
    const formData = new FormData();
    
    // 2. Append the file with the correct field name: 'image_file'
    formData.append('image_file', selectedFile);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.llm_analysis_summary) {
        setSummary(data.llm_analysis_summary);
      } else {
        setSummary('Analysis completed but no summary was generated.');
      }
      
    } catch (e) {
      console.error("API Fetch Error:", e);
      setError(`Failed to analyze image: ${e.message}. Ensure backend is running.`);
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      
      {/* React Component Structure */}
      <div className="app-container">
        <div className="main-card">
          <h1 className="header">
            AI Nutrition Label Analyzer
          </h1>
          
          {/* Upload Section */}
          <div className="upload-section">
            <label htmlFor="photoUpload" className="label">
              1. Select a photo of a food label
            </label>
            <input 
              type="file" 
              id="photoUpload" 
              accept="image/*" 
              onChange={saveImage}
              className="file-input"
            />

            {/* Selected File Preview */}
            {selectedFile && (
              <p className="selected-file-preview">
                Selected: <span className="file-name">{selectedFile.name}</span>
              </p>
            )}

            {/* Local Validation Error */}
            {fileError && (
               <div className="local-error">
                  {fileError}
               </div>
            )}

            {/* Action Button */}
            <button 
              onClick={sendToFastApi}
              disabled={loading || !selectedFile}
              className="action-button"
            >
              {loading ? (
                <span className="loading-content">
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                '2. Get AI Analysis'
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="results-section">
            <h2 className="section-title">Analysis Summary</h2>
            
            {/* Backend Error */}
            {error && (
              <div className="error-message">
                <p className="summary-title" style={{color: '#a80000', marginBottom: '0.25rem'}}>Backend Error:</p>
                <p className="summary-text">{error}</p>
              </div>
            )}

            {/* Successful Summary */}
            {summary && (
              <div className="summary-box">
                <p className="summary-title">LLM Insight:</p>
                <p className="summary-text">{summary}</p>
              </div>
            )}
            
            {/* Initial State */}
            {!loading && !summary && !error && !fileError && (
              <p className="initial-state">Upload an image of a nutritional fact panel to get started.</p>
            )}

            
          </div>
        </div>

         <footer className="footerSection">
        <p className="disclaimerText">
          ⚠️ Disclaimer: Created using Google Vision API , Open AI, React and FastAPI
        </p>
        <p className="authorText">Author — <strong>Subhasis Kalia</strong></p>
      </footer>
      </div>
      
    </>
  )
}

export default App;
