import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { authApi, errorMessage } from "../utils/api";
export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", code: "" });
  const [purpose, setPurpose] = useState(isRegister ? "register" : "login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const field = (key, label, type = "text") => (
    <label className="mb-4 block text-sm font-semibold text-slate-700">
      {label}
      <input
        required
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (!step) {
        const { data } = await authApi[isRegister ? "register" : "login"](
          isRegister
            ? { name: form.name, email: form.email }
            : { email: form.email },
        );
        setPurpose(data.purpose || (isRegister ? "register" : "login"));
        setStep(1);
      } else {
        const { data } = await authApi.verify({
          email: form.email,
          code: form.code,
          purpose,
        });
        authenticate(data);
        navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-12 px-5 py-12 md:grid-cols-2">
      <section className="hidden rounded-[2rem] bg-slate-950 p-12 text-white md:block">
        <span className="rounded-full bg-orange-400/15 px-4 py-2 text-sm font-bold text-orange-300">
          LEARN. BUILD. GROW.
        </span>
        <h1 className="mt-8 text-5xl font-black leading-tight">
          Your next big skill starts here.
        </h1>
        <p className="mt-5 text-lg text-slate-300">
          Expert-led programs designed to help you build a career you love.
        </p>
      </section>
      <form
        onSubmit={submit}
        className="mx-auto w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-orange-500">
          {step
            ? "Email verification"
            : isRegister
              ? "Join the community"
              : "Welcome back"}
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
          {step
            ? "Check your inbox"
            : isRegister
              ? "Create your account"
              : "Log in to learn"}
        </h2>
        <p className="mb-7 mt-2 text-sm text-slate-500">
          {step
            ? `Enter the six-digit code sent to ${form.email}.`
            : "Get access to curated courses and a community that helps you grow."}
        </p>
        {!step && isRegister && field("name", "Full name")}
        {!step && field("email", "Email address", "email")}
        {step > 0 && field("code", "Six-digit verification code", "text")}
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {busy ? "Please wait�" : step ? "Verify and continue" : "Continue"}
          <FiArrowRight />
        </button>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="mt-3 w-full py-2 text-sm font-semibold text-slate-500"
          >
            Use a different email
          </button>
        )}
        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegister ? "Already have an account?" : "New to Coding Rangers?"}{" "}
          <Link
            className="font-bold text-orange-600"
            to={isRegister ? "/login" : "/register"}
          >
            {isRegister ? "Log in" : "Sign up"}
          </Link>
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <FiMail /> Secure email verification
        </div>
      </form>
    </main>
  );
}
