import Header from "../../../shared/components/layout/Header";
import LoginModal from "../components/LoginModal";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <main className="login-page">
      <Header />

      <section className="login-page__section">
        <div className="login-page__inner">
          {/* Left side - Editorial copy */}
          <div className="login-page__copy">
            <div className="login-page__eyebrow">Bienvenido de nuevo</div>
            <h1 className="login-page__headline">
              Continúa tu <em>viaje</em>
            </h1>
            <p className="login-page__body">
              Inicia sesión para acceder a tus currículums, ver tus puntuaciones ATS y seguir construyendo
              documentos que definen tu carrera y llaman la atención.
            </p>
            <ul className="login-page__benefits">
              <li className="login-page__benefit">
                <span className="login-page__benefit-dot"></span>
                Accede a todos tus currículums guardados
              </li>
              <li className="login-page__benefit">
                <span className="login-page__benefit-dot"></span>
                Monitorea tu progreso de optimización ATS
              </li>
              <li className="login-page__benefit">
                <span className="login-page__benefit-dot"></span>
                Continúa donde lo dejaste
              </li>
            </ul>
          </div>

          {/* Right side - Login Modal */}
          <div className="login-page__modal">
            <LoginModal />
          </div>
        </div>
      </section>

      {/* Decorative orb */}
      <div className="login-page__orb-bottom"></div>
    </main>
  );
}