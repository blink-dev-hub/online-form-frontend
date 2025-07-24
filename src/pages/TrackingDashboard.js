import React, { useState } from 'react';
import axios from 'axios';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useTranslation } from 'react-i18next';

const TrackingDashboard = () => {
  const [email, setEmail] = useState('');
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const { t } = useTranslation();

  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/quotation', { params: { email } });
      setQuotations(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch quotations.');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      const res = await axios.post(`/api/quotation/${id}/pay`);
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initiate payment.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div>
      <h2>{t('Track Your Quotations')}</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="email"
          placeholder={t('Enter your email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={fetchQuotations} disabled={loading || !email}>
          {loading ? t('Loading...') : t('View My Quotations')}
        </button>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      {quotations.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>{t('Date')}</th>
              <th>{t('Status')}</th>
              <th>{t('Estimate (CHF)')}</th>
              <th>{t('Invoice')}</th>
              <th>{t('Shipment Status')}</th>
              <th>{t('Tracking #')}</th>
              <th>{t('Action')}</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map(q => (
              <tr key={q._id}>
                <td>{formatDate(q.createdAt)}</td>
                <td>{q.status}</td>
                <td>{q.estimate?.total ?? '-'}</td>
                <td>
                  <a href={`/uploads/${q.invoiceFile}`} target="_blank" rel="noopener noreferrer">
                    {t('Download')}
                  </a>
                </td>
                <td>{q.shipmentStatus || '-'}</td>
                <td>{q.trackingNumber || '-'}</td>
                <td>
                  {q.status === 'approved' && (
                    <button onClick={() => handlePay(q._id)} disabled={payingId === q._id}>
                      {payingId === q._id ? 'Redirecting...' : 'Pay Now'}
                    </button>
                  )}
                  {q.status === 'paid' && <span>Paid</span>}
                  {q.status !== 'approved' && q.status !== 'paid' && <span>-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {quotations.length === 0 && !loading && email && !error && (
        <div>{t('No quotations found for this email.')}</div>
      )}
    </div>
  );
};

export default TrackingDashboard; 