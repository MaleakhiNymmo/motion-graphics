import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { theme } from "../theme";

export const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Helper for typing text animation (kursor kedap-kedip)
  const typeText = (text: string, startFrame: number, speed: number = 2) => {
    if (frame < startFrame) return "";
    const charsToShow = Math.floor((frame - startFrame) / speed);
    const isTyping = charsToShow < text.length;
    const showCursor = frame % 15 < 7;
    return text.slice(0, charsToShow) + (isTyping && showCursor ? "|" : "");
  };

  const timerSpeedModifier = frame > 195 ? (frame - 195) * 50 : 1;
  const totalSeconds = Math.floor((frame * timerSpeedModifier) / fps);
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');

  // Animasi mask reveal teks pertama (frame 10 & 20)
  const revealLine1 = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.8 } });
  const revealLine2 = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 0.8 } });

  // Animasi masuk teks kedua (muncul di frame 180, detik ke-6)
  const revealLine3 = spring({ frame: frame - 180, fps, config: { damping: 14, mass: 0.8 } });
  const revealTimer = spring({ frame: frame - 180, fps, config: { damping: 14, mass: 0.8 } }); // Timer muncul bareng teks "Capek"

  // Efek sedot chip ke tengah (dimulai frame 270 / detik 9)
  const suckToCenter = spring({
    frame: frame - 270,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  // Animasi meledak/memanjang timer (dimulai frame 285)
  const explode = spring({
    frame: frame - 285,
    fps,
    config: { damping: 12, mass: 1.2, stiffness: 60 },
  });

  const highlightWidth = spring({
    frame: frame - 250, // Muncul sedikit sebelum chip tersedot
    fps,
    config: { damping: 15, mass: 0.5 },
  });

  const dataSources = [
    { name: "PostgreSQL", file: "postgresql-logo-svgrepo-com.svg", top: "15%", left: "10%", delay: 45, typingText: "SELECT * FROM orders", resultText: "12.480 rows", typingEnd: 100 },
    { name: "MongoDB", file: "MongoDB.svg", top: "20%", right: "10%", delay: 105, typingText: "db.users.find({})", resultText: "3,2K docs", typingEnd: 150 },
    { name: "Excel / CSV", file: "excel-document-svgrepo-com.svg", bottom: "20%", left: "12%", delay: 130, typingText: "laporan_final_v7_REVISI.xlsx", resultText: "laporan_final_v7_REVISI.xlsx", typingEnd: 200 },
    { name: "Analytics", file: "google-analytics-icon.svg", bottom: "15%", right: "12%", delay: 155, typingText: "", resultText: "", typingEnd: 250 }, // Di-handle khusus dengan angka interpolate
  ];

  // Meledak scale (pill membesar memenuhi layar)
  const timerScale = interpolate(explode, [0, 1], [1, 60]);
  const timerWidth = interpolate(explode, [0, 0.4], [100, 400], { extrapolateRight: "clamp" }); // Persen width

  return (
    <AbsoluteFill style={{ backgroundColor: theme.canvas, fontFamily: "sans-serif" }}>
      
      {/* HUD Elements */}
      <div style={{ position: "absolute", top: 40, left: 40, color: theme.inkMuted, fontSize: 20, fontFamily: "monospace", letterSpacing: 2 }}>
        01 &middot; MASALAH
      </div>
      <div style={{ position: "absolute", top: 40, right: 40, color: theme.inkMuted, fontSize: 20, fontFamily: "monospace" }}>
        {frame.toString().padStart(4, '0')} / 1500
      </div>

      {/* Center Content */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        
        {/* Kontainer Teks Pertama (0 - 6 detik / s.d frame 179) */}
        {frame < 180 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ overflow: "hidden", padding: "5px" }}>
              <h1 style={{ 
                fontSize: 72, 
                color: theme.ink, 
                margin: 0,
                lineHeight: 1.1,
                transform: `translateY(${(1 - revealLine1) * 100}%)`,
              }}>
                <span style={{ fontWeight: 900 }}>Report bulanan, </span>
                <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>datanya</span>
              </h1>
            </div>

            <div style={{ overflow: "hidden", padding: "5px" }}>
              <h1 style={{ 
                fontSize: 72, 
                color: theme.ink, 
                margin: 0,
                lineHeight: 1.1,
                transform: `translateY(${(1 - revealLine2) * 100}%)`,
              }}>
                <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>nyebar.</span>
              </h1>
            </div>
          </div>
        )}

        {/* Kontainer Teks Kedua (6 - 10 detik / mulai frame 180) */}
        {frame >= 180 && (
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            {/* Teks Capek (hilang transparan saat timer meledak) */}
            <div style={{ overflow: "hidden", padding: "10px", opacity: 1 - explode }}>
              <h2 style={{ 
                fontSize: 56, 
                fontWeight: 400,
                color: theme.ink, 
                margin: 0,
                transform: `translateY(${(1 - revealLine3) * 100}%)`,
                position: "relative",
                display: "inline-block"
              }}>
                Narik satu-satu?{" "}
                <span style={{ position: "relative", zIndex: 1, fontWeight: 500 }}>
                  Capek.
                  
                  {/* Stabilo Effect */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: "-5%",
                    height: "100%",
                    backgroundColor: theme.accent,
                    opacity: 0.6,
                    width: `${highlightWidth * 110}%`,
                    zIndex: -1,
                    transformOrigin: "left",
                    borderRadius: "4px"
                  }} />
                </span>
              </h2>
            </div>

            {/* Timer Pill yang akan memanjang lalu meledak */}
            <div style={{ marginTop: 16, padding: "20px", zIndex: 100 }}>
              <div style={{
                backgroundColor: theme.ink,
                color: theme.surface,
                padding: "16px 32px",
                borderRadius: 50,
                fontFamily: "monospace",
                fontSize: 40,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: explode > 0 ? `${timerWidth}%` : "auto", 
                transform: `translateY(${(1 - revealTimer) * 50}px) scale(${timerScale})`,
                opacity: explode > 0 ? 1 : interpolate(revealTimer, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                boxShadow: `0 10px 30px ${theme.ink}40`,
                whiteSpace: "nowrap"
              }}>
                <span style={{ 
                  color: frame > 195 ? theme.accent : theme.surface, 
                  textShadow: frame > 195 ? `0 0 10px ${theme.accent}` : "none",
                  opacity: 1 - (explode * 1.5) // Teks hilang lebih cepat
                }}>
                  {h}:{m}:{s}
                </span>
              </div>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* --- Data Source Chips --- */}
      {dataSources.map((source, index) => {
        const pop = spring({
          frame: frame - source.delay,
          fps,
          config: { damping: 12, mass: 0.8 },
        });

        // Getar kecil pas frame 195 (saat timer melonjak)
        const shake = frame > 195 && frame < 270 
          ? Math.sin((frame - 195) * 2) * 4
          : 0;

        const floatingY = interpolate(Math.sin((frame + index * 40) / 20), [-1, 1], [-10, 10]);

        // Hitung posisi suck to center
        const isBottom = source.bottom !== undefined;
        const isRight = source.right !== undefined;
        const translateY = suckToCenter > 0 ? interpolate(suckToCenter, [0, 1], [0, isBottom ? -350 : 350]) : floatingY + shake;
        const translateX = suckToCenter > 0 ? interpolate(suckToCenter, [0, 1], [0, isRight ? -350 : 350]) : shake;
        const scaleFinal = suckToCenter > 0 ? interpolate(suckToCenter, [0, 1], [pop, 0]) : pop;

        const isManualBlinking = frame > 195 ? (Math.floor(frame / 4) % 2 === 0) : true;
        const showResult = frame > source.typingEnd;

        // Custom Analytics counter
        let innerContent;
        if (source.name === "Analytics") {
          const sessions = Math.floor(interpolate(frame, [source.delay + 10, source.delay + 70], [0, 48210], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
          innerContent = <span>sessions: {sessions.toLocaleString()}</span>;
        } else {
          innerContent = showResult ? (
            <span style={{ color: theme.ink, fontWeight: "bold" }}>{source.resultText}</span>
          ) : (
            <span>{typeText(source.typingText, source.delay + 10)}</span>
          );
        }

        return (
          <div
            key={source.name}
            style={{
              position: "absolute",
              top: source.top,
              bottom: source.bottom,
              left: source.left,
              right: source.right,
              transform: `scale(${scaleFinal}) translate(${translateX}px, ${translateY}px)`,
              backgroundColor: theme.surface,
              padding: "20px 24px",
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minWidth: 280,
              boxShadow: `0 20px 40px ${theme.ink}15, 0 4px 12px ${theme.ink}05`,
              border: `1px solid ${theme.inkMuted}30`,
              zIndex: 5
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: 16,
                boxShadow: `0 4px 10px ${theme.ink}10`
              }}>
                <Img src={staticFile(`icons/${source.file}`)} style={{ width: 40, height: 40, objectFit: "contain" }} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: theme.ink }}>
                {source.name}
              </div>
            </div>

            <div style={{
              backgroundColor: theme.surfaceElevated,
              padding: "12px 16px",
              borderRadius: 12,
              fontFamily: "monospace",
              fontSize: 16,
              color: theme.inkSecondary,
              minHeight: 48,
              display: "flex",
              alignItems: "center",
              border: `1px solid ${theme.inkMuted}20`,
            }}>
              {innerContent}
            </div>

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "monospace",
              color: isManualBlinking ? theme.accent : "transparent",
              transition: "color 0.1s"
            }}>
              manual...
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
