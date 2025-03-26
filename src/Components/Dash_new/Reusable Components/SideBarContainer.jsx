import React, { useState, useEffect } from "react";
import "./SideBarContainer.css";

const SideBarContainer = ({
  visibleleft,
  setVisibleleft,
  sidebarprefer,
  handleSingleCodnition,
  submittedConditions,
  setSubmittedConditions,
  removedCondition,
  selectedPatient,
  Concerndata = [], // Ensure default value is an array
}) => {
  const [selectedPreference, setSelectedPreference] = useState(null);

  useEffect(() => {
    setSelectedPreference(null);
    setSubmittedConditions([]);
  }, [selectedPatient]);

  const handleClick = (title) => {
    setSelectedPreference(title);
    handleSingleCodnition(title);
  };

  return (
    <div className={`sidebar-container ${visibleleft ? "visible" : ""}`}>
      <div className="sidebar-content">
        {sidebarprefer.map((preference, index) => (
          <button
            key={index}
            className={`sidebar-button ${
              selectedPreference === preference.title ? "selected" : ""
            } ${
              submittedConditions.includes(preference.title) ? "submitted" : ""
            } ${
              Array.isArray(Concerndata) && Concerndata.includes(preference.title)
                ? "concerned"
                : ""
            }`}
            onClick={() => handleClick(preference.title)}
          >
            <img src={preference.icon} className="condition-icons" alt={preference.title} />
            <span>{preference.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideBarContainer;
