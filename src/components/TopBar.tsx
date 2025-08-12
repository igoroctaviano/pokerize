import { Button } from './ui/button'

import { Copy, Users } from 'lucide-react'

type Props = {
  name: string
  onEditName: () => void
  onInvite: () => void
  playersCount: number
}

export function TopBar({ name, onEditName, onInvite, playersCount }: Props) {
  return (
    <div className="flex w-full items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center">
          <div className="text-muted-foreground text-xs sm:text-sm font-bold">♠</div>
        </div>
        <div className="text-lg sm:text-xl font-bold text-foreground">Pokerize</div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="text-xs sm:text-sm text-muted-foreground hidden sm:flex items-center gap-1">
          <Users className="h-4 w-4"/> 
          {playersCount}
        </div>
        <Button variant="outline" onClick={onInvite} className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Invite players</span>
          <span className="sm:hidden">Invite</span>
        </Button>
        <Button variant="secondary" onClick={onEditName} className="text-xs sm:text-sm px-2 sm:px-3">
          {name || 'Set name'}
        </Button>
      </div>
    </div>
  )
}
