import { cn } from '../../lib/utils'
import * as React from 'react'

export function Badge({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('inline-flex items-center rounded-md border px-2 py-1 text-xs', className)}>{children}</div>
}
