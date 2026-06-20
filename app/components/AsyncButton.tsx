'use client'

interface AsyncButtonProps {
  onAsyncTask: () => void
}

export default function AsyncButton({ onAsyncTask }: AsyncButtonProps) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <button onClick={onAsyncTask} style={{ padding: '0.5rem 1rem' }}>
        Simular tarea asíncrona
      </button>
    </div>
  )
}