import { useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import "./ResumeCreationPage.css";

export default function ResumeCreationPage() {
  const navigate = useNavigate();

  return (
    <main className="resume-creation-page">
      <Header />

      <section className="resume-creation-page__container">
        <div className="resume-creation-page__header">
          <span className="resume-creation-page__eyebrow">
            Nuevo currículum
          </span>

          <h1 className="resume-creation-page__title">
            ¿Cómo quieres crear tu CV?
          </h1>

          <p className="resume-creation-page__description">
            Elige si quieres generar un currículum automáticamente desde tu
            perfil profesional o empezar manualmente desde cero.
          </p>
        </div>

        <div className="resume-creation-page__grid">
          <button
            type="button"
            onClick={() => navigate("/generate-from-profile")}
            className="resume-creation-page__card resume-creation-page__card--featured"
          >
            <span className="resume-creation-page__icon">✨</span>

            <span className="resume-creation-page__card-title">
              Generar desde mi perfil
            </span>
            

            <span className="resume-creation-page__card-description">
              Usa tu perfil profesional y una oferta laboral para crear un CV
              optimizado automáticamente con IA.
            </span>

            <span className="resume-creation-page__card-badge">
              Recomendado
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/resume-builder")}
            className="resume-creation-page__card"
          >
            <span className="resume-creation-page__icon">📝</span>

            <span className="resume-creation-page__card-title">
              Crear desde cero
            </span>

            <span className="resume-creation-page__card-description">
              Completa manualmente cada sección usando el asistente paso a paso
              del constructor de CVs.
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}