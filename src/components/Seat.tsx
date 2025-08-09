import { Card } from './ui/card'
import { cn } from '../lib/utils'

export type SeatPlayer = {
  name: string
  selected: string | null
}

export function Seat({ player, revealed }: { player: SeatPlayer; revealed: boolean }) {
  const show = revealed && player.selected !== null
  
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Modern Card */}
      <div className="relative">
        <Card className={cn(
          'h-16 w-12 rounded-lg border-2 shadow-lg transition-all duration-300 transform hover:scale-105',
          show 
            ? 'bg-card text-card-foreground border-border' 
            : 'bg-muted/30 border-border/50'
        )}>
          {show ? (
            <div className="flex flex-col items-center justify-center h-full p-1">
              <div className="text-2xl font-bold text-primary">{player.selected}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-1">
              <div className="w-5 h-6 bg-muted/50 rounded border border-border/30 flex items-center justify-center">
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
        <div className="w-6 h-6 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center shadow-sm">
          <div className="text-muted-foreground text-xs font-bold">♠</div>
        </div>
        <div className="text-sm font-medium text-center w-28 truncate text-foreground">
          {player.name || 'Guest'}
        </div>
      </div>
    </div>
  )
}
