import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const ConcernButton = ({
    Concerndata,
}) => {
  const [visibleData, setVisibleData] = useState(false);

  console.log(Concerndata);
  return (
    <div className="report-handle-button-container">
      {/* Report Button */}
      <div className="report_b">
        <Button onClick={() => setVisibleData(true)} label="Concern" />
      </div>

      {/* Dialog Popup */}
      <Dialog
        header="Patient Concern"
        visible={visibleData}
        style={{ width: "60vw" }}
        onHide={() => setVisibleData(false)}
      >
        <div className="popup-content">
          {Concerndata && Concerndata.length > 0 ? (
            <ul>
              {Concerndata.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No concerns available</p>
          )}
        </div>        
      </Dialog>
    </div>
  );
};

export default ConcernButton;
