import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const PhaseOne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Kursor bergerak masuk dari kanan bawah (frame 0 - 20)
  // spring membuat pergerakan tidak kaku, ada sedikit efek melambat di akhir
  const cursorProgress = spring({
    frame,
    fps,
    config: { damping: 14 },
  });
  
  // Memetakan nilai spring (0 ke 1) menjadi posisi X dan Y (400px ke 0px)
  const cursorX = interpolate(cursorProgress, [0, 1], [400, 0]);
  const cursorY = interpolate(cursorProgress, [0, 1], [400, 0]);

  // 2. Efek klik (kursor dan tombol mengecil sedikit) mulai di frame 20
  const clickProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  // 3. Efek morphing (tombol mengecil jadi lingkaran) mulai di frame 35
  const morphProgress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12 },
  });

  // Kalkulasi ukuran dan skala tombol
  // Skala: mulai dari 1 -> turun saat diklik (0.9) -> naik lagi ke 1 saat morphing
  const buttonScale = 1 - (clickProgress * 0.1) + (morphProgress * 0.1);
  
  // Lebar tombol: berubah dari 240px ke 80px (bentuk bulat)
  const buttonWidth = interpolate(morphProgress, [0, 1], [240, 80]);
  
  // Teks "Mulai" perlahan menghilang (opacity 1 ke 0) saat morphing dimulai
  const textOpacity = interpolate(morphProgress, [0, 0.5], [1, 0], {
    extrapolateRight: "clamp",
  });

  // 4. Efek menggambar centang (mulai setelah tombol jadi lingkaran, di frame 45)
  const checkProgress = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12 },
  });
  
  // strokeDashoffset untuk animasi menggambar SVG
  const checkStrokeDashoffset = interpolate(checkProgress, [0, 1], [100, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111",
        // Membuat efek grid tipis dengan linear-gradient CSS
        backgroundImage: `
          linear-gradient(to right, #222 1px, transparent 1px),
          linear-gradient(to bottom, #222 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Container utama tombol */}
      <div
        style={{
          width: buttonWidth,
          height: 80,
          backgroundColor: "#fff",
          borderRadius: 40, // Corner membulat setengah tinggi untuk bentuk pill/lingkaran
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${buttonScale})`,
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Teks Tombol */}
        <span
          style={{
            position: "absolute",
            opacity: textOpacity,
            fontSize: 28,
            fontWeight: "bold",
            color: "#111",
            fontFamily: "sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Mulai &rarr;
        </span>

        {/* Ikon Centang (SVG) */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            opacity: morphProgress, // Ikon baru muncul saat proses morphing
          }}
        >
          <path
            d="M20 6L9 17l-5-5"
            strokeDasharray="100"
            strokeDashoffset={checkStrokeDashoffset}
          />
        </svg>

        {/* Kursor Mouse (SVG), posisinya absolut relatif ke dalam tombol */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(${cursorX}px, ${cursorY}px) scale(${1 - clickProgress * 0.1})`, 
            zIndex: 10,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="white"
            stroke="black"
            strokeWidth="2"
            strokeLinejoin="round"
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
