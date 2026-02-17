import React, { ErrorInfo, PropsWithChildren } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: string;
}

class ErrorBoundary extends React.Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false, error: "" };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error: error.toString() };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-black text-red-500 font-mono p-8 relative z-[9999]">
          <div className="border border-red-900 p-8 bg-red-950/20 max-w-lg">
            <h1 className="text-xl font-bold mb-4">SYSTEM FAILURE</h1>
            <p className="mb-4">
              The neural interface encountered a critical error.
            </p>
            <pre className="text-xs bg-black p-4 overflow-auto border border-red-900/50 max-h-48">
              {this.state.error}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-red-900/50 hover:bg-red-800 text-white uppercase text-sm tracking-widest cursor-pointer"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    // @ts-ignore - props are available in class components
    return this.props.children;
  }
}

export default ErrorBoundary;
