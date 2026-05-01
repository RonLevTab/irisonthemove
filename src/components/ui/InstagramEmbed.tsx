"use client";

import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

type InstagramEmbedProps = {
  postUrl: string;
};

let embedScriptPromise: Promise<void> | null = null;

function normalizePostUrl(postUrl: string) {
  const trimmedUrl = postUrl.trim().replace(/\/+$/, "");
  return `${trimmedUrl}/`;
}

function loadInstagramScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.instgrm?.Embeds) {
    return Promise.resolve();
  }

  if (embedScriptPromise) {
    return embedScriptPromise;
  }

  embedScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      "instagram-embed-script",
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Instagram embed script failed to load.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Instagram embed script failed to load."));

    document.body.appendChild(script);
  });

  return embedScriptPromise;
}

export function InstagramEmbed({ postUrl }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const normalizedPostUrl = useMemo(() => normalizePostUrl(postUrl), [postUrl]);

  useEffect(() => {
    let isCancelled = false;

    async function processEmbed() {
      try {
        await loadInstagramScript();

        if (isCancelled) {
          return;
        }

        window.instgrm?.Embeds?.process();
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
        }
      }
    }

    processEmbed();

    return () => {
      isCancelled = true;
    };
  }, [normalizedPostUrl]);

  return (
    <div className="card-shell overflow-hidden bg-white p-4">
      <div ref={containerRef}>
        <blockquote
          key={normalizedPostUrl}
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={`${normalizedPostUrl}?utm_source=ig_embed&amp;utm_campaign=loading`}
          data-instgrm-version="14"
          style={{
            background: "#FFFFFF",
            border: 0,
            borderRadius: "24px",
            boxShadow: "0 0 1px 0 rgba(0,0,0,0.2),0 18px 40px 0 rgba(49,27,27,0.08)",
            margin: "0 auto",
            maxWidth: "540px",
            minWidth: "326px",
            padding: 0,
            width: "100%",
          }}
        >
          <div style={{ padding: "16px" }}>
            <a
              href={`${normalizedPostUrl}?utm_source=ig_embed&amp;utm_campaign=loading`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#FFFFFF",
                lineHeight: 0,
                padding: 0,
                textAlign: "center",
                textDecoration: "none",
                width: "100%",
              }}
            >
              <div style={{ padding: "19% 0" }} />
              <div
                style={{
                  color: "#3897f0",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 550,
                  lineHeight: "18px",
                }}
              >
                View this post on Instagram
              </div>
            </a>
          </div>
        </blockquote>
      </div>
    </div>
  );
}
