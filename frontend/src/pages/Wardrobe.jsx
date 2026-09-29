import Navbar from '../components/Navbar'
import {
  Grid2X2,
  Shirt,
  Plus,
  Search,
  ChevronDown,
  Sparkles,
} from 'lucide-react'

function Wardrobe() {
  const items = [
    { name: 'Linen Blazer', type: 'Jacket', emoji: '🧥' },
    { name: 'Silk Blouse', type: 'Top', emoji: '👚' },
    { name: 'High-Waist Trousers', type: 'Bottom', emoji: '👖' },
    { name: 'Midi Wrap Dress', type: 'Dress', emoji: '👗' },
    { name: 'Cashmere Sweater', type: 'Top', emoji: '🧶' },
    { name: 'Wide-Leg Pants', type: 'Bottom', emoji: '👖' },
    { name: 'Leather Loafers', type: 'Shoes', emoji: '👞' },
    { name: 'Gold Pendant', type: 'Accessory', emoji: '📿' },
  ]

  const categories = [
    ['All Items', Grid2X2],
    ['Tops', Shirt],
    ['Bottoms', Shirt],
    ['Dresses', Shirt],
    ['Shoes', Shirt],
    ['Accessories', Sparkles],
  ]

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#403a34]">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-[220px] border-r border-[#ddd7ca] bg-[#f2eee4] p-5 lg:block">
          <div className="space-y-2">
            {categories.map(([name, Icon], index) => (
              <button
                key={name}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm ${
                  index === 0 ? 'bg-[#dfe1cf] font-semibold' : 'hover:bg-[#ebe6da]'
                }`}
              >
                <Icon size={16} />
                {name}
              </button>
            ))}
          </div>

          <button className="mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-[#667149] py-3 text-sm text-white">
            <Plus size={16} /> Add Item
          </button>
        </aside>

        <main className="flex-1 px-7 py-10 lg:px-12">
          <div className="mx-auto max-w-[1250px]">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl text-[#4c382d]">My Wardrobe</h1>
                <p className="mt-2 text-sm text-[#898176]">
                  Your digital closet, organized your way.
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-md bg-[#667149] px-5 py-3 text-sm text-white">
                <Plus size={16} /> Add Item
              </button>
            </div>

            <div className="mb-7 flex flex-wrap gap-3">
              <div className="flex min-w-[280px] flex-1 items-center gap-2 rounded-md border border-[#d8d1c5] bg-white px-4">
                <Search size={16} />
                <input
                  placeholder="Search your wardrobe..."
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>

              <button className="flex items-center gap-3 rounded-md border border-[#d8d1c5] bg-white px-5 text-sm">
                All Items <ChevronDown size={15} />
              </button>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1fr_260px]">
              <section>
                <div className="mb-4 flex justify-between">
                  <h2 className="font-semibold">All Items</h2>
                  <span className="text-sm text-[#8a8378]">{items.length} items</span>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="overflow-hidden rounded-lg border border-[#ddd6ca] bg-[#fbf9f4]"
                    >
                      <div className="flex aspect-[4/4.5] items-center justify-center bg-gradient-to-br from-[#d7bea3] to-[#eee3d5] text-7xl">
                        {item.emoji}
                      </div>

                      <div className="p-3">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs text-[#8d857b]">{item.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-5">
                <div className="rounded-xl bg-[#485236] p-6 text-white">
                  <Sparkles size={20} />

                  <h3 className="mt-8 font-serif text-2xl">Need outfit ideas?</h3>
                  <p className="mt-2 font-serif text-xl text-[#e8e4d6]">
                    Let AI style your wardrobe.
                  </p>

                  <a
                    href="/style"
                    className="mt-6 block rounded-md bg-[#78845b] px-4 py-3 text-center text-xs font-semibold"
                  >
                    GENERATE IDEAS →
                  </a>
                </div>

                <div className="rounded-xl border border-[#ddd6ca] bg-[#fbf9f4] p-5">
                  <h3 className="font-serif text-xl">Quick Stats</h3>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span>Total Items</span><b>8</b></div>
                    <div className="flex justify-between"><span>Tops</span><span>2</span></div>
                    <div className="flex justify-between"><span>Dresses</span><span>2</span></div>
                    <div className="flex justify-between"><span>Bottoms</span><span>2</span></div>
                    <div className="flex justify-between"><span>Shoes</span><span>1</span></div>
                    <div className="flex justify-between"><span>Accessories</span><span>1</span></div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Wardrobe