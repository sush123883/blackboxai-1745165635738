import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Register from './pages/Register';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex space-x-4 flex-wrap items-center justify-between">
          <div className="flex space-x-4 flex-wrap">
            <Link to="/register" className="text-blue-600 hover:underline">{t('register')}</Link>
            <Link to="/login" className="text-blue-600 hover:underline">{t('login')}</Link>
            <Link to="/menu" className="text-blue-600 hover:underline">{t('menu')}</Link>
            <Link to="/order" className="text-blue-600 hover:underline">{t('placeOrder')}</Link>
            <Link to="/orders" className="text-blue-600 hover:underline">{t('myOrders')}</Link>
            <Link to="/admin" className="text-red-600 hover:underline font-bold">{t('adminDashboard')}</Link>
          </div>
          <LanguageSwitcher />
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<Order />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<MenuManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/" element={
              <div className="flex items-center justify-center h-[80vh]">
                <h1 className="text-4xl font-bold text-gray-800">
                  {t('welcome')}
                </h1>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
