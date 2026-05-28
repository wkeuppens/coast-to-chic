import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Link } from 'react-router-dom'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Something went wrong loading this page.
            </p>
            <Link to="/" className="text-sm text-accent hover:opacity-80 transition-opacity">
              ← Back to Follow the Coast
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
