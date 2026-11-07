import React from 'react';

export function Icon({ name, width = "1.15em", height = "1.15em", style, className = "ico" }) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    width,
    height,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: { verticalAlign: "-0.18em", ...style }
  };

  switch (name) {
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...commonProps}>
          <path d="M6 20V10M12 20V4M18 20v-6" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M16 8l-2 6-6 2 2-6z" />
        </svg>
      );
    case 'database':
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14a9 3 0 0 0 18 0V5" />
          <path d="M3 12a9 3 0 0 0 18 0" />
        </svg>
      );
    case 'user':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...commonProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...commonProps}>
          <path d="M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6-5.6-1.9 5.6-1.9z" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...commonProps}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...commonProps}>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...commonProps}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...commonProps}>
          <path d="M12 15V3M7 8l5-5 5 5M5 21h14" />
        </svg>
      );
    case 'import':
      return (
        <svg {...commonProps}>
          <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'check':
      return (
        <svg {...commonProps}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'bulb':
      return (
        <svg {...commonProps}>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...commonProps}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...commonProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...commonProps}>
          <path d="M12 2L2 7l10 5 10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'box':
      return (
        <svg {...commonProps}>
          <path d="M21 16V8l-9-5-9 5v8l9 5z" />
          <path d="M3.3 7L12 12l8.7-5M12 22V12" />
        </svg>
      );
    case 'puzzle':
      return (
        <svg {...commonProps}>
          <path d="M12 2L2 7l10 5 10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'ghost':
      return (
        <svg {...commonProps}>
          <path d="M9 10h.01M15 10h.01" />
          <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
        </svg>
      );
    case 'coffee':
      return (
        <svg {...commonProps}>
          <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
          <path d="M6 2v2M10 2v2M14 2v2" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...commonProps}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
        </svg>
      );
    case 'home':
      return (
        <svg {...commonProps}>
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...commonProps}>
          <path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-3.5-6.5C14 7 13.5 5 13 2c-3 2.5-6 6-6 10a5 5 0 0 0 .8 2.8" />
          <path d="M12 22a4 4 0 0 1-4-4c0-2 2-3.5 4-6 2 2.5 4 4 4 6a4 4 0 0 1-4 4z" />
        </svg>
      );
    case 'plant':
      return (
        <svg {...commonProps}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" />
          <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
        </svg>
      );
    case 'users':
      return (
        <svg {...commonProps}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...commonProps}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case 'alert-triangle':
      return (
        <svg {...commonProps}>
          <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...commonProps}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case 'external-link':
      return (
        <svg {...commonProps}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
    case 'star':
      return (
        <svg {...commonProps}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'log-out':
      return (
        <svg {...commonProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    case 'x':
      return (
        <svg {...commonProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    default:
      return null;
  }
}
