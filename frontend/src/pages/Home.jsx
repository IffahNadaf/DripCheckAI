import Navbar from '../components/Navbar'
import { Heart, MessageCircle, Bookmark, Plus, Sparkles } from 'lucide-react'

function Home() {
  const posts = [
    {
      id: 1,
      user: 'Maya',
      username: '@maya.styles',
      caption: 'Soft neutrals for a slow Sunday.',
      tags: '#minimal #neutralstyle #weekend',
      image:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
      likes: 128,
      comments: 14,
    },
    {
      id: 2,
      user: 'Aanya',
      username: '@aanyawears',
      caption: 'Keeping it effortless today.',
      tags: '#streetstyle #everydayfit',
      image:
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
      likes: 94,
      comments: 8,
    },
    {
      id: 3,
      user: 'Sara',
      username: '@sara.edit',
      caption: 'Earth tones forever.',
      tags: '#earthtones #ootd #styleinspo',
      image:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      likes: 216,
      comments: 21,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#403b35]">
      <Navbar />

      <main className="mx-auto max-w-[1380px] px-8 py-12 lg:px-14">

        {/* Top section */}
        <section className="mb-12 flex flex-col justify-between gap-8 border-b border-[#d8d2c5] pb-10 md:flex-row md:items-end">

          <div>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.22em] text-[#777b54]">
              YOUR DAILY EDIT
            </p>

            <h1 className="font-serif text-5xl leading-tight text-[#5a4433] md:text-6xl">
              What's everyone
              <br />
              wearing?
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#817b72]">
              Discover looks from the DripCheck community, save your
              favourites, and find inspiration for your next outfit.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-full bg-[#6d7347] px-6 py-3 text-[11px] font-semibold tracking-[0.15em] text-white transition hover:bg-[#5c623c]">
            <Plus size={16} />
            CREATE POST
          </button>
        </section>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">

          {/* Feed */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#5a4433]">
                Community Feed
              </h2>

              <button className="text-[11px] font-semibold tracking-[0.15em] text-[#6d7347]">
                VIEW ALL
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-[4px] border border-[#ddd7cb] bg-[#fbf9f4]"
                >

                  {/* User */}
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ded8ca] font-serif text-sm text-[#62503f]">
                      {post.user.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{post.user}</p>
                      <p className="text-[11px] text-[#989187]">
                        {post.username}
                      </p>
                    </div>
                  </div>

                  {/* Post image */}
                  <div className="aspect-[4/5] overflow-hidden bg-[#e7e1d5]">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between px-5 pt-4">
                    <div className="flex items-center gap-5">
                      <button className="flex items-center gap-1.5 text-xs">
                        <Heart size={19} strokeWidth={1.5} />
                        {post.likes}
                      </button>

                      <button className="flex items-center gap-1.5 text-xs">
                        <MessageCircle size={19} strokeWidth={1.5} />
                        {post.comments}
                      </button>
                    </div>

                    <button>
                      <Bookmark size={19} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Caption */}
                  <div className="px-5 pb-5 pt-4">
                    <p className="text-sm leading-6">
                      <span className="mr-2 font-semibold">
                        {post.user}
                      </span>
                      {post.caption}
                    </p>

                    <p className="mt-2 text-[11px] text-[#777b54]">
                      {post.tags}
                    </p>
                  </div>
                </article>
              ))}

            </div>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-6">

            <div className="border border-[#d8d2c5] bg-[#efede3] p-7">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#777b54] text-white">
                <Sparkles size={18} />
              </div>

              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#777b54]">
                DRIPCHECK AI
              </p>

              <h3 className="mt-3 font-serif text-2xl leading-snug text-[#594535]">
                Not sure what
                <br />
                to wear?
              </h3>

              <p className="mt-3 text-xs leading-5 text-[#837c72]">
                Ask your AI stylist to build a look using pieces already
                in your wardrobe.
              </p>

              <a
                href="/style"
                className="mt-6 inline-block border-b border-[#5e6541] pb-1 text-[10px] font-semibold tracking-[0.16em] text-[#5e6541]"
              >
                ASK YOUR STYLIST →
              </a>
            </div>

            <div className="border-t border-[#d8d2c5] pt-6">
              <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-[#777b54]">
                TRENDING NOW
              </p>

              {[
                '#NeutralLayers',
                '#CollegeFits',
                '#QuietLuxury',
                '#WeekendEdit',
                '#Monochrome',
              ].map((trend, index) => (
                <div
                  key={trend}
                  className="flex items-center gap-4 border-b border-[#e1dcd1] py-3"
                >
                  <span className="font-serif text-sm text-[#aaa397]">
                    0{index + 1}
                  </span>

                  <span className="text-xs font-medium">
                    {trend}
                  </span>
                </div>
              ))}
            </div>

          </aside>

        </div>
      </main>
    </div>
  )
}

export default Home