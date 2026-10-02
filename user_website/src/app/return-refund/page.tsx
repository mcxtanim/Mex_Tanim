import type { Metadata } from 'next';
import { TermsView } from '@/features/policies/TermsView';

export const metadata: Metadata = {
  title: 'Return & Replacement Policy | Mex Tanim Store',
  description: 'Return, Replacement and Refund Guidelines at Mex Tanim Store.',
};

export default function ReturnRefundPage() {
  return <TermsView initialTab="return" />;
}
