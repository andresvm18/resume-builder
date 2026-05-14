import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import Header from "../layout/Header";
import { APP_MESSAGES } from "../../constants/appMessages";
import "./AppErrorBoundary.css";

export default function AppErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : APP_MESSAGES.ERROR_BOUNDARY.DEFAULT_TITLE;

  const message = isRouteErrorResponse(error)
    ? error.data?.message || APP_MESSAGES.ERROR_BOUNDARY.DEFAULT_MESSAGE
    : error instanceof Error
      ? error.message
      : APP_MESSAGES.ERROR_BOUNDARY.FALLBACK_MESSAGE;

  return (
    <main className="app-error">
      <Header />

      <section className="app-error__card">
        <span className="app-error__badge">{APP_MESSAGES.ERROR_BOUNDARY.BADGE}</span>

        <h1 className="app-error__title">{title}</h1>

        <p className="app-error__message">{message}</p>

        <div className="app-error__actions">
          <Link to="/" className="app-error__primary">
            {APP_MESSAGES.ERROR_BOUNDARY.GO_HOME_BUTTON}
          </Link>

          <Link to="/dashboard" className="app-error__secondary">
            {APP_MESSAGES.ERROR_BOUNDARY.GO_DASHBOARD_BUTTON}
          </Link>
        </div>
      </section>
    </main>
  );
}