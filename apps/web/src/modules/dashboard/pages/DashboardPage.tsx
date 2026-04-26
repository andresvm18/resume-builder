import { Link } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Welcome */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome back 👋
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Manage your resumes and create new opportunities.
            </p>
          </div>

          <Link
            to="/resume-builder"
            className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            + Create Resume
          </Link>
        </div>

        {/* Resume Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Resume Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                ATS Ready
              </span>
              <span className="text-sm text-gray-500">Updated 2 days ago</span>
            </div>

            <h3 className="text-2xl font-bold">Software Engineer CV</h3>
            <p className="mt-3 text-gray-600">
              Optimized resume tailored for tech positions.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                to="/resume-builder"
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Edit
              </Link>

              <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>

          {/* Empty State Card */}
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-white p-6 text-center">
            <h3 className="text-xl font-semibold">Create your next resume</h3>
            <p className="mt-2 text-gray-600">
              Start building a recruiter-ready CV in minutes.
            </p>

            <Link
              to="/resume-builder"
              className="mt-6 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              New Resume
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}