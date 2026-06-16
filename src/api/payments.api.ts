import api from './axios';
import type{ CheckoutResponse, CreateCheckoutDto, Subscription } from '../types/payment.types';

export const paymentsApi = {

  // POST /payments/checkout
  createCheckoutSession: async (payload: CreateCheckoutDto): Promise<CheckoutResponse> => {
    const { data } = await api.post('/payments/checkout', payload);
    return data;
  },

  // GET /payments/subscription
  getUserSubscription: async (): Promise<Subscription> => {
    const { data } = await api.get('/payments/subscription');
    return data;
  },

};