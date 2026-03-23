/**
 * 必填标签组件
 */

interface RequiredLabelProps {
  children: React.ReactNode
}

export function RequiredLabel({ children }: RequiredLabelProps) {
  return (
    <div className="flex items-center gap-1">
      <span>{children}</span>
      <span className="text-destructive">*</span>
    </div>
  )
}
