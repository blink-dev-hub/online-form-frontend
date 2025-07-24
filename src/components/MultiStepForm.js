import React, { useState, useMemo } from 'react';
import { Box, Button, Stepper, Step, StepLabel, TextField, MenuItem, Typography, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { calculateEstimate } from '../utils/pricingTable';
import FieldError from './FieldError';
import InfoAlert from './InfoAlert';
import { useTranslation } from 'react-i18next';

const personalInfoSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  language: Yup.string().oneOf(['en', 'fr']).required('Language is required'),
});

const addressSchema = Yup.object({
  address: Yup.string().required('Address is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const auctionSchema = Yup.object({
  auctionHouse: Yup.string().required('Auction house name is required'),
  purchaseDate: Yup.string().required('Purchase date is required'),
  invoiceReceived: Yup.string().oneOf(['yes', 'no']).required('Invoice status is required'),
  invoiceValue: Yup.number().typeError('Must be a number').required('Invoice value is required'),
  invoiceFile: Yup.mixed().required('Invoice file is required'),
});

const packageSchema = Yup.object({
  shippingType: Yup.string().oneOf(['postal', 'fast']).required('Shipping type is required'),
  destination: Yup.string().required('Destination is required'),
  weight: Yup.string().required('Weight is required'),
  specialHandling: Yup.string(),
});

const initialValues = {
  firstName: '',
  lastName: '',
  language: 'en',
  address: '',
  phone: '',
  email: '',
  auctionHouse: '',
  purchaseDate: '',
  invoiceReceived: 'yes',
  invoiceValue: '',
  invoiceFile: null,
  shippingType: 'postal',
  destination: 'SWITZERLAND',
  weight: '',
  specialHandling: '',
};

const validationSchemas = [
  personalInfoSchema,
  addressSchema,
  auctionSchema,
  packageSchema,
  null, // Review step has no validation
];

const destinationOptions = [
  { value: 'SWITZERLAND', label: 'Switzerland' },
  { value: 'EU COUNTRIES', label: 'EU Countries' },
  { value: 'USA, CANADA', label: 'USA, Canada' },
  { value: 'OTHER COUNTRIES', label: 'Other Countries' },
];

const MultiStepForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const steps = [
    t('Personal Info'),
    t('Delivery Address'),
    t('Auction Details'),
    t('Package Details'),
    t('Review & Submit'),
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialValues);

  const nextStep = (values) => {
    setFormData({ ...formData, ...values });
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFileChange = (e, setFieldValue) => {
    setFieldValue('invoiceFile', e.currentTarget.files[0]);
  };

  // Calculate estimate for package and review steps
  const getEstimate = (values) => {
    if (!values.weight || !values.destination || !values.shippingType || !values.invoiceValue) return null;
    return calculateEstimate({
      shippingType: values.shippingType,
      destination: values.destination,
      weight: values.weight,
      invoiceValue: Number(values.invoiceValue),
    });
  };

  const renderEstimate = (estimate) => {
    if (!estimate) return null;
    if (estimate.breakdown.error) {
      return <Alert severity="warning">{estimate.breakdown.error}</Alert>;
    }
    return (
      <Box mt={2} mb={2}>
        <Typography variant="subtitle1">{t('estimated_price_breakdown')}</Typography>
        <ul>
          <li>{t('main_shipping')}: CHF {estimate.breakdown.main}</li>
          {estimate.breakdown.insurance && <li>{t('insurance')}: CHF {estimate.breakdown.insurance}</li>}
          {estimate.breakdown.packaging && <li>{t('packaging')}: CHF {estimate.breakdown.packaging}</li>}
          {estimate.breakdown.customDeclaration && <li>{t('custom_declaration')}: CHF {estimate.breakdown.customDeclaration}</li>}
          {estimate.breakdown.forwarding && <li>{t('forwarding')}: CHF {estimate.breakdown.forwarding}</li>}
        </ul>
        <Typography variant="h6">{t('total_estimate')}: CHF {estimate.total}</Typography>
      </Box>
    );
  };

  const renderStep = (formik) => {
    switch (currentStep) {
      case 0:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Field name="firstName">
              {({ field, meta }) => (
                <TextField {...field} label={t('first_name')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            <Field name="lastName">
              {({ field, meta }) => (
                <TextField {...field} label={t('last_name')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            <Field name="language">
              {({ field, meta }) => (
                <TextField {...field} select label={t('language')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth>
                  <MenuItem value="en">{t('English')}</MenuItem>
                  <MenuItem value="fr">{t('Français')}</MenuItem>
                </TextField>
              )}
            </Field>
          </Box>
        );
      case 1:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Field name="address">
              {({ field, meta }) => (
                <TextField {...field} label={t('address')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            <Field name="phone">
              {({ field, meta }) => (
                <TextField {...field} label={t('phone')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            <Field name="email">
              {({ field, meta }) => (
                <TextField {...field} label={t('email')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
          </Box>
        );
      case 2:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Field name="auctionHouse">
              {({ field, meta }) => (
                <TextField {...field} label={t('auction_house_name')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            <Field name="purchaseDate">
              {({ field, meta }) => (
                <TextField {...field} label={t('purchase_date')} type="date" InputLabelProps={{ shrink: true }} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            <Field name="invoiceReceived">
              {({ field, meta }) => (
                <TextField {...field} select label={t('full_invoice_received')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth>
                  <MenuItem value="yes">{t('yes')}</MenuItem>
                  <MenuItem value="no">{t('no')}</MenuItem>
                </TextField>
              )}
            </Field>
            <Field name="invoiceValue">
              {({ field, meta }) => (
                <TextField {...field} label={t('invoice_value_chf')} type="number" error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            <input
              id="invoiceFile"
              name="invoiceFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, formik.setFieldValue)}
              style={{ marginTop: 16 }}
            />
            {formik.touched.invoiceFile && formik.errors.invoiceFile && (
              <Typography color="error" variant="caption">{formik.errors.invoiceFile}</Typography>
            )}
            {formik.values.invoiceFile && (
              <Typography variant="body2">{t('selected_file')}: {formik.values.invoiceFile.name}</Typography>
            )}
          </Box>
        );
      case 3:
        // Package Details + Estimate
        const estimate = getEstimate(formik.values);
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Field name="shippingType">
              {({ field, meta }) => (
                <TextField {...field} select label={t('shipping_type')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth>
                  <MenuItem value="postal">{t('postal_service')}</MenuItem>
                  <MenuItem value="fast">{t('fast_carrier')}</MenuItem>
                </TextField>
              )}
            </Field>
            <Field name="destination">
              {({ field, meta }) => (
                <TextField {...field} select label={t('destination')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth>
                  {destinationOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
              )}
            </Field>
            <Field name="weight">
              {({ field, meta }) => (
                <TextField {...field} select label={t('estimated_weight')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth>
                  <MenuItem value="1">{t('up_to_1_kilo')}</MenuItem>
                  <MenuItem value="2">{t('up_to_2_kilos')}</MenuItem>
                  <MenuItem value="5">{t('up_to_5_kilos')}</MenuItem>
                  <MenuItem value=">5">{t('more_than_5_kilos')}</MenuItem>
                </TextField>
              )}
            </Field>
            <Field name="specialHandling">
              {({ field, meta }) => (
                <TextField {...field} label={t('special_handling_requests')} error={meta.touched && Boolean(meta.error)} helperText={<FieldError error={meta.touched && meta.error ? meta.error : ''} />} fullWidth />
              )}
            </Field>
            {renderEstimate(estimate)}
          </Box>
        );
      case 4:
        // Review & Submit + Estimate
        const reviewEstimate = getEstimate(formik.values);
        const fieldLabels = {
          firstName: t('first_name'),
          lastName: t('last_name'),
          language: t('language'),
          address: t('address'),
          phone: t('phone'),
          email: t('email'),
          auctionHouse: t('auction_house_name'),
          purchaseDate: t('purchase_date'),
          invoiceReceived: t('full_invoice_received'),
          invoiceValue: t('invoice_value_chf'),
          invoiceFile: t('invoice_file'),
          shippingType: t('shipping_type'),
          destination: t('destination'),
          weight: t('estimated_weight'),
          specialHandling: t('special_handling_requests'),
        };
        const getLabel = (key, value) => {
          if (key === 'language') return value === 'en' ? t('English') : t('Français');
          if (key === 'invoiceReceived') return value === 'yes' ? t('Yes') : t('No');
          if (key === 'shippingType') return value === 'postal' ? t('Postal Service') : t('Fast Carrier');
          if (key === 'destination') {
            if (value === 'SWITZERLAND') return t('Switzerland');
            if (value === 'EU COUNTRIES') return t('EU Countries');
            if (value === 'USA, CANADA') return t('USA, Canada');
            if (value === 'OTHER COUNTRIES') return t('Other Countries');
            return value;
          }
          if (value === '' || value === undefined || value === null) return t('None');
          return value;
        };
        return (
          <Box>
            <Typography variant="h6" gutterBottom>{t('Review & Submit')}</Typography>
            <Box sx={{ background: '#f5f5f5', p: 2, borderRadius: 2, mb: 2 }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {Object.keys(fieldLabels).map((key) => (
                  <li key={key}><b>{fieldLabels[key]}:</b> {key === 'invoiceFile' ? (formik.values.invoiceFile?.name || t('No file')) : getLabel(key, formik.values[key])}</li>
                ))}
              </ul>
            </Box>
            {reviewEstimate && (
              <Box mt={2} mb={2}>
                <Typography variant="subtitle1">{t('estimated_price_breakdown')}</Typography>
                <ul>
                  <li>{t('main_shipping')}: Fr. {reviewEstimate.breakdown.main}</li>
                  {reviewEstimate.breakdown.insurance && <li>{t('insurance')}: Fr. {reviewEstimate.breakdown.insurance}</li>}
                  {reviewEstimate.breakdown.packaging && <li>{t('packaging')}: Fr. {reviewEstimate.breakdown.packaging}</li>}
                  {reviewEstimate.breakdown.customDeclaration && <li>{t('custom_declaration')}: Fr. {reviewEstimate.breakdown.customDeclaration}</li>}
                  {reviewEstimate.breakdown.forwarding && <li>{t('forwarding')}: Fr. {reviewEstimate.breakdown.forwarding}</li>}
                </ul>
                <Typography variant="h6">{t('total_estimate')}: Fr. {reviewEstimate.total}</Typography>
              </Box>
            )}
            <Box display="flex" gap={2} mt={2}>
              <Button variant="contained" color="primary" type="submit">{t('Submit')}</Button>
              {currentStep > 0 && (
                <Button variant="outlined" onClick={prevStep} type="button">{t('Back')}</Button>
              )}
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box maxWidth={600} mx="auto">
      <InfoAlert message={t('estimate_disclaimer')} />
      <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Formik
        initialValues={formData}
        validationSchema={validationSchemas[currentStep]}
        onSubmit={async (values, { resetForm }) => {
          if (currentStep < steps.length - 1) {
            nextStep(values);
          } else {
            const estimate = getEstimate(values);
            if (onSubmit) {
              await onSubmit(values, estimate, resetForm);
            }
          }
        }}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            {renderStep(formik)}
            {currentStep < steps.length - 1 && (
              <Box mt={3} display="flex" justifyContent="space-between">
                {currentStep > 0 && (
                  <Button variant="outlined" onClick={prevStep} type="button">{t('back')}</Button>
                )}
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {t('next')}
                </Button>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MultiStepForm; 