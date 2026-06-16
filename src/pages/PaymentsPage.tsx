import { useState } from 'react';
import { CreditCard, Check, Loader2, Crown, Zap, Building2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments.api';
import { PlanType, SubscriptionStatus } from '../types/payment.types';

const plans = [
  {
    key: PlanType.FREE,
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Zap,
    color: 'text-zinc-400',
    border: 'border-zinc-700',
    features: [
      '1 Workspace',
      '3 Projects',
      '10 Tasks',
      'Basic Reports',
    ],
  },
  {
    key: PlanType.PRO,
    name: 'Pro',
    price: '$12',
    period: 'per month',
    icon: Crown,
    color: 'text-violet-400',
    border: 'border-violet-500',
    featured: true,
    features: [
      'Unlimited Workspaces',
      'Unlimited Projects',
      'Unlimited Tasks',
      'Advanced Reports',
      'Time Tracking',
      'AI Chatbot',
    ],
  },
  {
    key: PlanType.ENTERPRISE,
    name: 'Enterprise',
    price: '$49',
    period: 'per month',
    icon: Building2,
    color: 'text-yellow-400',
    border: 'border-yellow-500/50',
    features: [
      'Everything in Pro',
      'Priority Support',
      'Custom Integrations',
      'SSO / SAML',
      'Audit Logs',
      'SLA Guarantee',
    ],
  },
];

const PaymentsPage = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: subscription, isLoading: loadingSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => paymentsApi.getUserSubscription(),
  });

  const checkout = useMutation({
    mutationFn: (plan: string) =>
      paymentsApi.createCheckoutSession({ plan: plan as typeof PlanType[keyof typeof PlanType] }),
    onSuccess: (data) => {
      // Redirect to Stripe checkout page
      window.location.href = data.url;
    },
    onSettled: () => {
      setLoadingPlan(null);
    },
  });

  const handleUpgrade = (planKey: string) => {
    if (planKey === PlanType.FREE) return;
    setLoadingPlan(planKey);
    checkout.mutate(planKey);
  };

  const isCurrentPlan = (planKey: string) => subscription?.plan === planKey;

  const isActive = subscription?.status === SubscriptionStatus.ACTIVE;

  return (
    <div className="p-6 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <CreditCard size={24} className="text-violet-400" />
        <div>
          <h1 className="text-xl font-bold text-white">Billing & Plans</h1>
          <p className="text-sm text-zinc-500">Manage your subscription</p>
        </div>
      </div>

      {/* Current Subscription Status */}
      {loadingSubscription ? (
        <div className="animate-pulse h-16 bg-zinc-800 rounded-xl" />
      ) : subscription && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Current Plan</p>
            <p className="text-white font-semibold capitalize">{subscription.plan}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Status</p>
            <span className={`text-sm font-semibold capitalize ${
              isActive ? 'text-green-400' :
              subscription.status === SubscriptionStatus.PAST_DUE ? 'text-yellow-400' :
              'text-zinc-400'
            }`}>
              {subscription.status.replace('_', ' ')}
            </span>
          </div>
          {subscription.currentPeriodEnd && (
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Renews</p>
              <p className="text-sm text-white">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const current = isCurrentPlan(plan.key);
          const isLoading = loadingPlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative bg-zinc-900 border ${plan.border} rounded-xl p-6 flex flex-col gap-5 ${
                plan.featured ? 'ring-1 ring-violet-500/50' : ''
              }`}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3">
                <Icon size={20} className={plan.color} />
                <h2 className="text-white font-bold text-lg">{plan.name}</h2>
              </div>

              {/* Price */}
              <div>
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 text-sm ml-1">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={14} className="text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => handleUpgrade(plan.key)}
                disabled={current || plan.key === PlanType.FREE || isLoading}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  current
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : plan.key === PlanType.FREE
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : plan.featured
                    ? 'bg-violet-600 hover:bg-violet-700 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                }`}
              >
                {isLoading && <Loader2 size={14} className="animate-spin" />}
                {current ? 'Current Plan' : plan.key === PlanType.FREE ? 'Free Forever' : `Upgrade to ${plan.name}`}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PaymentsPage;