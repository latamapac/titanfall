import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error - in production could send to error tracking service
    console.error('Game Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleBackToMenu = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          background: 'var(--bg1)',
          color: 'var(--text)',
          textAlign: 'center',
        }}>
          <h1 style={{ color: '#f44', marginBottom: '20px' }}>⚠️ Something Went Wrong</h1>
          <p style={{ marginBottom: '20px', maxWidth: '500px' }}>
            The game encountered an unexpected error. Your progress may have been lost.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              background: 'var(--bg2)',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '12px',
              maxWidth: '600px',
              overflow: 'auto',
              marginBottom: '20px',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={this.handleReload}
              style={{
                padding: '12px 24px',
                background: 'var(--gold)',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              🔄 Reload Game
            </button>
            <button 
              onClick={this.handleBackToMenu}
              style={{
                padding: '12px 24px',
                background: 'var(--bg2)',
                color: 'var(--text)',
                border: '1px solid var(--dim)',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
