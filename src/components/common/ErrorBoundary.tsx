import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    // If it's the known DOM insertBefore error from translation/extensions, attempt recovery
    if (error.message && error.message.includes('insertBefore')) {
      console.warn('DOM insertBefore error detected; attempting component recovery.');
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-custom p-4 p-md-5 mx-auto" style={{ maxWidth: 540 }}>
            <div className="text-warning mb-3" style={{ fontSize: '3rem' }}>
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h3 className="h4 fw-bold mb-2">Something went wrong / ஏதோ தவறு நடந்துள்ளது</h3>
            <p className="text-muted small mb-4">
              A temporary display error occurred. Please click below to refresh the page.
              <br />
              ஒரு தற்காலிக பிழை ஏற்பட்டுள்ளது. பக்கத்தைப் புதுப்பிக்க கீழே கிளிக் செய்யவும்.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={this.handleReset}
              >
                Try Again / மீண்டும் முயலவும்
              </button>
              <button
                type="button"
                className="btn btn-maroon px-4"
                onClick={this.handleReload}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh / புதுப்பிக்கவும்
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
