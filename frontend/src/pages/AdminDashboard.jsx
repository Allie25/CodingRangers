import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { bookingApi, courseApi, errorMessage } from "../utils/api";
const blank = {
  title: "",
  description: "",
  instructor: "",
  duration: "",
  fee: 0,
  capacity: 30,
  imageUrl: "",
  status: "published",
};
export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  function load() {
    Promise.all([courseApi.adminList(), bookingApi.adminList()])
      .then(([c, b]) => {
        setCourses(c.data.courses);
        setBookings(b.data.bookings);
      })
      .catch((e) => setError(errorMessage(e)));
  }
  useEffect(load, []);
  async function create(e) {
    e.preventDefault();
    try {
      await courseApi.create({
        ...form,
        fee: Number(form.fee),
        capacity: Number(form.capacity),
      });
      setForm(blank);
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  async function review(id, status) {
    try {
      await bookingApi.review(id, { status });
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  async function remove(id) {
    try {
      await courseApi.remove(id);
      load();
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  const input =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-orange-400";
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <span className="text-sm font-bold uppercase tracking-widest text-orange-500">
        Administration
      </span>
      <h1 className="mt-2 text-4xl font-extrabold">Admin dashboard</h1>
      <p className="mt-2 text-slate-500">
        Manage courses and review learner requests.
      </p>
      {error && (
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}
      <div className="mt-9 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <form
          onSubmit={create}
          className="h-fit rounded-3xl border border-slate-200 p-6"
        >
          <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold">
            <FiPlus className="text-orange-500" /> Add a course
          </h2>
          <label className="mb-4 block text-sm font-semibold">
            Title
            <input
              className={`${input} mt-2`}
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="mb-4 block text-sm font-semibold">
            Description
            <textarea
              className={`${input} mt-2`}
              required
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="mb-4 block text-sm font-semibold">
              Instructor
              <input
                className={`${input} mt-2`}
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
              />
            </label>
            <label className="mb-4 block text-sm font-semibold">
              Duration
              <input
                className={`${input} mt-2`}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </label>
            <label className="mb-4 block text-sm font-semibold">
              Fee (?)
              <input
                type="number"
                min="0"
                className={`${input} mt-2`}
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
              />
            </label>
            <label className="mb-4 block text-sm font-semibold">
              Capacity
              <input
                type="number"
                min="1"
                className={`${input} mt-2`}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </label>
          </div>
          <button className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
            Publish course
          </button>
        </form>
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-extrabold">
              Courses <span className="text-slate-400">({courses.length})</span>
            </h2>
            <div className="mt-4 space-y-3">
              {courses.map((c) => (
                <article
                  key={c._id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                >
                  <div>
                    <h3 className="font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm capitalize text-slate-500">
                      {c.status} · {c.instructor || "No instructor"}
                    </p>
                  </div>
                  <button
                    title="Delete course"
                    onClick={() => remove(c._id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-extrabold">
              Booking requests{" "}
              <span className="text-slate-400">({bookings.length})</span>
            </h2>
            <div className="mt-4 space-y-3">
              {bookings.map((b) => (
                <article
                  key={b._id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">
                        {b.course?.title || "Course unavailable"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {b.user?.name} · {b.user?.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize">
                      {b.status}
                    </span>
                  </div>
                  {b.status === "pending" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => review(b._id, "approved")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => review(b._id, "rejected")}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
