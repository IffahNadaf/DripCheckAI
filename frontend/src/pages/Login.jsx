import { Link } from 'react-router-dom'
import { Eye, Mail, Lock } from 'lucide-react'
import dripcheckLogo from '../assets/dripcheck-logo.png'

function Login() {
  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#403a34]">

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden lg:block">

          {/* Temporary fashion image */}
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90"
            alt="Fashion"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Logo */}
          <div className="absolute left-10 top-8">
            <div className="rounded-md bg-[#f7f4ec]/90 px-4 py-2 backdrop-blur-sm">
              <img
                src={dripcheckLogo}
                alt="DripCheck"
                className="h-[38px] w-auto object-contain"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="absolute bottom-14 left-12 max-w-lg text-white">
            <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-white/80">
              YOUR WARDROBE, REIMAGINED
            </p>

            <h2 className="font-serif text-5xl leading-[1.08]">
              Better outfits.
              <br />
              Smarter choices.
              <br />
              That&apos;s DripCheck.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/80">
              Discover new ways to wear what you already own, connect with
              people who love fashion, and let AI make styling easier.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-7 py-12 sm:px-12 lg:px-16">

          <div className="w-full max-w-[430px]">

            {/* Mobile logo */}
            <div className="mb-10 lg:hidden">
              <img
                src={dripcheckLogo}
                alt="DripCheck"
                className="h-[45px] w-auto"
              />
            </div>

            <p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-[#73794f]">
              WELCOME BACK
            </p>

            <h1 className="font-serif text-4xl text-[#4d392e]">
              Log in to DripCheck.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#877f74]">
              Your wardrobe, your community, your style — all in one place.
            </p>

            {/* FORM */}
            <form className="mt-9">

              {/* Email */}
              <label className="text-xs font-semibold text-[#5b554e]">
                Email
              </label>

              <div className="mt-2 flex items-center gap-3 rounded-md border border-[#d7d0c4] bg-[#fbf9f4] px-4">
                <Mail
                  size={17}
                  strokeWidth={1.5}
                  className="text-[#8b8378]"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[#aaa298]"
                />
              </div>

              {/* Password */}
              <div className="mt-5 flex items-center justify-between">
                <label className="text-xs font-semibold text-[#5b554e]">
                  Password
                </label>

                <button
                  type="button"
                  className="text-[11px] font-semibold text-[#687047]"
                >
                  Forgot password?
                </button>
              </div>

              <div className="mt-2 flex items-center gap-3 rounded-md border border-[#d7d0c4] bg-[#fbf9f4] px-4">
                <Lock
                  size={17}
                  strokeWidth={1.5}
                  className="text-[#8b8378]"
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[#aaa298]"
                />

                <button type="button">
                  <Eye
                    size={17}
                    strokeWidth={1.5}
                    className="text-[#8b8378]"
                  />
                </button>
              </div>

              {/* Remember */}
              <label className="mt-4 flex w-fit items-center gap-2 text-xs text-[#756e65]">
                <input
                  type="checkbox"
                  className="accent-[#687047]"
                />
                Remember me
              </label>

              {/* Login */}
              <Link
                to="/"
                className="mt-7 block w-full rounded-md bg-[#687047] py-3.5 text-center text-xs font-semibold tracking-[0.12em] text-white transition hover:bg-[#59603c]"
              >
                LOG IN
              </Link>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#ddd6ca]" />

              <span className="text-[11px] text-[#999186]">
                OR
              </span>

              <div className="h-px flex-1 bg-[#ddd6ca]" />
            </div>

            {/* Google */}
            <button className="flex w-full items-center justify-center gap-3 rounded-md border border-[#d7d0c4] bg-[#fbf9f4] py-3.5 text-sm font-medium transition hover:bg-[#f0ece3]">
              <span className="text-base font-semibold">G</span>
              Continue with Google
            </button>

            {/* Sign up */}
            <p className="mt-8 text-center text-xs text-[#817a70]">
              New to DripCheck?{' '}
              <span className="cursor-pointer font-semibold text-[#687047]">
                Create an account
              </span>
            </p>

            {/* Terms */}
            <p className="mt-8 text-center text-[10px] leading-5 text-[#aaa298]">
              By continuing, you agree to DripCheck&apos;s Terms of Service
              and Privacy Policy.
            </p>

          </div>
        </section>

      </div>
    </div>
  )
}

export default Login