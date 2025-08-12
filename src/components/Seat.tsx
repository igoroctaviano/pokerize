import { Card } from './ui/card'
import { cn } from '../lib/utils'

export type SeatPlayer = {
  name: string
  selected: string | null
}

export function Seat({ player, revealed }: { player: SeatPlayer; revealed: boolean }) {
  const show = revealed && player.selected !== null
  const hasSelected = player.selected !== null
  
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      {/* Modern Card */}
      <div className="relative">
        <Card className={cn(
          'h-10 w-7 sm:h-12 sm:w-9 md:h-16 md:w-12 rounded-lg border-2 shadow-lg transition-all duration-300 transform hover:scale-105',
          show 
            ? 'bg-card text-card-foreground border-border' 
            : hasSelected
              ? 'bg-muted/30 border-green-500/70' // Green border when user has selected
              : 'bg-muted/30 border-border/50'
        )}>
          {show ? (
            <div className="flex flex-col items-center justify-center h-full p-1">
              <div className="text-sm sm:text-lg md:text-2xl font-bold text-primary">{player.selected}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-1">
              <div className="w-3 h-4 sm:w-4 sm:h-5 md:w-5 md:h-6 bg-muted/50 rounded border border-border/30 flex items-center justify-center">
                <div className="text-muted-foreground text-xs font-bold">♠</div>
              </div>
            </div>
          )}
        </Card>
        
        {/* Card shadow */}
        <div className="absolute -bottom-1 left-1 right-1 h-1 bg-black/10 rounded-full blur-sm"></div>
      </div>
      
      {/* Player Name */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center shadow-sm">
                      <div className={cn(
              "font-bold",
              hasSelected ? "text-green-500 text-xs sm:text-sm md:text-base" : "text-muted-foreground text-xs"
            )}>
            {hasSelected ? "✓" : "♠"}
          </div>
        </div>
        <div className="text-xs sm:text-sm font-medium text-center w-16 sm:w-20 md:w-28 truncate text-foreground">
          {player.name || 'Guest'}
        </div>
      </div>
    </div>
  )
}
