import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiMonitor, FiStar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { courseApi, bookingApi, errorMessage } from "../utils/api";
const colors = [
  "from-indigo-500 to-violet-600",
  "from-amber-400 to-orange-500",
  "from-emerald-500 to-teal-600",
];
export default function Home() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    courseApi
      .list()
      .then(({ data }) => setCourses(data.courses))
      .catch((e) => setError(errorMessage(e)));
  }, []);
  async function book(id) {
    if (!user) return window.location.assign("/login");
    try {
      await bookingApi.create(id);
      alert("Booking request submitted!");
    } catch (e) {
      alert(errorMessage(e));
    }
  }
  return (
    <>
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-[1.1fr_.9fr] md:py-28">
          <div>
            <span className="rounded-full border border-orange-300/30 bg-orange-300/10 px-4 py-2 text-sm font-semibold text-orange-200">
              Career-focused learning, made for you
            </span>
            <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl">
              Skills that move{" "}
              <span className="text-orange-400">you forward.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Learn from industry mentors, build practical projects, and get
              ready for what’s next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#courses"
                className="rounded-full bg-orange-500 px-6 py-3 font-bold hover:bg-orange-400"
              >
                Explore programs <FiArrowRight className="ml-2 inline" />
              </a>
              <Link
                to={user ? "/dashboard" : "/register"}
                className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
              >
                {user ? "My dashboard" : "Get started"}
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm text-slate-300">
              <span>
                <b className="text-xl text-white">Expert</b>
                <br />
                instructors
              </span>
              <span>
                <b className="text-xl text-white">Hands-on</b>
                <br />
                learning
              </span>
              <span>
                <b className="text-xl text-white">Built for</b>
                <br />
                your career
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-10 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-7 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">
                  YOUR NEXT CHAPTER
                </span>
                <FiStar className="text-orange-400" />
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "Build real-world skills",
                  "Learn with expert mentors",
                  "Grow at your own pace",
                ].map((x, i) => (
                  <div
                    key={x}
                    className="flex items-center gap-4 rounded-2xl bg-white/5 p-5"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-400/15 font-bold text-orange-300">
                      0{i + 1}
                    </span>
                    <span className="font-semibold">{x}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-orange-500 p-5">
                <p className="text-sm font-semibold text-orange-100">
                  Start learning today
                </p>
                <p className="mt-1 text-2xl font-extrabold">
                  Your goals are closer than you think.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="courses" className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Find your path
            </span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
              Popular programs
            </h2>
            <p className="mt-3 text-slate-500">
              Practical courses to help you take the next step.
            </p>
          </div>
          {user && (
            <Link to="/dashboard" className="font-bold text-orange-600">
              My learning <FiArrowRight className="ml-1 inline" />
            </Link>
          )}
        </div>
        {error && (
          <p className="mt-8 rounded-xl bg-amber-50 p-4 text-amber-800">
            {error}. Sign in to browse courses once the API is running.
          </p>
        )}
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <article
              key={c._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {c.imageUrl ? (
                <img
                  src={c.imageUrl}
                  alt=""
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div
                  className={`grid h-48 place-items-center bg-gradient-to-br ${colors[i % 3]} text-white`}
                >
                  <FiMonitor size={50} />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-orange-600">
                  <span>{c.instructor || "Coding Rangers"}</span>
                  <span className="text-slate-400">
                    {c.duration || "Flexible"}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-extrabold text-slate-900">
                  {c.title}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                  {c.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-xs text-slate-400">Course fee</span>
                    <p className="font-extrabold text-slate-900">
                      {Number(c.fee)
                        ? `?${Number(c.fee).toLocaleString("en-IN")}`
                        : "Free"}
                    </p>
                  </div>
                  <button
                    onClick={() => book(c._id)}
                    className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500"
                  >
                    Enroll now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!error && !courses.length && (
          <p className="mt-8 text-center text-slate-500">
            Loading available courses…
          </p>
        )}
      </section>
      <section className="bg-orange-50">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Ready to invest in yourself?
            </h2>
            <p className="mt-2 text-slate-600">
              Your next opportunity can start with a single course.
            </p>
          </div>
          <Link
            to="/register"
            className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white"
          >
            Create your free account <FiArrowRight className="ml-2 inline" />
          </Link>
        </div>
      </section>
    </>
  );
}
