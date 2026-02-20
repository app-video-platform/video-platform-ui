import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { selectAuthUser } from 'core/store/auth-store';
import { Button, Divider, Input } from '@shared/ui';
import { SettingsSection } from '../settings-section';
import { PageHeader } from 'domains/app/components';

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
      <PageHeader title="Payment Method" subTitle="Add Payment Method" />

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

      <Divider />

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
