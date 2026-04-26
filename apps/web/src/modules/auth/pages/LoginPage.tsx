import Header from "../../../shared/components/layout/Header";
import LoginModal from "../components/LoginModal";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
        <LoginModal />
      </section>
    </main>
  );
}