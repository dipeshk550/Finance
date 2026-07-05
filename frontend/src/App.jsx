import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DonorList from './pages/donors/DonorList'
import DonationList from './pages/donations/DonationList'
import IncomeList from './pages/income/IncomeList'
import ExpenseList from './pages/expenses/ExpenseList'
import Statement from './pages/statement/Statement'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/donors" element={<DonorList />} />
                  <Route path="/donations" element={<DonationList />} />
                  <Route path="/income" element={<IncomeList />} />
                  <Route path="/expenses" element={<ExpenseList />} />
                  <Route path="/statement" element={<Statement />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold text-brand-600">404</h1>
      <p className="text-gray-500">Page not found</p>
      <a href="/" className="btn-primary mt-4">Go Home</a>
    </div>
  )
}
