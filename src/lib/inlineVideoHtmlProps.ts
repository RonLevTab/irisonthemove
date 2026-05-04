/**
 * Self-hosted looped MP4s: same flags everywhere so inline playback + unmute-after-tap
 * behave consistently on iOS Safari, Android Chrome, and desktop.
 */
export const inlineLoopingVideoProps = {
  playsInline: true,
  disablePictureInPicture: true,
} as const;
