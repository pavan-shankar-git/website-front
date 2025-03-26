import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const ReportHandleButton = ({
  submittedData,
  setSubmittedData,
  handleRemove,
  handleDownload,
  fetchBatches,
  fetchReportStatus,
}) => {
  const [visibleData, setVisibleData] = useState(false);

  const handleRemoveAll = () => {
    setSubmittedData([]);
  };

  const handleSubmit = async () => {
    if (submittedData.length === 0) {
      alert("No data available for submission!");
      return;
    }

    try {
      setVisibleData(false); // Close pop-up
      alert("Data has been successfully submitted!"); // Show success message

      await handleDownload(); // Perform download (ensure it doesn't fail)
      handleRemoveAll(); // Clear data after submission

      await fetchBatches(); // Refresh batch list
      await fetchReportStatus(); // Refresh report status
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="report-handle-button-container">
      <div className="report_b">
        <Button onClick={() => setVisibleData(true)} label="Report" />
      </div>

      <Dialog
        header="Submitted Data"
        visible={visibleData}
        style={{ width: "60vw" }}
        onHide={() => setVisibleData(false)}
      >
        <div className="popup-content">
          {submittedData.length === 0 ? (
            <p>No data to submit.</p>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto", fontSize: "0.9rem" }}>
              <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Condition</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Severity</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Concern</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>No Mutation</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>AI Score</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Reason</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedData.map((entry, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.condition}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.severity}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.Concern || ""}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.NoMutation || ""}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.aiScore || "N/A"}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.reason || "N/A"}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                        <Button label="Remove" className="p-button-danger" onClick={() => handleRemove(index)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="download-section">
          <Button label="Submit" onClick={handleSubmit} />
        </div>
      </Dialog>
    </div>
  );
};

export default ReportHandleButton;
