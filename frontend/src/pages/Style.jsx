import { useState } from 'react'
import Navbar from '../components/Navbar'
import {
  ArrowRight,
  Sparkles,
  CloudSun,
  Heart,
  GraduationCap,
  Shirt,
  WandSparkles,
  UserRound,
  Camera,
  ShoppingBag,
} from 'lucide-react'

function Style() {
  const [showResults, setShowResults] = useState(false)
  const [prompt, setPrompt] = useState('')

  const search = () => {
    if (prompt.trim()) setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#403a34]">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-r from-[#d8c1a8] via-[#d7c3aa] to-[#a8a183] px-8 py-16 lg:px-14">
        <div className="mx-auto max-w-[1380px]">
          <p className="flex items-center gap-2 text-xs font-semibold text-[#667149]">
            <Sparkles size={14} /> AI STYLIST
          </p>

          <h1 className="mt-5 font-serif text-5xl text-[#3f3128]">
            Ask your stylist.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#675f56]">
            Get outfit recommendations, style advice and more — all based on
            your wardrobe, preferences and occasion.
          </p>

          <div className="mt-7 flex max-w-2xl items-center rounded-full bg-[#fbf9f4] p-2 pl-5 shadow-sm">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder='e.g. "What should I wear for lunch with friends?"'
              className="flex-1 bg-transparent text-sm outline-none"
            />

            <button
              onClick={search}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#667149] text-white"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              'Outfit for a date',
              "Dress for today's weather",
              'Use my wardrobe',
              'Something casual',
            ].map((text) => (
              <button
                key={text}
                onClick={() => setPrompt(text)}
                className="rounded-full bg-[#f8f5ee] px-4 py-2 text-xs"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1380px] px-8 py-9 lg:px-14">
        {!showResults ? (
          <>
            <h2 className="font-serif text-2xl">Try these suggestions</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                [CloudSun, "Today's weather", '28°C · Partly cloudy', 'Light layers recommended'],
                [GraduationCap, 'College fit', 'Comfortable · Trendy', 'Perfect for your campus vibe'],
                [Heart, 'Date night', 'Chic · Effortless', 'Feel confident & comfortable'],
                [Shirt, 'Use my wardrobe', 'Create outfits from', 'what you already own'],
              ].map(([Icon, title, line1, line2]) => (
                <button
                  key={title}
                  onClick={() => {
                    setPrompt(title)
                    setShowResults(true)
                  }}
                  className="rounded-xl border border-[#ddd6ca] bg-[#fbf9f4] p-5 text-left"
                >
                  <Icon size={21} className="text-[#667149]" />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-xs text-[#827b71]">{line1}</p>
                  <p className="mt-1 text-xs text-[#827b71]">{line2}</p>
                </button>
              ))}
            </div>

            <h2 className="mt-10 font-serif text-2xl">Recent searches</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {['College outfit', 'Dinner date', 'Rainy day look', 'Festival outfit', 'Work from home'].map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-[#ddd6ca] bg-[#fbf9f4] px-4 py-2 text-xs"
                >
                  {x}
                </span>
              ))}
            </div>
          </>
        ) : (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#667149]">
                  YOUR RESULTS
                </p>
                <h2 className="mt-2 font-serif text-4xl">Styled from your wardrobe.</h2>
                <p className="mt-2 text-sm text-[#81796e]">
                  Three outfit ideas based on “{prompt}”.
                </p>
              </div>

              <button
                onClick={() => setShowResults(false)}
                className="text-sm text-[#667149]"
              >
                ← New search
              </button>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {[
                ['Relaxed Lunch', '92%', ['Cream Blouse', 'Olive Trousers', 'White Sneakers']],
                ['Soft Casual', '86%', ['Linen Shirt', 'Wide-Leg Pants', 'Leather Loafers']],
                ['Easy Minimal', '78%', ['Cashmere Sweater', 'Black Trousers', 'White Sneakers']],
              ].map(([name, score, pieces], index) => (
                <article
                  key={name}
                  className="rounded-xl border border-[#ddd6ca] bg-[#fbf9f4] p-5"
                >
                  <div className="flex justify-between">
                    <span className="text-xs tracking-widest text-[#8b8378]">
                      LOOK 0{index + 1}
                    </span>

                    <span className="rounded-full bg-[#dfe2ce] px-3 py-1 text-xs font-semibold text-[#59613e]">
                      {score} Wardrobe Match
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {pieces.map((piece) => (
                      <div
                        key={piece}
                        className="flex aspect-[3/4] items-center justify-center rounded-lg bg-[#e5d8c8] p-2 text-center text-xs"
                      >
                        {piece}
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-5 font-serif text-2xl">{name}</h3>

                  <p className="mt-2 text-sm leading-6 text-[#7e766b]">
                    Balanced colours and relaxed silhouettes make this combination
                    suitable for a comfortable daytime look.
                  </p>

                  <button className="mt-5 w-full rounded-md bg-[#667149] py-3 text-xs font-semibold text-white">
                    SAVE OUTFIT
                  </button>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-[#ddd6ca] bg-[#eee9dc] p-7">
                <div className="flex items-center gap-2 text-[#667149]">
                  <ShoppingBag size={18} />
                  <span className="text-xs font-semibold tracking-widest">WARDROBE GAP</span>
                </div>

                <h3 className="mt-4 font-serif text-2xl">
                  One piece could make this even better.
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#7d756b]">
                  Black straight-fit trousers would give you another strong
                  combination for this occasion.
                </p>
              </div>

              <div className="rounded-xl bg-[#4e563a] p-7 text-white">
                <div className="flex items-center gap-2">
                  <WandSparkles size={18} />
                  <span className="text-xs font-semibold tracking-widest">VIRTUAL TRY-ON</span>
                </div>

                <h3 className="mt-4 font-serif text-3xl">
                  See the outfit on you.
                </h3>

                <p className="mt-2 text-sm text-[#dddcca]">
                  Preview your selected look before deciding what to wear.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 rounded-md bg-[#f5f1e8] py-3 text-xs font-semibold text-[#424a32]">
                    <UserRound size={17} /> Avatar
                  </button>

                  <button className="flex items-center justify-center gap-2 rounded-md border border-[#89916d] py-3 text-xs font-semibold">
                    <Camera size={17} /> My Photo
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Style