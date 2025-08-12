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
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="rounded-xl bg-primary/20 backdrop-blur-sm border border-border/50 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-lg">
        {!revealed ? (
          <Button 
            size="lg" 
            onClick={onReveal}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-500 hover:via-purple-500 hover:to-blue-400 text-white font-semibold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-lg border-0 relative overflow-hidden group transform hover:scale-110"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Reveal Cards</span>
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-center">
              <div className="text-muted-foreground text-xs sm:text-sm mb-1">Average Points</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {avg || '-'}{Number.isFinite(avg) ? '' : ''}
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onReset}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium px-2 sm:px-3 md:px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-xs sm:text-sm md:text-base"
            >
              New Round
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
