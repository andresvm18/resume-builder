import Header from "../../../shared/components/layout/Header";
import LoginModal from "../components/LoginModal";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <main className="login-page">
      <Header />

      <section className="login-page__section">
        <div className="login-page__inner">
          <div className="login-page__copy">
            <div className="login-page__eyebrow">{APP_MESSAGES.AUTH.LOGIN_PAGE_EYEBROW}</div>
            <h1 className="login-page__headline">
              {APP_MESSAGES.AUTH.LOGIN_PAGE_HEADLINE}
            </h1>
            <p className="login-page__body">
              {APP_MESSAGES.AUTH.LOGIN_PAGE_BODY}
            </p>
            <ul className="login-page__benefits">
              <li className="login-page__benefit">
                <span className="login-page__benefit-dot"></span>
                {APP_MESSAGES.AUTH.LOGIN_BENEFIT_1}
              </li>
              <li className="login-page__benefit">
                <span className="login-page__benefit-dot"></span>
                {APP_MESSAGES.AUTH.LOGIN_BENEFIT_2}
              </li>
              <li className="login-page__benefit">
                <span className="login-page__benefit-dot"></span>
                {APP_MESSAGES.AUTH.LOGIN_BENEFIT_3}
              </li>
            </ul>
          </div>

          <div className="login-page__modal">
            <LoginModal />
          </div>
        </div>
      </section>

      <div className="login-page__orb-bottom"></div>
    </main>
  );
}