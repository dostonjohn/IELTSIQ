export function getAudioPolicy(pathname) {
  const p = String(pathname || '').toLowerCase()
  if (
    p.startsWith('/off-time/karaoke') ||
    p.startsWith('/clips') ||
    p.startsWith('/practice/listening') ||
    p.startsWith('/mock') ||
    p.includes('recorder')
  ) return 'pause'
  if (p.startsWith('/off-time/minigames')) return 'duck'
  return 'allow'
}
