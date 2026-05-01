"use client";

import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { createPortal } from "react-dom";

import { ContactForm } from "@/components/ui/ContactForm";
import { brandScriptClassName } from "@/lib/brandFonts";

type ContactFormModalProps = {
  open: boolean;
  onClose: () => void;
  formId: string;
};

export function ContactFormModal({ open, onClose, formId }: ContactFormModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(45,32,28,0.55)] backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2
            id="contact-modal-title"
            className={`${brandScriptClassName} text-2xl text-[var(--color-primary)] sm:text-3xl`}
          >
            Send a message
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-primary)] transition hover:bg-[var(--color-surface-strong)]"
            aria-label="Close"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>
        <ContactForm formId={formId} variant="modal" />
      </div>
    </div>,
    document.body,
  );
}
