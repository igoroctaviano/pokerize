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
    <div className="flex w-full items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center">
          <div className="text-muted-foreground text-sm font-bold">♠</div>
        </div>
        <div className="text-xl font-bold text-foreground">Pokerize</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground hidden sm:flex items-center gap-1">
          <Users className="h-4 w-4"/> 
          {playersCount}
        </div>
        <Button variant="outline" onClick={onInvite} className="gap-2">
          <Copy className="h-4 w-4" />
          Invite players
        </Button>
        <Button variant="secondary" onClick={onEditName}>{name || 'Set name'}</Button>
      </div>
    </div>
  )
}
