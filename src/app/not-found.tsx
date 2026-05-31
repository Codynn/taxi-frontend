"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLottie() {
      try {
        const lottie = (await import("lottie-web")).default;
        if (cancelled || !containerRef.current) return;

        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/animations/404.json",
        });
      } catch (e) {
        console.error("Lottie failed to load", e);
      }
    }

    loadLottie();
    return () => {
      cancelled = true;
      animRef.current?.destroy();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nf-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
        }

        /* ── Background blobs ── */
        .nf-bg-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .nf-bg-blob-1 {
          width: 640px; height: 640px;
          background: radial-gradient(circle, rgba(254,168,0,0.12) 0%, transparent 70%);
          top: -200px; left: -200px;
        }
        .nf-bg-blob-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(254,168,0,0.08) 0%, transparent 70%);
          bottom: -160px; right: -160px;
        }
        .nf-bg-blob-3 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(254,168,0,0.06) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }

       
        /* ── Card ── */
        .nf-card {
          position: relative;
          z-index: 1;
          background: #ffffff;
          border: 1px solid rgba(254,168,0,0.2);
          border-radius: 28px;
          padding: 3rem 2.5rem 2.5rem;
          max-width: 560px;
          width: 100%;
          box-shadow:
            0 2px 4px rgba(254,168,0,0.05),
            0 16px 56px rgba(254,168,0,0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* top amber bar */
        .nf-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 72px; height: 4px;
          background: linear-gradient(90deg, #FEA800, #ffc94d);
          border-radius: 0 0 6px 6px;
        }

        /* ── Lottie ── */
        .nf-lottie {
          width: 100%;
          max-width: 440px;
          aspect-ratio: 1280 / 800;
          margin-bottom: 0.25rem;
        }

        /* ── Text ── */
        .nf-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FEA800;
          background: rgba(254,168,0,0.08);
          border: 1px solid rgba(254,168,0,0.2);
          border-radius: 999px;
          padding: 0.28rem 0.8rem;
          margin-bottom: 1rem;
          animation: fadeUp 0.5s 0.3s ease both;
        }

        .nf-heading {
          font-size: clamp(1.6rem, 4vw, 2.1rem);
          font-weight: 800;
          color: #1a1100;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 0.75rem;
          animation: fadeUp 0.5s 0.4s ease both;
        }

        .nf-desc {
          font-size: 0.9rem;
          font-weight: 300;
          color: #7a6a3a;
          text-align: center;
          line-height: 1.75;
          max-width: 360px;
          margin-bottom: 2rem;
          animation: fadeUp 0.5s 0.5s ease both;
        }

        /* ── Buttons ── */
        .nf-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.5s 0.6s ease both;
        }

        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.65rem 1.4rem;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
          border: none;
        }
        .nf-btn:active { transform: scale(0.97) !important; }

        .nf-btn-primary {
          background: #FEA800;
          color: #1a1100;
          box-shadow: 0 4px 20px rgba(254,168,0,0.35);
        }
        .nf-btn-primary:hover {
          background: #ffb820;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(254,168,0,0.5);
        }

        .nf-btn-ghost {
          background: transparent;
          color: #8a6600;
          border: 1.5px solid rgba(254,168,0,0.3);
        }
        .nf-btn-ghost:hover {
          border-color: rgba(254,168,0,0.6);
          background: rgba(254,168,0,0.06);
          transform: translateY(-2px);
        }

        /* ── Divider ── */
        .nf-divider {
          width: 100%;
          height: 1px;
          background: rgba(254,168,0,0.12);
          margin: 1.75rem 0 1.5rem;
        }

        /* ── Footer ── */
        .nf-footer {
          font-size: 0.75rem;
          color: #bba060;
          font-weight: 400;
          text-align: center;
          animation: fadeUp 0.5s 0.7s ease both;
        }
        .nf-footer a {
          color: #cc8800;
          text-decoration: none;
          font-weight: 500;
        }
        .nf-footer a:hover { text-decoration: underline; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .nf-card { padding: 2rem 1.25rem 1.75rem; border-radius: 20px; }
          .nf-ring { display: none; }
        }
      `}</style>

      <div className="nf-root">
        {/* Background */}
        <div className="nf-bg-blob nf-bg-blob-1" />
        <div className="nf-bg-blob nf-bg-blob-2" />
        <div className="nf-bg-blob nf-bg-blob-3" />
        <div className="nf-ring nf-ring-1" />
        <div className="nf-ring nf-ring-2" />
        <div className="nf-dot nf-dot-tl" />
        <div className="nf-dot nf-dot-tr" />
        <div className="nf-dot nf-dot-bl" />
        <div className="nf-dot nf-dot-br" />

        {/* Card */}
        <div className="nf-card">
          {/* Lottie */}
          <div className="nf-lottie" ref={containerRef} />

          {/* Badge */}
          {/* <span className="nf-eyebrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            Error 404
          </span> */}

          <h1 className="nf-heading">Page not found</h1>
          <p className="nf-desc">
            The page you're looking for doesn't exist or has been moved. Check
            the URL or navigate back to a safe place.
          </p>

          <div className="nf-actions">
            <Link href="/" className="nf-btn nf-btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
