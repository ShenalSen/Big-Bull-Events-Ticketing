import React from 'react';
import { toast } from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Scanner Error:', error, errorInfo);
    toast.error('Scanner error occurred');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-500/10 border border-red-500 rounded-lg">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Scanner Error</h3>
          <p className="text-gray-300 mb-4">
            The scanner encountered an error. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                     transition-colors"
          >
            Reset Scanner
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;