import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import dripcheckLogo from '../assets/dripcheck-logo.png'

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f4ec] text-[#403a34]">

      {/* Background decorative circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 1.8 }}
        className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#d9c4aa] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.25,
          y: [0, -20, 0],
        }}
        transition={{
          opacity: { duration: 1.5 },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        className="absolute -right-24 bottom-0 h-[450px] w-[450px] rounded-full bg-[#aeb58b] blur-3xl"
      />

      {/* Floating decorative text */}
      <motion.p
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.35, x: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute left-10 top-1/2 hidden -rotate-90 text-[10px] font-semibold tracking-[0.35em] text-[#686e49] lg:block"
      >
        AI POWERED FASHION
      </motion.p>

      <motion.p
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 0.35, x: 0 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute right-8 top-1/2 hidden rotate-90 text-[10px] font-semibold tracking-[0.35em] text-[#686e49] lg:block"
      >
        STYLE YOUR WAY
      </motion.p>

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

        {/* Small top label */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-8 flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-[#73794f]"
        >
          <Sparkles size={13} />
          YOUR AI STYLE COMPANION
          <Sparkles size={13} />
        </motion.div>

        {/* LOGO */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.78,
            y: 25,
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <img
            src={dripcheckLogo}
            alt="DripCheck"
            className="mx-auto w-[250px] object-contain md:w-[320px]"
          />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 70 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-7 h-px bg-[#777d55]"
        />

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.9,
            duration: 0.8,
          }}
          className="mt-7 font-serif text-4xl leading-[1.15] text-[#4d392e] sm:text-5xl md:text-6xl"
        >
          Your closet. Your vibe.
          <br />

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="italic text-[#69704a]"
          >
            Styled smarter.
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="mt-6 max-w-[560px] text-sm leading-7 text-[#827a70]"
        >
          Turn your wardrobe into endless possibilities.
          Discover outfits, share your style and let AI help you
          make every look feel like you.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.9,
            duration: 0.7,
          }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/login"
            className="group flex items-center gap-3 rounded-full bg-[#667149] px-7 py-3.5 text-xs font-semibold tracking-[0.12em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#555e3b] hover:shadow-lg"
          >
            GET STARTED

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/login"
            className="group flex items-center gap-2 rounded-full border border-[#aaa391] px-7 py-3.5 text-xs font-semibold tracking-[0.12em] transition duration-300 hover:border-[#667149] hover:bg-[#eeeade]"
          >
            LOG IN
          </Link>
        </motion.div>

        {/* Feature words */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 1 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 text-[9px] font-semibold tracking-[0.2em] text-[#969083]"
        >
          <span>STYLE</span>
          <span className="text-[#b6b09f]">•</span>
          <span>DISCOVER</span>
          <span className="text-[#b6b09f]">•</span>
          <span>CONNECT</span>
          <span className="text-[#b6b09f]">•</span>
          <span>REIMAGINE</span>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="absolute bottom-7 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] tracking-[0.25em] text-[#9a9388]">
            EXPLORE
          </span>

          <div className="relative h-8 w-px overflow-hidden bg-[#d1cabc]">
            <motion.div
              animate={{
                y: [-20, 35],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute h-4 w-px bg-[#667149]"
            />
          </div>
        </motion.div>

      </main>
    </div>
  )
}

export default Landing