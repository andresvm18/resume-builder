import { useEffect, useRef } from "react";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./AtsScoreCard.css";

interface ScoreBreakdown {
  keyword_match: number;
  section_completeness: number;
  format_quality: number;
  role_alignment: number;
}

interface AtsScoreCardProps {
  breakdown?: ScoreBreakdown;
}

const DEFAULT: ScoreBreakdown = {
  keyword_match: 88,
  section_completeness: 76,
  format_quality: 80,
  role_alignment: 79,
};

const formatScoreFormula = (breakdown: ScoreBreakdown, score: number): string => {
  return `(${breakdown.keyword_match}×0.4)+(${breakdown.section_completeness}×0.2)+(${breakdown.format_quality}×0.2)+(${breakdown.role_alignment}×0.2) = ${score}`;
};

export default function AtsScoreCard({ breakdown = DEFAULT }: AtsScoreCardProps) {
  const ringRef = useRef<SVGCircleElement>(null);

  const score = Math.round(
    breakdown.keyword_match * 0.4 +
    breakdown.section_completeness * 0.2 +
    breakdown.format_quality * 0.2 +
    breakdown.role_alignment * 0.2
  );

  const CIRCUMFERENCE = 251.2;
  const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.setProperty("--dash", `${dashOffset}`);
    }
  }, [dashOffset]);

  const rows = [
    { label: APP_MESSAGES.ATS.KEYWORD_MATCH_LABEL, value: breakdown.keyword_match, weight: 0.4, color: "teal" },
    { label: APP_MESSAGES.ATS.SECTION_COMPLETENESS_LABEL, value: breakdown.section_completeness, weight: 0.2, color: "blue" },
    { label: APP_MESSAGES.ATS.FORMAT_QUALITY_LABEL, value: breakdown.format_quality, weight: 0.2, color: "blue" },
    { label: APP_MESSAGES.ATS.ROLE_ALIGNMENT_LABEL, value: breakdown.role_alignment, weight: 0.2, color: "blue" },
  ];

  return (
    <div className="ats-card">
      {/* Ring */}
      <div className="ats-card__ring-col">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="40" fill="none" stroke="var(--lp-border)" strokeWidth="8" />
          <circle
            ref={ringRef}
            cx="55" cy="55" r="40"
            fill="none"
            stroke="#1D9E75"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            transform="rotate(-90 55 55)"
            className="ats-card__ring-progress"
          />
          <text x="55" y="50" textAnchor="middle" fontSize="22" fontWeight="500" fill="var(--text-primary)" fontFamily="'DM Sans', sans-serif">{score}</text>
          <text x="55" y="65" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="'DM Sans', sans-serif">/100</text>
        </svg>
        <span className="ats-card__badge">{APP_MESSAGES.ATS.SCORE_BADGE}</span>
      </div>

      <div className="ats-card__breakdown">
        {rows.map(({ label, value, weight, color }) => (
          <div key={label} className="ats-card__row">
            <div className="ats-card__row-header">
              <span className="ats-card__row-label">{label}</span>
              <span className="ats-card__row-value">
                {value} <span className="ats-card__row-weight">× {weight}</span>
              </span>
            </div>
            <div className="ats-card__bar-track">
              <div
                className={`ats-card__bar-fill ats-card__bar-fill--${color}`}
                style={{ "--bar-width": `${value}%` } as React.CSSProperties}
              />
            </div>
          </div>
        ))}

        <div className="ats-card__formula">
          {formatScoreFormula(breakdown, score)}
        </div>
      </div>
    </div>
  );
}