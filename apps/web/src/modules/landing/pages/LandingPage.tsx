import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../auth/services/auth.service";
import Header from "../../../shared/components/layout/Header";
import AtsScoreCard from "../components/AtsScoreCard";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleCreateResume = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/resume-builder");
    } else {
      navigate("/login");
    }
  };

  const handleCTA = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/resume-builder");
    } else {
      navigate("/register");
    }
  };

  return (
    <main className="landing-page">
      <Header />

      {/* Hero */}
      <section className="hero">
        <div>
          <span className="hero__badge">{APP_MESSAGES.LANDING.HERO_BADGE}</span>
          <h2 className="hero__title">{APP_MESSAGES.LANDING.HERO_TITLE}</h2>
          <p className="hero__description">{APP_MESSAGES.LANDING.HERO_DESCRIPTION}</p>
          <div className="hero__actions">
            <button onClick={handleCreateResume} className="btn-primary">
              {APP_MESSAGES.LANDING.HERO_BUTTON}
            </button>
          </div>
        </div>
        <div className="hero__visual">
          <AtsScoreCard />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <p className="features__eyebrow">{APP_MESSAGES.LANDING.FEATURES_EYEBROW}</p>
        <h3 className="features__title">{APP_MESSAGES.LANDING.FEATURES_TITLE}</h3>
        <div className="features__grid">
          <div className="feature-card">
            <div className="feature-card__icon">📄</div>
            <h4 className="feature-card__title">{APP_MESSAGES.LANDING.FEATURE_ATS_TITLE}</h4>
            <p className="feature-card__description">{APP_MESSAGES.LANDING.FEATURE_ATS_DESCRIPTION}</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">⬇</div>
            <h4 className="feature-card__title">{APP_MESSAGES.LANDING.FEATURE_PDF_TITLE}</h4>
            <p className="feature-card__description">{APP_MESSAGES.LANDING.FEATURE_PDF_DESCRIPTION}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta__inner">
          <h3 className="cta__title">
            {APP_MESSAGES.LANDING.CTA_TITLE}
          </h3>
          <p className="cta__description">{APP_MESSAGES.LANDING.CTA_DESCRIPTION}</p>
          <div className="cta__action">
            <button onClick={handleCTA} className="btn-primary">
              {APP_MESSAGES.LANDING.CTA_BUTTON}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}