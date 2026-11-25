# Gửi em (React JS)

Phiên bản React JS (Vite) bám sát giao diện và hiệu ứng của bức thư **Gửi em** (nền trời đêm xanh navy, viền vàng ánh kim, hạt bụi vàng bay lên, phong bì đóng dấu sáp **HA**, cánh hoa rơi khi mở thư, lá thư kẻ dòng kèm cành hoa góc trang) và bổ sung **máy phát đĩa than cổ điển** ở góc dưới bên phải.

## Cách chạy dự án

```bash
npm install
npm run dev
```

Build bản production (xuất ra thư mục `dist/`):

```bash
npm run build
```

> Lưu ý trên Windows PowerShell: nếu bị chặn script `npm.ps1`, dùng `npm.cmd run dev` và `npm.cmd run build`.

## Cách thêm bài hát MP3 của riêng bạn

1. Chép file nhạc `.mp3` vào thư mục `public/music/` (ví dụ `public/music/bai-hat.mp3`).
2. Mở file `src/data/playlist.js` và đặt bài hát đó lên đầu danh sách `PLAYLIST`:

```js
{
  id: 'my-song',
  type: 'audio',
  title: 'Tên bài hát',
  artist: 'Tên ca sĩ',
  src: './music/bai-hat.mp3',
}
```

## Chỉnh sửa nội dung thư

Chỉnh sửa trực tiếp trong file `src/data/letterData.js`.
