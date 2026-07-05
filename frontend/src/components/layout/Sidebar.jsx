import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LuLayoutDashboard, LuUsers, LuHandCoins, LuWallet, LuReceipt, LuFileText } from 'react-icons/lu'

const navItems = [
  { to: '/', key: 'dashboard', icon: LuLayoutDashboard },
  { to: '/donors', key: 'donors', icon: LuUsers },
  { to: '/donations', key: 'donations', icon: LuHandCoins },
  { to: '/income', key: 'income', icon: LuWallet },
  { to: '/expenses', key: 'expenses', icon: LuReceipt },
  { to: '/statement', key: 'statement', icon: LuFileText },
]

export default function Sidebar({ open, onClose }) {
  const { t } = useTranslation()

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-40 h-full w-64 transform border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-950 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5 dark:border-gray-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">ॐ</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{t('organization')}</p>
            <p className="text-xs text-gray-500">{t('app_name')}</p>
          </div>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={key}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
