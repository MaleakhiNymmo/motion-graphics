import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

interface LogoRemotionProps {
  theme?: 'paper' | 'dark';
  size?: number;
  startFrame?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LogoRemotion: React.FC<LogoRemotionProps> = ({
  theme = 'paper',
  size = 280,
  startFrame = 0,
  className = '',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = Math.max(0, frame - startFrame);

  const isPaper = theme === 'paper';
  const logoColor = isPaper ? '#1C1C1C' : '#F6F6F9';
  const ghostColor = isPaper ? 'rgba(28, 28, 28, 0.12)' : 'rgba(246, 246, 249, 0.12)';

  // ====================================================================
  // 1. Ambient Aura Pulse
  // ====================================================================
  const auraOpacity = interpolate(
    relFrame,
    [24, 45, 54, 60],
    [0, 0, 0.35, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const auraScale = interpolate(
    relFrame,
    [24, 45, 54, 60],
    [0.8, 0.8, 1.25, 1.45],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ====================================================================
  // 2. Main Assembly Settle / Lock-in Scale
  // ====================================================================
  const svgLockSpring = spring({
    frame: relFrame - 45,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });
  const svgScale = relFrame < 45 ? 1 : interpolate(svgLockSpring, [0, 1], [0.96, 1]);

  // ====================================================================
  // 3. Orbit Track: Faint Guide Circle
  // ====================================================================
  const guideOpacity = interpolate(relFrame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const guideScale = interpolate(relFrame, [0, 18], [0.9, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // ====================================================================
  // 4. Dynamic Pen / Stroke Tracer (360° Trace)
  // ====================================================================
  const tracerProgress = interpolate(relFrame, [0, 38], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const strokeDashoffset = (1 - tracerProgress) * 440;
  const tracerRotate = interpolate(relFrame, [0, 38], [-90, 270], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  // ====================================================================
  // 5. Solid Orbit Ring Path
  // ====================================================================
  const solidRingOpacity = interpolate(relFrame, [35, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ====================================================================
  // 6. Satellite Dot Pop (188, 204)
  // ====================================================================
  const satelliteSpring = spring({
    frame: relFrame - 32,
    fps,
    config: { damping: 10, stiffness: 220, mass: 0.7 },
  });
  const satelliteScale = relFrame < 32 ? 0 : satelliteSpring;
  const satelliteOpacity = relFrame < 32 ? 0 : interpolate(relFrame, [32, 36], [0, 1], { extrapolateRight: 'clamp' });

  // ====================================================================
  // 7. Dual Wing Slide & Merge
  // ====================================================================
  // Left Wing
  const leftWingProgress = interpolate(relFrame, [16, 43], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const leftWingX = interpolate(leftWingProgress, [0, 1], [-24, 0]);
  const leftWingY = interpolate(leftWingProgress, [0, 1], [18, 0]);
  const leftWingScale = interpolate(leftWingProgress, [0, 1], [0.85, 1]);
  const leftWingOpacity = interpolate(leftWingProgress, [0, 0.3, 1], [0, 1, 1]);

  // Right Wing
  const rightWingProgress = interpolate(relFrame, [19, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rightWingX = interpolate(rightWingProgress, [0, 1], [24, 0]);
  const rightWingY = interpolate(rightWingProgress, [0, 1], [-18, 0]);
  const rightWingScale = interpolate(rightWingProgress, [0, 1], [0.85, 1]);
  const rightWingOpacity = interpolate(rightWingProgress, [0, 0.3, 1], [0, 1, 1]);

  // ====================================================================
  // 8. Center Focal Dot Snap (122.5, 152.5)
  // ====================================================================
  const centerDotSpring = spring({
    frame: relFrame - 38,
    fps,
    config: { damping: 9, stiffness: 240, mass: 0.6 },
  });
  const centerDotScale = relFrame < 38 ? 0 : centerDotSpring;
  const centerDotOpacity = relFrame < 38 ? 0 : interpolate(relFrame, [38, 42], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Outer ambient aura */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(24px)',
          opacity: auraOpacity,
          transform: `scale(${auraScale})`,
          background: isPaper
            ? 'radial-gradient(circle, rgba(28, 28, 28, 0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(246, 246, 249, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Main Vector Motion Assembly */}
      <svg
        viewBox="73 72 151 151"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          transform: `scale(${svgScale})`,
        }}
      >
        {/* 1. Guide Orbit Circle */}
        <circle
          cx="148.5"
          cy="147.5"
          r="70"
          stroke={ghostColor}
          strokeWidth="1.5"
          fill="none"
          style={{
            opacity: guideOpacity,
            transform: `scale(${guideScale})`,
            transformOrigin: '148.5px 147.5px',
          }}
        />

        {/* 2. Dynamic Pen / Stroke Tracer */}
        <circle
          cx="148.5"
          cy="147.5"
          r="70"
          stroke={logoColor}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="440"
          strokeDashoffset={strokeDashoffset}
          style={{
            transformOrigin: '148.5px 147.5px',
            transform: `rotate(${tracerRotate}deg)`,
          }}
        />

        {/* 3. Solid Orbit Path Ring */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M148.5 74C189.093 74 222 106.907 222 147.5C222 169.765 212.099 189.718 196.461 203.196C196.486 203.461 196.5 203.729 196.5 204C196.5 208.694 192.694 212.5 188 212.5C186.694 212.5 185.456 212.204 184.351 211.678C173.745 217.615 161.518 221 148.5 221C107.907 221 75 188.093 75 147.5C75 106.907 107.907 74 148.5 74ZM148.5 81C111.773 81 82 110.773 82 147.5C82 184.227 111.773 214 148.5 214C159.811 214 170.462 211.175 179.787 206.193C179.601 205.494 179.5 204.759 179.5 204C179.5 199.306 183.306 195.5 188 195.5C189.811 195.5 191.488 196.069 192.867 197.034C206.452 184.859 215 167.178 215 147.5C215 110.773 185.227 81 148.5 81Z"
          fill={logoColor}
          style={{ opacity: solidRingOpacity }}
        />

        {/* 4. Satellite Dot (188, 204) */}
        <circle
          cx="188"
          cy="204"
          r="8.5"
          fill={logoColor}
          style={{
            transformOrigin: '188px 204px',
            transform: `scale(${satelliteScale})`,
            opacity: satelliteOpacity,
          }}
        />

        {/* 5. Left Wing / Crescent */}
        <path
          d="M107.946 121.812C137.681 139.214 158.372 162.02 170.41 190.218C163.842 193.594 156.394 195.5 148.5 195.5C142.121 195.5 136.034 194.252 130.466 191.993L129.498 151.333C129.406 147.468 126.198 144.41 122.333 144.502C118.468 144.594 115.41 147.802 115.502 151.667L116.249 183.051C106.575 174.269 100.5 161.594 100.5 147.5C100.5 138.051 103.232 129.24 107.946 121.812Z"
          fill={logoColor}
          style={{
            transformOrigin: '135px 158px',
            transform: `translate(${leftWingX}px, ${leftWingY}px) scale(${leftWingScale})`,
            opacity: leftWingOpacity,
          }}
        />

        {/* 6. Right Wing / Crescent */}
        <path
          d="M148.5 99.5C155.28 99.5 161.731 100.909 167.579 103.445L168.502 142.167C168.594 146.032 171.802 149.09 175.667 148.998C179.532 148.906 182.59 145.698 182.498 141.833L181.81 112.941C190.865 121.672 196.5 133.927 196.5 147.5C196.5 160.965 190.953 173.132 182.022 181.849C168.851 152.665 147.154 129.073 117.258 111.061C125.654 103.855 136.568 99.5 148.5 99.5Z"
          fill={logoColor}
          style={{
            transformOrigin: '157px 140px',
            transform: `translate(${rightWingX}px, ${rightWingY}px) scale(${rightWingScale})`,
            opacity: rightWingOpacity,
          }}
        />

        {/* 7. Center Focal Dot Snap */}
        <circle
          cx="122.5"
          cy="152.5"
          r="4"
          fill={logoColor}
          style={{
            transformOrigin: '122.5px 152.5px',
            transform: `scale(${centerDotScale})`,
            opacity: centerDotOpacity,
          }}
        />
      </svg>
    </div>
  );
};
