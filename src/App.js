import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import QuotationForm from './pages/QuotationForm';
import QuotationReview from './pages/QuotationReview';
import PaymentPage from './pages/PaymentPage';
import TrackingDashboard from './pages/TrackingDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';

function App() {
  return (
    <LanguageProvider>
      <CssBaseline />
      <Router>
        <Header />
        <Container maxWidth="md" sx={{ mb: 4 }}>
          <Routes>
            <Route path="/" element={<QuotationForm />} />
            <Route path="/review" element={<QuotationReview />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/tracking" element={<TrackingDashboard />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Container>
      </Router>
    </LanguageProvider>
  );
}

export default App;
