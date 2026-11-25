/**
 * Danh sách nhạc phát kèm khi mở thư.
 *
 * Cách thêm bài hát MP3 của riêng bạn:
 * 1. Copy file .mp3 vào thư mục: public/music/ (ví dụ: public/music/bai-hat.mp3)
 * 2. Thêm (hoặc thay thế) mục đầu tiên bên dưới với type: 'audio' và src: './music/bai-hat.mp3'
 */
export const PLAYLIST = [
  {
    id: 'gentle-piano',
    type: 'audio',
    preset: 'warm-letter',
    src: './music/music.mp3',
    title: 'Giai Điệu Dịu Dàng',
    artist: 'Dành riêng cho em',
    duration: 32,
  },
];
