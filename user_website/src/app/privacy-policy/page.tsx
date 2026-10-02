import type { Metadata } from 'next';
import { TermsView } from '@/features/policies/TermsView';

export const metadata: Metadata = {
  title: 'Privacy Policy | Mex Tanim Store',
  description: 'Privacy Policy and Data Protection standards at Mex Tanim Store.',
};

export default function PrivacyPolicyPage() {
  return <TermsView initialTab="privacy" />;
}
