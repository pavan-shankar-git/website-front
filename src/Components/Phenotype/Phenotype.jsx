import React, { useState, useEffect, useCallback } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import "./Phenotype.css";

const Phenotype = ({ isPhenotypeVisible, selectedPatient, selectedBatch }) => {
  const [selectedPhenos, setSelectedPhenos] = useState([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogSelection, setDialogSelection] = useState([]);
  const [phenotypeFiles, setPhenotypeFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPatient) {
      const files = [
        { name: `PDF`, type: "pdf" },
        { name: `Consent`, type: "consent" },
        { name: `Blood Reports`, type: "blood_reports" },
      ];
      setPhenotypeFiles(files);
      setSelectedPhenos([]);
      setDialogSelection([]);
    }
  }, [selectedPatient, selectedBatch]);

  const fetchPDF = async (fileType) => {
    if (!selectedPatient) return;
    setLoading(true);

    const url = `https://website-backend-6w0g.onrender.com/patient_files/${selectedBatch}/${selectedPatient}/${fileType}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("File not found");
      setSelectedPhenos([url]);
      
    } catch (error) {
      alert("File not found for the selected patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleSelection = useCallback(() => {
    setVisibleDialog(true);
  }, []);

  const handleDialogSelection = useCallback(() => {
    setSelectedPhenos(dialogSelection);
    setVisibleDialog(false);
  }, [dialogSelection]);

  const handleCheckboxChange = useCallback(
    (filePath) => {
      if (dialogSelection.includes(filePath)) {
        setDialogSelection(dialogSelection.filter((path) => path !== filePath));
      } else if (dialogSelection.length < 2) {
        setDialogSelection([...dialogSelection, filePath]);
      }
    },
    [dialogSelection]
  );

  return (
    <section
      className={`phenotype-section ${isPhenotypeVisible ? "visible" : "hidden"}`}
      style={{ width: "28em", margin: "20px" }}
    >
      <div className="phenotype-controls">
        <div className="phenotype-buttons">
          {phenotypeFiles.map((file) => (
            <Button
              key={file.name}
              label={file.name}
              className="phenotype-btn"
              onClick={() => fetchPDF(file.type)}
              disabled={loading}
            />
          ))}
          <div className="phenotype-checkboxes">
            <div className="phenotype-checkbox-container">
              <Checkbox inputId="one" checked={selectedPhenos.length === 1} onChange={() => setSelectedPhenos([])} />
              <label htmlFor="one">1</label>
              <Checkbox inputId="two" checked={selectedPhenos.length === 2} onChange={handleMultipleSelection} />
              <label htmlFor="two">2</label>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="small-loading">
          <ProgressSpinner style={{ width: "30px", height: "30px" }} strokeWidth="5" />
        </div>
      )}

      <div className="phenotype-pdf-display" style={{ display: "flex", gap: "10px", flexWrap: "wrap", width: "100%" }}>
        {selectedPhenos.map((filePath, index) => (
          <iframe
            key={index}
            src={filePath}
            title={`Phenotype Report ${index + 1}`}
            style={{
              width: selectedPhenos.length === 2 ? "48%" : "100%",
              height: "100vh",
              border: "none",
            }}
            frameBorder="0"
          />
        ))}
      </div>

      <Dialog
        visible={visibleDialog}
        style={{ width: "50vw" }}
        header="Select up to 2 PDFs"
        footer={
          <div>
            <Button label="Confirm" onClick={handleDialogSelection} disabled={dialogSelection.length !== 2} />
            <Button label="Cancel" onClick={() => setVisibleDialog(false)} className="p-button-secondary" />
          </div>
        }
        onHide={() => setVisibleDialog(false)}
      >
        {phenotypeFiles.map((file) => (
          <div key={file.name} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              inputId={file.name}
              checked={dialogSelection.includes(
                `http://localhost:5000/patient_files/${selectedPatient}/${file.type}`
              )}
              onChange={() => handleCheckboxChange(`http://localhost:5000/patient_files/${selectedPatient}/${file.type}`)}
            />
            <label htmlFor={file.name} style={{ marginLeft: "10px" }}>
              {file.name}
            </label>
          </div>
        ))}
      </Dialog>
    </section>
  );
};

export default Phenotype;
