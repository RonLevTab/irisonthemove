"use client";

import { ValidationError, useForm } from "@formspree/react";

import { brandScriptClassName } from "@/lib/brandFonts";

/** DM Sans (`--font-body` / Tailwind `font-sans`) for fields inside the card. */
const inputDmSansClassName = "font-sans text-lg text-[var(--color-foreground)]";

/** Same as `SectionHeading` editorialDual eyebrow (e.g. “Contact” above the main headline). */
const contactSectionEyebrowClassName =
  "font-text-3 whitespace-nowrap text-[0.72rem] font-bold uppercase leading-none tracking-[0.28em] text-[var(--color-primary)] sm:text-[0.86rem] sm:tracking-[0.26em]";

const contactFieldComfortClassName =
  "px-5 py-4 sm:py-[1.125rem] lg:px-6 lg:py-5 rounded-[1.35rem]";

/** Centers eyebrow labels above fields (matches centered placeholder and input text). */
const contactLabelAlignClassName = "block w-full text-center";

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
    : "card-shell contact-form-card flex flex-col gap-5 p-6 sm:gap-6 sm:p-8 lg:p-10";

  const labelClassName = isModal
    ? "flex flex-col items-center gap-3 text-center text-sm font-bold text-[var(--color-primary)]"
    : "flex flex-col items-center gap-3 text-center";

  const inputClassName = isModal
    ? "form-input text-center"
    : `form-input text-center ${contactFieldComfortClassName} ${inputDmSansClassName}`;

  if (state.succeeded) {
    const successInner = (
      <div
        className={
          isModal ? "flex flex-col gap-3 pt-1" : "flex flex-col gap-3"
        }
      >
        <p
          className={`font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)] ${isModal ? "text-sm" : "text-base"}`}
        >
          Message sent
        </p>
        <h3
          className={`${brandScriptClassName} text-[var(--color-primary)] ${isModal ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"}`}
        >
          Thank you
        </h3>
        <p
          className={`leading-7 text-[var(--color-foreground-muted)] ${!isModal ? "font-sans text-lg leading-8" : "text-base"}`}
        >
          Iris will get back to you as soon as possible.
        </p>
      </div>
    );

    if (isModal) return successInner;
    return <div className="card-shell p-6 sm:p-8">{successInner}</div>;
  }

  const textareaClassName = isModal
    ? "form-input resize-y min-h-40 text-center"
    : `form-input resize-y min-h-44 pt-16 text-center sm:min-h-52 sm:pt-20 lg:min-h-60 lg:pt-24 ${contactFieldComfortClassName} ${inputDmSansClassName}`;

  const formInner = (
    <form onSubmit={handleSubmit} className={formShell}>
      <div
        className={
          isModal
            ? "grid gap-5 sm:grid-cols-2"
            : "grid gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5"
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
            placeholder="your name"
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
          placeholder={"Collab? New idea? Quick question?\nFeel free to reach out!"}
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
        className="primary-button w-full justify-center px-8 py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );

  return formInner;
}
