import React from 'react'
import { Link } from 'react-router-dom'
import { isValidTo } from '../utils'

const PrimaryButton = (props = {}) => {
  const { as = "button", to, className = "", children, style, disabled, title, ...rest } = props;
  const linkMode = isValidTo(to) && !disabled;
  const Comp = linkMode ? Link : as;
  const compProps = linkMode ? { to } : {};
  const restSafe = rest && typeof rest === "object" ? rest : {};
  return (
    <Comp
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-transform active:scale-[0.98] shadow ${className || ""}`}
      style={{ background: "var(--btn-bg, #4f46e5)", color: "var(--btn-fg, #fff)", ...(style || {}) }}
      {...compProps}
      {...restSafe}
      disabled={disabled}
      title={title}
    >
      {children}
    </Comp>
  );
};

export default PrimaryButton
