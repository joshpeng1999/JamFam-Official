// Central palette so real brand colors can be dropped in without touching component code.
export const colors = {
  background: '#0A0A0A',
  surface: '#161616',
  surfaceAlt: '#1E1E1E',
  border: '#2A2A2A',

  sheetBackground: '#FFFFFF',
  sheetSurfaceAlt: '#F2F2F2',
  sheetBorder: '#E3E3E3',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.68)',
  textTertiary: 'rgba(255,255,255,0.45)',

  sheetTextPrimary: '#0A0A0A',
  sheetTextSecondary: 'rgba(10,10,10,0.6)',
  sheetTextTertiary: 'rgba(10,10,10,0.4)',

  accent: '#57AEE2',
  accentPressed: '#468BB5',

  pillBlue: '#2D6BD9',
  pillBlueBg: 'rgba(45,107,217,0.16)',
  pillGreen: '#3FBE7A',
  pillGreenBg: 'rgba(63,190,122,0.16)',

  success: '#3FBE7A',
  danger: '#E5484D',

  overlayScrim: 'rgba(0,0,0,0.5)',
  overlayScrimStrong: 'rgba(0,0,0,0.8)',
} as const;

export const avatarPalette = [
  '#F5A623',
  '#2D6BD9',
  '#3FBE7A',
  '#D9548C',
  '#8E6CE0',
  '#3AB0C9',
] as const;
