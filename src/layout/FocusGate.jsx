import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useGlobalAudio } from '../audio/GlobalAudioContext'
import { getAudioPolicy } from '../audio/FocusManager'

const FocusGate = () => {
  const { pathname } = useLocation()
  const { setPolicy, pauseAll, resumeAll, duck, isRunning, tracks, userActivated } = useGlobalAudio()

  useEffect(() => {
    const policy = getAudioPolicy(pathname)
    setPolicy(policy)
    if (policy === 'pause') {
      if (isRunning) pauseAll()
    } else if (policy === 'duck') {
      duck(true)
    } else {
      duck(false)
      if (!isRunning && userActivated && tracks.length > 0) {
        resumeAll()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}

export default FocusGate
