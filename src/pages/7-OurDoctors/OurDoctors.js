import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ourdoctors.css";

const OurDoctors = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const role = user?.role;
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name);
    }
  }, []);

  const doctors = [
    {
      id: 1,
      name: "Prof. Dr. Tamer Farouk Siam",
      title: "Cardiology Specialist",
      rating: 4.5,
      reviews: 128,
      image: "Prof. Dr. Tamer Farouk Siam.png",
      className: "doctor-card-tamer", // Unique class name
      description: "أستاذ جراحة القلب والصدر بجامعة القاهرة ورءيس قسم جراحة القلب والصدر بمستشفي سعاد كفافي"
    },
    {
      id: 2,
      name: "Dr. Nourhan Mokhtar",
      title: "Dentistry",
      rating: 4.8,
      reviews: 215,
      image: "Dr.NourhanMokhtar.png",
      className: "doctor-card-chen",
      description: "استشاري طب وجراحة الفم والاسنان بمستشفي سعاد كفافي"

    },
    {
      id: 3,
      name: "Dr. Ahmed Tharwat",
      title: "Dentistry",
      rating: 4.2,
      reviews: 87,
      image: "Dr. Ahmed Tharwat.png",
      className: "doctor-card-tharwat",
      description: "استشاري تركيبات وزراعة اسنان بمستشفي سعاد كفافي"
    },
    {
      id: 4,
      name: "Prof. Dr. Ahmed Basyony",
      title: "Dentistry",
      rating: 4.7,
      reviews: 176,
      image: "Dr. Ahmed Basyony.png",
      className: "doctor-card-williams",
      description: "استاذ تقويم الاسنان كلية طب الاسنان واستشاري التقويم بمستشفي سعاد كفافي"
    },
    {
      id: 5,
      name: "Prof. Dr. Mahmoud Al-Aseel",
      title: "Dermatologist",
      rating: 4.3,
      reviews: 94,
      image: "Prof. Dr. Mahmoud Al-Aseel.png",
      className: "doctor-card-park",
      description: "أستاذ علاج الجذور بكلية طب الفم و الأسنان جامعة مصر واستشاري علاج الجذور بمستشفي سعاد كفافي"
    },
    {
      id: 6,
      name: "Dr. Mohamed Nashaat",
      title: "Dentistry",
      rating: 4.0,
      reviews: 65,
      image: "Dr. Mohamed Nashaat.png",
      className: "doctor-card-wilson",
      description: "اخصائي طب أسنان أطفال"

    },
    {
      id: 7,
      name: "Dr. Nehal Kabil",
      title: "Dentistry",
      rating: 4.6,
      reviews: 142,
      image: "Dr. Nehal Kabil.png",
      className: "Dr. Nehal Kabil.png",
      description: "ا د اسنان اطفال وصحة المجتمع في كلية طب اسنان جامعة مصر ورئيس وحدة علاج اسنان الاطفال وذوي الاحتياجات تحت مخدر عام بمستشفي سعاد كفافي"
    },
    {
      id: 8,
      name: "Dr. Amr Khairy Morsy",
      title: "Dentistryt",
      rating: 4.4,
      reviews: 118,
      image: "Dr. Amr Khairy Morsy.png",
      className: "doctor-card-kim",
      description: "مدرس مساعد قسم تقويم الاسنان جامعه مصر للعلوم والتكنولوجيا واخصائي تقويم في مستشفي سعاد كفافي"
    },
    {
      id: 9,
      name: "Dr. Mohammed Ali Al-Zamel",
      title: "ENT Specialist",
      rating: 4.4,
      reviews: 118,
      image: "Dr. Mohammed Ali Al-Zamel.png",
      className: "doctor-card-kim",
      description: "استشاري رمد في مستشفي سعاد كفافي"
    },
    {

      id: 10,
      name: "Prof. Dr. Gamal Abdel Fattah",
      title: "Ear,Nose & Throte Specialist",
      rating: 4.6,
      reviews: 142,
      image: "Prof. Dr. Gamal Abdel Fattah.png",
      className: "Dr. Nehal Kabil.png",
      description: "رئيس قسم انف واذن وحنجرة بمستشفي سعاد كفافي"
    },
    {
      id: 11,
      name: "Dr. Wael Ali Mohamed El-Zomor",
      title: "Ear,Nose & Throte Specialist",
      rating: 4.0,
      reviews: 65,
      image: "Dr. Wael Ali Mohamed El-Zomor.png",
      className: "doctor-card-wilson",
      description: "استشاري انف واذن وحنجرة بمستشفي سعاد كفافي"
    },
    {
      id: 12,
      name: "Dr. Kareem Mourad",
      title: "Ophthalmologist",
      rating: 4.6,
      reviews: 142,
      image: "Dr. Kareem Mourad.png",
      className: "Dr. Nehal Kabil.png",
      description: "استشاري جراحة مخ واعصاب بمستشفي سعاد كفافي"
    },
    {
      id: 13,
      name: "Prof. Dr. Magda Abdel Hamid",
      title: "Pediatrics",
      rating: 4.4,
      reviews: 118,
      image: "Prof. Dr. Magda Abdel Hamid.png",
      className: "doctor-card-kim",
      description: "استشاري طب أطفال وحديثي الولادة بجامعة الزقازيق واستشاري طب أطفال وحديثي الولادة بمستشفي سعاد كفافي"
    },
    {
      id: 14,
      name: "Prof. Dr. Sherif Abdel Rahman",
      title: "Urology",
      rating: 4.4,
      reviews: 118,
      image: "Prof. Dr. Sherif Abdel Rahman.png",
      className: "doctor-card-kim",
      description: "استاذ جراحة الكلي والمسالك بجامعة القاهرة واستشاري ورئيس قسم المسالك البولية بمستشفي سعاد كفافي"
    },
    {

      id: 15,
      name: "Prof. Dr. Hamdy Mohamed Ibrahim",
      title: "Urology",
      rating: 4.6,
      reviews: 142,
      image: "Prof. Dr. Hamdy Mohamed Ibrahim.png",
      description: "استشاري جراحة المسالك البولية في مستشفي سعاد كفافي و استاذ جراحة المسالك البولية بجامعة الفيوم"
    },
    {
      id: 16,
      name: "Dr. Mina Safwat Samble",
      title: "Urology",
      rating: 4.4,
      reviews: 118,
      image: "Dr. Mina Safwat Samble.png",
      className: "doctor-card-kim",
      description: "استشاري جراحة المسالك البولية في مستشفي سعاد كفافي"
    },
    {
      id: 17,
      name: "Dr. Nauman Mohamed Kamal El-Shafie",
      title: "Ear,Nose & Throte Specialist",
      rating: 4.4,
      reviews: 118,
      image: "Dr. Nauman Mohamed Kamal El-Shafie.png",
      className: "doctor-card-kim",
      description: "استشاري جراحة الوجه والفم والفكين بمستشفي سعاد كفافي"

    },
    {
      id: 18,
      name: "Dr. Lotfi El-Kilani",
      title: "Ear,Nose & Throte Specialist",
      rating: 4.6,
      reviews: 142,
      image: "Dr. Lotfi El-Kilani.png",
      description: "استشاري جراحة الفم والوجه والفكين في مستشفي سعاد كفافي , مدرس جراحة الفم والوجه والفكين بجامعة مصر , زميل الكلية الملكية للجراحين -ادنبره انجلترا"

    },
    {
      id: 19,
      name: "Prof. Dr. Khairy El-Morsy",
      title: "Ear,Nose & Throte Specialist",
      rating: 4.4,
      reviews: 118,
      image: "Prof. Dr. Khairy El-Morsy.png",
      className: "doctor-card-kim",
      description: "أستاذ جراحة الفم والوجه والفكين بكلية طب الاسنان جامعة القاهرة واستشاري جراحة الفم والوجه والفكين بمستشفي سعاد كفافي"

    },
    {
      id: 20,
      name: "Dr. Lobna Abdel Azim Rifaat",
      title: "ENT Specialist",
      rating: 4.4,
      reviews: 118,
      image: "Dr. Lobna Abdel Azim Rifaat.png",
      className: "doctor-card-kim",
      description: "استشاري أمراض دم باطنة واستشاري تحاليل الدم والسرطان في مستشفي سعاد كفافي"
    },

    {

      id: 21,
      name: "Dr. Hany Gamal",
      title: "Ophthalmologist",
      rating: 4.6,
      reviews: 142,
      image: "Dr. Hany Gamal.png",
      description: "رئيس قسم التخدير والعناية المركزة وعلاج الالم بمستشفي سعاد كفافي"
    },


  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star">½</span>);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <>
      <header className="contact-header">
        <div className="nav-logo">
          <img src="logo.png" alt="Hospital Logo" className="hospital-logo" />
        </div>
        <nav className="navbar1">
          <ul className="nav-links1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
          <div className="About-nav-right">
            {isLoggedIn ? (
              <Link to={`/${role}Profile/${userId}`} className="About-welcome-message">
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
        <div className="ourdoctors-grid-container">
          <h2 className="oursection-title">Our Medical Specialists</h2>
          <p className="oursection-subtitle">Top-rated healthcare professionals</p>

          <div className="ourcompact-doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor.id} className={`ourcompact-doctor-card ${doctor.className}`}>
                <div className="ourdoctor-image-container">
                  <img src={doctor.image} alt={doctor.name} className="ourdoctor-image" />
                </div>
                <div className="ourcompact-doctor-info">
                  <h3 className="ourdoctor-name">{doctor.name}</h3>
                  <p className="ourdoctor-title">{doctor.title}</p>
                  <div className="ourdoctor-rating">
                    <div className="starss">
                      {renderStars(doctor.rating)}
                      <span className="rating-valuee">{doctor.rating.toFixed(1)}</span>
                    </div>
                    <p className="review-count">({doctor.reviews} reviews)</p>
                  </div>
                  <div className="ourdoctor-description">
                    <p>{doctor.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer__content">
          <img
            src="Hosptal1.png"
            alt="Hospital Building"
            className="footer__image"
          />

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/OurDoctors">Our Doctors</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Get in Touch</h3>
            <div className="footer-contact-item">
              <a href="tel:16111" className="footer-contact-link">Call Us: 16111</a>
            </div>

            <div className="footer-contact-item">
              <a
                href="https://maps.google.com?q=26th+of+July+Corridor,+6th+of+October,+Egypt"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                26th of July Corridor<br />6th of October, Egypt
              </a>
            </div>

            <div className="footer-contact-item">
              <a href="mailto:info@souadkafafihospital.com" className="footer-contact-link">
                info@souadkafafihospital.com
              </a>
            </div>
            <div className="footer__social-icons">
              <a
                href="https://www.instagram.com/souad_kafafi_hospital"
                aria-label="Instagram"
                className="footer__social-icon"
              >
                <img src="instagram.png" alt="Instagram" />
              </a>
              <a
                href="https://x.com/themskuh"
                aria-label="Twitter"
                className="footer__social-icon"
              >
                <img src="twitter.png" alt="Twitter" />
              </a>
              <a href="https://m.facebook.com/themskuh" aria-label="Facebook" className="footer__social-icon">
                <img src="facebook.png" alt="Facebook" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__copyright">
          <p>© 2025 Souad Kafafi Hospital. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default OurDoctors;