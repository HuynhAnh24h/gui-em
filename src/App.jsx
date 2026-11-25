import { useEffect, useRef, useState } from 'react';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import PetalsLayer from './components/PetalsLayer';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [opened, setOpened] = useState(false);
  const [burstSignal, setBurstSignal] = useState(0);

  const letterRef = useRef(null);
  const musicPlayerRef = useRef(null);
  const focusTimerRef = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(focusTimerRef.current);
    };
  }, []);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setBurstSignal((prev) => prev + 1);

    // Bắt đầu phát nhạc ngay khi chạm vào con dấu mở thư
    musicPlayerRef.current?.startPlayback();

    focusTimerRef.current = window.setTimeout(() => {
      letterRef.current?.focus({ preventScroll: true });
    }, 900);
  };

  return (
    <>
      <PetalsLayer burstSignal={burstSignal} />

      <main className={`stage ${opened ? 'opened' : ''}`.trim()} id="stage">
        <Envelope onOpen={handleOpen} />
        <Letter ref={letterRef} />
      </main>

      <MusicPlayer ref={musicPlayerRef} isVisible={opened} />
    </>
  );
}
