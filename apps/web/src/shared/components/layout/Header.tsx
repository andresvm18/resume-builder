import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          ResumeBuilder
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}