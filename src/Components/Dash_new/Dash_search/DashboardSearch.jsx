import React, { useState, useEffect } from "react";
import "./DashboardSearch.css";

const DashboardSearch = ({ onSelectPatient, fetchDataFromAPIs, selectedBatch, setSelectedBatch }) => {
  const [batches, setBatches] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reportStatus, setReportStatus] = useState({});
  const [availabilityStatus, setAvailabilityStatus] = useState({});
  const [error, setError] = useState(null);

 
  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchReportStatus();
      fetchDataFromAPIs();


    }
  }, [selectedBatch]);
  
  // useEffect(() => {
  //   if (selectedPatient) {
  //     //fetchReportStatus();
  //     fetchDataFromAPIs();


  //   }
  // }, [selectedPatient]);

  const fetchBatches = async () => {
    try {
      const response = await fetch(`https://website-backend-6w0g.onrender.com/get-batches`);
      if (!response.ok) throw new Error("Failed to fetch batches");
      const data = await response.json();
      setBatches(data || {});
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchReportStatus = async () => {
    try {
      const response = await fetch(`https://website-backend-6w0g.onrender.com/get-report-status?batch_name=${selectedBatch}`);
      if (!response.ok) throw new Error("Failed to fetch report status");

      const data = await response.json();
      setReportStatus(data);
      setAvailabilityStatus(data);
    } catch (error) {
      console.error("Error fetching report status:", error);
    }
  };

  const handleBatchChange = (event) => {
    const batch = event.target.value;
    if (batch === selectedBatch) return;
    setSelectedBatch(batch);
    setSearchQuery("");
    setFilteredPatients([]);
    setSelectedPatient(null);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!selectedBatch) return;

    // ✅ Show all patients when input is empty
    if (query.trim() === "") {
      setFilteredPatients(batches[selectedBatch] || []);
      return;
    }

    // ✅ Filter patients dynamically
    setFilteredPatients(
      batches[selectedBatch]?.filter((file) => file.toLowerCase().includes(query.toLowerCase())) || []
    );
  };

  // ✅ Show all patients when input is focused
  const handleInputFocus = () => {
    if (selectedBatch) {
      setFilteredPatients(batches[selectedBatch] || []);
    }
  };

  const handleSelect = (patient) => {
    setSelectedPatient(patient);
    setSearchQuery("");
    setFilteredPatients([]);
    
    if (onSelectPatient) {
        onSelectPatient(patient); // ✅ Ensure onSelectPatient is called
    }

   // fetchDataFromAPIs(); // ✅ Fetch batch data
};

  const toggleAvailability = async (event, patient) => {
    event.stopPropagation(); // ✅ Prevents selecting the patient when clicking the switch

    const newStatus = !availabilityStatus[patient]?.available;

    try {
      const response = await fetch("https://website-backend-6w0g.onrender.com/update-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_name: selectedBatch,
          patient_id: patient,
          availability: newStatus ? "available" : "not_available",
        }),
      });

      if (!response.ok) throw new Error("Failed to update availability");

      // ✅ Update local state after successful backend update
      setAvailabilityStatus((prev) => ({
        ...prev,
        [patient]: { available: newStatus },
      }));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const getColorClass = (patient) => {
    if (reportStatus[patient]?.submitted) return "green";
    if (availabilityStatus[patient]?.available) return "orange";
    return "red";
  };

  return (
    <div className="dashboard-search">
      <select value={selectedBatch} onChange={handleBatchChange} className="batch-dropdown">
        <option value="">Select Batch</option>
        {Object.keys(batches).map((batch) => (
          <option key={batch} value={batch}>
            {batch}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search patient file..."
        value={searchQuery}
        onChange={handleSearch}
        onFocus={handleInputFocus} // ✅ Show all patients when input is focused
        className="dashboard-search-input"
        disabled={!selectedBatch}
      />
      <i className="pi pi-search dashboard-search-icon"></i>

      {filteredPatients.length > 0 && (
        <ul className="search-results">
          {filteredPatients.map((patient) => {
            const isSubmitted = reportStatus[patient]?.submitted || false;

            return (
              <li key={patient} className={`search-result-item ${getColorClass(patient)}`}>
                <span>{patient}</span>

                <div className="switch-container">
                  {/* ✅ Toggle Switch (Disabled if Submitted) */}
                  <label className="switch">
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      checked={isSubmitted || availabilityStatus[patient]?.available || false}
                      disabled={isSubmitted} // ✅ Disable toggle if submitted
                      onChange={(e) => !isSubmitted && toggleAvailability(e, patient)}
                    />
                    <span className="slider round"></span>
                  </label>

                  {/* ✅ "View Details" Button */}
                  <button className="view-details-button" onClick={() => handleSelect(patient)}>
                    View Details
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedPatient && (
        <div className="selected-patient">
          Selected: <span className={`selected-${getColorClass(selectedPatient)}`}>{selectedPatient}</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DashboardSearch;
