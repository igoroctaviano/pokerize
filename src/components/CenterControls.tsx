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
      <div className="rounded-xl bg-primary/20 backdrop-blur-sm border border-border/50 px-6 py-4 shadow-lg">
        {!revealed ? (
          <Button 
            size="lg" 
            onClick={onReveal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Reveal Cards
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <div className="text-muted-foreground text-sm mb-1">Average Points</div>
              <div className="text-2xl font-bold text-foreground">
                {avg || '-'}{Number.isFinite(avg) ? '' : ''}
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onReset}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              New Round
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
