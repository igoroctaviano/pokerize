import { useEffect, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { useAwareness, useRoom, useSharedState } from './realtime'
import { TopBar } from './components/TopBar'
import { Seat } from './components/Seat'
import { Deck } from './components/Deck'
import { CenterControls } from './components/CenterControls'

import { NameModal } from './components/NameModal'

const getOrCreateRoomId = () => {
  const hash = window.location.hash.replace('#', '')
  if (hash) return hash
  const id = nanoid(8)
  window.location.hash = id
  return id
}

export default function App() {
  const roomId = useMemo(getOrCreateRoomId, [])
  const { room, loading, connected, setName, setSelected, reveal, resetRound, playerId } = useRoom(roomId)
  const shared = useSharedState(room)
  const players = useAwareness(room)

  const [name, setNameLocal] = useState<string>('')
  
  // Always show name modal if no name is set
  const [isNameOpen, setIsNameOpen] = useState(() => {
    const hasName = name && name.trim().length > 0
    return !hasName
  })

  // Set remote presence name once on mount and when room changes
  useEffect(() => {
    if (room && name) {
      setName(name)
    }
  }, [room, name, setName])

  const me = players.find((p) => p.clientId === playerId)
  const selected = (me?.selected as string | null) ?? null
  const values = players.map((p) => String(p.selected ?? ''))

  const onInvite = async () => {
    await navigator.clipboard.writeText(window.location.href)
    alert('Invite link copied to clipboard!')
  }



  // Show loading indicator until users are successfully connected
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold mb-2">Connecting to room...</h2>
          <p className="text-muted-foreground">
            Setting up your Pokerize session
          </p>
        </div>
      </div>
    )
  }

  // Show waiting message if connected but no other users
  if (connected && players.length <= 1) {
    // Instead of waiting, show the room with invite info in the TopBar
    // The TopBar already has the invite functionality, so we can proceed to the main room
  }

  // Show error message if not connected and not loading
  if (!loading && !connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="rounded-full h-32 w-32 border-2 border-destructive mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Connection Failed</h2>
          <p className="text-muted-foreground mb-4">
            Unable to connect to the room. The host might not be online or the room might not exist.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <br />
            <button
              onClick={() => {
                // Create a new room
                const newRoomId = nanoid(8)
                window.location.hash = newRoomId
                window.location.reload()
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Create New Room
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <TopBar
        name={name || 'Guest'}
        playersCount={players.length}
        onInvite={onInvite}
        onEditName={() => setIsNameOpen(true)}
      />

      {/* Debug info for testing */}
      <div className="text-center text-sm text-muted-foreground py-2">
        Room ID: {roomId} | Players: {players.length} | Connected: {connected ? 'Yes' : 'No'}
      </div>

      <main className="mx-auto flex h-[calc(100vh-140px)] max-w-6xl flex-col items-center justify-center gap-8 px-4 relative">
        {/* Modern Poker Table Layout */}
        <div className="relative w-full h-full max-w-4xl mx-auto">
          {/* Player Seats - Arranged like the example image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {players.map((p, index) => {
                const totalPlayers = players.length
                
                // Arrange players in an evenly distributed semi-circular pattern like the example
                let angle, radius
                
                if (totalPlayers <= 3) {
                  // For 3 players: evenly spaced triangle, positioned to avoid center overlap
                  angle = (index * 120) + 90 // 120° apart, starting from top
                  radius = 180
                } else if (totalPlayers <= 6) {
                  // For 4-6 players: evenly distributed semi-circle, avoiding center
                  angle = (index * 180 / (totalPlayers - 1)) + 90 // 180° spread, evenly distributed
                  radius = 200
                } else {
                  // For 7+ players: wider semi-circle with even distribution
                  angle = (index * 200 / (totalPlayers - 1)) + 80 // 200° spread, evenly distributed
                  radius = 220
                }
                
                return (
                  <div
                    key={p.clientId}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
                      top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
                    }}
                  >
                    <Seat player={{ name: p.name || 'Guest', selected: p.selected ?? null }} revealed={shared.revealed} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Center Controls */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CenterControls revealed={shared.revealed} onReveal={reveal} onReset={resetRound} values={values} />
          </div>
        </div>

        <Deck selected={selected} onSelect={(v) => setSelected(v)} />
      </main>

      <NameModal
        open={isNameOpen}
        onOpenChange={setIsNameOpen}
        value={name}
        onChange={setNameLocal}
        onSubmit={() => {
          if (name.trim()) {
            setIsNameOpen(false)
          }
        }}
      />
    </div>
  )
}
