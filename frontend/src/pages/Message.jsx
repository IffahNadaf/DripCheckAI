import { useState } from 'react'
import Navbar from '../components/Navbar'
import {
  Search,
  Send,
  Image,
  Smile,
  MoreHorizontal,
  Plus,
  Phone,
  Video,
} from 'lucide-react'

function Message() {
  const [selectedChat, setSelectedChat] = useState(0)

  const conversations = [
    {
      name: 'Atiya',
      username: '@atiya.f',
      initial: 'A',
      message: 'Omg yes that outfit would look so good 😭',
      time: '2m',
      online: true,
    },
    {
      name: 'Sara',
      username: '@sara.styles',
      initial: 'S',
      message: 'Where did you get that top?',
      time: '18m',
      online: true,
    },
    {
      name: 'College Fits',
      username: '4 members',
      initial: 'C',
      message: 'Meher: sending my outfit now',
      time: '1h',
      online: false,
    },
    {
      name: 'Zoya',
      username: '@zoyawears',
      initial: 'Z',
      message: 'Loved the look you posted!',
      time: '3h',
      online: false,
    },
    {
      name: 'Fashion Girls',
      username: '6 members',
      initial: 'F',
      message: 'Aisha: What are we wearing tomorrow?',
      time: '1d',
      online: false,
    },
  ]

  const active = conversations[selectedChat]

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#403a34]">
      <Navbar />

      <main className="mx-auto max-w-[1380px] px-8 py-8 lg:px-14">
        <div className="mb-7">
          <h1 className="font-serif text-4xl text-[#4d392e]">
            Messages
          </h1>

          <p className="mt-2 text-sm text-[#847d73]">
            Talk style, share looks, stay connected.
          </p>
        </div>

        <div className="flex h-[680px] overflow-hidden rounded-xl border border-[#dcd5c8] bg-[#fbf9f4]">

          {/* LEFT — conversations */}
          <aside className="w-[330px] shrink-0 border-r border-[#ddd6ca]">

            <div className="border-b border-[#ddd6ca] p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl">
                  Conversations
                </h2>

                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#667149] text-white">
                  <Plus size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-[#eeeae1] px-4">
                <Search size={15} className="text-[#8b8379]" />

                <input
                  placeholder="Search messages..."
                  className="w-full bg-transparent py-2.5 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              {conversations.map((chat, index) => (
                <button
                  key={chat.name}
                  onClick={() => setSelectedChat(index)}
                  className={`flex w-full items-center gap-3 border-b border-[#eee9df] px-5 py-4 text-left transition ${
                    selectedChat === index
                      ? 'bg-[#e4e5d5]'
                      : 'hover:bg-[#f2eee5]'
                  }`}
                >

                  {/* Avatar */}
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#cbbca6] font-serif text-lg text-[#554436]">
                      {chat.initial}
                    </div>

                    {chat.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#fbf9f4] bg-[#6e7a4e]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {chat.name}
                      </p>

                      <span className="text-[10px] text-[#999186]">
                        {chat.time}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-[#8b8379]">
                      {chat.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT — selected chat */}
          <section className="flex flex-1 flex-col">

            {/* Chat header */}
            <div className="flex h-[78px] items-center border-b border-[#ddd6ca] px-6">

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cbbca6] font-serif text-lg">
                  {active.initial}
                </div>

                {active.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#fbf9f4] bg-[#6e7a4e]" />
                )}
              </div>

              <div className="ml-3">
                <p className="text-sm font-semibold">
                  {active.name}
                </p>

                <p className="text-[11px] text-[#8c847a]">
                  {active.online ? 'Active now' : active.username}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-5 text-[#686158]">
                <button>
                  <Phone size={18} strokeWidth={1.5} />
                </button>

                <button>
                  <Video size={19} strokeWidth={1.5} />
                </button>

                <button>
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-7 py-7">

              <p className="mb-7 text-center text-[10px] tracking-wider text-[#aaa296]">
                TODAY
              </p>

              {/* Their message */}
              <div className="mb-5 flex items-end gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cbbca6] text-xs">
                  {active.initial}
                </div>

                <div className="max-w-[420px] rounded-2xl rounded-bl-sm bg-[#ebe7dd] px-4 py-3">
                  <p className="text-sm leading-6">
                    Heyyy! Did you decide what you're wearing tomorrow?
                  </p>
                </div>
              </div>

              {/* My message */}
              <div className="mb-5 flex justify-end">
                <div className="max-w-[420px] rounded-2xl rounded-br-sm bg-[#667149] px-4 py-3 text-white">
                  <p className="text-sm leading-6">
                    Not yet 😭 I'm deciding between two outfits.
                  </p>
                </div>
              </div>

              {/* Their message */}
              <div className="mb-5 flex items-end gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cbbca6] text-xs">
                  {active.initial}
                </div>

                <div className="max-w-[420px] rounded-2xl rounded-bl-sm bg-[#ebe7dd] px-4 py-3">
                  <p className="text-sm leading-6">
                    Send both! I'll help you choose 👀
                  </p>
                </div>
              </div>

              {/* Shared fashion post */}
              <div className="mb-5 flex justify-end">
                <div className="w-[230px] overflow-hidden rounded-xl border border-[#d8d1c5] bg-[#f5f1e8]">
                  <div className="flex h-[190px] items-center justify-center bg-gradient-to-br from-[#d3b89c] to-[#eee1d1] text-6xl">
                    👗
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-semibold">
                      Outfit option 01
                    </p>

                    <p className="mt-1 text-[11px] text-[#898176]">
                      Shared from my wardrobe
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cbbca6] text-xs">
                  {active.initial}
                </div>

                <div className="rounded-2xl rounded-bl-sm bg-[#ebe7dd] px-4 py-3">
                  <p className="text-sm">
                    Omg yes this one!! 🤎
                  </p>
                </div>
              </div>
            </div>

            {/* Message input */}
            <div className="border-t border-[#ddd6ca] p-5">
              <div className="flex items-center gap-3 rounded-full border border-[#d6d0c4] bg-[#f7f4ec] px-4 py-2">

                <button className="text-[#777065]">
                  <Image size={19} strokeWidth={1.5} />
                </button>

                <input
                  placeholder={`Message ${active.name}...`}
                  className="flex-1 bg-transparent py-2 text-sm outline-none"
                />

                <button className="text-[#777065]">
                  <Smile size={19} strokeWidth={1.5} />
                </button>

                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#667149] text-white">
                  <Send size={15} />
                </button>
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  )
}

export default Message