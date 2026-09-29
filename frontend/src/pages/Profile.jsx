import Navbar from '../components/Navbar'
import {
  User,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Settings,
  MapPin,
  Ruler,
  Palette,
  Heart,
} from 'lucide-react'

function Profile() {
  const menu = [
    ['Profile', User],
    ['Style Preferences', Sparkles],
    ['Personalisation', SlidersHorizontal],
    ['Saved', Bookmark],
    ['Settings', Settings],
  ]

  const styles = [
    ['Casual', 90],
    ['Minimal', 75],
    ['Ethnic', 60],
    ['Streetwear', 40],
    ['Formal', 30],
  ]

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#403a34]">
      <Navbar />

      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-64px)] w-[230px] border-r border-[#ddd6ca] bg-[#f2eee4] p-5 lg:block">
          {menu.map(([name, Icon], index) => (
            <button
              key={name}
              className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                index === 0 ? 'bg-[#fbf9f4] font-semibold' : ''
              }`}
            >
              <Icon size={16} /> {name}
            </button>
          ))}
        </aside>

        <main className="flex-1 px-7 py-9 lg:px-10">
          <div className="mx-auto max-w-[1100px]">
            <section className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#cdb083] text-3xl">
                👤
              </div>

              <div>
                <h1 className="font-serif text-3xl">Profile Name</h1>

                <p className="mt-2 flex items-center gap-1 text-sm text-[#817a70]">
                  <MapPin size={14} /> Goa, India
                </p>

                <div className="mt-3 flex gap-2">
                  {['Minimal', 'Casual', 'Ethnic'].map((x) => (
                    <span key={x} className="rounded-full border border-[#ddd6ca] px-3 py-1 text-xs">
                      {x}
                    </span>
                  ))}
                </div>
              </div>

              <button className="ml-auto rounded-md border border-[#ddd6ca] bg-[#fbf9f4] px-5 py-2 text-sm">
                Edit
              </button>
            </section>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <section className="rounded-xl border border-[#ddd6ca] bg-[#fbf9f4] p-7">
                <h2 className="font-serif text-2xl">Your Style</h2>

                <div className="mt-5 space-y-5">
                  {styles.map(([name, value]) => (
                    <div key={name}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>{name}</span>
                        <span className="text-[#898176]">{value}%</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[#ded8cb]">
                        <div
                          className="h-full rounded-full bg-[#667149]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#ddd6ca] bg-[#fbf9f4] p-7">
                <h2 className="font-serif text-2xl">Your Preferences</h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div>
                    <p className="text-xs text-[#958d82]">Wardrobe type</p>
                    <b>Women's</b>
                  </div>

                  <div>
                    <p className="text-xs text-[#958d82]">Location</p>
                    <b>Goa, India</b>
                  </div>

                  <div>
                    <p className="text-xs text-[#958d82]">Age range</p>
                    <b>18 – 24</b>
                  </div>

                  <div>
                    <p className="text-xs text-[#958d82]">Occasions</p>
                    <b>College, Everyday, Parties</b>
                  </div>
                </div>

                <button className="mt-6 w-full rounded-md bg-[#667149] py-3 text-sm text-white">
                  Edit preferences
                </button>
              </section>
            </div>

            <section className="mt-6 rounded-xl bg-[#dce0c4] p-7">
              <h2 className="font-serif text-2xl">Make your recommendations smarter</h2>

              <p className="mt-2 text-sm text-[#777568]">
                Add a few more details to get even better outfit suggestions.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  [Ruler, 'Fit preferences', 'Add your preferred sizes →'],
                  [Palette, 'Colour preferences', 'Tell us what you love →'],
                  [Heart, 'Favourite brands', 'Your go-to brands →'],
                ].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-lg bg-[#fbf9f4] p-5">
                    <Icon size={20} />
                    <p className="mt-4 font-semibold">{title}</p>
                    <p className="mt-2 text-xs text-[#898176]">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <button className="mt-6 flex w-full justify-between rounded-lg border border-[#ddd6ca] bg-[#fbf9f4] px-5 py-4 text-sm font-semibold">
              Account Settings <span>→</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile