import { useState, useEffect, useRef } from "react";
import musicFile from "./assets/music.mp3";

const WEDDING_DATE = new Date("2026-08-15T17:00:00+05:00");
const MAPS_URL = "https://maps.app.goo.gl/nLptz5n145W995uT9";

/* ── Countdown hook ─────────────────────────────────────────── */
function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ── Audio hook (Web Audio API) ────────────────────────────── */
function useAudio() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return { playing, toggle };
}

/* ── Petal component ────────────────────────────────────────── */
function Petals() {
  const items = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${(i * 4.7 + 2) % 96}%`,
    dur: `${6 + ((i * 1.15) % 7)}s`,
    delay: `${(i * 0.55) % 10}s`,
    size: `${14 + ((i * 2) % 12)}px`,
    type: i % 4,
  }));
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {items.map(({ id, left, dur, delay, size, type }) => (
        <div
          key={id}
          className={`petal petal-${type % 2}`}
          style={{
            left,
            fontSize: size,
            animationDuration: dur,
            animationDelay: delay,
          }}
        >
          {type === 0 ? "🌸" : type === 1 ? "🌺" : type === 2 ? "🌼" : "✿"}
        </div>
      ))}
    </div>
  );
}

/* ── Ornamental divider ─────────────────────────────────────── */
function GoldDivider() {
  return (
    <svg
      width="340"
      height="36"
      viewBox="0 0 340 36"
      style={{ display: "block", margin: "0 auto" }}
    >
      <line
        x1="0"
        y1="18"
        x2="130"
        y2="18"
        stroke="#C9A84C"
        strokeWidth="0.7"
      />
      <path
        d="M130 18 L143 10 L156 18 L143 26 Z"
        fill="#C9A84C"
        fillOpacity="0.55"
      />
      <circle
        cx="170"
        cy="18"
        r="9"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.1"
      />
      <circle cx="170" cy="18" r="3.5" fill="#C9A84C" />
      <circle cx="158" cy="18" r="2.5" fill="#F4B8C8" />
      <circle cx="182" cy="18" r="2.5" fill="#F4B8C8" />
      <path
        d="M184 18 L197 10 L210 18 L197 26 Z"
        fill="#C9A84C"
        fillOpacity="0.55"
      />
      <line
        x1="210"
        y1="18"
        x2="340"
        y2="18"
        stroke="#C9A84C"
        strokeWidth="0.7"
      />
    </svg>
  );
}

/* ── Inline SVG corner rose ─────────────────────────────────── */
function CornerFlower({ flip, flipY }) {
  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 70 70"
      style={{
        position: "absolute",
        transform: `scaleX(${flip ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
        opacity: 0.55,
      }}
    >
      <circle
        cx="15"
        cy="15"
        r="8"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.8"
        strokeDasharray="3 5"
      />
      <circle cx="15" cy="15" r="2.5" fill="#C9A84C" />
      <ellipse
        cx="30"
        cy="12"
        rx="7"
        ry="12"
        fill="#F4B8C8"
        opacity="0.8"
        transform="rotate(20 30 12)"
      />
      <ellipse
        cx="12"
        cy="30"
        rx="7"
        ry="11"
        fill="#E8768E"
        opacity="0.6"
        transform="rotate(70 12 30)"
      />
      <ellipse
        cx="38"
        cy="26"
        rx="6"
        ry="10"
        fill="#F4B8C8"
        opacity="0.7"
        transform="rotate(40 38 26)"
      />
      <circle cx="28" cy="22" r="4" fill="#C9A84C" opacity="0.5" />
      <circle cx="22" cy="28" r="3" fill="#D4AF37" opacity="0.4" />
    </svg>
  );
}

