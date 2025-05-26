import React, { useState } from 'react';
import './patientprofile.css';
import { FaStar, FaRegStar } from 'react-icons/fa';

const PreviousAppointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: 'March 15, 2023',
      time: '10:00 AM',
      doctor: 'Dr. Ahmed Bassiouni',
      doctorId: 'doc1',
      department: 'Dentistry',
      status: 'Completed',
      diagnosis: 'Gingivitis',
      treatment: 'Teeth cleaning and antibiotics',
      rating: 0,
      feedback: '',
      isRated: false,
      submittedAt: null,
      showRatingModal: false
    },
    {
      id: 2,
      date: 'February 22, 2023',
      time: '02:30 PM',
      doctor: 'Dr. Nourhan Makram',
      doctorId: 'doc2',
      department: 'Dentistry',
      status: 'Completed',
      diagnosis: 'Tooth decay',
      treatment: 'Dental fillings',
      rating: 0,
      feedback: '',
      isRated: false,
      submittedAt: null,
      showRatingModal: false
    },
    {
      id: 3,
      date: 'January 10, 2023',
      time: '11:00 AM',
      doctor: 'Dr. Mohamed Nashaat',
      doctorId: 'doc3',
      department: 'Pediatrics',
      status: 'Completed',
      diagnosis: 'Routine checkup',
      treatment: 'No treatment needed',
      rating: 0,
      feedback: '',
      isRated: false,
      submittedAt: null,
      showRatingModal: false
    }
  ]);

  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const toggleAppointmentDetails = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const handleRating = (id, rating) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { 
        ...appointment, 
        rating,
        showRatingModal: rating > 0
      } : appointment
    ));
  };

  const handleFeedbackChange = (id, value) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, feedback: value } : appointment
    ));
  };

  const closeRatingModal = (id) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { 
        ...appointment, 
        showRatingModal: false 
      } : appointment
    ));
  };

  const submitFeedback = async (id) => {
    try {
      const appointmentToUpdate = appointments.find(a => a.id === id);
      const updatedAppointment = {
        ...appointmentToUpdate,
        isRated: true,
        submittedAt: new Date().toISOString(),
        showRatingModal: false
      };

      // Simulate API call - replace with your actual API endpoint
      const response = await fetch('/api/appointments/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: id,
          doctorId: updatedAppointment.doctorId,
          rating: updatedAppointment.rating,
          feedback: updatedAppointment.feedback
        })
      });

      if (!response.ok) throw new Error('Failed to save rating');

      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? updatedAppointment : appointment
      ));

      // Show success message
      alert('Rating submitted successfully!');
      
      // Close the modal
      closeRatingModal(id);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const renderStars = (rating, interactive = false, onRate = () => {}) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            onClick={() => interactive && onRate(star)}
            style={{ 
              cursor: interactive ? 'pointer' : 'default',
              color: star <= rating ? '#FFD700' : '#C0C0C0',
              fontSize: '24px',
              margin: '0 2px'
            }}
          >
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
    );
  };

  const renderRatingModal = (appointment) => {
    if (!appointment.showRatingModal) return null;

    return (
      <div className="rating-modal-overlay">
        <div className="rating-modal">
          <h3>How was your visit?</h3>
          
          <div className="rating-section">
            <p>Rate this appointment</p>
            {renderStars(appointment.rating, true, (rating) => handleRating(appointment.id, rating))}
          </div>

          <div className="feedback-section">
            <label>Share your experience (optional)</label>
            <textarea
              value={appointment.feedback}
              onChange={(e) => handleFeedbackChange(appointment.id, e.target.value)}
              placeholder="Tell us about your experience with the doctor..."
              rows="4"
            />
          </div>

          <div className="modal-actions">
            <button 
              className="cancel-btn"
              onClick={() => closeRatingModal(appointment.id)}
            >
              Cancel
            </button>
            <button 
              className="submit-btn"
              onClick={() => submitFeedback(appointment.id)}
              disabled={appointment.rating === 0}
            >
              Submit Rating
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'rated') return appointment.isRated;
    if (activeTab === 'unrated') return !appointment.isRated;
    return true;
  });

  return (
    <div className="previous-appointments-container">
      <div className="appointments-header">
        <h1>Previous Appointments</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={activeTab === 'rated' ? 'active' : ''}
            onClick={() => setActiveTab('rated')}
          >
            Rated
          </button>
          <button 
            className={activeTab === 'unrated' ? 'active' : ''}
            onClick={() => setActiveTab('unrated')}
          >
            Unrated
          </button>
        </div>
      </div>

      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            {activeTab === 'rated' 
              ? 'No rated appointments' 
              : activeTab === 'unrated' 
                ? 'No appointments waiting for rating' 
                : 'No previous appointments'}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <React.Fragment key={appointment.id}>
              <div className={`appointment-card ${expandedAppointment === appointment.id ? 'expanded' : ''}`}>
                <div className="appointment-summary">
                  <div className="appointment-date">
                    <span className="date">{appointment.date}</span>
                    <span className="time">{appointment.time}</span>
                  </div>
                  <div className="appointment-info">
                    <h3>{appointment.doctor}</h3>
                    <p>{appointment.department}</p>
                    {appointment.isRated && (
                      <div className="rating-badge">
                        {renderStars(appointment.rating)}
                      </div>
                    )}
                  </div>
                  <button 
                    className="toggle-details-btn"
                    onClick={() => toggleAppointmentDetails(appointment.id)}
                  >
                    {expandedAppointment === appointment.id ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                {expandedAppointment === appointment.id && (
                  <div className="appointment-details">
                    <div className="details-section">
                      <h4>Diagnosis:</h4>
                      <p>{appointment.diagnosis}</p>
                    </div>
                    <div className="details-section">
                      <h4>Treatment:</h4>
                      <p>{appointment.treatment}</p>
                    </div>

                    {!appointment.isRated ? (
                      <button 
                        className="rate-btn"
                        onClick={() => handleRating(appointment.id, 1)}
                      >
                        Rate This Visit
                      </button>
                    ) : (
                      <div className="submitted-feedback">
                        <h4>Your Previous Rating</h4>
                        <div className="your-rating">
                          {renderStars(appointment.rating)}
                          {appointment.submittedAt && (
                            <span className="submission-date">
                              Submitted on: {new Date(appointment.submittedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {appointment.feedback && (
                          <div className="your-feedback">
                            <h5>Your Feedback:</h5>
                            <p>{appointment.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {renderRatingModal(appointment)}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default PreviousAppointments;