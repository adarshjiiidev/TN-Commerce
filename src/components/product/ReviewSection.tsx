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
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-gray-600 group-hover:text-yellow-400/50"
              )}
            />
          </button>
        ))}
        <span className="ml-3 text-sm font-medium text-gray-300 self-center">
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
              size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5',
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
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
    <div className="space-y-12">
      {/* Rating Summary */}
      <div className="glass-card rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-2xl font-bold text-white font-heading">Student Reviews</h3>
            <div className="flex items-end justify-center md:justify-start gap-4">
              <span className="text-6xl font-bold text-white leading-none">{averageRating.toFixed(1)}</span>
              <div className="space-y-1 pb-1">
                {renderStars(Math.round(averageRating), 'md')}
                <p className="text-gray-400 text-sm">
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {getRatingDistribution().map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4 group">
                <span className="text-sm font-medium text-gray-400 w-8">{rating}★</span>
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap",
                filterRating === null
                  ? "bg-white text-black font-medium"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              )}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap",
                  filterRating === rating
                    ? "bg-white text-black font-medium"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
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
          className="bg-[#0d0d12] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating-high">Highest Rated</option>
          <option value="rating-low">Lowest Rated</option>
        </select>
      </div>

      {/* Add Review Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white font-heading">Reviews</h3>
          {session ? (
            userHasReviewed ? (
              <div className="text-right">
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                  You've reviewed this product
                </Badge>
              </div>
            ) : (
              !showAddReview ? (
                <Button
                  onClick={() => setShowAddReview(true)}
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddReview(false)
                    setReviewFormData({ rating: 0, comment: '', images: [] })
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )
            )
          ) : (
            <Button variant="outline" className="opacity-50 cursor-not-allowed">
              Sign in to review
            </Button>
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
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      How would you rate this product?
                    </label>
                    {renderRatingSelector()}
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-3">
                      Share your thoughts
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={reviewFormData.comment}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                      placeholder="What did you like or dislike? How was the quality?"
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                      required
                    />
                    <div className="flex justify-between mt-2">
                      <p className={cn("text-xs", reviewFormData.comment.length < 10 ? "text-yellow-500" : "text-green-500")}>
                        {reviewFormData.comment.length < 10
                          ? `Minimum 10 characters needed (${reviewFormData.comment.length}/10)`
                          : "Lookin' good!"}
                      </p>
                      <p className="text-xs text-gray-500">{reviewFormData.comment.length}/500</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={submittingReview || reviewFormData.rating === 0 || reviewFormData.comment.trim().length < 10}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
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
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5 border-dashed">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {filterRating
                  ? `No ${filterRating}-star reviews found`
                  : 'No reviews yet'
                }
              </p>
              <p className="text-gray-600 text-sm mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            sortedAndFilteredReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {review.user?.image ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                        <Image
                          src={review.user.image}
                          alt={review.user.name || 'User'}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/10 shadow-glow">
                        {(review.userName || review.user?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white text-lg">
                            {review.userName || review.user?.name || 'Anonymous'}
                          </h4>
                          {review.isVerified && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 text-[10px] px-2 h-5">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          {renderStars(review.rating)}
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
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
                          "flex items-center gap-1.5 h-8 rounded-full transition-all",
                          review.helpfulVotes?.includes(session?.user?.id || '')
                            ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
                            : "text-gray-500 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <ThumbsUp className={cn("h-3.5 w-3.5", review.helpfulVotes?.includes(session?.user?.id || '') && "fill-current")} />
                        <span className="text-xs font-medium">
                          {votingReviews.has(review._id) ? '...' : (review.helpfulCount || 0)}
                        </span>
                      </Button>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {review.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group cursor-zoom-in">
                            <Image
                              src={image}
                              alt={`Review ${imgIndex + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
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
          <div className="text-center pt-8">
            <Button
              variant="outline"
              onClick={loadMoreReviews}
              disabled={loading}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8 rounded-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : 'Load More Reviews'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
