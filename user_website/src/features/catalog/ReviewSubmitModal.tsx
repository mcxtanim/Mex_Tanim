'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, ShieldCheck, AlertCircle, ShoppingBag } from 'lucide-react';
import { addReview } from './reviewService';
import { useLanguage } from '../shared/LanguageContext';

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  customerName?: string;
  onReviewSubmitted?: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({
  isOpen,
  onClose,
  orderId,
  productId,
  productTitle,
  productImage,
  customerName = '',
  onReviewSubmitted,
}) => {
  const { language } = useLanguage();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>(customerName);
  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(0);
      setReviewerName(customerName || '');
      setComment('');
      setErrorMsg('');
      setIsSuccess(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, customerName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!reviewerName.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please enter your name');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার মূল্যবান রিভিউ কমেন্ট লিখুন' : 'Please write your review comment');
      return;
    }

    try {
      addReview({
        productId,
        orderId,
        customerName: reviewerName,
        rating,
        comment,
      });

      setIsSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
      setErrorMsg(language === 'bn' ? 'রিভিউ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to submit review. Please try again.');
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return language === 'bn' ? '৫ স্টার (অসাধারণ / Excellent)' : '5 Stars (Excellent)';
      case 4:
        return language === 'bn' ? '৪ স্টার (অনেক ভালো / Very Good)' : '4 Stars (Very Good)';
      case 3:
        return language === 'bn' ? '৩ স্টার (মোটামুটি / Average)' : '3 Stars (Average)';
      case 2:
        return language === 'bn' ? '২ স্টার (খারাপ নয় / Fair)' : '2 Stars (Fair)';
      case 1:
        return language === 'bn' ? '১ স্টার (সন্তোষজনক নয় / Poor)' : '1 Star (Poor)';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-wide">
                {language === 'bn' ? 'Verified Review দিন' : 'Write Verified Review'}
              </h3>
              <p className="text-[11px] text-gray-300 font-medium">
                {language === 'bn' ? 'আপনার কেনা প্রোডাক্টের রিভিউ শেয়ার করুন' : 'Share your experience with this product'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh] scrollbar-thin">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'bn' ? 'ধন্যবাদ! আপনার রিভিউ যোগ হয়েছে' : 'Thank You! Review Submitted'}
              </h3>
              <p className="text-xs text-gray-600 font-medium max-w-xs mx-auto">
                {language === 'bn'
                  ? 'আপনার সততা ও মূল্যবান ফিডব্যাকের জন্য ধন্যবাদ। প্রোডাক্ট পেজে "Verified Buyer" ব্যাজ সহ আপনার রিভিউ দেখা যাচ্ছে।'
                  : 'Your review has been successfully attached to the product with a Verified Buyer badge.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Info Box */}
              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-gray-200/80">
                <img
                  src={productImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=150&q=80'}
                  alt={productTitle}
                  className="w-12 h-12 object-contain bg-white p-1 rounded-xl border border-gray-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                    {productTitle}
                  </h4>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Buyer Purchase</span>
                  </span>
                </div>
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1-5 Star Rating Selector */}
              <div className="space-y-2 text-center bg-orange-50/50 p-4 rounded-2xl border border-orange-200/80">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  {language === 'bn' ? 'স্টার রেটিং দিন (১ - ৫)' : 'Select Star Rating (1 - 5)'}
                </label>

                <div className="flex items-center justify-center space-x-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <p className="text-xs font-extrabold text-slate-900">
                  {getRatingLabel(hoverRating || rating)}
                </p>
              </div>

              {/* Reviewer Name */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">
                  {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                />
              </div>

              {/* Review Comment Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">
                  {language === 'bn' ? 'আপনার রিভিউ কমেন্ট *' : 'Review Comment *'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    language === 'bn'
                      ? 'প্রোডাক্টের কোয়ালিটি, পারফরম্যান্স এবং অভিজ্ঞতা সম্পর্কে লিখুন...'
                      : 'Share details of your experience regarding build quality, performance, etc.'
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-orange-600 hover:to-orange-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{language === 'bn' ? 'ভেরিফাইড রিভিউ সাবমিট করুন' : 'Submit Verified Review'}</span>
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
