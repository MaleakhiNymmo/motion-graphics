import React from 'react';
import { motion } from 'motion/react';

interface LogoMotionProps {
  theme?: 'paper' | 'dark';
  className?: string;
  isExiting?: boolean;
}

export default function LogoMotion({
  theme = 'dark',
  className = 'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36',
  isExiting = false,
}: LogoMotionProps) {
  const isPaper = theme === 'paper';
  const logoColor = isPaper ? '#1C1C1C' : '#F6F6F9';
  const ghostColor = isPaper ? 'rgba(28, 28, 28, 0.12)' : 'rgba(246, 246, 249, 0.12)';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer ambient aura / subtle pulse at lock-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0, 0.35, 0],
          scale: [0.8, 0.8, 1.25, 1.45],
        }}
        transition={{
          duration: 1.2,
          times: [0, 0.6, 0.85, 1],
          delay: 0.8,
          ease: 'easeOut',
        }}
        className="absolute inset-[-20%] rounded-full pointer-events-none filter blur-xl"
        style={{
          background: isPaper
            ? 'radial-gradient(circle, rgba(28, 28, 28, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(246, 246, 249, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Main Vector Motion Assembly */}
      <motion.svg
        viewBox="73 72 151 151"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        animate={{
          scale: isExiting ? 1.08 : [0.96, 1.03, 1],
          opacity: isExiting ? 0.85 : 1,
        }}
        transition={{
          scale: isExiting
            ? { duration: 0.82, ease: [0.76, 0, 0.24, 1] }
            : { delay: 1.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
          opacity: { duration: 0.3 },
        }}
      >
        {/* ==================================================================== */}
        {/* 1. ORBIT TRACK: Faint Guide Orbit Circle */}
        {/* ==================================================================== */}
        <motion.circle
          cx="148.5"
          cy="147.5"
          r="70"
          stroke={ghostColor}
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Dynamic Pen/Stroke Tracer tracing 360° */}
        <motion.circle
          cx="148.5"
          cy="147.5"
          r="70"
          stroke={logoColor}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="440"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1, rotate: 270 }}
          transition={{
            duration: 1.25,
            ease: [0.65, 0, 0.35, 1],
          }}
          style={{ transformOrigin: '148.5px 147.5px' }}
        />

        {/* Orbit Path Final Solid Geometry (fades in as stroke finishes, locking outer ring + satellite notch) */}
        <motion.path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M148.5 74C189.093 74 222 106.907 222 147.5C222 169.765 212.099 189.718 196.461 203.196C196.486 203.461 196.5 203.729 196.5 204C196.5 208.694 192.694 212.5 188 212.5C186.694 212.5 185.456 212.204 184.351 211.678C173.745 217.615 161.518 221 148.5 221C107.907 221 75 188.093 75 147.5C75 106.907 107.907 74 148.5 74ZM148.5 81C111.773 81 82 110.773 82 147.5C82 184.227 111.773 214 148.5 214C159.811 214 170.462 211.175 179.787 206.193C179.601 205.494 179.5 204.759 179.5 204C179.5 199.306 183.306 195.5 188 195.5C189.811 195.5 191.488 196.069 192.867 197.034C206.452 184.859 215 167.178 215 147.5C215 110.773 185.227 81 148.5 81Z"
          fill={logoColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.15,
            duration: 0.35,
            ease: 'easeOut',
          }}
        />

        {/* Satellite Dot pop effect at notch (188, 204) */}
        <motion.circle
          cx="188"
          cy="204"
          r="8.5"
          fill={logoColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: 1 }}
          transition={{
            delay: 1.05,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{ transformOrigin: '188px 204px' }}
        />

        {/* ==================================================================== */}
        {/* 2. DUAL WING SLIDE & MERGE */}
        {/* ==================================================================== */}
        {/* Left Wing / Crescent */}
        <motion.path
          d="M107.946 121.812C137.681 139.214 158.372 162.02 170.41 190.218C163.842 193.594 156.394 195.5 148.5 195.5C142.121 195.5 136.034 194.252 130.466 191.993L129.498 151.333C129.406 147.468 126.198 144.41 122.333 144.502C118.468 144.594 115.41 147.802 115.502 151.667L116.249 183.051C106.575 174.269 100.5 161.594 100.5 147.5C100.5 138.051 103.232 129.24 107.946 121.812Z"
          fill={logoColor}
          initial={{
            x: -24,
            y: 18,
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.55,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformOrigin: '135px 158px' }}
        />

        {/* Right Wing / Crescent */}
        <motion.path
          d="M148.5 99.5C155.28 99.5 161.731 100.909 167.579 103.445L168.502 142.167C168.594 146.032 171.802 149.09 175.667 148.998C179.532 148.906 182.59 145.698 182.498 141.833L181.81 112.941C190.865 121.672 196.5 133.927 196.5 147.5C196.5 160.965 190.953 173.132 182.022 181.849C168.851 152.665 147.154 129.073 117.258 111.061C125.654 103.855 136.568 99.5 148.5 99.5Z"
          fill={logoColor}
          initial={{
            x: 24,
            y: -18,
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.65,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformOrigin: '157px 140px' }}
        />

        {/* ==================================================================== */}
        {/* 3. CENTER FOCAL DOT SNAP */}
        {/* ==================================================================== */}
        <motion.circle
          cx="122.5"
          cy="152.5"
          r="4"
          fill={logoColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.45, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            delay: 1.25,
            duration: 0.45,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{ transformOrigin: '122.5px 152.5px' }}
        />
      </motion.svg>
    </div>
  );
}
