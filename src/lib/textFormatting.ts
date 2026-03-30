import React from 'react';

/**
 * Renders markdown-style **bold** and *italic* inline formatting as React elements.
 * XSS-safe — never uses dangerouslySetInnerHTML.
 */
export const renderFormattedText = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/\*([^*]+?)\*/);

    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : Infinity;

    if (boldIndex === Infinity && italicIndex === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIndex <= italicIndex && boldMatch) {
      if (boldIndex > 0) parts.push(remaining.slice(0, boldIndex));
      parts.push(React.createElement('strong', { key: key++, className: 'font-bold text-foreground' }, boldMatch[1]));
      remaining = remaining.slice(boldIndex + boldMatch[0].length);
    } else if (italicMatch) {
      if (italicIndex > 0) parts.push(remaining.slice(0, italicIndex));
      parts.push(React.createElement('em', { key: key++, className: 'italic text-foreground/90' }, italicMatch[1]));
      remaining = remaining.slice(italicIndex + italicMatch[0].length);
    }
  }

  return parts;
};
