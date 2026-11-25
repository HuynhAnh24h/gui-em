import { forwardRef } from 'react';
import { LETTER_CONTENT } from '../data/letterData';

const Letter = forwardRef(function Letter(_props, ref) {
  return (
    <article className="letter" ref={ref} tabIndex={-1} aria-live="polite">
      <p className="to">{LETTER_CONTENT.to}</p>

      {LETTER_CONTENT.paragraphs.map((text, idx) => (
        <p key={idx}>{text}</p>
      ))}

      <p className="sign">
        {LETTER_CONTENT.signature}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
        </svg>
      </p>

      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <symbol id="sprig" viewBox="0 0 80 80">
          <path
            d="M68 12C50 26 34 44 14 76"
            fill="none"
            stroke="var(--soft)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity=".6"
          />
          <path
            d="M52 26q-14-2-18-14 14 0 18 14z"
            fill="var(--soft)"
            opacity=".35"
          />
          <path
            d="M38 46q-14 2-22-8 14-4 22 8z"
            fill="var(--soft)"
            opacity=".35"
          />
          <path
            d="M28 62q-10 4-18-2 10-6 18 2z"
            fill="var(--soft)"
            opacity=".35"
          />
          <g transform="translate(67 13)" fill="var(--rose)">
            <ellipse rx="4" ry="7" cy="-7" />
            <ellipse rx="4" ry="7" cy="-7" transform="rotate(72)" />
            <ellipse rx="4" ry="7" cy="-7" transform="rotate(144)" />
            <ellipse rx="4" ry="7" cy="-7" transform="rotate(216)" />
            <ellipse rx="4" ry="7" cy="-7" transform="rotate(288)" />
            <circle r="3.4" fill="#f1d79b" />
          </g>
        </symbol>
      </svg>

      <svg className="deco tr" aria-hidden="true">
        <use href="#sprig" />
      </svg>
      <svg className="deco bl" aria-hidden="true">
        <use href="#sprig" />
      </svg>
    </article>
  );
});

export default Letter;
