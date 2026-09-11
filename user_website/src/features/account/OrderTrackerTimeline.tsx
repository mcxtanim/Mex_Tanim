'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  XCircle,
  ShoppingBag,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { CustomerOrder, CustomerOrderStatus } from './types';
import { ORDER_STAGES, getOrderStageIndex } from './orderSyncService';
import { useLanguage } from '../shared/LanguageContext';

interface OrderTrackerTimelineProps {
  order: CustomerOrder;
}

export const OrderTrackerTimeline: React.FC<OrderTrackerTimelineProps> = ({ order }) => {
  const { language } = useLanguage();
  const currentStageIndex = getOrderStageIndex(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-md p-5 sm:p-7 space-y-6">
      
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center shadow-md shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {language === 'bn' ? 'অর্ডার ট্র্যাকিং সিস্টেম' : 'Live Order Tracking'}
              </h4>
              <span className="bg-orange-50 text-orange-600 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-orange-200">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {language === 'bn' ? 'আপনার অর্ডারের বর্তমান অবস্থা মনিটর করুন' : 'Monitor the current stage of your order'}
            </p>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className="self-start sm:self-center">
          {isCancelled ? (
            <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-black px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-2xs">
              <XCircle className="w-4 h-4 fill-red-600 text-white" />
              <span>{language === 'bn' ? 'অর্ডার বাতিল (Cancelled)' : 'Cancelled'}</span>
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3.5 py-1 rounded-full flex items-center space-x-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>
                {language === 'bn'
                  ? ORDER_STAGES[currentStageIndex]?.titleBn || order.status
                  : ORDER_STAGES[currentStageIndex]?.titleEn || order.status}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* CANCELLED STATE VIEW */}
      {isCancelled ? (
        <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl text-center space-y-2">
          <XCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h5 className="font-extrabold text-red-900 text-sm">
            {language === 'bn' ? 'এই অর্ডারটি বাতিল করা হয়েছে' : 'This order has been cancelled'}
          </h5>
          <p className="text-xs text-red-700 font-medium max-w-md mx-auto">
            {language === 'bn'
              ? 'অর্ডার সংক্রান্ত যেকোনো প্রশ্নের জন্য আমাদের হেল্পলাইনে যোগাযোগ করুন।'
              : 'For any queries regarding this order, please contact our customer support hotline.'}
          </p>
        </div>
      ) : (
        
        /* 7-STAGE PROGRESS TIMELINE TRACKER */
        <div className="py-2">
          
          {/* Desktop Horizontal Stepper (Hidden on small mobile) */}
          <div className="hidden md:block">
            <div className="relative flex items-center justify-between">
              {/* Background Connecting Line */}
              <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 rounded-full z-0" />
              
              {/* Active Progress Connecting Line */}
              <div
                className="absolute top-5 left-6 h-1 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full transition-all duration-700 z-0"
                style={{
                  width: `${(currentStageIndex / (ORDER_STAGES.length - 1)) * 94}%`,
                }}
              />

              {/* Stage Nodes */}
              {ORDER_STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isFuture = idx > currentStageIndex;

                return (
                  <div
                    key={stage.status}
                    className="relative z-10 flex flex-col items-center group cursor-default"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-black text-xs shadow-md ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 scale-100'
                          : isCurrent
                          ? 'bg-orange-500 text-white ring-4 ring-orange-100 scale-110 animate-pulse'
                          : 'bg-white text-gray-400 border-2 border-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[3]" />
                      ) : isCurrent ? (
                        <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Stage Label */}
                    <div className="mt-3 text-center max-w-[100px]">
                      <h5
                        className={`text-[11px] font-extrabold leading-tight ${
                          isCurrent
                            ? 'text-orange-600 scale-105'
                            : isCompleted
                            ? 'text-slate-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {language === 'bn' ? stage.titleBn : stage.titleEn}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Timeline (Visible on mobile/tablets) */}
          <div className="block md:hidden space-y-6">
            {ORDER_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.status} className="flex space-x-4 relative">
                  {/* Vertical Connecting Line */}
                  {idx < ORDER_STAGES.length - 1 && (
                    <div
                      className={`absolute top-8 left-4 bottom-0 w-0.5 -ml-px ${
                        idx < currentStageIndex ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  {/* Icon Badge */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h5
                        className={`text-xs font-extrabold ${
                          isCurrent
                            ? 'text-orange-600'
                            : isCompleted
                            ? 'text-slate-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {language === 'bn' ? stage.titleBn : stage.titleEn}
                      </h5>
                      {isCurrent && (
                        <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md">
                          {language === 'bn' ? 'চলমান স্টেজ' : 'Active Stage'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      {language === 'bn' ? stage.descBn : stage.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
