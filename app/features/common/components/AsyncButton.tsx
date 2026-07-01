'use client'

interface AsyncButtonProps {
  onAsyncTask: () => void
}

export default function AsyncButton({ onAsyncTask }: AsyncButtonProps) {
  return (
    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
      <button
        onClick={onAsyncTask}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f7f6f3';
          e.currentTarget.style.borderColor = 'var(--color-muted)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        Simular tarea asíncrona
      </button>
    </div>
  )
}