import { useEffect, useState, useRef } from 'react'

export default function StreamingText() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchStream = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/longtext', { signal })
        const reader = response.body?.getReader()
        if (!reader) {
          setLoading(false)
          return
        }

        let done = false
        while (!done) {
          const { value, done: doneReading } = await reader.read()
          if (value) {
            const chunk = new TextDecoder().decode(value)
            setText(prev => prev + chunk)
            if (containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight
            }
          }
          done = doneReading
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Streaming fetch failed', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStream()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        padding: '1rem',
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #ccc'
      }}
      aria-live="polite"
      role="region"
    >
      {loading && !text ? 'Loading streaming text...' : text}
    </div>
  )
}
