import React from 'react';
import './GlassIcons.css';

const gradientMapping = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

// Presentational form of the official GlassIcons button. The surrounding
// MagicBento card owns the actual button behavior and accessible name.
export function GlassIcon({ icon, color = 'purple', className = '' }) {
  const background = gradientMapping[color] || color;
  return <span className={`icon-btn magic-bento-glass-icon ${className}`.trim()} aria-hidden="true">
    <span className="icon-btn__back" style={{ background }} />
    <span className="icon-btn__front"><span className="icon-btn__icon"><i className={`fa-solid ${icon}`} /></span></span>
  </span>;
}

export default function GlassIcons({ items, className = '' }) {
  return <div className={`icon-btns ${className}`}>{items.map((item, index) => <button key={index} className={`icon-btn ${item.customClass || ''}`} aria-label={item.label} type="button"><span className="icon-btn__back" style={{ background: gradientMapping[item.color] || item.color }} /><span className="icon-btn__front"><span className="icon-btn__icon" aria-hidden="true">{item.icon}</span></span><span className="icon-btn__label">{item.label}</span></button>)}</div>;
}
