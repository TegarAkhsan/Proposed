Design system · Website kasih sayang

Tidak harus jauh, tidak harus mahal. Cukup kamu, langit sore, dan cerita yang tidak habis. Pilih satu rencana. Sisanya aku yang siapkan.

Konsep

## Satu hari, tiga warna langit

Seluruh sistem warna mengikuti jam: pagi emas, sore jingga ke mawar, malam ungu anggur. Setiap rencana tinggal menunjuk jamnya, jadi kartu, penanda waktu, dan foto polaroid otomatis ikut berwarna. Dasarnya blush muda di mode terang dan anggur gelap di mode malam, dengan satu warna aksen mawar untuk semua tombol.

Warna

## Palet

Semua warna dipakai lewat token. Nilai di bawah mengikuti tema yang sedang aktif, coba tombol ganti tema di atas.

Tipografi

## Tiga suara

Bodoni Moda miring untuk kalimat besar yang romantis, Figtree untuk teks yang harus mudah dibaca, Caveat untuk tulisan tangan di polaroid dan catatan kecil.

`--f-display`\
`Display 64 / italic`

Ada hari yang ingin kuhabiskan denganmu

`--f-display`\
`Judul 32 / 500`

Plan B, sore yang pelan

`--f-body`\
`Teks 16 / 1.6`

Lagoon jam empat sore, bawa cat air kecil dan satu buku untuk dibaca bergantian.

`--f-body`\
`Label 12 / caps`

Sore · 16.00

`--f-hand`\
`Tulisan tangan 28`

nanti kita foto di sini ya

Bentuk dan gerak

## Radius, bayangan, animasi

**Radius**

`--r-sm 6 · --r-md 14 · --r-pill 999`Polaroid hampir tanpa radius (3px) supaya terasa seperti kertas foto sungguhan.

**Bayangan**

`--shadow`Satu bayangan lembut berwarna mawar, dipakai di polaroid dan kartu saat hover.

**Gerak** `--ease cubic-bezier(.22,.8,.3,1)` Kata muncul satu per satu naik 0,5em dengan jeda 110 ms. Kolom polaroid mengalir pelan ke atas selama 38 detik per putaran. Hover menegakkan polaroid. Jika perangkat meminta gerak minimal, semuanya diam dan semua teks tetap terbaca.

Komponen · Polaroid

## Foto dengan tulisan tangan

Dipakai di kolom bergerak samping teks, atau dijatuhkan dari atas satu per satu saat pengunjung menggulir. Selang-seling kiri dan kanan, kemiringan antara -4° dan 4°. Ganti area gradien dengan foto asli berbentuk persegi.

pagi

sarapan dulu

sore

langitnya jingga

malam

jalan pelan-pelan

Komponen · Kartu rencana

## Pilih satu, lalu simpan ke kalender

Kartu bisa dicoba langsung. Pilih rencana, atur tanggal dan jam mulai, lalu tombol Google Calendar membuka acara yang sudah terisi.

Tanggal

Mulai jam

[Tambahkan ke Google Calendar](#)

Komponen · Tombol dan chip

## Status interaksi

Utama Sekunder Belum bisa dipilih PagiSoreMalam

Alur halaman

## Urutan dari atas ke bawah

Pembuka

### Kata-kata

Kalimat besar muncul per kata, tulisan tangan menyusul. Polaroid mengalir di sisi kanan, atau di kiri pada bagian berikutnya.

Cerita

### Foto dan kenangan

Polaroid selang-seling dengan satu kalimat pendek. Maksimal tiga baris per kenangan.

Pilihan

### Plan A, B, C

Tiga kartu sejajar. Satu terpilih pada satu waktu, ditandai garis mawar.

Penutup

### Tanggal dan kalender

Panel tanggal, jam, lalu tombol Google Calendar dan salin rencana.

Aturan pakai

## Yang dilakukan dan dihindari

### Lakukan

- Satu aksen mawar untuk semua tombol dan pilihan.
- Warna pagi, sore, malam hanya untuk penanda waktu dan foto.
- Tulisan tangan hanya untuk catatan pendek, bukan paragraf.
- Teks selalu terbaca penuh tanpa menunggu animasi.
- Hormati pengaturan gerak minimal di perangkat.

### Hindari

- Lebih dari satu kolom polaroid bergerak dalam satu layar.
- Kemiringan di atas 4° atau foto yang menutupi teks.
- Memakai warna jingga atau ungu untuk tombol.
- Ikon hati di setiap judul. Satu kalimat yang tulus lebih kuat.
- Kontras rendah antara tulisan tangan dan latar.