import { ENVELOPE_CONTENT } from '../data/letterData';

export default function Envelope({ onOpen }) {
  return (
    <button
      type="button"
      className="envelope"
      id="open"
      aria-label="Mở thư"
      onClick={onOpen}
    >
      <span className="flap" />
      <span className="seal">{ENVELOPE_CONTENT.seal}</span>
      <span className="address">{ENVELOPE_CONTENT.address}</span>
      <span className="hint">{ENVELOPE_CONTENT.hint}</span>
    </button>
  );
}
