import { Card } from './ui/card'

export function EstimateHistory({ estimates }: { estimates: string[] }) {
  if (estimates.length === 0) {
    return (
      <div className="hidden lg:block w-64 p-4">
        <Card className="p-4 bg-muted/20 border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Estimate History</h3>
          <p className="text-xs text-muted-foreground">No estimates yet</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="hidden lg:block w-64 p-4">
      <Card className="p-4 bg-muted/20 border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Estimate History</h3>
        <div className="space-y-2">
          {estimates.map((estimate, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Round {estimates.length - index}</span>
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{estimate}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
