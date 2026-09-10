'use client';

import React, { useState } from 'react';
import { ProductReview } from '@/types/product';
import { RatingStars } from '@/components/ui/RatingStars';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { CheckCircle, ThumbsUp, MessageSquarePlus } from 'lucide-react';

interface ReviewSectionProps {
  productId: string;
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}

export function ReviewSection({ productId, reviews: initialReviews, rating, reviewCount }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const handleToggleHelpful = (id: string) => {
    setHelpfulVotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewTitle.trim() || !reviewComment.trim()) return;

    setIsSubmitting(true);
    const created = await api.addReview(productId, {
      author: authorName.trim(),
      rating: newRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verified: true,
    });

    setReviews((prev) => [created, ...prev]);
    setIsSubmitting(false);
    setIsWriteModalOpen(false);
    setAuthorName('');
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <div className="space-y-8 pt-2">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-blue-50/40 border border-blue-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-sans font-extrabold text-[#0A192F]">{rating.toFixed(1)}</span>
            <div>
              <RatingStars rating={rating} size="md" />
              <p className="text-xs text-slate-500 mt-0.5">Based on {reviews.length} verified buyer reviews</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-1.5 hover:border-[#0066FF] hover:text-[#0066FF] font-semibold"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-[#0066FF]" />
          <span>Write a Review</span>
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => {
          const hasVoted = !!helpfulVotes[rev.id];
          const currentHelpful = rev.helpfulCount + (hasVoted ? 1 : 0);

          return (
            <div key={rev.id} className="p-5 rounded-xl border border-slate-200/80 bg-white space-y-3">
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
                <span className="font-semibold text-slate-600">{rev.author}</span>
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
        })}
      </div>

      {/* Write a Review Modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="Review this JudesCart Product"
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

          <Input
            label="Your Name"
            placeholder="e.g. Julian M."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />

          <Input
            label="Review Headline"
            placeholder="e.g. Exceptional quality and performance"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Review Details
            </label>
            <textarea
              rows={4}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share details about durability, performance, fit, or daily experience..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
            />
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
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
