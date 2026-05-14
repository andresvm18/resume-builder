import Header from "../../../shared/components/layout/Header";
import RegisterModal from "../components/RegisterModal";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./RegisterPage.css";

export default function RegisterPage() {
  return (
    <main className="register-page">
      <Header />

      <section className="register-page__section">
        <div className="register-page__inner">
          <div className="register-page__copy">
            <span className="register-page__eyebrow">{APP_MESSAGES.AUTH.REGISTER_PAGE_EYEBROW}</span>
            <h1 className="register-page__headline">
              {APP_MESSAGES.AUTH.REGISTER_PAGE_HEADLINE}
            </h1>
            <p className="register-page__body">
              {APP_MESSAGES.AUTH.REGISTER_PAGE_BODY}
            </p>
            <ul className="register-page__perks">
              <li className="register-page__perk">
                <span className="register-page__perk-dot" />
                {APP_MESSAGES.AUTH.REGISTER_PERK_1}
              </li>
              <li className="register-page__perk">
                <span className="register-page__perk-dot" />
                {APP_MESSAGES.AUTH.REGISTER_PERK_2}
              </li>
              <li className="register-page__perk">
                <span className="register-page__perk-dot" />
                {APP_MESSAGES.AUTH.REGISTER_PERK_3}
              </li>
            </ul>
          </div>

          <div className="register-page__modal">
            <RegisterModal />
          </div>
        </div>
      </section>
    </main>
  );
}