import { useEffect, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { useAwareness, useRoom, useSharedState } from './realtime'
import { TopBar } from './components/TopBar'
import { Seat } from './components/Seat'
import { Deck } from './components/Deck'
import { CenterControls } from './components/CenterControls'
import { EstimateHistory } from './components/EstimateHistory'
import { NameModal } from './components/NameModal'

const getOrCreateRoomId = () => {
  const hash = window.location.hash.replace('#', '')
  if (hash) return hash
  const id = nanoid(8)
  window.location.hash = id
  return id
}

// Custom hook for responsive design
function useResponsiveRadius() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export default function App() {
  const roomId = useMemo(getOrCreateRoomId, [])
  const { room, loading, connected, setName, setSelected, reveal, resetRound, playerId } = useRoom(roomId)
  const shared = useSharedState(room)
  const players = useAwareness(room)
  const isMobile = useResponsiveRadius()

  const [name, setNameLocal] = useState<string>(() => {
    // Try to get name from localStorage first
    const savedName = localStorage.getItem('pokerize-username')
    return savedName || ''
  })
  const [estimateHistory, setEstimateHistory] = useState<string[]>([])
  const [lastRevealedState, setLastRevealedState] = useState(false)
  
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

  // Save name to localStorage when it changes
  useEffect(() => {
    if (name && name.trim().length > 0) {
      localStorage.setItem('pokerize-username', name)
    }
  }, [name])

  const me = players.find((p) => p.clientId === playerId)
  const selected = (me?.selected as string | null) ?? null
  const values = players.map((p) => String(p.selected ?? ''))

  // Track estimate history when cards are first revealed (not on every render)
  useEffect(() => {
    if (shared.revealed && !lastRevealedState && values.length > 0) {
      // Only update when cards are first revealed (transition from false to true)
      const valueCounts = values.reduce((acc, value) => {
        if (value && value !== 'null') {
          acc[value] = (acc[value] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

      // Find the most common estimate, prioritizing highest number in case of ties
      const mostCommon = Object.entries(valueCounts)
        .sort(([aKey, aCount], [bKey, bCount]) => {
          // First sort by count (descending)
          if (bCount !== aCount) {
            return bCount - aCount
          }
          // If counts are equal, sort by numeric value (descending) - highest number wins
          const aNum = parseFloat(aKey) || 0
          const bNum = parseFloat(bKey) || 0
          return bNum - aNum
        })[0]?.[0]

      if (mostCommon) {
        setEstimateHistory(prev => {
          const newHistory = [mostCommon, ...prev.slice(0, 4)] // Keep only last 5
          return newHistory
        })
      }
    }
    setLastRevealedState(shared.revealed)
  }, [shared.revealed, values, lastRevealedState])

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
    <div className="min-h-screen flex flex-col">
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

      {/* Main Game Area - Uses flexbox for responsive layout */}
      <div className="flex-1 flex flex-col relative">
        {/* Game Content - Takes available space and centers content */}
        <main className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6 px-1 sm:px-2 md:px-4 pt-1 sm:pt-2 md:pt-4 pb-1 sm:pb-2 md:pb-4 relative">
          {/* Modern Poker Table Layout */}
          <div className="relative w-full h-full max-w-4xl mx-auto">
            {/* Player Seats - Arranged like the example image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {players
                  .sort((a, b) => a.clientId.localeCompare(b.clientId)) // Stable sorting by player ID
                  .map((p, index) => {
                  const totalPlayers = players.length
                  
                  // Arrange players in an evenly distributed semi-circular pattern like the example
                  let angle, radius
                  
                  if (totalPlayers <= 3) {
                    // For 3 players: evenly spaced triangle, positioned to avoid center overlap
                    angle = (index * 120) + 90 // 120° apart, starting from top
                    radius = isMobile ? 100 : 160 // Smaller radius on mobile
                  } else if (totalPlayers <= 6) {
                    // For 4-6 players: evenly distributed semi-circle, avoiding center
                    angle = (index * 180 / (totalPlayers - 1)) + 90 // 180° spread, evenly distributed
                    radius = isMobile ? 120 : 180 // Smaller radius on mobile
                  } else {
                    // For 7+ players: wider semi-circle with even distribution
                    angle = (index * 200 / (totalPlayers - 1)) + 80 // 200° spread, evenly distributed
                    radius = isMobile ? 140 : 200 // Smaller radius on mobile
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
        </main>

        {/* Estimate History Sidebar - Positioned absolutely on the right */}
        <div className="absolute right-0 top-0 h-full">
          <EstimateHistory estimates={estimateHistory} />
        </div>
      </div>

      {/* Estimate Selector - Now part of the normal document flow */}
      <div className="px-1 sm:px-2 md:px-4 pb-1 sm:pb-2 md:pb-4">
        <Deck selected={selected} onSelect={(v) => setSelected(v)} />
      </div>

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
