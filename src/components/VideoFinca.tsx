'use client'

import { useRef } from 'react'

export default function VideoFinca() {
  const ref = useRef<HTMLVideoElement>(null)

  return (
    <video
      ref={ref}
      controls
      autoPlay
      muted
      loop
      playsInline
      onCanPlay={() => { if (ref.current) ref.current.playbackRate = 1.5 }}
      className="w-full"
      style={{ maxHeight: '420px', objectFit: 'cover' }}
    >
      <source src="https://ytxpsbophwkqcsraptuy.supabase.co/storage/v1/object/public/media/VideoFincaMery_web.mp4" type="video/mp4" />
    </video>
  )
}
