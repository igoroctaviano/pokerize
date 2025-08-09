import { Button } from './ui/button'
import { average } from '../lib/utils'

export function CenterControls({
  revealed,
  onReveal,
  onReset,
  values,
}: {
  revealed: boolean
  onReveal: () => void
  onReset: () => void
  values: string[]
}) {
  const numeric = values.map((v) => Number(v)).filter((n) => Number.isFinite(n)) as number[]
  const avg = average(numeric)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl bg-primary/20 px-10 py-6">
        {!revealed ? (
          <Button size="lg" onClick={onReveal}>Reveal</Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="lg" onClick={onReset}>New round</Button>
            <div className="text-sm text-muted-foreground">Average: <span className="font-semibold text-foreground">{avg || '-'}{Number.isFinite(avg) ? '' : ''}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}
