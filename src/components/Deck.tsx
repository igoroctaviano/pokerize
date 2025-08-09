import { Button } from './ui/button'
import { cn } from '../lib/utils'

const FIB_CARDS = ['0','1','2','3','5','8','13','21','34','55','89','?','☕️']

export function Deck({ selected, onSelect }: { selected: string | null; onSelect: (v: string | null) => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-20 w-full max-w-5xl -translate-x-1/2 px-4">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2 rounded-xl border bg-background/60 p-3 backdrop-blur">
        {FIB_CARDS.map((c) => (
          <Button key={c} variant={selected === c ? 'default' : 'outline'} className={cn('w-12')} onClick={() => onSelect(c)}>
            {c}
          </Button>
        ))}
        {selected && (
          <Button variant="ghost" onClick={() => onSelect(null)} className="ml-2 text-muted-foreground">
            Clear
          </Button>
        )}
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">Choose your card 👇</p>
    </div>
  )
}
