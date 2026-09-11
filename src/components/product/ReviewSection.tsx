'use client';

import React, { useState, useMemo } from 'react';
import { ProductReview } from '@/types/product';
import { RatingStars } from '@/components/ui/RatingStars';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import {
  CheckCircle,
  ThumbsUp,
  MessageSquarePlus,
  Star,
  Sparkles,
  ThumbsDown,
  Filter,
} from 'lucide-react';

interface ReviewSectionProps {
  productId: string;
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}

const COMMON_TAGS = [
  'Exceptional Quality',
  'Fast Delivery',
  'Accurate Sizing',
  'Premium Feel',
  'Highly Recommended',
  'Great Battery Life',
  'Sleek Aesthetics',
];

export function ReviewSection({
  productId,
  reviews: initialReviews,
  rating: initialRating,
  reviewCount: initialCount,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Recalculate average rating & counts dynamically
  const currentAvgRating = useMemo(() => {
    if (reviews.length === 0) return initialRating;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews, initialRating]);

  // Rating Distribution breakdown (1-5)
  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = counts[stars as 1 | 2 | 3 | 4 | 5] || 0;
      const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
      return { stars, count, pct };
    });
  }, [reviews]);

  const handleToggleHelpful = (id: string) => {
    setHelpfulVotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewTitle.trim() || !reviewComment.trim()) return;

    setIsSubmitting(true);
    const tagText = selectedTags.length > 0 ? ` [Key Highlights: ${selectedTags.join(', ')}]` : '';
    const created = await api.addReview(productId, {
      author: authorName.trim(),
      rating: newRating,
      title: reviewTitle.trim(),
      comment: `${reviewComment.trim()}${tagText}`,
      verified: true,
    });

    setReviews((prev) => [created, ...prev]);
    setIsSubmitting(false);
    setIsWriteModalOpen(false);
    setAuthorName('');
    setReviewTitle('');
    setReviewComment('');
    setSelectedTags([]);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4500);
  };

  const filteredReviews = useMemo(() => {
    if (filterRating === 'all') return reviews;
    return reviews.filter((r) => Math.round(r.rating) === filterRating);
  }, [reviews, filterRating]);

  return (
    <div className="space-y-8 pt-2">
      {/* Toast feedback */}
      {showSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Thank you! Your verified review has been published and rewards 50 bonus JudesCoins.</span>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-emerald-700 hover:text-emerald-900 text-xs uppercase font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Header & Rating Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {/* Left: Score */}
        <div className="md:col-span-4 flex flex-col justify-center space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
          <span className="text-xs uppercase tracking-widest font-bold text-[#0066FF]">Verified Customer Score</span>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-sans font-extrabold text-[#0A192F]">{currentAvgRating.toFixed(1)}</span>
            <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
          </div>
          <RatingStars rating={currentAvgRating} size="md" />
          <p className="text-xs text-slate-500">
            Based on {reviews.length} authentic buyer feedback submissions
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-bold"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </Button>
          </div>
        </div>

        {/* Right: Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {distribution.map(({ stars, count, pct }) => (
            <button
              key={stars}
              onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
              className={`flex items-center gap-3 text-xs w-full group py-0.5 rounded-lg px-2 transition-colors ${
                filterRating === stars ? 'bg-blue-50 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1 w-12 shrink-0 font-medium text-slate-700">
                <span>{stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-slate-500 shrink-0">{pct}%</span>
              <span className="w-8 text-right text-slate-400 text-[11px] shrink-0">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
          {(['all', 5, 4, 3, 2, 1] as const).map((star) => (
            <button
              key={String(star)}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                filterRating === star
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {star === 'all' ? `All (${reviews.length})` : `${star} Stars`}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold">No reviews match the selected filter</p>
            <button
              onClick={() => setFilterRating('all')}
              className="mt-2 text-xs font-bold text-[#0066FF] hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const hasVoted = !!helpfulVotes[rev.id];
            const currentHelpful = rev.helpfulCount + (hasVoted ? 1 : 0);

            return (
              <div key={rev.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rev.rating} />
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>

                <div>
                  <h4 className="text-sm font-sans font-bold text-[#0A192F]">{rev.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.comment}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-700">{rev.author}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev.id)}
                    className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'text-[#0066FF] fill-[#0066FF]' : ''}`} />
                    <span>Helpful ({currentHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Write a Review Modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="Write a Customer Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Overall Rating
            </label>
            <RatingStars
              rating={newRating}
              interactive
              size="md"
              onRatingChange={(r) => setNewRating(r)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name / Nickname"
              placeholder="e.g. Julian M."
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
            <Input
              label="Review Headline"
              placeholder="e.g. Exceptional finish and build"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              required
            />
          </div>

          {/* Quick Highlight Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Key Highlights (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-[#0066FF] text-white border-[#0066FF]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Review Details
            </label>
            <textarea
              rows={3}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share honest feedback about durability, aesthetic, daily performance, or sizing..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
            />
          </div>

          {/* Recommendation Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-700">
              Would you recommend this product to other JudesCart shoppers?
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRecommend(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  recommend
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Yes 👍
              </button>
              <button
                type="button"
                onClick={() => setRecommend(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  !recommend
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                No 👎
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWriteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold"
            >
              Submit & Earn 50 Coins
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

