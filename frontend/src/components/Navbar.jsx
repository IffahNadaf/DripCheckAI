import { NavLink } from 'react-router-dom'
import { User } from 'lucide-react'
import dripcheckLogo from '../assets/dripcheck-logo.png'

function Navbar() {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Wardrobe', path: '/wardrobe' },
    { name: 'Style', path: '/style' },
    { name: 'Chat', path: '/chat' },
  ]

  return (
    <header className="w-full border-b border-[#ddd7ca] bg-[#f7f4ec]">
      <nav className="mx-auto flex h-[64px] max-w-[1500px] items-center px-7 lg:px-10">

        {/* DripCheck Logo */}
        <NavLink to="/" className="flex items-center">
          <img
            src={dripcheckLogo}
            alt="DripCheck"
            className="h-[42px] w-auto object-contain"
          />
        </NavLink>

        {/* Navigation */}
        <div className="ml-auto flex h-full items-center gap-9">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex h-full items-center text-[13px] transition-colors ${
                  isActive
                    ? 'font-semibold text-[#4f5536]'
                    : 'font-medium text-[#403a34] hover:text-[#687047]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}

                  {isActive && (
                    <span className="absolute bottom-[13px] left-0 h-[1.5px] w-full bg-[#687047]" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `ml-3 flex h-8 w-8 items-center justify-center rounded-full ${
                isActive
                  ? 'bg-[#687047] text-white'
                  : 'bg-[#ded9cd] text-[#504a42]'
              }`
            }
          >
            <User size={16} strokeWidth={1.6} />
          </NavLink>
        </div>

      </nav>
    </header>
  )
}

export default Navbar