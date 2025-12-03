import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { selectAuthUser } from '@store/auth-store';
import { Button, Input } from '@shared/ui';
import { SettingsSection } from '../settings-section';

export interface PaymentMethodFormData {
  businessName: string;
  businessType: 'company' | 'individual';
  vat: string;
}

const SettingsPaymentMethodTab: React.FC = () => {
  const user = useSelector(selectAuthUser);

  const methods = useForm<PaymentMethodFormData>({
    defaultValues: {
      businessName: '',
      businessType: 'individual',
      vat: '',
    },
    mode: 'onTouched',
  });
  const { control } = methods;

  return (
    <FormProvider {...methods}>
      <div className="settings-header">
        <div className="title-wrapper">
          <h2>Payment Method</h2>
          <p style={{ fontSize: 14 }}>Add Payment Method</p>
        </div>
      </div>

      <hr className="category-line" />

      <SettingsSection
        title="Business"
        subTitle="Add your business information"
      >
        <Controller
          name="businessName"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              label="Business Name"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
            />
          )}
        />

        <Controller
          name="vat"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              label="VAT / Tax ID"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
            />
          )}
        />
      </SettingsSection>

      <hr className="category-line" />

      <SettingsSection
        title="Payment Provider"
        subTitle="Connect your payment provider"
      >
        <Button variant="tertiary">Connect</Button>
      </SettingsSection>
    </FormProvider>
  );
};

export default SettingsPaymentMethodTab;
