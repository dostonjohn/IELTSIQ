import React from 'react'

const Card = ({ title, action, children, className = "" }) => (
  <section
    className={`rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-4 md:p-6 shadow ${className}`}
    style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.07)" }}
  >
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </section>
);

export default Card
