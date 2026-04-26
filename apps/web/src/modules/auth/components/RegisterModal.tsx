import { Link } from "react-router-dom";

export default function RegisterModal() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign up to start building your ATS-optimized resume.
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            placeholder="John"
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Middle Name
          </label>
          <input
            type="text"
            placeholder="Patrick"
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>
        

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-black">
          Sign Up
        </Link>
      </p>
    </div>
  );
}