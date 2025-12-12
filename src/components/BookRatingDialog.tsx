import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useAddBookReview, useUpdateBookReview, useMyBookReview } from '@/hooks/useBookReviews';

interface BookRatingDialogProps {
  bookId: string;
  bookTitle: string;
  trigger?: React.ReactNode;
}

export function BookRatingDialog({ bookId, bookTitle, trigger }: BookRatingDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const { data: existingReview } = useMyBookReview(bookId);
  const addReview = useAddBookReview();
  const updateReview = useUpdateBookReview();

  const handleSubmit = async () => {
    if (rating === 0) return;

    if (existingReview) {
      await updateReview.mutateAsync({
        id: existingReview.id,
        rating,
        review_text: reviewText || null,
      });
    } else {
      await addReview.mutateAsync({
        book_id: bookId,
        rating,
        review_text: reviewText || undefined,
      });
    }
    setOpen(false);
    setRating(0);
    setReviewText('');
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review_text || '');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Rate Book</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{existingReview ? 'Update Review' : 'Rate & Review'}</DialogTitle>
          <DialogDescription>
            Share your thoughts about "{bookTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review (Optional)</label>
            <Textarea
              placeholder="Share your experience with this book..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0 || addReview.isPending || updateReview.isPending}
          >
            {existingReview ? 'Update' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}