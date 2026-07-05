import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LuMenu, LuMoon, LuSun, LuLogOut, LuUser, LuLanguages } from 'react-icons/lu'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar({ onMenuClick }) {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  function switchLanguage() {
    i18n.changeLanguage(i18n.language === 'en' ? 'ne' : 'en')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden" onClick={onMenuClick}>
        <LuMenu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <button onClick={switchLanguage} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
          <LuLanguages className="h-4 w-4" />
          {i18n.language === 'en' ? 'नेपाली' : 'English'}
        </button>

        <button onClick={toggle} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
          {dark ? <LuSun className="h-5 w-5" /> : <LuMoon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0) ?? 'U'}
            </span>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs capitalize text-gray-500 leading-tight">{user?.role?.replace('_', ' ')}</p>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                <LuUser className="h-4 w-4" /> Profile
              </button>
              <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
                <LuLogOut className="h-4 w-4" /> {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