/* ── Countdown box ──────────────────────────────────────────── */
function CountBox({ value, label }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      setTimeout(() => setFlash(false), 350);
    }
    prev.current = value;
  }, [value]);
  return (
    <div
      className="cbox"
      style={{
        background: flash ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.55)",
      }}
    >
      <div className="cnum">{String(value).padStart(2, "0")}</div>
      <div className="clbl">{label}</div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function WeddingInvitation() {
  const time = useCountdown(WEDDING_DATE);
  const { playing, toggle } = useAudio();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FBF0E8",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Global styles ─────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #FBF0E8; }

        /* ── Backgrounds ── */
        .bg-layer-1 {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 15% 10%, rgba(248,190,210,0.28) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 85% 90%, rgba(201,168,76,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 15%, rgba(232,118,142,0.10) 0%, transparent 55%),
            linear-gradient(175deg, #FBF0E8 0%, #FDF8F0 45%, #FBF0E8 100%);
        }

        /* ── Petals ── */
        @keyframes petalFall {
          0%   { transform: translateY(-60px) rotate(0deg)   translateX(0px);  opacity: 0; }
          8%   { opacity: 0.95; }
          48%  { transform: translateY(48vh) rotate(200deg) translateX(28px); }
          90%  { opacity: 0.75; }
          100% { transform: translateY(108vh) rotate(400deg) translateX(0px);  opacity: 0; }
        }
        @keyframes petalFall-1 {
          0%   { transform: translateY(-60px) rotate(30deg)   translateX(0px);  opacity: 0; }
          8%   { opacity: 0.9; }
          48%  { transform: translateY(48vh) rotate(220deg) translateX(-30px); }
          90%  { opacity: 0.65; }
          100% { transform: translateY(108vh) rotate(410deg) translateX(0px);  opacity: 0; }
        }
        .petal { position: fixed; top: -60px; pointer-events: none; z-index: 2; will-change: transform; }
        .petal-0 { animation: petalFall   linear infinite; }
        .petal-1 { animation: petalFall-1 linear infinite; }

        /* ── Section reveals ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; }
        .reveal.show { animation: fadeUp 1.1s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* ── Float names ── */
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-9px); }
        }
        .float-names { animation: floatY 5s ease-in-out infinite; }

        /* ── Gold shimmer ── */
        @keyframes shimmer {
          0%,100% { opacity: 0.65; }
          50%      { opacity: 1; }
        }
        .shimmer { animation: shimmer 3.5s ease-in-out infinite; }

        /* ── Countdown box ── */
        .cbox {
          min-width: 76px; padding: 14px 16px; border-radius: 14px;
          border: 1px solid rgba(201,168,76,0.35); text-align: center;
          backdrop-filter: blur(10px); transition: background 0.35s, transform 0.2s;
        }
        .cbox:hover { transform: translateY(-4px); }
        .cnum {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(30px,6vw,44px); font-weight: 300;
          color: #6B1E3E; line-height: 1;
        }
        .clbl {
          font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
          color: #9B6E86; margin-top: 5px;
        }

        /* ── Map button ── */
        .mapbtn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #6B1E3E 0%, #9B2B5A 100%);
          color: #FDF0E6; border: none; padding: 14px 38px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px; letter-spacing: 2.5px; cursor: pointer;
          border-radius: 60px; text-transform: uppercase;
          box-shadow: 0 6px 24px rgba(107,30,62,0.28);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .mapbtn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(107,30,62,0.38);
        }

        /* ── Audio button ── */
        .audiobtn {
          position: fixed; top: 18px; right: 18px; z-index: 100;
          width: 50px; height: 50px; border-radius: 50%;
          border: 1.5px solid rgba(201,168,76,0.55);
          background: rgba(253,246,236,0.88);
          backdrop-filter: blur(10px);
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; font-size: 20px;
          box-shadow: 0 3px 14px rgba(107,30,62,0.14);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .audiobtn:hover { transform: scale(1.12); box-shadow: 0 5px 20px rgba(107,30,62,0.22); }

        /* ── Venue card ── */
        .venue-card {
          background: rgba(255,255,255,0.58);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(201,168,76,0.32);
          border-radius: 22px;
          padding: 40px 32px;
          position: relative;
          box-shadow: 0 6px 40px rgba(107,30,62,0.07), 0 1px 0 rgba(255,255,255,0.8) inset;
        }

        /* ── Floral border top/bottom ── */
        .floral-border {
          display: flex; align-items: center; gap: 0;
          justify-content: center; overflow: hidden;
        }

        /* ── Section spacing ── */
        .section { margin-bottom: 40px; }
      `}</style>

      {/* ── Background layer ─────────────────────────────── */}
      <div className="bg-layer-1" />

      {/* ── SVG pattern overlay ───────────────────────────── */}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.07,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="floral"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="40"
              cy="40"
              r="12"
              fill="none"
              stroke="#8B1A4A"
              strokeWidth="0.6"
            />
            <circle
              cx="40"
              cy="40"
              r="5"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="0.5"
            />
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="80"
              stroke="#C9A84C"
              strokeWidth="0.3"
            />
            <line
              x1="0"
              y1="40"
              x2="80"
              y2="40"
              stroke="#C9A84C"
              strokeWidth="0.3"
            />
            <line
              x1="0"
              y1="0"
              x2="80"
              y2="80"
              stroke="#8B1A4A"
              strokeWidth="0.2"
            />
            <line
              x1="80"
              y1="0"
              x2="0"
              y2="80"
              stroke="#8B1A4A"
              strokeWidth="0.2"
            />
            <circle cx="0" cy="0" r="3" fill="#C9A84C" />
            <circle cx="80" cy="0" r="3" fill="#C9A84C" />
            <circle cx="0" cy="80" r="3" fill="#C9A84C" />
            <circle cx="80" cy="80" r="3" fill="#C9A84C" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#floral)" />
      </svg>

      {/* ── Falling petals ────────────────────────────────── */}
      <Petals />

      {/* ── Audio toggle ──────────────────────────────────── */}
      <button
        className="audiobtn"
        onClick={toggle}
        title={playing ? "Musiqa o'chirish" : "Musiqa yoqish"}
      >
        {playing ? "🔊" : "🔇"}
      </button>

      {/* ── Page content ──────────────────────────────────── */}
      <div
        style={{
          maxWidth: 660,
          margin: "0 auto",
          padding: "48px 20px 64px",
          position: "relative",
          zIndex: 3,
        }}
      >
        {/* ── Top ornament ──────────────────────────────── */}
        <div
          className={`reveal section ${visible ? "show" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.05s" }}
        >
          <svg width="240" height="44" viewBox="0 0 240 44">
            <line
              x1="0"
              y1="22"
              x2="85"
              y2="22"
              stroke="#C9A84C"
              strokeWidth="0.8"
            />
            <path
              d="M85 22 Q100 10 115 22 Q130 34 145 22"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1.1"
            />
            <line
              x1="145"
              y1="22"
              x2="240"
              y2="22"
              stroke="#C9A84C"
              strokeWidth="0.8"
            />
            <circle cx="115" cy="22" r="3.5" fill="#C9A84C" />
            <circle cx="98" cy="16" r="4" fill="#F4B8C8" opacity="0.8" />
            <circle cx="132" cy="28" r="4" fill="#F4B8C8" opacity="0.8" />
            <circle cx="85" cy="22" r="2" fill="#C9A84C" opacity="0.5" />
            <circle cx="145" cy="22" r="2" fill="#C9A84C" opacity="0.5" />
          </svg>
        </div>

        {/* ── Invitation tagline ────────────────────────── */}
        <div
          className={`reveal section ${visible ? "show" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.15s" }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#9B6E86",
              fontSize: 13,
              letterSpacing: "5px",
              textTransform: "uppercase",
            }}
          >
            Sizni to'yimizga taklif qilamiz
          </p>
        </div>

        {/* ── Couple names ─────────────────────────────── */}
        <div
          className={`reveal section float-names ${visible ? "show" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.3s" }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-block",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "clamp(60px, 14vw, 96px)",
                color: "#6B1E3E",
                lineHeight: 1.05,
                textShadow:
                  "0 3px 24px rgba(107,30,62,0.18), 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              Shoxjahon
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                margin: "6px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(to right, transparent, #C9A84C 80%)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: 44,
                  color: "#C9A84C",
                  lineHeight: 1,
                }}
                className="shimmer"
              >
                &amp;
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(to left, transparent, #C9A84C 80%)",
                }}
              />
            </div>

            <h1
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "clamp(60px, 14vw, 96px)",
                color: "#6B1E3E",
                lineHeight: 1.05,
                textShadow:
                  "0 3px 24px rgba(107,30,62,0.18), 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              Malika
            </h1>
          </div>
        </div>

        {/* ── Gold divider ──────────────────────────────── */}
        <div
          className={`reveal section ${visible ? "show" : ""}`}
          style={{ animationDelay: "0.5s" }}
        >
          <GoldDivider />
        </div>

        {/* ── Venue card ───────────────────────────────── */}
        <div
          className={`reveal section venue-card ${visible ? "show" : ""}`}
          style={{ animationDelay: "0.7s" }}
        >
          <CornerFlower style={{ top: 0, left: 0 }} />
          <CornerFlower flip style={{ top: 0, right: 0 }} />
          <CornerFlower flipY style={{ bottom: 0, left: 0 }} />
          <CornerFlower flip flipY style={{ bottom: 0, right: 0 }} />

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "#9B6E86",
                fontSize: 11,
                letterSpacing: "5px",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              ✦ Nikoh to'yi ✦
            </p>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(30px, 7vw, 46px)",
                fontWeight: 300,
                color: "#6B1E3E",
                letterSpacing: 2,
                marginBottom: 6,
              }}
            >
              15 Avgust 2026
            </div>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "#9B6E86",
                fontSize: 16,
                fontStyle: "italic",
                marginBottom: 24,
              }}
            >
              Shanba · Soat 17:00
            </p>

            <svg
              width="80"
              height="2"
              viewBox="0 0 80 2"
              style={{ display: "block", margin: "0 auto 24px" }}
            >
              <line
                x1="0"
                y1="1"
                x2="80"
                y2="1"
                stroke="#C9A84C"
                strokeWidth="1.2"
              />
            </svg>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(20px, 5vw, 28px)",
                  fontWeight: 600,
                  color: "#6B1E3E",
                  letterSpacing: 1,
                }}
              >
                "Suyun bobo" to'yxonasi
              </div>
            </div>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "#9B6E86",
                fontSize: 15,
                fontStyle: "italic",
              }}
            >
              Qashqadaryo viloyati, Koson tumani
            </p>
          </div>
        </div>

        {/* ── Countdown ────────────────────────────────── */}
        <div
          className={`reveal section ${visible ? "show" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.9s" }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#9B6E86",
              fontSize: 12,
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            To'yga qoldi
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <CountBox value={time.d} label="Kun" />
            <CountBox value={time.h} label="Soat" />
            <CountBox value={time.m} label="Daqiqa" />
            <CountBox value={time.s} label="Soniya" />
          </div>
        </div>

        {/* ── Map button ───────────────────────────────── */}
        <div
          className={`reveal section ${visible ? "show" : ""}`}
          style={{ textAlign: "center", animationDelay: "1.05s" }}
        >
          <button
            className="mapbtn"
            onClick={() => window.open(MAPS_URL, "_blank")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            Manzilni ko'rish
          </button>
        </div>

        {/* ── Bottom divider ────────────────────────────── */}
        <div
          className={`reveal section ${visible ? "show" : ""}`}
          style={{ animationDelay: "1.15s" }}
        >
          <GoldDivider />
        </div>

        {/* ── Footer message ────────────────────────────── */}
        <div
          className={`reveal ${visible ? "show" : ""}`}
          style={{ textAlign: "center", animationDelay: "1.25s" }}
        >
          <p
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(24px, 5vw, 34px)",
              color: "#C9A84C",
              marginBottom: 12,
            }}
          >
            Sizni ko'rishdan xursand bo'lamiz
          </p>
          <svg width="160" height="28" viewBox="0 0 160 28">
            <line
              x1="0"
              y1="14"
              x2="55"
              y2="14"
              stroke="#C9A84C"
              strokeWidth="0.7"
            />
            <path d="M60 14 l6-6 l6 6 l-6 6 Z" fill="#F4B8C8" opacity="0.7" />
            <circle cx="80" cy="14" r="5" fill="#E8768E" opacity="0.65" />
            <path d="M94 14 l6-6 l6 6 l-6 6 Z" fill="#F4B8C8" opacity="0.7" />
            <line
              x1="105"
              y1="14"
              x2="160"
              y2="14"
              stroke="#C9A84C"
              strokeWidth="0.7"
            />
          </svg>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#9B6E86",
              fontSize: 13,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            Shoxjahon &amp; Malika · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
