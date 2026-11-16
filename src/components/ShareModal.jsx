import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

export default function ShareModal({ isOpen = false, onClose }) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open && typeof dialog.showModal === 'function') {
        try {
          dialog.showModal();
        } catch {
          // Fallback handled safely
        }
      }
    } else if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="rocky-dialog p-4"
    >
      <div className="relative mx-auto w-full max-w-sm glass-panel p-6 rounded-3xl shadow-2xl border border-white/15 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Share Dialog"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 id="share-modal-title" className="text-lg font-extrabold text-white uppercase font-outfit">
          SHARE 3D EXPERIENCE
        </h3>
        <p className="text-xs text-zinc-300 mt-1 mb-5">
          Send this interactive 3D culinary showcase to friends and food lovers.
        </p>

        <div className="flex items-center gap-2 p-1.5 bg-black/50 border border-white/10 rounded-2xl mb-2">
          <label htmlFor="share-url-input" className="sr-only">
            Share URL
          </label>
          <input
            id="share-url-input"
            type="text"
            readOnly
            value={currentUrl}
            className="w-full bg-transparent px-3 text-xs text-zinc-200 outline-none select-all"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="cta-pill-button px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold text-white uppercase cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
