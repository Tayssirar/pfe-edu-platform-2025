import type React from "react"

const BgLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="main-container" dir="rtl">
      <div className="white-box">
        {/* Main cross-shaped layout */}
        <div className="cross-layout"></div>
        {children}
      </div>
    </div>
  )
}

export default BgLayout
