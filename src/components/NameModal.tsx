import { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card'

export function NameModal({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      <Card className="relative z-10 w-[95vw] max-w-lg">
        <CardHeader>
          <CardTitle>Enter your name</CardTitle>
          <CardDescription>This will be visible to everyone in this room.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input ref={inputRef} placeholder="Your name" value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && value && onSubmit()} />
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={onSubmit} disabled={!value}>Continue</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
