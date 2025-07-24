import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useTranslation } from 'react-i18next';

const statusOptions = ['pending', 'approved', 'paid', 'shipped', 'completed'];
const shipmentOptions = ['pending', 'shipped', 'completed'];

const AdminDashboard = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { t } = useTranslation();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/quotation/all');
      setQuotations(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch quotations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.patch(`/api/quotation/${id}/status`, { status });
      setQuotations(qs => qs.map(q => q._id === id ? { ...q, status } : q));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const updateShipment = async (id, { shipmentStatus, trackingNumber }) => {
    setUpdatingId(id);
    try {
      await axios.patch(`/api/quotation/${id}/shipment`, { shipmentStatus, trackingNumber });
      setQuotations(qs => qs.map(q => q._id === id ? { ...q, shipmentStatus, trackingNumber } : q));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update shipment.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h2>{t('Admin Dashboard')}</h2>
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      {!loading && quotations.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>{t('Date')}</th>
              <th>{t('User')}</th>
              <th>{t('Status')}</th>
              <th>{t('Estimate (CHF)')}</th>
              <th>{t('Invoice')}</th>
              <th>{t('Shipment Status')}</th>
              <th>{t('Tracking #')}</th>
              <th>{t('Update Shipment')}</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map(q => (
              <tr key={q._id}>
                <td>{formatDate(q.createdAt)}</td>
                <td>{q.email}</td>
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
                  <select
                    value={q.shipmentStatus || 'pending'}
                    onChange={e => updateShipment(q._id, { shipmentStatus: e.target.value, trackingNumber: q.trackingNumber })}
                    disabled={updatingId === q._id}
                  >
                    {shipmentOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Tracking #"
                    value={q.trackingNumber || ''}
                    onChange={e => updateShipment(q._id, { shipmentStatus: q.shipmentStatus, trackingNumber: e.target.value })}
                    disabled={updatingId === q._id}
                    style={{ width: 100, marginLeft: 4 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && quotations.length === 0 && <div>{t('No quotations found.')}</div>}
    </div>
  );
};

export default AdminDashboard; 