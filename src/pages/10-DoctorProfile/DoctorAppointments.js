import React, { useState, useEffect } from 'react';
import './doctorprofile.css';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const doctorId = user?.userId;
const DoctorAppointments = () => {
  // States
  const [showDiagnosis, setShowDiagnosis] = useState(null);
  const [diagnoses, setDiagnoses] = useState({});
  const [activeTab, setActiveTab] = useState('today');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDelay, setSelectedDelay] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [appointments, setAppointments] = useState([]);



  // Delay options
  const delayOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' }
  ];

  // Fetch appointments from API (مثال)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.userId;
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/get-doctor-bookings/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // أو المكان اللي بتخزن فيه التوكن
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data.booking);
        console.log("Fetched appointments:", data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Handlers
  const handleUploadClick = (appointmentId) => {
    setShowDiagnosis(showDiagnosis === appointmentId ? null : appointmentId);
  };

  const handleDiagnosisChange = (appointmentId, value) => {
    setDiagnoses(prev => ({
      ...prev,
      [appointmentId]: value
    }));
  };

  const openNotificationModal = (type, appointment = null) => {
    setNotificationType(type);
    setSelectedAppointment(appointment);
    setShowNotificationModal(true);
    setSelectedDelay('');
  };

  // إرسال الإشعار الحقيقي إلى الباك إند
  const sendNotification = async () => {
    if (notificationType === 'delay' && !selectedDelay) {
      alert('Please select delay duration');
      return;
    }

    setIsSending(true);

    try {
      // هنا يتم الاتصال بالباك إند الحقيقي
      const response = await fetch('https://your-api-endpoint.com/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token' // إذا كان يحتاج مصادقة
        },
        body: JSON.stringify({
          appointmentId: selectedAppointment?.id,
          patientId: selectedAppointment?.patientId,
          type: notificationType,
          delayMinutes: notificationType === 'delay' ? selectedDelay : null,
          message: notificationType === 'delay'
            ? `Your appointment will be delayed by ${selectedDelay} minutes`
            : 'Your doctor is absent today'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      alert(`Notification sent successfully to patient: ${notificationType === 'delay'
        ? `Appointment delayed by ${selectedDelay} minutes`
        : 'Doctor absence reported'
        }`);

      setShowNotificationModal(false);
    } catch (error) {
      console.error("Notification error:", error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Submit diagnosis (مثال)
  const submitDiagnosis = async (appointment) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-medical-record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctorId,
          patientId: appointment.patientId,
          diagnosis: diagnoses[appointment.id],
          treatmentDetails: "",
        }),
      });

      console.log({
        doctorId: doctorId,
        patientId: appointment.patientId,
        diagnosis: diagnoses[appointment.id],
      });


      if (!response.ok) {
        throw new Error("Failed to submit diagnosis");
      }

      alert("Diagnosis submitted successfully!");
      setShowDiagnosis(null);
    } catch (error) {
      alert("Error submitting diagnosis");
      console.error(error);
    }
  };



  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="appointments-container">
      <h2 className="section-title">My Appointments</h2>

      {/* Global absence button */}
      <div className="global-notification-actions">
        <button
          className="global-absence-btn"
          onClick={() => openNotificationModal('absence')}
        >
          Report Absence for Today
        </button>
      </div>

      {/* Appointment tabs */}
      <div className="appointment-tabs">
        <div
          className={`tab ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          {getDayName(new Date())}<br />
          {new Date().toLocaleDateString()}
        </div>

        <div
          className={`tab ${activeTab === 'tomorrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('tomorrow')}
        >
          {getDayName(new Date(Date.now() + 86400000))}<br />
          {new Date(Date.now() + 86400000).toLocaleDateString()}
        </div>

        <div
          className={`tab ${activeTab === '3rd' ? 'active' : ''}`}
          onClick={() => setActiveTab('3rd')}
        >
          {getDayName(new Date(Date.now() + 86400000 * 2))}<br />
          {new Date(Date.now() + 86400000 * 2).toLocaleDateString()}
        </div>

        <div
          className={`tab ${activeTab === '4rd' ? 'active' : ''}`}
          onClick={() => setActiveTab('4rd')}
        >
          {getDayName(new Date(Date.now() + 86400000 * 3))}<br />
          {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}
        </div>

        <div
          className={`tab ${activeTab === '5rd' ? 'active' : ''}`}
          onClick={() => setActiveTab('5rd')}
        >
          {getDayName(new Date(Date.now() + 86400000 * 4))}<br />
          {new Date(Date.now() + 86400000 * 4).toLocaleDateString()}
        </div>

        <div
          className={`tab ${activeTab === '6rd' ? 'active' : ''}`}
          onClick={() => setActiveTab('6rd')}
        >
          {getDayName(new Date(Date.now() + 86400000 * 5))}<br />
          {new Date(Date.now() + 86400000 * 5).toLocaleDateString()}
        </div>
      </div>

      {/* Appointments list */}
      <div className="appointments-list">
        {(() => {
          // حدد التاريخ اللي عايز تعرض مواعيده بناءً على التاب النشط
          let filterDate;
          const today = new Date();
          if (activeTab === 'today') {
            filterDate = today;
          } else if (activeTab === 'tomorrow') {
            filterDate = new Date(today.getTime() + 86400000 * 1);
          } else if (activeTab === '3rd') {
            filterDate = new Date(today.getTime() + 86400000 * 2);
          } else if (activeTab === '4rd') {
            filterDate = new Date(today.getTime() + 86400000 * 3);
          } else if (activeTab === '5rd') {
            filterDate = new Date(today.getTime() + 86400000 * 4);
          } else if (activeTab === '6rd') {
            filterDate = new Date(today.getTime() + 86400000 * 5);
          } else {
            filterDate = null;
          }

          // فلترة المواعيد حسب التاريخ
          const filteredAppointments = appointments.filter(app => {
            if (!filterDate) return false;
            const appDate = new Date(app.date);
            return appDate.toDateString() === filterDate.toDateString();
          });

          // لو فاضية أظهر رسالة
          if (filteredAppointments.length === 0) {
            return <p className="no-appointments">لا يوجد مواعيد لـ {activeTab === 'today' ? 'اليوم' : activeTab === 'tomorrow' ? 'غدًا' : ''}.</p>;
          }

          // لو في مواعيد اعرضهم
          return filteredAppointments.map(appointment => (
            <div className="appointment-card" key={appointment.id}>
              <div className="appointment-info">
                <h3>{appointment.patientName}</h3>
                <p className="appointment-time">
                  {(() => {
                    const originalDate = new Date(appointment.date);
                    const hours = originalDate.getHours().toString().padStart(2, '0');
                    const minutes = originalDate.getMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;

                  })()}
                </p>
                <span className={`status-badge ${appointment.status}`}>
                  confirmed
                </span>
              </div>

              <div className="appointment-actions">
                <button
                  className="upload-btn"
                  onClick={() => handleUploadClick(appointment.id)}
                >
                  {showDiagnosis === appointment.id ? 'Hide' : 'Upload Diagnosis'}
                </button>

                <button
                  className="delay-btn"
                  onClick={() => openNotificationModal('delay', appointment)}
                >
                  Report Delay
                </button>
              </div>

              {showDiagnosis === appointment.id && (
                <div className="diagnosis-section">
                  <h4>Patient Diagnosis</h4>
                  <textarea
                    value={diagnoses[appointment.id] || ''}
                    onChange={(e) => handleDiagnosisChange(appointment.id, e.target.value)}
                    placeholder="Enter diagnosis, medications, and recommendations..."
                    rows="5"
                  />
                  <div className="diagnosis-actions">
                    <button
                      className="cancel-btn"
                      onClick={() => setShowDiagnosis(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="submit-btn"
                      onClick={() => submitDiagnosis(appointment)}
                    >
                      Submit Diagnosis
                    </button>
                  </div>
                </div>
              )}
            </div>
          ));
        })()}
      </div>


      {/* Notification modal */}
      {showNotificationModal && (
        <div className="notification-modal">
          <div className="modal-content">
            <h3>
              {notificationType === 'delay'
                ? `Report Delay for ${selectedAppointment?.name}'s Appointment`
                : 'Report Absence for All Today\'s Appointments'}
            </h3>

            {notificationType === 'delay' ? (
              <div className="delay-options">
                <p>Select delay duration:</p>
                <div className="delay-buttons">
                  {delayOptions.map(option => (
                    <button
                      key={option.value}
                      className={`delay-option ${selectedDelay === option.value ? 'selected' : ''}`}
                      onClick={() => setSelectedDelay(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p>This will notify all patients with appointments today. Are you sure?</p>
            )}

            <div className="modal-actions">
              <button
                onClick={sendNotification}
                disabled={isSending || (notificationType === 'delay' && !selectedDelay)}
                className="confirm-btn"
              >
                {isSending ? 'Sending...' : 'Confirm'}
              </button>

              <button
                onClick={() => setShowNotificationModal(false)}
                disabled={isSending}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default DoctorAppointments;