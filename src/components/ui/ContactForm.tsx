"use client";

import { ValidationError, useForm } from "@formspree/react";

import { brandScriptClassName } from "@/lib/brandFonts";

/** DM Sans (`--font-body` / Tailwind `font-sans`) for fields inside the card. */
const inputDmSansClassName = "font-sans text-base text-[var(--color-foreground)]";

/** Same as `SectionHeading` editorialDual eyebrow (e.g. “Contact” above “Let’s work together”). */
const contactSectionEyebrowClassName =
  "font-text-3 whitespace-nowrap text-[0.62rem] font-bold uppercase leading-none tracking-[0.28em] text-[var(--color-primary)] sm:text-[0.74rem] sm:tracking-[0.26em]";

/** Aligns titles with typed text / placeholder (`form-input` uses `px-4`). */
const contactLabelAlignClassName = "pl-4";

type ContactFormProps = {
  formId: string;
  /** Lighter layout when shown inside the contact modal. */
  variant?: "default" | "modal";
};

export function ContactForm({ formId, variant = "default" }: ContactFormProps) {
  const [state, handleSubmit] = useForm(formId);
  const isModal = variant === "modal";

  const formShell = isModal
    ? "flex flex-col gap-5"
    : "card-shell flex flex-col gap-4 p-5 sm:gap-5 sm:p-6";

  const labelClassName = isModal
    ? "flex flex-col gap-3 text-sm font-bold text-[var(--color-primary)]"
    : "flex flex-col gap-2";

  const inputClassName = isModal
    ? "form-input"
    : `form-input ${inputDmSansClassName}`;

  if (state.succeeded) {
    const successInner = (
      <div
        className={
          isModal ? "flex flex-col gap-3 pt-1" : "flex flex-col gap-3"
        }
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
          Message sent
        </p>
        <h3
          className={`${brandScriptClassName} text-3xl text-[var(--color-primary)] sm:text-4xl`}
        >
          Thank you
        </h3>
        <p
          className={`text-base leading-7 text-[var(--color-foreground-muted)] ${!isModal ? "font-sans" : ""}`}
        >
          Iris will get back to you as soon as possible.
        </p>
      </div>
    );

    if (isModal) return successInner;
    return <div className="card-shell p-5 sm:p-6">{successInner}</div>;
  }

  const textareaClassName = isModal
    ? "form-input resize-y min-h-40"
    : `form-input resize-y min-h-36 sm:min-h-44 ${inputDmSansClassName}`;

  const formInner = (
    <form onSubmit={handleSubmit} className={formShell}>
      <div
        className={
          isModal
            ? "grid gap-5 sm:grid-cols-2"
            : "grid gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4"
        }
      >
        <label className={labelClassName}>
          {isModal ? (
            "Name"
          ) : (
            <span
              className={`${contactSectionEyebrowClassName} ${contactLabelAlignClassName}`}
            >
              Name
            </span>
          )}
          <input
            className={inputClassName}
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
          />
          <ValidationError prefix="Name" field="name" errors={state.errors} />
        </label>

        <label className={labelClassName}>
          {isModal ? (
            "Email"
          ) : (
            <span
              className={`${contactSectionEyebrowClassName} ${contactLabelAlignClassName}`}
            >
              Email
            </span>
          )}
          <input
            className={inputClassName}
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </label>
      </div>

      <label className={labelClassName}>
        {isModal ? (
          "Message"
        ) : (
          <span
            className={`${contactSectionEyebrowClassName} ${contactLabelAlignClassName}`}
          >
            Message
          </span>
        )}
        <textarea
          className={textareaClassName}
          id="message"
          name="message"
          required
          placeholder="Tell Iris about your brand, campaign, or idea."
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
        />
      </label>

      <button
        type="submit"
        disabled={state.submitting}
        className="primary-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );

  return formInner;
}
