# 👾 Minigame Market

Satu situs **GitHub Pages** berisi hub arcade + **10 minigame** (clicker & platformer). 100% static — cuma HTML, CSS, dan JavaScript. Tanpa backend, tanpa build step, tanpa dependency.

## 🎮 Daftar Game

| # | Game | Genre | File |
|---|------|-------|------|
| 1 | Snack Tycoon | Idle Clicker | `games/snack-tycoon.html` |
| 2 | Cosmic Miner | Space Idle | `games/cosmic-miner.html` |
| 3 | Monster Tap RPG | Clicker RPG | `games/monster-tap.html` |
| 4 | Kopi Kita | Coffee Idle | `games/kopi-kita.html` |
| 5 | Tiny Garden | Idle Grow | `games/tiny-garden.html` |
| 6 | Jumpy Box | Platformer 2D | `games/jumpy-box.html` |
| 7 | Pixel Dash | Endless Runner | `games/pixel-dash.html` |
| 8 | Ninja Leap | Wall-Jump | `games/ninja-leap.html` |
| 9 | Click Defender | Tap Survival | `games/click-defender.html` |
| 10 | Lava Climb | Vertical Climber | `games/lava-climb.html` |

## 📁 Struktur

```
minigame-market/
├─ index.html            # Hub / landing arcade
├─ assets/
│  ├─ style.css          # Tema neon + shell game bersama
│  ├─ idle.css           # Style engine idle/clicker
│  ├─ idle.js            # Engine idle/clicker (dipakai 4 game)
│  └─ canvas.css         # HUD + overlay untuk game canvas
├─ games/                # 10 file game
└─ README.md
```

- **4 game clicker** (Snack, Cosmic, Kopi, Tiny Garden) berbagi engine `assets/idle.js` — cukup ganti config-nya.
- **Monster Tap RPG** & **5 game canvas** punya logika sendiri di dalam file masing-masing.
- Progress idle & high score tersimpan otomatis lewat `localStorage` (per perangkat).

## 🚀 Cara Deploy ke GitHub Pages

1. Buka **Settings → Pages**.
2. Bagian **Source**, pilih branch `main` + folder `/ (root)`, lalu **Save**.
3. Tunggu 1–2 menit. Game live di:
   `https://m45argaeth.github.io/misoku/`

## 💡 Catatan

- Semua path antar-file pakai path **relatif**, jadi aman dipasang di subpath GitHub Pages.
- Tinggal buka `index.html` di browser buat ngetes lokal.
- Gampang ditambah: duplikat salah satu file game clicker, ganti config-nya, lalu tambahkan entri baru di array `GAMES` dalam `index.html`.

Dibuat dengan ❤️ — selamat bermain & nge-deploy!
