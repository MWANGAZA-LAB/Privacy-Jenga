import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TestErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Error occurred during testing</div>;
    }

    return this.props.children;
  }
}
