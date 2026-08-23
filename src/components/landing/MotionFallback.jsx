/**
 * Lightweight framer-motion-like wrapper.
 *
 * Instead of pulling in framer-motion (which adds ~30kb gzipped), we use CSS
 * animations defined in tailwind.config.js + index.css.
 *
 * The `motion.div` / `motion.h1` / `motion.p` syntax matches framer-motion's
 * API, so if we ever want to swap in the real thing, the migration is trivial.
 */
import React from 'react';

const make = (Tag) =>
  React.forwardRef(function MotionTag(
    { initial, animate, transition, children, className, ...props },
    ref
  ) {
    // Derive a CSS class from `animate` props (opacity + y)
    const animClasses = [];
    if (animate?.opacity === 1 && (initial?.opacity ?? 1) === 0) {
      animClasses.push('animate-fade-in');
    }
    return React.createElement(
      Tag,
      {
        ref,
        className: [className, animClasses.join(' ')].filter(Boolean).join(' '),
        ...props,
      },
      children
    );
  });

export const motion = new Proxy(
  {},
  {
    get: (_, tag) => make(tag),
  }
);
