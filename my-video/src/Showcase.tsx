import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1_Problem } from "./scenes/Scene1_Problem";
import { Scene2_Solusi } from "./scenes/Scene2_Solusi";

import { Scene4_Penutup } from "./scenes/Scene4_Penutup";

export const Showcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#F9FAFB" }}>
      {/* 
        Scene 1: The Problem 
        Berjalan dari awal (frame 0) selama 300 frame (10 detik)
      */}
      <Sequence from={0} durationInFrames={300}>
        <Scene1_Problem />
      </Sequence>
      
      {/* 
        Scene 2: Solusi (Gabungan E, T, L + Airflow)
        Berjalan dari frame 300 selama 1245 frame (berakhir di frame 1545, tertutup oleh curtain wipe)
      */}
      <Sequence from={300} durationInFrames={1245}>
        <Scene2_Solusi />
      </Sequence>

      {/* 
        Scene 4: Penutup
        Berjalan dari frame 1530 (detik 51) selama 300 frame (10 detik)
      */}
      <Sequence from={1530} durationInFrames={300}>
        <Scene4_Penutup />
      </Sequence>
    </AbsoluteFill>
  );
};
