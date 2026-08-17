import httpClient from 'core/api/http-client';
import { CommerceCheckoutSession, CommerceOrder } from 'core/api/models';

export const createCommerceCheckoutSessionAPI = async (
  productIds: string[],
  idempotencyKey: string,
): Promise<CommerceCheckoutSession> => {
  const response = await httpClient.post<CommerceCheckoutSession>(
    'api/commerce/checkout-sessions',
    { productIds },
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      withCredentials: true,
    },
  );

  return response.data;
};

export const getCommerceOrderAPI = async (
  orderId: string,
): Promise<CommerceOrder> => {
  const response = await httpClient.get<CommerceOrder>(
    `api/commerce/orders/${orderId}`,
    { withCredentials: true },
  );

  return response.data;
};
