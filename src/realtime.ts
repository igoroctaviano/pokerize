import { useEffect, useRef, useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { doc, setDoc, onSnapshot, collection, query, orderBy, serverTimestamp, writeBatch, deleteDoc } from 'firebase/firestore'
import { db } from './lib/firebase'

export type PlayerPresence = {
  id: string
  name: string
  selected: string | null
  lastSeen: number
}

export type RoomState = {
  revealed: boolean
  lastUpdated: number
}

export type Room = {
  id: string
  players: Map<string, PlayerPresence>
  state: RoomState
  cleanup: () => void
}

// Create or join a room
export function useRoom(roomId: string) {
  const [roomState, setRoomState] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const playerIdRef = useRef<string>('')
  const playersRef = useRef<Map<string, PlayerPresence>>(new Map())
  const stateRef = useRef<RoomState>({ revealed: false, lastUpdated: Date.now() })

  useEffect(() => {
    let mounted = true
    const players = new Map<string, PlayerPresence>()
    let state: RoomState = { revealed: false, lastUpdated: Date.now() }

    const setupRoom = async () => {
      try {
        // Generate or retrieve player ID from localStorage
        if (!playerIdRef.current) {
          const savedPlayerId = localStorage.getItem('pokerize-player-id')
          if (savedPlayerId) {
            playerIdRef.current = savedPlayerId
          } else {
            const newPlayerId = nanoid(8)
            playerIdRef.current = newPlayerId
            localStorage.setItem('pokerize-player-id', newPlayerId)
          }
        }
        const localPlayerId = playerIdRef.current
        playersRef.current = players
        stateRef.current = state

        // Create room document reference
        const roomRef = doc(db, 'rooms', roomId)
        
        // Create player document reference
        const playerRef = doc(db, 'rooms', roomId, 'players', localPlayerId)

        // Set up real-time listener for room state
        const unsubscribeState = onSnapshot(roomRef, (doc) => {
          if (mounted && doc.exists()) {
            const data = doc.data()
            if (data && data.state) {
              Object.assign(state, data.state)
              setRoomState(prev => prev ? { ...prev, state } : null)
            }
          }
        })

        // Set up real-time listener for players
        const playersQuery = query(
          collection(db, 'rooms', roomId, 'players'),
          orderBy('lastSeen', 'desc')
        )

        const unsubscribePlayers = onSnapshot(playersQuery, (snapshot) => {
          if (mounted) {
            players.clear()
            snapshot.forEach((doc) => {
              const playerData = doc.data() as PlayerPresence
              // Only include players who have been seen in the last 30 seconds
              if (playerData.lastSeen > Date.now() - 30000) {
                players.set(playerData.id, playerData)
              }
            })
            setRoomState(prev => prev ? { ...prev, players: new Map(players) } : null)
          }
        })

        // Add local player to Firestore
        const localPlayer = {
          id: localPlayerId,
          name: 'Guest',
          selected: null,
          lastSeen: Date.now()
        }
        
        await setDoc(playerRef, localPlayer)
        players.set(localPlayerId, localPlayer)

        // Initialize room state if it doesn't exist
        await setDoc(roomRef, {
          state: state,
          lastUpdated: serverTimestamp()
        }, { merge: true })

        // Set up cleanup function
        cleanupRef.current = () => {
          unsubscribeState()
          unsubscribePlayers()
          // Remove player from Firestore when leaving
          deleteDoc(playerRef).catch(console.error)
        }

        // Set up periodic heartbeat to keep player active
        const heartbeatInterval = setInterval(() => {
          if (mounted) {
            const currentPlayer = players.get(localPlayerId)
            if (currentPlayer) {
              setDoc(playerRef, { lastSeen: Date.now() }, { merge: true }).catch(console.error)
            }
          }
        }, 10000) // Update every 10 seconds

        // Add heartbeat cleanup
        const originalCleanup = cleanupRef.current
        cleanupRef.current = () => {
          clearInterval(heartbeatInterval)
          originalCleanup()
        }

        if (mounted) {
          setRoomState({ id: roomId, players, state, cleanup: cleanupRef.current || (() => {}) })
          setLoading(false)
          setConnected(true)
        }
      } catch (error) {
        console.error('Error setting up Firestore room:', error)
        if (mounted) {
          alert('Failed to connect to the room. Please check your internet connection and try again.')
          setLoading(false)
        }
      }
    }

    setupRoom()

    return () => {
      mounted = false
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [roomId])

  const setName = useCallback(async (name: string) => {
    if (!roomState) return
    let playerId = playerIdRef.current
    if (!playerId) {
      const savedPlayerId = localStorage.getItem('pokerize-player-id')
      if (savedPlayerId) {
        playerId = savedPlayerId
        playerIdRef.current = playerId
      } else {
        playerId = nanoid(8)
        playerIdRef.current = playerId
        localStorage.setItem('pokerize-player-id', playerId)
      }
    }

    const current = roomState.players.get(playerId) || { 
      id: playerId, 
      name: 'Guest', 
      selected: null, 
      lastSeen: Date.now() 
    }

    if (current.name === name) {
      return // No changes needed
    }

    const updated = { ...current, name, lastSeen: Date.now() }

    // Update locally
    roomState.players.set(playerId, updated)
    setRoomState({ ...roomState, players: new Map(roomState.players) })
    
    try {
      // Update in Firestore
      const playerRef = doc(db, 'rooms', roomState.id, 'players', playerId)
      await setDoc(playerRef, updated)
    } catch (error) {
      console.error('Error updating name:', error)
    }
  }, [roomState])

  const setSelected = useCallback(async (selected: string | null) => {
    if (!roomState) return
    let playerId = playerIdRef.current
    if (!playerId) {
      const savedPlayerId = localStorage.getItem('pokerize-player-id')
      if (savedPlayerId) {
        playerId = savedPlayerId
        playerIdRef.current = playerId
      } else {
        playerId = nanoid(8)
        playerIdRef.current = playerId
        localStorage.setItem('pokerize-player-id', playerId)
      }
    }

    const current = roomState.players.get(playerId) || { 
      id: playerId, 
      name: 'Guest', 
      selected: null, 
      lastSeen: Date.now() 
    }

    if (current.selected === selected) {
      return // No changes needed
    }

    const updated = { ...current, selected, lastSeen: Date.now() }

    // Update locally
    roomState.players.set(playerId, updated)
    setRoomState({ ...roomState, players: new Map(roomState.players) })
    
    try {
      // Update in Firestore
      const playerRef = doc(db, 'rooms', roomState.id, 'players', playerId)
      await setDoc(playerRef, updated)
    } catch (error) {
      console.error('Error updating selection:', error)
    }
  }, [roomState])

  const reveal = async () => {
    if (!roomState) return
    
    const newState = { ...roomState.state, revealed: true, lastUpdated: Date.now() }
    setRoomState({ ...roomState, state: newState })
    
    try {
      // Update in Firestore
      const roomRef = doc(db, 'rooms', roomState.id)
      await setDoc(roomRef, { state: newState, lastUpdated: serverTimestamp() }, { merge: true })
    } catch (error) {
      console.error('Error revealing cards:', error)
      alert('Failed to reveal cards. Please try again.')
    }
  }

  const resetRound = async () => {
    if (!roomState) return
    
    const newState = { ...roomState.state, revealed: false, lastUpdated: Date.now() }
    setRoomState({ ...roomState, state: newState })
    
    // Clear all selections
    const updatedPlayers = new Map(roomState.players)
    updatedPlayers.forEach((player, id) => {
      updatedPlayers.set(id, { ...player, selected: null, lastSeen: Date.now() })
    })
    setRoomState({ ...roomState, state: newState, players: updatedPlayers })
    
    try {
      // Use Firestore batch for efficient updates
      const batch = writeBatch(db)
      
      // Update all players
      updatedPlayers.forEach((player) => {
        const playerRef = doc(db, 'rooms', roomState.id, 'players', player.id)
        batch.update(playerRef, { selected: null, lastSeen: Date.now() })
      })
      
      // Update room state
      const roomRef = doc(db, 'rooms', roomState.id)
      batch.update(roomRef, { 
        state: newState, 
        lastUpdated: serverTimestamp() 
      })
      
      await batch.commit()
    } catch (error) {
      console.error('Error resetting round:', error)
      alert('Failed to reset the round. Please try again.')
    }
  }

  return { room: roomState, loading, connected, setName, setSelected, reveal, resetRound, playerId: playerIdRef.current }
}

export function useAwareness(room: Room | null) {
  const [players, setPlayers] = useState<Array<{ clientId: string } & PlayerPresence>>([])

  useEffect(() => {
    if (room) {
      const playerArray = Array.from(room.players.entries()).map(([id, player]) => ({
        clientId: id,
        ...player
      }))
      setPlayers(playerArray)
    } else {
      setPlayers([])
    }
  }, [room])

  return players
}

export function useSharedState(room: Room | null) {
  return { revealed: room?.state.revealed || false }
}
