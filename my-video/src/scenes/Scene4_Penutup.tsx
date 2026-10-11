import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, interpolateColors, Easing } from "remotion";
import { theme } from "../theme";
import { MousePointer2 } from "lucide-react";
import { LogoRemotion } from "../LogoRemotion";

export const Scene4_Penutup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Curtain Wipe Transition (runs from frame 0 to 30)
  const wipeProgress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  let curtainX = -102;
  if (wipeProgress <= 0.44) {
    curtainX = interpolate(wipeProgress, [0, 0.44], [-102, 0], { easing: Easing.bezier(0.65, 0.05, 0.36, 1) });
  } else if (wipeProgress <= 0.56) {
    curtainX = 0;
  } else {
    curtainX = interpolate(wipeProgress, [0.56, 1], [0, 102], { easing: Easing.bezier(0.65, 0.05, 0.36, 1) });
  }
  const isScene4Revealed = wipeProgress > 0.44;

  // 2. Timer Appearance & Countdown (04:00:00 -> 00:00:00)
  const revealTimer = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  
  const totalSeconds = Math.floor(
    interpolate(frame - 5, [0, 75], [14400, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
  );
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  
  const timerColor = interpolateColors(
    frame - 5, 
    [0, 75], 
    ["#EF4444", "#10B981"]
  );

  // 3. Text Headlines
  const revealDataRapi = spring({ frame: frame - 85, fps, config: { damping: 14 } });
  const revealBisnisHappy = spring({ frame: frame - 110, fps, config: { damping: 14 } });
  const highlightWidth = spring({ frame: frame - 135, fps, config: { damping: 15 } });

  // 4. Timer fades out -> Button text "Let's connect →"
  const timerFadeOut = interpolate(frame, [95, 115], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const connectFadeIn = interpolate(frame, [115, 135], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // 5. Cursor Movement & Click
  const cursorOpacity = frame > 150 
    ? interpolate(frame, [150, 160], [0, 1], { extrapolateRight: "clamp" }) * interpolate(frame, [198, 204], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : 0;
  const cursorX = interpolate(frame, [155, 192], [90, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.quad) });
  const cursorY = interpolate(frame, [155, 192], [130, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.out(Easing.quad) });
  const cursorClick = spring({ frame: frame - 195, fps, config: { damping: 15, stiffness: 220 } });
  const cursorScale = interpolate(cursorClick, [0, 0.5, 1], [1, 0.82, 1]);

  // 6. Post-click Transition: Text & Headings Fade Out
  const sceneElementsFade = interpolate(frame, [196, 204], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const buttonTextFade = interpolate(frame, [194, 200], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // 7. Button Expansion to Fill Fullscreen (Paper Surface)
  const clickDip = interpolate(cursorClick, [0, 0.5, 1], [1, 0.94, 1]);
  const expandProgress = interpolate(frame, [198, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });
  const pillScale = expandProgress > 0 ? interpolate(expandProgress, [0, 1], [1, 26]) : clickDip;
  const isFullyPaper = expandProgress >= 1;

  return (
    <AbsoluteFill style={{ backgroundColor: isScene4Revealed ? (isFullyPaper ? theme.surface : theme.ink) : "transparent", fontFamily: "sans-serif" }}>
      
      {/* Monolithic Curtain Wipe Slab (Entrance) */}
      {wipeProgress < 1 && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 9999,
          backgroundColor: theme.ink,
          transform: `translateX(${curtainX}%)`,
          boxShadow: "0 0 60px rgba(0,0,0,0.35)"
        }} />
      )}

      {isScene4Revealed && (
        <>
          {/* HUD Elements */}
          <div style={{ position: "absolute", top: 40, left: 40, color: theme.inkMuted, fontSize: 20, fontFamily: "monospace", letterSpacing: 2, opacity: sceneElementsFade }}>
            04 &middot; PENUTUP
          </div>
          <div style={{ position: "absolute", top: 40, right: 40, color: theme.inkMuted, fontSize: 20, fontFamily: "monospace", opacity: sceneElementsFade }}>
            {(frame + 1530).toString().padStart(4, '0')} / 1830
          </div>

          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
            
            {/* TOP TEXT: Data rapi */}
            <div style={{ overflow: "hidden", padding: "5px", opacity: sceneElementsFade }}>
              <h1 style={{ 
                fontSize: 84, 
                color: theme.surface, 
                margin: 0,
                fontWeight: 900,
                transform: `translateY(${(1 - revealDataRapi) * 100}%)`,
              }}>
                Data rapi,
              </h1>
            </div>

            {/* MIDDLE PILL (Timer -> Connect Button -> Fullscreen Expansion) */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              opacity: revealTimer,
              transform: `translateY(${interpolate(revealTimer, [0, 1], [30, 0])}px)`,
              zIndex: 20,
            }}>
              <span style={{ color: theme.inkMuted, fontSize: 18, fontWeight: 700, letterSpacing: 2, opacity: timerFadeOut * sceneElementsFade }}>
                WAKTU NARIK MANUAL
              </span>
              
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* The Pill Button */}
                <div style={{
                  backgroundColor: theme.surface,
                  padding: "16px 32px",
                  borderRadius: 50,
                  fontFamily: "monospace",
                  fontSize: 40,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: expandProgress > 0 ? "none" : "0 10px 30px rgba(0,0,0,0.5)",
                  minWidth: 280,
                  height: 80,
                  position: "relative",
                  overflow: "hidden",
                  transform: `scale(${pillScale})`,
                  transformOrigin: "center center",
                }}>
                  {/* Timer Display */}
                  <span style={{ 
                    color: timerColor,
                    textShadow: `0 0 15px ${timerColor}`,
                    opacity: timerFadeOut * buttonTextFade,
                    position: "absolute"
                  }}>
                    {h}:{m}:{s}
                  </span>
                  
                  {/* Connect Text */}
                  <span style={{
                    color: theme.ink,
                    fontSize: 24,
                    fontFamily: "sans-serif",
                    opacity: connectFadeIn * buttonTextFade,
                    position: "absolute",
                    whiteSpace: "nowrap"
                  }}>
                    Let's connect &rarr;
                  </span>
                </div>

                {/* Cursor Pointer */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px)) scale(${cursorScale})`,
                  opacity: cursorOpacity,
                  color: theme.surface,
                  zIndex: 30,
                  pointerEvents: "none"
                }}>
                  <MousePointer2 size={40} fill={theme.surface} stroke={theme.ink} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* BOTTOM TEXT: Bisnis happy */}
            <div style={{ overflow: "hidden", padding: "5px", opacity: sceneElementsFade }}>
              <h1 style={{ 
                fontSize: 84, 
                color: theme.surface, 
                margin: 0,
                fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400,
                transform: `translateY(${(1 - revealBisnisHappy) * -100}%)`,
                position: "relative"
              }}>
                bisnis happy.
                <span style={{
                  position: "absolute",
                  bottom: 10,
                  left: -10,
                  height: 35,
                  backgroundColor: `${theme.accent}60`,
                  width: `calc(${highlightWidth * 100}% + 20px)`,
                  zIndex: -1,
                  borderRadius: 4
                }} />
              </h1>
            </div>

          </AbsoluteFill>

          {/* 8. Logo Bumper (Appears seamlessly over the expanded paper surface from frame 218) */}
          {frame >= 218 && (
            <AbsoluteFill style={{
              justifyContent: "center",
              alignItems: "center",
              zIndex: 40,
              pointerEvents: "none",
            }}>
              <LogoRemotion
                theme="paper"
                size={300}
                startFrame={218}
              />
            </AbsoluteFill>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

