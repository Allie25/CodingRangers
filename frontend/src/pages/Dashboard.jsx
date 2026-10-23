import { useEffect, useState } from "react";
import { FiBookOpen, FiClock, FiX } from "react-icons/fi";
import { bookingApi, courseApi, errorMessage } from "../utils/api";
const badge = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};
export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  function load() {
    Promise.all([bookingApi.mine(), courseApi.list()])
      .then(([b, c]) => {
        setBookings(b.data.bookings);
        setCourses(c.data.courses);
      })
      .catch((e) => setError(errorMessage(e)));
  }
  useEffect(load, []);
  async function enroll(id) {
    try {
      await bookingApi.create(id);
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  async function cancel(id) {
    try {
      await bookingApi.cancel(id);
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <span className="text-sm font-bold uppercase tracking-widest text-orange-500">
        Learner space
      </span>
      <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
        My dashboard
      </h1>
      <p className="mt-2 text-slate-500">
        Track your requests and find your next course.
      </p>
      {error && (
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">My bookings</h2>
        {!bookings.length ? (
          <p className="mt-4 rounded-2xl bg-slate-50 p-8 text-slate-500">
            You haven’t booked a course yet. Explore the programs below to get
            started.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {bookings.map((b) => (
              <article
                key={b._id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex items-center gap-4">
                  <span className="rounded-xl bg-orange-50 p-3 text-orange-500">
                    <FiBookOpen />
                  </span>
                  <div>
                    <h3 className="font-bold">
                      {b.course?.title || "Course unavailable"}
                    </h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${badge[b.status]}`}
                    >
                      {b.status}
                    </span>
                    {b.note && (
                      <p className="mt-2 text-xs text-slate-500">{b.note}</p>
                    )}
                  </div>
                </div>
                {b.status === "pending" && (
                  <button
                    title="Cancel booking"
                    onClick={() => cancel(b._id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <FiX />
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">Discover courses</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <article
              key={c._id}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold">{c.title}</h3>
                <FiClock className="text-orange-500" />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {c.duration || "Flexible learning"} ·{" "}
                {c.instructor || "Expert instructor"}
              </p>
              <p className="mt-4 font-extrabold">
                {Number(c.fee)
                  ? `?${Number(c.fee).toLocaleString("en-IN")}`
                  : "Free"}
              </p>
              <button
                onClick={() => enroll(c._id)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-orange-500"
              >
                Request a place
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
