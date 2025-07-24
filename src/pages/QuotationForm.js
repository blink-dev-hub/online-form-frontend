import React, { useState } from 'react';
import MultiStepForm from '../components/MultiStepForm';
import axios from 'axios';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import { useTranslation } from 'react-i18next';

const QuotationForm = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  const { t } = useTranslation();

  const handleSubmit = async (values, estimate, resetForm) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'invoiceFile' && value) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });
      formData.append('estimate', JSON.stringify(estimate));
      const res = await axios.post('/api/quotation', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitStatus({ success: true, message: 'Quotation submitted successfully!' });
      resetForm();
    } catch (err) {
      setSubmitStatus({ success: false, message: err.response?.data?.error || 'Submission failed.' });
    }
  };

  return (
    <div>
      <h2>{t('Quotation Form')}</h2>
      {submitStatus && submitStatus.success && (
        <SuccessAlert message={submitStatus.message} />
      )}
      {submitStatus && !submitStatus.success && (
        <ErrorAlert message={submitStatus.message} />
      )}
      <MultiStepForm onSubmit={handleSubmit} />
    </div>
  );
};

export default QuotationForm; 