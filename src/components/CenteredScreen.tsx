import type { PropsWithChildren, ReactNode } from 'react'

type CenteredScreenProps = PropsWithChildren<{
  title?: string
  subtitle?: string
  footer?: ReactNode
}>

export function CenteredScreen({ title, subtitle, footer, children }: CenteredScreenProps) {
  return (
    <main className="screen active">
      <div className="centered-container">
        {title ? <h1 className="screen-title">{title}</h1> : null}
        {subtitle ? <h3 className="screen-subtitle">{subtitle}</h3> : null}
        {children}
        {footer ? <div className="screen-footer">{footer}</div> : null}
      </div>
    </main>
  )
}
