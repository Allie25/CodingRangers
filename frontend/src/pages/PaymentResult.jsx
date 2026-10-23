import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
export default function PaymentResult() {
  const success = useLocation().pathname.endsWith("success");
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-16">
      <section className="max-w-lg rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl">
        <span
          className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${success ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
        >
          {success ? <FiCheckCircle size={42} /> : <FiXCircle size={42} />}
        </span>
        <h1 className="mt-6 text-3xl font-extrabold">
          {success ? "Payment successful" : "Payment unsuccessful"}
        </h1>
        <p className="mt-3 leading-7 text-slate-500">
          {success
            ? "Your payment has been received. Welcome aboard!"
            : "Your payment could not be completed. You can return to your dashboard to try again."}
        </p>
        <Link
          to="/dashboard"
          className="mt-7 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white"
        >
          Go to dashboard
        </Link>
        <p className="mt-4 text-xs text-slate-400">
          Payment processing is not connected to the current API.
        </p>
      </section>
    </main>
  );
}
