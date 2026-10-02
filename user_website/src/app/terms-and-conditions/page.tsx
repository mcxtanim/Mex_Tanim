import type { Metadata } from 'next';
import { TermsView } from '@/features/policies/TermsView';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Mex Tanim Store',
  description: 'Terms and Conditions, Order Guidelines and Customer Policies for Mex Tanim Store.',
};

export default function TermsAndConditionsPage() {
  return <TermsView initialTab="terms" />;
}
