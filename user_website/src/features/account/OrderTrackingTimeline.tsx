'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  AlertCircle,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Box,
} from 'lucide-react';
import {
  ORDER_STAGES,
  getOrderStageIndex,
  normalizeOrderStatus,
  OrderStageStatus,
} from './orderService';
import { useLanguage } from '../shared/LanguageContext';

interface OrderTrackingTimelineProps {
  status: string;
  createdAt: string;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  status,
  createdAt,
}) => {
  const { language } = useLanguage();
  const normalizedStatus = normalizeOrderStatus(status);
  const currentStageIndex = getOrderStageIndex(status);

  const formattedDate = new Date(createdAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  // If order is Cancelled
  if (normalizedStatus === 'Cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-5 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-red-800 text-base">
            {language === 'bn' ? 'অর্ডারটি বাতিল করা হয়েছে (Order Cancelled)' : 'Order Cancelled'}
          </h4>
          <p className="text-xs text-red-600 font-medium mt-1">
            {language === 'bn'
              ? 'যেকোনো অনুসন্ধানের জন্য কাস্টমার সাপোর্টে কল বা হোয়াটসঅ্যাপে যোগাযোগ করুন।'
              : 'For any inquiries, please contact our customer support.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/90 border border-gray-200/90 rounded-3xl p-5 sm:p-6 space-y-6">
      
      {/* Current Status Banner Header */}
      <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {language === 'bn' ? 'বর্তমান স্ট্যাটাস (Current Stage)' : 'Current Stage'}
            </span>
            <h4 className="font-black text-slate-900 text-base sm:text-lg">
              {language === 'bn'
                ? ORDER_STAGES[currentStageIndex]?.nameBn || normalizedStatus
                : ORDER_STAGES[currentStageIndex]?.nameEn || normalizedStatus}
            </h4>
          </div>
        </div>

        <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full shadow-2xs">
          {ORDER_STAGES[currentStageIndex]?.nameEn || normalizedStatus}
        </span>
      </div>

      {/* Responsive Order Progress Timeline Bar */}
      <div className="relative py-2">
        
        {/* Desktop / Tablet Horizontal Stage Stepper */}
        <div className="hidden md:grid grid-cols-7 gap-2 relative z-10">
          {ORDER_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isFuture = idx > currentStageIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center text-center group">
                
                {/* Stage Icon Node */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-orange-500 text-white ring-8 ring-orange-500/20 animate-pulse scale-110'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Stage Name */}
                <span
                  className={`text-[11px] font-extrabold mt-2 leading-tight ${
                    isCurrent
                      ? 'text-orange-600 scale-105'
                      : isCompleted
                      ? 'text-slate-900'
                      : 'text-gray-400'
                  }`}
                >
                  {language === 'bn' ? stage.nameBn : stage.nameEn}
                </span>

                {/* Timestamp for first/current stage */}
                {idx === 0 && (
                  <span className="text-[10px] text-gray-400 font-semibold mt-1">
                    {formattedDate}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline Layout */}
        <div className="md:hidden space-y-4 relative pl-6 border-l-2 border-gray-200 ml-3">
          {ORDER_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isFuture = idx > currentStageIndex;

            return (
              <div key={stage.id} className="relative flex items-start space-x-3">
                {/* Node Bullet */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-orange-500 text-white ring-4 ring-orange-500/20 animate-bounce'
                      : 'bg-white border border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5
                      className={`text-xs font-black ${
                        isCurrent
                          ? 'text-orange-600'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {language === 'bn' ? stage.nameBn : stage.nameEn}
                    </h5>
                    {isCurrent && (
                      <span className="text-[9px] bg-orange-100 text-orange-700 font-extrabold px-2 py-0.2 rounded-full">
                        {language === 'bn' ? 'চলমান' : 'Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {language === 'bn' ? stage.descriptionBn : stage.descriptionEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
