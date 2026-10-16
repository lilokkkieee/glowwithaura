import { useState, useEffect, useCallback } from 'react';
import { Loader2, Check, Trash2, Star, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminReview {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  products?: { name: string } | null;
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product_reviews')
      .select('id, product_id, user_name, rating, comment, status, created_at, products(name)')
      .order('created_at', { ascending: false });
    if (error) {
      setReviews([]);
    } else {
      setReviews((data as unknown as AdminReview[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews(); }, [fetchReviews]);

  const approve = async (id: string) => {
    setActingId(id);
    await supabase.from('product_reviews').update({ status: 'approved' }).eq('id', id);
    setActingId(null);
    fetchReviews();
  };

  const remove = async (id: string) => {
    setActingId(id);
    await supabase.from('product_reviews').delete().eq('id', id);
    setActingId(null);
    fetchReviews();
  };

  if (loading) {
    return <div className="p-12 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-gold-400" /></div>;
  }

  const pending = reviews.filter((r) => r.status === 'pending');
  const approved = reviews.filter((r) => r.status === 'approved');

  if (reviews.length === 0) {
    return <div className="p-12 text-center"><p className="text-cream-300/40 text-sm">No reviews yet.</p></div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-cream-100">
          Pending Reviews ({pending.length})
        </h2>
        <button onClick={fetchReviews} className="w-9 h-9 rounded-full hover:bg-forest-700 flex items-center justify-center transition-colors">
          <RefreshCw size={16} className="text-cream-300/60" />
        </button>
      </div>

      {pending.length === 0 && (
        <p className="text-cream-300/40 text-sm text-center py-6">No pending reviews.</p>
      )}

      {pending.map((r) => (
        <ReviewCard
          key={r.id}
          review={r}
          acting={actingId === r.id}
          onApprove={() => approve(r.id)}
          onDelete={() => remove(r.id)}
        />
      ))}

      {approved.length > 0 && (
        <>
          <h2 className="font-serif text-xl text-cream-100 pt-4">Approved Reviews ({approved.length})</h2>
          {approved.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              acting={actingId === r.id}
              onApprove={() => approve(r.id)}
              onDelete={() => remove(r.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  acting,
  onApprove,
  onDelete,
}: {
  review: AdminReview;
  acting: boolean;
  onApprove: () => void;
  onDelete: () => void;
}) {
  const productName = review.products?.name ?? review.product_id;
  return (
    <div className="p-4 rounded-xl bg-forest-700/50 border border-forest-600">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-cream-100 font-medium text-sm">{review.user_name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              review.status === 'approved' ? 'bg-green-500/15 text-green-400' : 'bg-gold-500/15 text-gold-400'
            }`}>{review.status}</span>
          </div>
          <p className="text-cream-300/50 text-xs mb-1">on {productName}</p>
          <div className="flex items-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} className={s <= review.rating ? 'fill-gold-400 text-gold-400' : 'text-beige-300'} />
            ))}
          </div>
          <p className="text-cream-300/80 text-sm">{review.comment}</p>
        </div>
        <span className="text-cream-300/40 text-xs shrink-0">
          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <div className="flex gap-2">
        {review.status !== 'approved' && (
          <button
            onClick={onApprove}
            disabled={acting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            {acting ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} /> Approve</>}
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={acting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 text-white text-xs font-medium hover:bg-red-500 transition-colors disabled:opacity-50"
        >
          {acting ? <Loader2 size={14} className="animate-spin" /> : <><Trash2 size={14} /> Delete</>}
        </button>
      </div>
    </div>
  );
}
