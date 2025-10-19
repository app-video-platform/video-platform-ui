/* eslint-disable no-unused-vars */
import { CancelationPolicy } from '../models/cancellation/cancellation-policy';

export enum CancelationPolicyId {
  NoRefunds = 'no_refunds',
  Full24h = 'full_24h',
  Full48h = 'full_48h',
  Partial24h = 'partial_24h',
  ManualReview = 'manual_review',
  CustomPolicy = 'custom_policy',
}

export const CANCELATION_POLICIES: CancelationPolicy[] = [
  {
    id: CancelationPolicyId.NoRefunds,
    label: '❌ No cancellations allowed',
    notes: 'Booking is final',
  },
  {
    id: CancelationPolicyId.Full24h,
    label: '✅ Full refund if canceled ≥ 24h in advance',
    notes: 'Industry standard; gives both sides predictability',
  },
  {
    id: CancelationPolicyId.Full48h,
    label: '🔁 Full refund if canceled ≥ 48h in advance',
    notes: 'More generous',
  },
  {
    id: CancelationPolicyId.Partial24h,
    label: '🕐 50% refund if canceled ≥ 24h in advance',
    notes: 'You keep part of the fee',
  },
  {
    id: CancelationPolicyId.ManualReview,
    label: '✉️ Cancellations allowed anytime (manual review)',
    notes: 'Student submits request, you decide offline',
  },
  {
    id: CancelationPolicyId.CustomPolicy,
    label: '⚙️ Custom policy (describe in message below)',
    notes: 'Enables custom entry in "Confirmation Message" field',
  },
];
