import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import Header from "../layout/Header";
import "./AppErrorBoundary.css";

export default function AppErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Ocurrió un error inesperado";

  const message = isRouteErrorResponse(error)
    ? error.data?.message || "No se pudo cargar esta página."
    : error instanceof Error
      ? error.message
      : "Algo salió mal en la aplicación.";

  return (
    <main className="app-error">
      <Header />

      <section className="app-error__card">
        <span className="app-error__badge">Error</span>

        <h1 className="app-error__title">{title}</h1>

        <p className="app-error__message">{message}</p>

        <div className="app-error__actions">
          <Link to="/" className="app-error__primary">
            Volver al inicio
          </Link>

          <Link to="/dashboard" className="app-error__secondary">
            Ir al dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}