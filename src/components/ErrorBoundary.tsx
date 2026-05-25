import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Send, CheckCircle } from 'lucide-react';
import { reportComponentError } from '../utils/errorReporter';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  reportStatus: { type: 'success' | 'error'; message: string } | null;
  isReporting: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      reportStatus: null,
      isReporting: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 Error Boundary Caught:', error, errorInfo);

    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, reportStatus: null, isReporting: false });
  };

  handleReportError = async () => {
    const { error, errorInfo, isReporting, reportStatus } = this.state;

    if (!error || isReporting || reportStatus?.type === 'success') return;

    this.setState({ isReporting: true, reportStatus: null });

    try {
      const result = await reportComponentError(
        error,
        errorInfo?.componentStack
      );

      if (result.success) {
        this.setState({
          reportStatus: { type: 'success', message: result.message },
          isReporting: false,
        });
        // Auto-dismiss after 5 seconds
        setTimeout(() => this.setState({ reportStatus: null }), 5000);
      } else {
        this.setState({
          reportStatus: { type: 'error', message: result.message },
          isReporting: false,
        });
        // Auto-dismiss after 5 seconds
        setTimeout(() => this.setState({ reportStatus: null }), 5000);
      }
    } catch (err) {
      this.setState({
        reportStatus: {
          type: 'error',
          message: 'Unable to send report. Please try again later.',
        },
        isReporting: false,
      });
      setTimeout(() => this.setState({ reportStatus: null }), 5000);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Oops! Something went wrong
            </h2>

            <p className="text-slate-600 mb-6">
              {this.props.fallbackMessage ||
                "We're sorry for the inconvenience. Our team has been notified and we're working on a fix."}
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Success/Error Report Status */}
            {this.state.reportStatus && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                this.state.reportStatus.type === 'success'
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-orange-100 border border-orange-300'
              }`}>
                {this.state.reportStatus.type === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <p className={`text-sm font-medium ${
                  this.state.reportStatus.type === 'success' ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {this.state.reportStatus.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 text-slate-700 font-medium hover:text-slate-900 transition-colors"
              >
                Return to Homepage
              </button>

              <button
                onClick={this.handleReportError}
                disabled={this.state.isReporting || this.state.reportStatus?.type === 'success'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {this.state.isReporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Report Issue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
