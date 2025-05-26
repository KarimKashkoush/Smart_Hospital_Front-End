import React, { useState } from 'react';
import "./MedicalRecird.css";
const MedicalRecord = () => {
  const [expandedRecords, setExpandedRecords] = useState({});

  const records = [
    {
      id: 1,
      date: "27 FEB",
      time: "10:30 AM",
      doctor: "DR/Nourhan mokhtar",
      patient: "Record for selim abotaleb",
      details: "Dental checkup and cleaning. Found two cavities that need filling."
    },
    {
      id: 2,
      date: "28 FEB",
      time: "02:15 PM",
      doctor: "DR/Ahmed basyony",
      patient: "Record for selim abotaleb",
      details: "Orthodontic consultation. Recommended braces treatment plan."
    },
    {
      id: 3,
      date: "01 MAR",
      time: "09:00 AM",
      doctor: "DR/Mohamed nashat",
      patient: "Record for selim abotaleb",
      details: "Pediatric dental examination. Baby teeth are developing normally."
    }
  ];

  const toggleDetails = (recordId) => {
    setExpandedRecords(prev => ({
      ...prev,
      [recordId]: !prev[recordId]
    }));
  };

  return (
    <div className="records-timeline">
      <h1 className="records-title">Medical Records Timeline</h1>
      <div className="timeline-container">
        {records.map((record) => (
          <div key={record.id} className="timeline-item">
            <div className="timeline-header">
              <div className="timeline-date">{record.date}</div>
              <div className="timeline-time">{record.time}</div>
            </div>
            <div className="timeline-content">
              <div className="doctor-info">{record.doctor}</div>
              <div className="patient-info">{record.patient}</div>
              
              <button 
                className="view-button"
                onClick={() => toggleDetails(record.id)}
              >
                {expandedRecords[record.id] ? 'Hide Details' : 'View Details'}
              </button>
              
              {expandedRecords[record.id] && (
                <div className="record-details">
                  <h4>Treatment Details:</h4>
                  <p>{record.details}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MedicalRecord;