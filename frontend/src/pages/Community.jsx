import Navbar from '../components/Navbar'
import { Heart, MessageCircle, Plus, Bookmark } from 'lucide-react'

function Community() {
  const posts = [
    ['Aisha', 'Earth-tone fit today 🤎', 'Minimal'],
    ['Meher', 'Minimal and comfy ✨', 'College'],
    ['Sara', 'Festive ready ✨', 'Ethnic'],
    ['Naina', 'Weekend coffee fit.', 'Casual'],
    ['Zoya', 'Keeping it classic.', 'Streetwear'],
    ['Riya', 'Soft neutral palette.', 'Minimal'],
  ]

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#403a34]">
      <Navbar />

      <main className="mx-auto max-w-[1380px] px-8 py-10 lg:px-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="font-serif text-5xl text-[#4d392e]">Community</h1>
            <p className="mt-3 max-w-xl text-sm text-[#817a70]">
              See what everyone's wearing. Get inspired, share your style,
              and be part of a community that gets it.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-md bg-[#667149] px-5 py-3 text-sm text-white">
            <Plus size={16} /> Create Post
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-b border-[#ddd6ca] pb-5">
          {['For You', 'Trending', 'College', 'Streetwear', 'Ethnic', 'Minimal'].map((x, i) => (
            <button
              key={x}
              className={`rounded-full px-4 py-2 text-xs ${
                i === 0 ? 'bg-[#667149] text-white' : 'bg-[#eee9df]'
              }`}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-8 xl:grid-cols-[1fr_230px]">
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(([user, caption, tag], index) => (
              <article
                key={`${user}-${index}`}
                className="overflow-hidden rounded-lg border border-[#ddd6ca] bg-[#fbf9f4]"
              >
                <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#c9aa8d] to-[#e9dccb] text-7xl">
                  {index % 3 === 0 ? '👗' : index % 3 === 1 ? '🧥' : '✨'}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{user}</p>
                      <p className="text-[11px] text-[#8c8479]">#{tag}</p>
                    </div>

                    <Bookmark size={17} />
                  </div>

                  <p className="mt-3 text-sm">{caption}</p>

                  <div className="mt-4 flex gap-5 text-xs">
                    <span className="flex items-center gap-1"><Heart size={17} /> {80 + index * 23}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={17} /> {8 + index}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside>
            <div className="rounded-xl border border-[#ddd6ca] bg-[#fbf9f4] p-5 text-center">
              <p className="text-xs font-semibold tracking-widest text-[#667149]">
                DRIPCHECK
              </p>
              <p className="mt-2 font-serif text-xl">STYLE SCORE</p>

              <div className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-[#667149] font-serif text-4xl">
                92
              </div>

              <p className="mt-4 text-xs text-[#847d73]">
                You're a style icon!
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-serif text-xl">Trending</h3>
              <div className="mt-4 space-y-3 text-sm text-[#667149]">
                <p>#collegefits</p>
                <p>#streetwear</p>
                <p>#ethnicwear</p>
                <p>#ootd</p>
                <p>#minimal</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Community