'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { OrderDetailView } from '@/features/account/OrderDetailView';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = typeof params?.id === 'string' ? params.id : '';

  return <OrderDetailView orderId={orderId} />;
}
