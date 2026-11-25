import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { PLAYLIST } from '../data/playlist';
import { RomanticSynthPlayer } from '../utils/romanticPiano';

const MusicPlayer = forwardRef(function MusicPlayer({ isVisible }, ref) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const synthRef = useRef(null);

  const currentTrack = PLAYLIST[trackIndex] || PLAYLIST[0];
  const volume = 0.65;

  const getSynth = useCallback(() => {
    if (!synthRef.current) {
      synthRef.current = new RomanticSynthPlayer();
    }
    return synthRef.current;
  }, []);

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthRef.current) {
      synthRef.current.pause();
    }
  }, []);

  const playTrack = useCallback(
    (index, resetPosition = false) => {
      const track = PLAYLIST[index] || PLAYLIST[0];
      if (!track) return;

      stopAll();

      if (track.type === 'audio' && track.src) {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.getAttribute('data-track-id') !== track.id) {
          audio.src = track.src;
          audio.setAttribute('data-track-id', track.id);
        }
        if (resetPosition) {
          audio.currentTime = 0;
        }
        audio.volume = volume;
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        const synth = getSynth();
        if (resetPosition || synth.presetKey !== (track.preset || 'warm-letter')) {
          synth.setPreset(track.preset || 'warm-letter');
        }
        synth.setVolume(volume);
        synth.play();
        setIsPlaying(true);
      }
    },
    [getSynth, stopAll]
  );

  // Kích hoạt phát nhạc ngay trong sự kiện click mở thư
  useImperativeHandle(
    ref,
    () => ({
      startPlayback: () => {
        playTrack(trackIndex, true);
      },
    }),
    [playTrack, trackIndex]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (trackIndex + 1) % PLAYLIST.length;
    setTrackIndex(nextIdx);
    playTrack(nextIdx, true);
  }, [playTrack, trackIndex]);

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;
    synth.onEnded = () => {
      if (PLAYLIST.length > 1) {
        handleNext();
      } else {
        synth.seek(0);
      }
    };
  }, [handleNext]);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.destroy();
        synthRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopAll();
      setIsPlaying(false);
    } else {
      playTrack(trackIndex, false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={() => {
          if (PLAYLIST.length > 1) {
            handleNext();
          } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
        onError={() => {
          if (currentTrack?.type === 'audio') {
            setIsPlaying(false);
          }
        }}
      />

      {isVisible && (
        <aside
          className={`turntable-player ${isPlaying ? 'playing' : 'paused'}`}
          aria-label="Máy phát đĩa than cổ điển"
        >
          <span className="tt-tooltip" role="status" aria-live="polite">
            {isPlaying ? `♪ ${currentTrack.title}` : 'Nhấn để phát nhạc'}
          </span>

          <div className="tt-notes" aria-hidden="true">
            <span className="tt-note n1">♪</span>
            <span className="tt-note n2">♫</span>
          </div>

          <button
            type="button"
            className="tt-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
            title={
              isPlaying
                ? `Đang phát: ${currentTrack.title} (Nhấn để tạm dừng)`
                : `Tạm dừng: ${currentTrack.title} (Nhấn để phát)`
            }
          >
            <div className="tt-deck" aria-hidden="true">
              {/* Đĩa than đen xoay trên mâm cổ điển */}
              <div className="tt-platter">
                <div className="tt-vinyl">
                  <span className="tt-grooves" />
                  <span className="tt-sheen" />
                  <span className="tt-label">
                    <svg className="tt-heart" viewBox="0 0 24 24">
                      <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
                    </svg>
                    <span className="tt-spindle" />
                  </span>
                </div>
              </div>

              {/* Cần gạt kim đĩa than bằng đồng cổ */}
              <div className="tt-arm-wrap">
                <div className="tt-arm-pivot">
                  <span className="tt-arm-screw" />
                </div>
                <svg
                  className="tt-arm-svg"
                  viewBox="0 0 36 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="20" y="2" width="7" height="9" rx="2" fill="#c9a566" />
                  <path
                    d="M23.5 11 V47 Q23.5 54 16 61"
                    stroke="#f1d79b"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <g transform="translate(13.5 62) rotate(36)">
                    <rect
                      x="-3.5"
                      y="-5"
                      width="7"
                      height="10"
                      rx="1.6"
                      fill="#2b1915"
                      stroke="#f1d79b"
                      strokeWidth="1"
                    />
                    <rect x="-1" y="4.5" width="2" height="2.4" rx="0.6" fill="#e8cf93" />
                  </g>
                </svg>
              </div>

              {/* Đèn báo & núm xoay đồng cổ */}
              <span className="tt-led" />
              <span className="tt-knob" />
            </div>
          </button>
        </aside>
      )}
    </>
  );
});

export default MusicPlayer;
