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
      <Card className={cn('grid h-14 w-8 place-items-center rounded-md border', show ? 'bg-primary/20' : 'bg-muted/30')}>
        <span className="text-xs">{show ? player.selected : ''}</span>
      </Card>
      <div className="text-sm font-medium text-center w-24 truncate">{player.name || 'Guest'}</div>
    </div>
  )
}
