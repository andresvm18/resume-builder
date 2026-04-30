import Header from "../../../shared/components/layout/Header";
import RegisterModal from "../components/RegisterModal";
import "./RegisterPage.css";

export default function RegisterPage() {
  return (
    <main className="register-page">
      <Header />

      <section className="register-page__section">
        <div className="register-page__inner">

          {/* Left side - Editorial copy */}
          <div className="register-page__copy">
            <span className="register-page__eyebrow">Únete a ResumeBuilder</span>
            <h1 className="register-page__headline">
              Tu próximo rol comienza<br />
              con el <em>currículum</em> adecuado.
            </h1>
            <p className="register-page__body">
              Crea un currículum optimizado para ATS que supere los filtros
              y llegue a las manos de los reclutadores.
            </p>
            <ul className="register-page__perks">
              <li className="register-page__perk">
                <span className="register-page__perk-dot" />
                Puntuación ATS con desglose en vivo
              </li>
              <li className="register-page__perk">
                <span className="register-page__perk-dot" />
                Exportación a PDF con un clic
              </li>
              <li className="register-page__perk">
                <span className="register-page__perk-dot" />
                Coincidencia de palabras clave específicas del rol
              </li>
            </ul>
          </div>

          {/* Right side - Modal */}
          <div className="register-page__modal">
            <RegisterModal />
          </div>

        </div>
      </section>
    </main>
  );
}