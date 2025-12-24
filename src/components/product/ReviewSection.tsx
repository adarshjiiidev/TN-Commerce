"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, User, Plus, Upload, X, MessageSquare, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Review } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
  reviews: Review[]
  productId: string
  averageRating: number
  totalReviews: number
}

export default function ReviewSection({
  reviews,
  productId,
  averageRating,
  totalReviews
}: ReviewSectionProps) {
  const { data: session } = useSession()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showAddReview, setShowAddReview] = useState(false)
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    comment: '',
    images: [] as string[]
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [votingReviews, setVotingReviews] = useState<Set<string>>(new Set())
  const [allReviews, setAllReviews] = useState<Review[]>(reviews)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [userHasReviewed, setUserHasReviewed] = useState(false)

  // Initialize state with props
  useEffect(() => {
    setAllReviews(reviews)
    setHasMore(reviews.length >= 5)
  }, [reviews])

  // Check if current user has already reviewed this product
  useEffect(() => {
    if (session?.user?.id) {
      const userReview = allReviews.find(
        review => review.userId === session.user.id
      )
      setUserHasReviewed(!!userReview)
    } else {
      setUserHasReviewed(false)
    }
  }, [session, allReviews])

  const loadMoreReviews = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = currentPage + 1
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${nextPage}&limit=5&sort=${sortBy}${filterRating ? `&rating=${filterRating}` : ''}`
      )

      if (!response.ok) {
        throw new Error('Failed to load more reviews')
      }

      const data = await response.json()
      if (data.success && data.data.reviews) {
        setAllReviews(prev => [...prev, ...data.data.reviews])
        setCurrentPage(nextPage)
        setHasMore(data.data.pagination.totalPages > nextPage)
      }
    } catch (error) {
      console.error('Error loading more reviews:', error)
      toast.error('Failed to load more reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleHelpfulVote = async (reviewId: string) => {
    if (!session) {
      toast.error('Please sign in to vote on reviews')
      return
    }

    if (votingReviews.has(reviewId)) {
      return // Already voting on this review
    }

    setVotingReviews(prev => new Set(prev.add(reviewId)))

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to vote on review')
      }

      const result = await response.json()
      toast.success(result.data.message)

      // Ideally update locally instead of reload, keeping reload for now as per previous logic
      window.location.reload()
    } catch (error) {
      console.error('Error voting on review:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to vote on review')
    } finally {
      setVotingReviews(prev => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast.error('Please sign in to leave a review')
      return
    }

    if (reviewFormData.rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (reviewFormData.comment.trim().length < 10) {
      toast.error('Please write at least 10 characters in your review')
      return
    }

    setSubmittingReview(true)
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewFormData.rating,
          comment: reviewFormData.comment.trim()
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (response.status === 409) {
          setUserHasReviewed(true)
          setShowAddReview(false)
          toast.error('You have already reviewed this product.')
          return
        }
        throw new Error(error.error || error.message || 'Failed to submit review')
      }

      toast.success('Review submitted successfully!')
      setReviewFormData({ rating: 0, comment: '', images: [] })
      setShowAddReview(false)
      window.location.reload()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const renderRatingSelector = () => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
            className="group relative"
          >
            <Star
              className={cn(
                "h-8 w-8 transition-all duration-200",
                star <= reviewFormData.rating
                  ? "fill-black text-black scale-110"
                  : "text-gray-200 group-hover:text-black/50"
              )}
            />
          </button>
        ))}
        <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-black self-center">
          {reviewFormData.rating > 0 && (
            reviewFormData.rating === 1 ? 'Poor' :
              reviewFormData.rating === 2 ? 'Fair' :
                reviewFormData.rating === 3 ? 'Good' :
                  reviewFormData.rating === 4 ? 'Very Good' : 'Excellent'
          )}
        </span>
      </div>
    )
  }

  const sortedAndFilteredReviews = allReviews
    .filter(review => filterRating ? review.rating === filterRating : true)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        default:
          return 0
      }
    })

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
              star <= rating
                ? "fill-black text-black"
                : "text-gray-200"
            )}
          />
        ))}
      </div>
    )
  }

  const getRatingDistribution = () => {
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length,
      percentage: totalReviews > 0 ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 : 0
    }))
    return distribution.reverse()
  }

  return (
    <div className="space-y-16">
      {/* Rating Summary */}
      <div className="bg-gray-50 p-10 border border-black/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic">Ratings</h3>
            <div className="flex items-end justify-center md:justify-start gap-4">
              <span className="text-7xl font-black text-black leading-none tracking-tighter italic">{averageRating.toFixed(1)}</span>
              <div className="space-y-2 pb-1">
                {renderStars(Math.round(averageRating), 'md')}
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  {totalReviews} Verfied Reviews
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {getRatingDistribution().map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4 group">
                <span className="text-[10px] font-black text-black w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-black h-full"
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-y border-black/5 py-8">
        <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto pb-4 sm:pb-0">
          <div className="flex items-center gap-2 text-black">
            <Filter className="h-3 w-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterRating(null)}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                filterRating === null
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-400 hover:text-black"
              )}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={cn(
                  "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                  filterRating === rating
                    ? "bg-black text-white"
                    : "bg-gray-50 text-gray-400 hover:text-black"
                )}
              >
                {rating}★
              </button>
            ))}
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-gray-50 border border-black/5 text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none cursor-pointer h-10"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating-high">Highest Rated</option>
          <option value="rating-low">Lowest Rated</option>
        </select>
      </div>

      {/* Add Review Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black text-black uppercase tracking-tighter italic">Feed</h3>
          {session ? (
            userHasReviewed ? (
              <div className="text-right">
                <Badge className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-black/5 rounded-none px-4 py-2">
                  Already Reviewed
                </Badge>
              </div>
            ) : (
              !showAddReview ? (
                <Button
                  onClick={() => setShowAddReview(true)}
                  className="bg-black text-white hover:bg-gray-900 rounded-none h-12 px-8 font-black uppercase tracking-widest text-[10px]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddReview(false)
                    setReviewFormData({ rating: 0, comment: '', images: [] })
                  }}
                  className="text-gray-400 hover:text-black font-black uppercase tracking-widest text-[10px]"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )
            )
          ) : (
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Sign in to contribute
            </div>
          )}
        </div>

        <AnimatePresence>
          {session && showAddReview && !userHasReviewed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-gray-50 border border-black/5 p-8">
                <form onSubmit={handleSubmitReview} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      Overall Rating
                    </label>
                    {renderRatingSelector()}
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      Write your opinion
                    </label>
                    <textarea
                      id="comment"
                      rows={5}
                      value={reviewFormData.comment}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                      placeholder="Was the fit perfect? Quality? Let others know."
                      className="w-full px-5 py-4 bg-white border border-black/5 text-black placeholder-gray-400 rounded-none focus:outline-none focus:border-black/20 resize-none transition-all text-sm font-medium"
                      required
                    />
                    <div className="flex justify-between mt-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {reviewFormData.comment.length < 10
                          ? `NEED ${10 - reviewFormData.comment.length} MORE CHARS`
                          : "PERFECT LENGTH"}
                      </p>
                      <p className="text-[10px] font-black text-gray-300">{reviewFormData.comment.length}/500</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={submittingReview || reviewFormData.rating === 0 || reviewFormData.comment.trim().length < 10}
                      className="bg-black text-white hover:bg-gray-900 rounded-none h-14 px-12 font-black uppercase tracking-widest text-[10px]"
                    >
                      {submittingReview ? 'SENDING...' : 'PUBLISH REVIEW'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-4">
          {sortedAndFilteredReviews.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 border border-black/5 border-dashed">
              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                {filterRating
                  ? `No ${filterRating}-star reviews found`
                  : 'Be the first to review'
                }
              </p>
            </div>
          ) : (
            sortedAndFilteredReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="py-10 border-b border-black/5 last:border-0"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {review.user?.image ? (
                      <div className="w-14 h-14 rounded-none overflow-hidden border border-black/5">
                        <Image
                          src={review.user.image}
                          alt={review.user.name || 'User'}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-gray-50 border border-black/5 flex items-center justify-center text-black font-black text-xl italic uppercase">
                        {(review.userName || review.user?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-black text-black text-xl uppercase tracking-tighter italic">
                            {review.userName || review.user?.name || 'Anonymous User'}
                          </h4>
                          {review.isVerified && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 border border-black/5">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                          {renderStars(review.rating)}
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulVote(review._id)}
                        disabled={votingReviews.has(review._id) || review.userId === session?.user?.id}
                        className={cn(
                          "flex items-center gap-2 h-10 px-4 transition-all rounded-none border border-transparent",
                          review.helpfulVotes?.includes(session?.user?.id || '')
                            ? "bg-black text-white"
                            : "text-gray-400 hover:text-black hover:border-black/10"
                        )}
                      >
                        <ThumbsUp className={cn("h-3.5 w-3.5", review.helpfulVotes?.includes(session?.user?.id || '') && "fill-current")} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Helpful ({review.helpfulCount || 0})
                        </span>
                      </Button>
                    </div>

                    <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-2xl">
                      {review.comment}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-3 mt-6">
                        {review.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative w-24 h-24 flex-shrink-0 border border-black/5 group cursor-zoom-in">
                            <Image
                              src={image}
                              alt={`Review ${imgIndex + 1}`}
                              fill
                              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {hasMore && sortedAndFilteredReviews.length >= 5 && (
          <div className="text-center pt-16">
            <Button
              variant="outline"
              onClick={loadMoreReviews}
              disabled={loading}
              className="bg-black text-white hover:bg-gray-900 px-12 h-14 rounded-none font-black uppercase tracking-widest text-[10px]"
            >
              {loading ? 'LOADING...' : 'SHOW MORE REVIEWS'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
