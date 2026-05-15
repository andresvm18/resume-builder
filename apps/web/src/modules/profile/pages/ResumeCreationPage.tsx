import { useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

import {
  IconSparkles,
  IconFilePencil
} from "@tabler/icons-react";

import "./ResumeCreationPage.css";

export default function ResumeCreationPage() {
  const navigate = useNavigate();

  return (
    <main className="resume-creation-page">
      <Header />

      <section className="resume-creation-page__container">
        <div className="resume-creation-page__header">
          <span className="resume-creation-page__eyebrow">
            {APP_MESSAGES.RESUME_CREATION.EYEBROW}
          </span>

          <h1 className="resume-creation-page__title">
            {APP_MESSAGES.RESUME_CREATION.TITLE}
          </h1>

          <p className="resume-creation-page__description">
            {APP_MESSAGES.RESUME_CREATION.DESCRIPTION}
          </p>
        </div>

        <div className="resume-creation-page__grid">
          <button
            type="button"
            onClick={() => navigate("/generate-from-profile")}
            className="resume-creation-page__card resume-creation-page__card--featured"
          >
            <span className="resume-creation-page__icon">
              <IconSparkles size={28} stroke={1.7} />
            </span>

            <span className="resume-creation-page__card-title">
              {APP_MESSAGES.RESUME_CREATION.GENERATE_FROM_PROFILE_TITLE}
            </span>

            <span className="resume-creation-page__card-description">
              {APP_MESSAGES.RESUME_CREATION.GENERATE_FROM_PROFILE_DESCRIPTION}
            </span>

            <span className="resume-creation-page__card-badge">
              {APP_MESSAGES.RESUME_CREATION.RECOMMENDED_BADGE}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/resume-builder")}
            className="resume-creation-page__card"
          >
            <span className="resume-creation-page__icon">
              <IconFilePencil size={28} stroke={1.7} />
            </span>

            <span className="resume-creation-page__card-title">
              {APP_MESSAGES.RESUME_CREATION.CREATE_FROM_SCRATCH_TITLE}
            </span>

            <span className="resume-creation-page__card-description">
              {APP_MESSAGES.RESUME_CREATION.CREATE_FROM_SCRATCH_DESCRIPTION}
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}