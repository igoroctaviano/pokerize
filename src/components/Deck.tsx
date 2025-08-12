import { cn } from '../lib/utils'

const FIB_CARDS = ['0','1','2','3','5','8','13','21','34','55','89','?','☕️']

export function Deck({ selected, onSelect }: { selected: string | null; onSelect: (v: string | null) => void }) {
  return (
    <div className="fixed bottom-8 left-1/2 z-20 w-full max-w-5xl -translate-x-1/2 px-4">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-3 rounded-xl border bg-background/60 p-4 backdrop-blur shadow-lg">
        {FIB_CARDS.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(selected === c ? null : c)}
            className={cn(
              'relative w-14 h-14 rounded-full border-2 shadow-md transition-all duration-200 transform hover:scale-110 hover:shadow-lg',
              selected === c 
                ? 'bg-primary border-primary/50 shadow-primary/25' 
                : 'bg-card border-border hover:border-primary/50'
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                'text-lg font-bold',
                selected === c ? 'text-primary-foreground' : 'text-foreground'
              )}>
                {c}
              </span>
            </div>
            {/* Chip inner ring */}
            <div className={cn(
              'absolute inset-1 rounded-full border',
              selected === c ? 'border-primary/30' : 'border-border/50'
            )}></div>
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">Choose your card 👆</p>
    </div>
  )
}
