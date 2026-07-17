import React from "react";

interface LoaderProps {
  /**
   * The text to display underneath the loading spinner.
   * If omitted, defaults to "Loading..."
   */
  text?: string;
  /**
   * Whether the loader should occupy the full screen height (h-screen).
   * If false, it behaves as a centered block element for cards/containers.
   * @default true
   */
  fullScreen?: boolean;
  /**
   * Optional custom container className to override the default layout wrapper.
   */
  className?: string;
}

export function PremiumLoader({ text = "Loading...", fullScreen = true, className }: LoaderProps) {
  const containerClasses = className
    ? className
    : (fullScreen
      ? "flex h-screen w-full items-center justify-center bg-[#f5f7fb]"
      : "flex items-center justify-center p-8 w-full");

  return (
    <div className={containerClasses}>
      <div className="journal-loader-container">
        <div className="academic-book">
          <div className="academic-book__spine" />
          
          {/* Left static page */}
          <div className="academic-book__page academic-book__page--left">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          
          {/* Right static page */}
          <div className="academic-book__page academic-book__page--right">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          
          {/* Flipping pages leafing dynamically */}
          <div className="academic-book__page academic-book__page--flipping page-1">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="academic-book__page academic-book__page--flipping page-2">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="academic-book__page academic-book__page--flipping page-3">
            <div className="academic-book__page-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
        
        {text && <p className="shimmer-text">{text}</p>}
      </div>
    </div>
  );
}
