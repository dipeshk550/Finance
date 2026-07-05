import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@satsangparivar.org')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-gray-50 p-4 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white shadow-lg">ॐ</span>
          <h1 className="text-xl font-bold">ॐ सत्सङ्ग परिवार</h1>
          <p className="text-sm text-gray-500">{t('app_name')}</p>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{t('auth.welcome_back')}</h2>
          <p className="mb-6 text-sm text-gray-500">{t('auth.login_subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('auth.email')}</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.org" />
            </div>
            <div>
              <label className="label">{t('auth.password')}</label>
              <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? t('common.loading') : t('auth.login_button')}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">Demo: admin@satsangparivar.org / Password@123</p>
        </div>
      </motion.div>
    </div>
  )
}
