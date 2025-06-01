import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./doctordetails.css";
import { useLocation } from "react-router-dom";

const DoctorDetails = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const [doctorData, setDoctorData] = useState([]);
  const [realRatings, setRealRatings] = useState([]);
  const doctor = location.state?.doctor;

  useEffect(() => {
    if (!doctor || !doctor.userId) return;

    fetch(`http://localhost:5987/ratings/${doctor.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.ratings) {
          setRealRatings(data.ratings);
        }
      })
      .catch(err => console.error("Error fetching ratings:", err));
  }, [doctor]);

  const averageRating = realRatings.length > 0
    ? (realRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / realRatings.length).toFixed(1)
    : null;

  useEffect(() => {
    if (!doctor || !doctor.userId) {
      console.error("No doctor or userId found in location state");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/get-doctor/${doctor.userId}`)
      .then(res => {
        if (!res.ok) throw new Error("فشل في جلب البيانات");
        return res.json();
      })
      .then(data => setDoctorData(data))
      .catch(err => console.error(err));

    // Load user from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name);
    }
  }, [doctor]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    timeSlotId: "",
    time: "",
    message: "",
    doctorId: "",
    patientId: "",
  });

  function generateTimeSlots(startTime, endTime, intervalMinutes = 15) {
    const slots = [];

    // نحول الوقت لنوع Date بس يوم وهمي عشان نقدر نستخدم الدوال
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let current = new Date(2000, 0, 1, startHour, startMinute);
    const end = new Date(2000, 0, 1, endHour, endMinute);

    while (current < end) {
      // نحول الوقت لسلسلة "HH:mm"
      const hh = String(current.getHours()).padStart(2, '0');
      const mm = String(current.getMinutes()).padStart(2, '0');
      slots.push(`${hh}:${mm}`);

      // نزود الوقت بربع ساعة
      current.setMinutes(current.getMinutes() + intervalMinutes);
    }

    return slots;
  }

  function getAvailableTimeSlots(timeSlot, bookings) {
    const start = timeSlot.startTime; // مثل "09:00"
    const end = timeSlot.endTime;     // مثل "12:00"

    // دالة لتحويل "HH:mm" إلى دقائق من منتصف الليل
    function timeToMinutes(t) {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    }

    // دالة لتحويل الدقائق إلى "HH:mm"
    function minutesToTime(min) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    // جلب كل الفترات (كل 15 دقيقة)
    const slots = [];
    let current = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    while (current < endMinutes) {
      slots.push(minutesToTime(current));
      current += 15;
    }

    // الأوقات المحجوزة كـ array من strings "HH:mm"
    const bookedTimes = bookings.map(b => {
      // حوّل الوقت في الحجز من ISO إلى "HH:mm"
      const date = new Date(b.date);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    // تصفية الأوقات المتاحة (مش محجوزة)
    const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

    return availableSlots;
  }

  // مثال على استدعاء الدالة
  const exampleTimeSlot = {
    startTime: "09:00",
    endTime: "12:00"
  };

  const exampleBookings = [
    {
      date: "2025-06-07T06:30:00.000Z"  // UTC
    }
  ];

  // **ملاحظة**: الوقت في البيانات بتاعك بالـ UTC، لو انت في توقيت محلي، لازم تضبط التوقيت حسب المنطقة الزمنية.
  const available = getAvailableTimeSlots(exampleTimeSlot, exampleBookings);
  console.log(available);


  const getAvailableSlotsForDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return [];
    if (!doctorData.timeSlots) return [];

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];

    // فلتر الشفتات المتاحة في اليوم ده
    const slotsForDay = doctorData.timeSlots.filter(slot => slot.dayOfWeek === dayName);

    let allSlots = [];

    slotsForDay.forEach(slot => {
      // نولد كل أوقات الشيفت
      const times = generateTimeSlots(slot.startTime, slot.endTime, 15);

      times.forEach(time => {
        allSlots.push({
          id: slot.id, // رقم الشيفت
          time: time,
          booked: slot.booked,
        });
      });

    });

    // لو عايز ممكن تحذف الأوقات المحجوزة هنا حسب booked لو عندك تفاصيل الحجز لكل ربع ساعة

    return allSlots;
  };

  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotStatus, setSlotStatus] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);


  const generateAvailableDates = () => {
    if (!doctorData.timeSlots) return [];

    const today = new Date();
    const availableDates = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      const isAvailable = doctorData.timeSlots.some(slot => slot.dayOfWeek === dayName);
      if (isAvailable) {
        availableDates.push(date);
      }
    }

    return availableDates;
  };

  const availableDates = generateAvailableDates();

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(date); // 👈 ده بيتم استخدامه لاحقًا في select
    setFormData({ ...formData, date: dateString, timeSlotId: null, time: "" });
    setShowDatePicker(false);
    checkSlotAvailability(date, ""); // 👈 مرر الـ Date object مش string
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "time") {
      const selectedSlot = availableSlots.find(slot => slot.time === value);

      setFormData(prev => ({
        ...prev,
        time: value,
        timeSlotId: selectedSlot ? selectedSlot.id : "", // فقط رقم
      }));

      if (selectedDate) {
        checkSlotAvailability(selectedDate, value);
      }

    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const checkSlotAvailability = (dateObj, shift) => {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return;
    if (!doctorData.timeSlots) return;

    setIsLoadingSlots(true);

    setTimeout(() => {
      const slotsForDate = getAvailableSlotsForDate(dateObj);
      setAvailableSlots(slotsForDate);

      if (shift) {
        const slot = slotsForDate.find(s => s.time === shift);
        setSlotStatus(slot && (!slot.booked || slot.booked.length === 0) ? "available" : "not-available");
      } else {
        setSlotStatus(null);
      }

      setIsLoadingSlots(false);
    }, 300);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const Id = user?.userId;
  const role = user?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timeSlotId = formData.timeSlotId;
    const selectedTime = formData.time;
    const dateTimeString = `${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`;

    // نحسب السعر والخصم
    const basePrice = 50; // سعر الكشف الأصلي
    const hasUniversity = user?.university && user.university.trim() !== "";

    const discountPercent = hasUniversity ? 25 : 0;
    const discountAmount = (basePrice * discountPercent) / 100;
    const totalPrice = basePrice - discountAmount;

    try {
      const dateStr = selectedDate.toISOString();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          timeSlotId,
          dateTime: dateTimeString,
          patientName: formData.name,
          patientId: Id ? Number(Id) : undefined,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Booking failed");
      }

      // التنقل بعد الحجز مع إرسال بيانات السعر والخصم
      navigate("/confirmation", {
        state: {
          doctorName: doctor.name,
          date: dateStr.split("T")[0],
          time: formData.time,
          cost: `${basePrice} EGP`,
          discount: discountPercent > 0 ? `${discountPercent}%` : 'No discount',
          total: `${totalPrice} EGP`,
          reservationNumber: `D-${Math.floor(100000 + Math.random() * 900000)}`,
        },
      });
    } catch (error) {
      alert("Booking failed: " + error.message);
    }
  };


  // Helper to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Select a date";
    const options = { weekday: 'long', year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <header className="contact-header">
        <div className="nav-logo">
          <img src="/logo.png" alt="Hospital Logo" className="hospital-logo" />
        </div>
        <nav className="navbar1">
          <ul className="nav-links1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
          <div className="About-nav-right">
            {isLoggedIn ? (
              <Link to={`/${role}Profile/${Id}`} className="welcome-message">
                Hello, {userName}
              </Link>
            ) : (
              <>
                <Link to="/LogIn">Log In</Link>
                <Link to="/SignUpSelection">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="scheduler-container">
          <div className="combined-container">
            {/* Left Column - Doctor Image and Reviews */}
            <div className="left-column">
              <div className="image-section">
                <div className="image-frame">
                  <img
                    src={doctor.profileImage || "/main-logo.png"}
                    alt="Dr. Nourhan Mokhtar"
                    className="service-image"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <h3>{doctor.name}</h3>
                      <p>{doctor.education}</p>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= Math.round(averageRating) ? "filled" : ""}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-text">
                          {averageRating ? `${averageRating} (${realRatings.length} تقييم)` : "لا يوجد تقييم"}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Reviews Section */}
              <div className="doctor-reviews-section">
                <div className="reviews-list">
                  {realRatings.length > 0 ? (
                    realRatings.map((rating, index) => (
                      <div key={index} className="review-card">
                        <div className="review-header">
                          <h4>{rating.patient?.name || "مريض"}</h4>
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= rating.rating ? "filled" : ""}>★</span>
                            ))}
                          </div>
                          <span className="review-date">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{rating.comment || "لا يوجد تعليق"}</p>
                      </div>
                    ))
                  ) : (
                    <p>لا يوجد تقييمات حتى الآن</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Appointment Form */}
            <div className="form-section">
              <div className="form-header">
                <h1 className="form-title">Schedule Your Appointment</h1>
                <p className="form-subtitle">Book with Dr. {doctor.name}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your Phone"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date:</label>
                    <div className="date-picker-container">
                      <div
                        className="date-display"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                      >
                        {selectedDate ? formatDate(selectedDate) : "Select a date"}
                      </div>
                      {showDatePicker && (
                        <div className="date-picker-popup">
                          {availableDates.map((date, index) => (
                            <div
                              key={index}
                              className={`date-option ${selectedDate && selectedDate.toDateString() === date.toDateString() ? "selected" : ""}`}
                              onClick={() => handleDateSelect(date)}
                            >
                              {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {isLoadingSlots && (
                      <div className="loading-indicator">
                        Checking availability...
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Time:</label>
                    <select
                      name="time"
                      value={formData.time || ""}
                      onChange={handleChange}
                      required
                      disabled={!formData.date}
                      className="compact-time-select"
                    >
                      <option value="">Select time</option>
                      {availableSlots.map((slot, index) => {
                        const [hh, mm] = slot.time.split(':').map(Number);
                        const end = new Date(2000, 0, 1, hh, mm);
                        end.setMinutes(end.getMinutes() + 15);
                        const endHH = String(end.getHours()).padStart(2, '0');
                        const endMM = String(end.getMinutes()).padStart(2, '0');
                        const endTime = `${endHH}:${endMM}`;

                        return (
                          <option key={slot.time} value={slot.time}>
                            {slot.time} - {endTime}
                          </option>
                        );
                      })}
                    </select>



                    {slotStatus && !isLoadingSlots && formData.time && (
                      <div className={`slot-status ${slotStatus}`}>
                        {slotStatus === "available"
                          ? "✓ Slot available"
                          : "✗ Slot not available"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-divider"></div>

                <div className="form-group">
                  <label>Message:</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows="3"
                  ></textarea>
                </div>

                <div className="appointment-summary">
                  <h3>
                    Appointment: {formatDate(formData.date)} {formData.time && `at ${formData.time}`}
                  </h3>
                </div>
                <button
                  type="submit"
                  className="appointment-submit-btn"
                  disabled={slotStatus !== "available"}
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DoctorDetails;