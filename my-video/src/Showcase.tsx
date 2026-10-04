import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1_Problem } from "./scenes/Scene1_Problem";
import { Scene2_Solusi } from "./scenes/Scene2_Solusi";

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
        Berjalan dari frame 300 selama 900 frame (30 detik)
      */}
      <Sequence from={300} durationInFrames={900}>
        <Scene2_Solusi />
      </Sequence>
    </AbsoluteFill>
  );
};
