import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile, interpolateColors } from "remotion";
import { Check, Loader2, Clock } from "lucide-react";
import { theme } from "../theme";

export const Scene2_Solusi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TIMING STAGE (900 frame total)
  const START_E = 60;
  const START_T = 300;
  const START_L = 550;
  const START_AIRFLOW = 815;

  // --- CAMERA & PANNING LOGIC ---
  const START_INTRO = 0;
  const revealETL = spring({ frame: frame - START_INTRO, fps, config: { damping: 14, mass: 0.8 } });
  
  // Konfigurasi pergerakan kamera & ekspansi yang jauh lebih smooth dan lambat
  const smoothConfig = { damping: 18, mass: 2.5, stiffness: 45 };
  
  const introToE = spring({ frame: frame - START_E, fps, config: smoothConfig });
  const eToT = spring({ frame: frame - START_T, fps, config: smoothConfig });
  const tToL = spring({ frame: frame - START_L, fps, config: smoothConfig });

  // Lebar huruf dan spasi
  const CHAR_W = 100;
  // GAP membesar dari 20px saat kumpul jadi 800px saat mencar biar luas!
  const GAP = interpolate(introToE, [0, 1], [20, 800]); 

  const expandE = interpolate(introToE, [0, 1], [0, 220]);
  const expandT = interpolate(eToT, [0, 1], [0, 300]);
  const expandL = interpolate(tToL, [0, 1], [0, 140]);

  // Dynamic Widths
  const wE = CHAR_W + expandE;
  const wT = CHAR_W + expandT;
  const wL = CHAR_W + expandL;

  // Exact Centers of each block dynamically
  const targetIntro = (wE + GAP + wT + GAP + wL) / 2;
  const targetE = wE / 2;
  const targetT = wE + GAP + (wT / 2);
  const targetL = wE + GAP + wT + GAP + (wL / 2);

  // Focus State (0 = Intro, 1 = E, 2 = T, 3 = L)
  const focusState = introToE + eToT + tToL;
  
  // Calculate Camera X to follow the target perfectly
  let camX = targetIntro;
  if (focusState <= 1) {
      camX = interpolate(focusState, [0, 1], [targetIntro, targetE]);
  } else if (focusState <= 2) {
      camX = interpolate(focusState, [1, 2], [targetE, targetT]);
  } else {
      camX = interpolate(focusState, [2, 3], [targetT, targetL]);
  }

  // Header Y position (starts at center 45%, moves to top 25% biar ngga ketinggian)
  const headerTop = interpolate(introToE, [0, 1], [45, 25]);

  // Opacities - User requested all to be same color (no dimming)
  const opacityE = 1;
  const opacityT = 1;
  const opacityL = 1;

  // Extract Visual Coordinates (relative to targetE)
  const iconY = 500;
  const centralBoxY = 770;
  const dataSources = [
    { name: "PostgreSQL", file: "postgresql-logo-svgrepo-com.svg", offsetX: -180 },
    { name: "MongoDB", file: "MongoDB.svg", offsetX: -60 },
    { name: "Excel", file: "excel-document-svgrepo-com.svg", offsetX: 60 },
    { name: "Analytics", file: "google-analytics-icon.svg", offsetX: 180 },
  ];

  // Transform Visual Logic
  const fT = frame - START_T;
  const dupHighlight = spring({ frame: fT - 60, fps, config: { damping: 14 } });
  const dupDelete = spring({ frame: fT - 100, fps, config: { damping: 14 } });
  const scanSweep = spring({ frame: fT - 140, fps, config: { damping: 14, mass: 1.5 } });
  const scanX = interpolate(scanSweep, [0, 1], [-400, 400]); // relative to targetT

  // Structure Transform Visual Logic (Ubah Struktur)
  const structureAnim = spring({ frame: fT - 190, fps, config: { damping: 14 } });
  const block1Width = interpolate(structureAnim, [0, 1], [100, 80]);
  const block2Width = interpolate(structureAnim, [0, 1], [250, 120]);
  const block3Width = interpolate(structureAnim, [0, 1], [100, 80]);
  const block4Width = interpolate(structureAnim, [0, 1], [0, 120]);
  const block4Opacity = interpolate(structureAnim, [0, 1], [0, 1]);
  const blockColor = interpolateColors(structureAnim, [0, 1], [theme.inkMuted, theme.inkSecondary]);

  // Load Visual Logic
  const fallExcel = spring({ frame: frame - START_L - 40, fps, config: { damping: 12 } });

  // Airflow Zoom Transition Logic
  // 1. Center the Excel file (starts at 720, after rows finish dropping)
  const centerExcel = spring({ frame: frame - 720, fps, config: { damping: 18, mass: 1.5, stiffness: 60 } });
  
  // 1.2 Morph into circle & Fade out Excel (starts at 735)
  const morphCircle = spring({ frame: frame - 735, fps, config: { damping: 16, stiffness: 70 } });
  
  // 1.4 Show Checkmark (starts at 775)
  const showCheckmark = spring({ frame: frame - 775, fps, config: { damping: 14, stiffness: 80 } });
  
  // 1.5 Hide Checkmark (starts at 805)
  const hideCheckmark = interpolate(frame, [805, 810], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  // 2. Smooth Zoom In (starts at 815)
  const zoomTransition = spring({ frame: frame - START_AIRFLOW, fps, config: { damping: 40, mass: 4, stiffness: 12 } });
  
  const excelScale = fallExcel + (zoomTransition * 40);
  
  let currentBgColor: string = theme.surface;
  if (zoomTransition > 0) {
      currentBgColor = interpolateColors(zoomTransition, [0, 1], [theme.surface, theme.canvas]);
  }

  const boxWidth = interpolate(morphCircle, [0, 1], [500, 130]);
  const boxBorderRadius = interpolate(morphCircle, [0, 1], [16, 65]);
  const loadingRotation = (frame - 735) * 8; // continuous rotation
  
  const excelContentOpacity = interpolate(frame, [720, 730], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const hideLoader = interpolate(frame, [770, 775], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const loadingOpacity = interpolate(morphCircle, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }) * (1 - hideLoader);
  const checkmarkScale = interpolate(showCheckmark, [0, 1], [0, 1]);
  const checkmarkOpacity = interpolate(showCheckmark, [0, 0.5], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) - hideCheckmark;

  const excelTop = interpolate(centerExcel, [0, 1], [300, 90]);
  const excelYPercent = interpolate(centerExcel, [0, 1], [0, -50]);
  
  // 3. Airflow Logo & Text Reveal
  const airflowPop = spring({ frame: frame - 870, fps, config: { damping: 15, mass: 1.5, stiffness: 40 } });
  const slideAndReveal = spring({ frame: frame - 920, fps, config: { damping: 20, mass: 1.5, stiffness: 45 } });
  
  // 4. Airflow Schedule Grid Reveal
  const slideUpAirflow = spring({ frame: frame - 1000, fps, config: { damping: 18, mass: 1.2, stiffness: 50 } });
  const START_GRID = 1030;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ink, fontFamily: "sans-serif" }}>
      
      {/* HUD Elements */}
      <div style={{ position: "absolute", top: 40, left: 40, color: theme.inkMuted, fontSize: 20, fontFamily: "monospace", letterSpacing: 2, zIndex: 50 }}>
        02 &middot; CARA KERJA
      </div>
      <div style={{ position: "absolute", top: 40, right: 40, color: theme.inkMuted, fontSize: 20, fontFamily: "monospace", zIndex: 50 }}>
        {(frame + 300).toString().padStart(4, '0')} / 1500
      </div>

      {/* GIANT PANNING CANVAS */}
      <div style={{
        position: "absolute",
        top: 0, left: 540, // Center of screen
        width: 4000, height: "100%", // Very wide canvas
        transform: `translateX(-${camX}px)`,
      }}>
        
        {/* HEADER TEXT */}
        <div style={{
          position: "absolute",
          top: `${headerTop}%`,
          left: 0,
          transform: `translateY(-50%)`,
          display: "flex",
          gap: GAP,
          zIndex: 10,
          opacity: interpolate(zoomTransition, [0, 0.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }}>
            {/* E Block */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", opacity: opacityE, width: wE }}>
                <div style={{ display: "flex", alignItems: "baseline", color: theme.surface }}>
                    <div style={{ width: CHAR_W, display: "flex", justifyContent: "center" }}>
                        <div style={{ overflow: "hidden", padding: "5px" }}>
                            <div style={{ transform: `translateY(${(1 - revealETL) * 100}%)` }}>
                                <span style={{ fontSize: 120, fontWeight: 900 }}>E</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ overflow: "hidden", width: expandE }}>
                        <span style={{ fontSize: 60, fontWeight: 900, marginLeft: 4 }}>xtract</span>
                    </div>
                </div>
                <div style={{ overflow: "hidden", height: interpolate(introToE, [0, 1], [0, 50]), opacity: introToE, marginTop: -10, alignSelf: "center" }}>
                    <span style={{ color: theme.inkMuted, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32 }}>("tarik")</span>
                </div>
            </div>

            {/* T Block */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", opacity: opacityT, width: wT }}>
                <div style={{ display: "flex", alignItems: "baseline", color: theme.surface }}>
                    <div style={{ width: CHAR_W, display: "flex", justifyContent: "center" }}>
                        <div style={{ overflow: "hidden", padding: "5px" }}>
                            <div style={{ transform: `translateY(${(1 - revealETL) * 100}%)` }}>
                                <span style={{ fontSize: 120, fontWeight: 900 }}>T</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ overflow: "hidden", width: expandT }}>
                        <span style={{ fontSize: 60, fontWeight: 900, marginLeft: 4 }}>ransform</span>
                    </div>
                </div>
                <div style={{ overflow: "hidden", height: interpolate(eToT, [0, 1], [0, 50]), opacity: eToT, marginTop: -10, alignSelf: "center" }}>
                    <span style={{ color: theme.inkMuted, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32 }}>("rapikan")</span>
                </div>
            </div>

            {/* L Block */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", opacity: opacityL, width: wL }}>
                <div style={{ display: "flex", alignItems: "baseline", color: theme.surface }}>
                    <div style={{ width: CHAR_W, display: "flex", justifyContent: "center" }}>
                        <div style={{ overflow: "hidden", padding: "5px" }}>
                            <div style={{ transform: `translateY(${(1 - revealETL) * 100}%)` }}>
                                <span style={{ fontSize: 120, fontWeight: 900 }}>L</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ overflow: "hidden", width: expandL }}>
                        <span style={{ fontSize: 60, fontWeight: 900, marginLeft: 4 }}>oad</span>
                    </div>
                </div>
                <div style={{ overflow: "hidden", height: interpolate(tToL, [0, 1], [0, 50]), opacity: tToL, marginTop: -10, alignSelf: "center" }}>
                    <span style={{ color: theme.inkMuted, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32 }}>("simpan")</span>
                </div>
            </div>
        </div>


        {/* --- E VISUALIZATION (EXTRACT) --- */}
        {frame >= START_E && frame < START_L && ( 
          <>
            <svg width="4000" height="1080" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
                {dataSources.map((source, index) => {
                // Garis muncul 15 frame setelah ikonnya muncul
                const linePop = spring({ frame: frame - START_E - 55 - (index * 30), fps, config: { damping: 14 } });
                return (
                    <line 
                    key={"line-" + source.name}
                    x1={targetE + source.offsetX} y1={iconY + 30} x2={targetE} y2={centralBoxY - 40} 
                    stroke={theme.inkSecondary} 
                    strokeWidth="4" 
                    strokeDasharray="12 12" 
                    strokeDashoffset={-(frame * 5)} 
                    opacity={linePop}
                    />
                );
                })}
            </svg>

            {dataSources.map((source, index) => {
                // Ikon muncul bergantian setelah RAW_DATA
                const pop = spring({ frame: frame - START_E - 40 - (index * 30), fps, config: { damping: 14 } });
                return (
                <div key={source.name} style={{
                    position: "absolute",
                    top: iconY, left: targetE + source.offsetX,
                    transform: `translate(-50%, -50%) scale(${pop})`,
                    backgroundColor: theme.surface, padding: 15, borderRadius: 20,
                    display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2
                }}>
                    <Img src={staticFile(`icons/${source.file}`)} style={{ width: 60, height: 60 }} />
                </div>
                );
            })}

            <div style={{
                position: "absolute",
                top: centralBoxY, left: targetE,
                // Box RAW_DATA muncul duluan
                transform: `translate(-50%, -50%) scale(${spring({ frame: frame - START_E - 20, fps, config: { damping: 14 } })})`,
                backgroundColor: theme.surfaceElevated,
                border: `4px solid ${theme.surface}`,
                padding: "20px 40px",
                borderRadius: 12,
                zIndex: 2,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <span style={{ color: theme.ink, fontSize: 28, fontWeight: 700, fontFamily: "monospace" }}>RAW_DATA</span>
            </div>
          </>
        )}


        {/* --- T VISUALIZATION (TRANSFORM) --- */}
        {frame >= START_T && frame < START_AIRFLOW && (
            <div style={{ position: "absolute", top: 450, left: targetT, transform: "translateX(-50%)", width: 600 }}>
              
              <div style={{ width: "100%", height: 60, backgroundColor: theme.surface, borderRadius: 8, margin: "10px 0", display: "flex", alignItems: "center", padding: "0 20px", gap: 20 }}>
                <div style={{ width: block1Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block2Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block3Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block4Width, height: 20, backgroundColor: blockColor, borderRadius: 4, opacity: block4Opacity }} />
              </div>

              <div style={{ 
                width: "100%", 
                height: interpolate(dupDelete, [0, 1], [60, 0]), 
                backgroundColor: interpolateColors(dupHighlight, [0, 1], [theme.surface, theme.accent]), 
                borderRadius: 8, 
                margin: `${interpolate(dupDelete, [0, 1], [10, 0])}px 0`, 
                display: "flex", alignItems: "center", padding: "0 20px", gap: 20,
                opacity: 1 - dupDelete,
                overflow: "hidden"
              }}>
                <div style={{ width: 100, height: 20, backgroundColor: theme.inkMuted, borderRadius: 4 }} />
                <div style={{ width: 250, height: 20, backgroundColor: theme.inkMuted, borderRadius: 4 }} />
                <div style={{ width: 100, height: 20, backgroundColor: theme.inkMuted, borderRadius: 4 }} />
              </div>

              <div style={{ 
                width: "100%", height: 60, backgroundColor: theme.surface, borderRadius: 8, margin: "10px 0", display: "flex", alignItems: "center", padding: "0 20px", gap: 20,
                transform: `rotate(${scanSweep > 0.3 ? 0 : 4}deg) translateX(${scanSweep > 0.3 ? 0 : 20}px)`, 
                transition: "transform 0.2s ease-out"
              }}>
                <div style={{ width: block1Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block2Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block3Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block4Width, height: 20, backgroundColor: blockColor, borderRadius: 4, opacity: block4Opacity }} />
              </div>

              <div style={{ width: "100%", height: 60, backgroundColor: theme.surface, borderRadius: 8, margin: "10px 0", display: "flex", alignItems: "center", padding: "0 20px", gap: 20 }}>
                <div style={{ width: block1Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block2Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block3Width, height: 20, backgroundColor: blockColor, borderRadius: 4 }} />
                <div style={{ width: block4Width, height: 20, backgroundColor: blockColor, borderRadius: 4, opacity: block4Opacity }} />
              </div>

              {scanSweep > 0 && scanSweep < 1 && (
                <div style={{
                  position: "absolute",
                  top: -50, bottom: -50, width: 10,
                  backgroundColor: theme.accent,
                  boxShadow: `0 0 40px 20px ${theme.accent}80`,
                  left: scanX + 300, // scanX is from -400 to 400 relative to center, so +300 aligns it to left edge of 600px width container
                  zIndex: 10
                }} />
              )}
            </div>
        )}

        {/* --- L VISUALIZATION (LOAD) --- */}
        {frame >= START_L && (
            <div style={{ position: "absolute", top: 450, left: targetL, transform: "translateX(-50%)", width: 600 }}>
                
                {[0, 1, 2].map(i => {
                  const dropRow = spring({ frame: frame - START_L - 80 - (i * 15), fps, config: { damping: 14 } });
                  return (
                    <div key={i} style={{
                      position: "absolute", left: 0,
                      top: interpolate(dropRow, [0, 1], [i * 70, 300]),
                      opacity: interpolate(dropRow, [0, 0.8, 1], [1, 1, 0]),
                      transform: `scale(${interpolate(dropRow, [0, 1], [1, 0.5])})`,
                      width: "100%", height: 60, backgroundColor: theme.surface, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 20px", gap: 20
                    }}>
                      <div style={{ width: 80, height: 20, backgroundColor: theme.inkSecondary, borderRadius: 4 }} />
                      <div style={{ width: 120, height: 20, backgroundColor: theme.inkSecondary, borderRadius: 4 }} />
                      <div style={{ width: 80, height: 20, backgroundColor: theme.inkSecondary, borderRadius: 4 }} />
                      <div style={{ width: 120, height: 20, backgroundColor: theme.inkSecondary, borderRadius: 4 }} />
                    </div>
                  );
                })}

                <div style={{
                  position: "absolute",
                  top: excelTop, left: "50%",
                  transform: `translate(-50%, ${excelYPercent}%) scale(${excelScale})`,
                  backgroundColor: currentBgColor,
                  width: boxWidth,
                  height: 130,
                  borderRadius: boxBorderRadius,
                  display: "flex", justifyContent: "center", alignItems: "center",
                  boxShadow: zoomTransition > 0.5 ? "none" : `0 20px 50px ${theme.ink}80`,
                  zIndex: 10,
                  overflow: "hidden"
                }}>
                  {/* Excel Content */}
                  {/* Excel Content */}
                  <div style={{ 
                    position: "absolute", 
                    display: "flex", alignItems: "center", gap: 15, 
                    opacity: excelContentOpacity,
                    pointerEvents: "none"
                  }}>
                    <Img src={staticFile(`icons/excel-document-svgrepo-com.svg`)} style={{ width: 80, height: 80 }} />
                    <span style={{ 
                      color: theme.ink, fontSize: 24, fontWeight: 700, fontFamily: "monospace", whiteSpace: "nowrap",
                      display: morphCircle > 0.9 ? "none" : "block"
                    }}>
                      Report Agustus 2026.xlsx
                    </span>
                  </div>
                  {/* Loading Content */}
                  <div style={{ 
                    position: "absolute", 
                    display: "flex", justifyContent: "center", alignItems: "center",
                    opacity: loadingOpacity,
                    pointerEvents: "none"
                  }}>
                    <div style={{ transform: `rotate(${loadingRotation}deg)` }}>
                        <Loader2 size={60} color={theme.ink} strokeWidth={3} />
                    </div>
                  </div>
                  {/* Sent/Loaded Content */}
                  <div style={{ 
                    position: "absolute", 
                    display: "flex", justifyContent: "center", alignItems: "center",
                    opacity: checkmarkOpacity,
                    transform: `scale(${checkmarkScale})`,
                    pointerEvents: "none"
                  }}>
                    <Check size={80} color="#10B981" strokeWidth={3.5} />
                  </div>
                </div>
            </div>
        )}
      </div>

      {/* --- AIRFLOW FINAL REVEAL (Absolute to Screen) --- */}
      {(() => {
        return frame >= START_AIRFLOW && zoomTransition > 0.05 && (
          <div style={{
            position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", zIndex: 30
          }}>
            {/* Airflow SVG Masked Reveal (Sliding up) */}
            <div>
              <div style={{ 
                display: "flex", 
              alignItems: "center",
              transform: `scale(${airflowPop}) translateY(-${interpolate(slideUpAirflow, [0, 1], [0, 150])}px)`,
              position: "relative"
            }}>
            {/* Pinwheel dari Apache Airflow.svg */}
            <div style={{ width: 175, height: 175, flexShrink: 0 }}>
                <Img src={staticFile(`icons/Apache Airflow.svg`)} style={{ width: 175, height: 175, maxWidth: "none" }} />
            </div>

            {/* Teks masking dari AirflowLogo.svg */}
            <div style={{ 
                width: interpolate(slideAndReveal, [0, 1], [0, 453 - 175]),
                height: 175,
                overflow: "hidden",
                position: "relative",
                flexShrink: 0
            }}>
                <Img 
                    src={staticFile(`icons/AirflowLogo.svg`)} 
                    style={{ 
                        position: "absolute",
                        height: 175, 
                        width: 453,
                        maxWidth: "none",
                        left: -175,
                        top: 0
                    }} 
                />
            </div>
            </div>
          </div>
          
          {/* The DAG Lineage & Time */}
          <div style={{
              position: "absolute",
              top: "50%",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 60,
              opacity: interpolate(slideUpAirflow, [0, 1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
              transform: `translateY(${interpolate(slideUpAirflow, [0, 1], [50, 0])}px)`
          }}>
              {/* Ticking Time */}
              {/* Ticking Time */}
              {(() => {
                 const t = Math.max(0, frame - START_GRID);
                 
                 const toDay6 = spring({ frame: t - 15, fps, config: { damping: 14 } });
                 const toHourlyText = spring({ frame: t - 100, fps, config: { damping: 14 } });
                 
                 const toHour1 = spring({ frame: t - 120, fps, config: { damping: 14 } });
                 
                 const hourOffsetIndex = toHour1;
                 const clockSpin = (toDay6 * 360) + (hourOffsetIndex * 30);
                 
                 const hoursArray = ["00", "01"];

                 return (
                     <div style={{ display: "flex", alignItems: "center", gap: 15, color: theme.ink, fontFamily: "monospace", fontSize: 24, letterSpacing: 2 }}>
                         <Clock size={28} style={{ transform: `rotate(${clockSpin}deg)` }} />
                         <span style={{ display: "flex", gap: 8 }}>
                             Schedule: 
                             <div style={{ height: 30, overflow: "hidden", position: "relative", width: 105 }}>
                                 <span style={{ position: "absolute", color: theme.accent, display: "flex", alignItems: "center", height: 30, transform: `translateY(-${toHourlyText * 100}%)` }}>@daily</span>
                                 <span style={{ position: "absolute", color: theme.accent, display: "flex", alignItems: "center", height: 30, transform: `translateY(${(1 - toHourlyText) * 100}%)` }}>@hourly</span>
                             </div>
                             <div style={{ display: "flex", alignItems: "center", height: 30 }}>&bull; 2026-10-</div>
                             
                             {/* Date Ticker */}
                             <div style={{ height: 30, overflow: "hidden" }}>
                                 <div style={{ display: "flex", flexDirection: "column", transform: `translateY(-${toDay6 * 30}px)` }}>
                                     <span style={{ height: 30, display: "flex", alignItems: "center" }}>05</span>
                                     <span style={{ height: 30, display: "flex", alignItems: "center" }}>06</span>
                                 </div>
                             </div>
                             
                             <div style={{ display: "flex", alignItems: "center", height: 30, marginLeft: 5 }}>
                                 {/* Hour Ticker */}
                                 <div style={{ height: 30, overflow: "hidden" }}>
                                     <div style={{ display: "flex", flexDirection: "column", transform: `translateY(-${hourOffsetIndex * 30}px)` }}>
                                         {hoursArray.map((h, i) => (
                                             <span key={i} style={{ height: 30, display: "flex", alignItems: "center" }}>{h}</span>
                                         ))}
                                     </div>
                                 </div>
                                 <span>:00</span>
                             </div>
                         </span>
                     </div>
                 );
              })()}

              {/* DAG Nodes */}
              {(() => {
                 const t = Math.max(0, frame - START_GRID);
                 
                 const isDaily = t < 110;
                 
                 const dagDailyProgress = t - 40; 
                 const popDaily1 = dagDailyProgress >= 0 ? spring({ frame: dagDailyProgress, fps, config: { damping: 12, stiffness: 100 } }) : 0;
                 const popDaily2 = dagDailyProgress >= 8 ? spring({ frame: dagDailyProgress - 8, fps, config: { damping: 12, stiffness: 100 } }) : 0;
                 const popDaily3 = dagDailyProgress >= 16 ? spring({ frame: dagDailyProgress - 16, fps, config: { damping: 12, stiffness: 100 } }) : 0;

                 const dagHourlyProgress = t - 140;
                 const popHourly1 = dagHourlyProgress >= 0 ? spring({ frame: dagHourlyProgress, fps, config: { damping: 12, stiffness: 100 } }) : 0;
                 const popHourly2 = dagHourlyProgress >= 8 ? spring({ frame: dagHourlyProgress - 8, fps, config: { damping: 12, stiffness: 100 } }) : 0;
                 const popHourly3 = dagHourlyProgress >= 16 ? spring({ frame: dagHourlyProgress - 16, fps, config: { damping: 12, stiffness: 100 } }) : 0;

                 const pop1 = isDaily ? popDaily1 : popHourly1;
                 const pop2 = isDaily ? popDaily2 : popHourly2;
                 const pop3 = isDaily ? popDaily3 : popHourly3;

                 const edge1Active = isDaily ? dagDailyProgress > 6 : dagHourlyProgress > 6;
                 const edge2Active = isDaily ? dagDailyProgress > 14 : dagHourlyProgress > 14;

                 const cSucc = "#17A34A";
                 const cSkip = "#EC4899";
                 const cNone = "#D1D5DB";

                 const state1 = pop1 > 0.1 ? "success" : "none";
                 const state2Live = pop2 > 0.1 ? (isDaily ? "skipped" : "success") : "none";
                 const state2Batch = pop2 > 0.1 ? (isDaily ? "success" : "skipped") : "none";
                 const state3 = pop3 > 0.1 ? "success" : "none";

                 const e1T = edge1Active ? (isDaily ? cSkip : cSucc) : cNone;
                 const e1B = edge1Active ? (isDaily ? cSucc : cSkip) : cNone;
                 const e2T = edge2Active ? (isDaily ? cSkip : cSucc) : cNone;
                 const e2B = edge2Active ? (isDaily ? cSucc : cSkip) : cNone;

                 const AirflowNode = ({ id, op, state, scale = 1, left, top }: any) => {
                     const color = state === "success" ? cSucc : state === "skipped" ? cSkip : cNone;
                     return (
                        <div style={{
                            position: "absolute", left, top,
                            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
                            padding: "10px 15px", borderRadius: 6, backgroundColor: "#FFF",
                            border: `2px solid ${color}`,
                            transform: `scale(${scale})`,
                            boxShadow: state !== "none" ? `0 4px 12px ${color}33` : "0 1px 3px rgba(0,0,0,0.1)",
                            minWidth: 200, width: 220, zIndex: 1
                        }}>
                            <span style={{ color: "#111827", fontFamily: "system-ui, sans-serif", fontSize: 18, fontWeight: "bold" }}>
                                {id}
                            </span>
                            <span style={{ color: "#6B7280", fontFamily: "system-ui, sans-serif", fontSize: 14 }}>
                                {op}
                            </span>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 4,
                                backgroundColor: color, color: "#FFF",
                                padding: "2px 8px", borderRadius: 12,
                                fontSize: 12, fontWeight: "bold", fontFamily: "system-ui, sans-serif",
                                opacity: state !== "none" ? 1 : 0,
                                transform: `scale(${state !== "none" ? 1 : 0.8})`,
                                transition: "all 0.2s ease-out",
                            }}>
                                {state === "skipped" ? "⏭ skipped" : <><Check size={12} strokeWidth={4} /> success</>}
                            </div>
                        </div>
                     );
                 };

                 return (
                     <div style={{ position: "relative", width: 850, height: 260 }}>
                         <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                             {/* L1 -> Top */}
                             <path d="M 220 125 L 250 125 L 270 60 L 300 60" stroke={e1T} strokeWidth={3} fill="none" strokeLinejoin="round" />
                             {/* L1 -> Bottom */}
                             <path d="M 220 125 L 250 125 L 270 190 L 300 190" stroke={e1B} strokeWidth={3} fill="none" strokeLinejoin="round" />
                             
                             {/* Top -> L2 */}
                             <path d="M 520 60 L 550 60 L 570 125 L 600 125" stroke={e2T} strokeWidth={3} fill="none" strokeLinejoin="round" />
                             {/* Bottom -> L2 */}
                             <path d="M 520 190 L 550 190 L 570 125 L 600 125" stroke={e2B} strokeWidth={3} fill="none" strokeLinejoin="round" />
                         </svg>

                         <AirflowNode id="check_schedule" op="BranchPythonOperator" state={state1} scale={interpolate(pop1, [0, 0.5, 1], [1, 1.05, 1])} left={0} top={85} />
                         <AirflowNode id="fetch_live_api" op="HttpOperator" state={state2Live} scale={interpolate(pop2, [0, 0.5, 1], [1, 1.05, 1])} left={300} top={20} />
                         <AirflowNode id="fetch_batch_db" op="BigQueryOperator" state={state2Batch} scale={interpolate(pop2, [0, 0.5, 1], [1, 1.05, 1])} left={300} top={150} />
                         <AirflowNode id="process_data" op="PythonOperator" state={state3} scale={interpolate(pop3, [0, 0.5, 1], [1, 1.05, 1])} left={600} top={85} />
                     </div>
                 );
              })()}
          </div>
        </div>
        );
      })()}
    </AbsoluteFill>
  );
};
