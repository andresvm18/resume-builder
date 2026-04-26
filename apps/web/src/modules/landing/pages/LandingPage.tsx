import { Link } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            ATS-Optimized Resume Platform
          </span>

          <h2 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight">
            Build resumes that pass filters and get interviews.
          </h2>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            Create clean, ATS-friendly resumes with real-time previews,
            optimized structure, and downloadable PDF exports.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-2xl bg-black px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
            >
              Create Your Resume
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h3 className="text-center text-4xl font-bold tracking-tight">
          Why choose ResumeBuilder
        </h3>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-6">
            <h4 className="text-xl font-semibold">ATS Optimization</h4>
            <p className="mt-3 text-gray-600">
              Built specifically to maximize compatibility with applicant
              tracking systems.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h4 className="text-xl font-semibold">PDF Export</h4>
            <p className="mt-3 text-gray-600">
              Download polished, recruiter-ready resumes in one click.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-4xl font-bold tracking-tight">
            Start building your next opportunity today.
          </h3>

          <p className="mt-4 text-lg text-gray-600">
            Join professionals creating resumes that stand out where it matters.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-2xl bg-black px-8 py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}