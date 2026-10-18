'use client';

import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 20, readOnly = false }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(n)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          aria-label={`${n} stars`}
        >
          <Star
            size={size}
            className={n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
          }
