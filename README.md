# UNDERTALE GAME - Web Version

Website game Undertale yang dibuat dengan HTML, CSS, JavaScript, dan PHP native (tanpa framework).

## 📁 Struktur Folder

```
undertale_game/
│
├── index.html                 # File utama HTML
│
├── assets/
│   ├── css/
│   │   └── style.css         # Styling lengkap
│   ├── js/
│   │   └── script.js         # Logic game
│   └── images/               # Folder untuk gambar (opsional)
│
├── php/
│   ├── api.php              # Backend API
│   ├── config.php           # Konfigurasi
│   └── database.php         # Database functions (opsional)
│
├── logs/                     # Folder untuk log files
│   ├── actions.log
│   └── errors.log
│
└── README.md                # Dokumentasi

```

## 🎮 Fitur Game

### ✨ Fitur Utama
- **FIGHT** - Serang musuh dengan damage random
- **ACT** - Pilihan non-agresif
- **ITEM** - Gunakan item untuk heal
- **MERCY** - Opsi perdamaian (tema game Undertale)

### 💻 Fitur Technical
- HP Bar dinamis dengan warna gradient
- Sound effects menggunakan Web Audio API
- Responsive design (mobile-friendly)
- Dialog animasi dengan efek typewriter
- Keyboard shortcuts (F, A, I, M, H, L)
- Game state management
- Logging system

## 🚀 Cara Menggunakan

### 1. Setup Awal
```bash
# Clone atau download project
cd undertale_game

# Buka dengan web server lokal
php -S localhost:8000
```

### 2. Akses Website
```
http://localhost:8000
```

### 3. Keyboard Shortcuts
```
F - FIGHT
A - ACT
I - ITEM
M - MERCY
H - Decrease HP (testing)
L - Increase HP (testing)
```

## 📋 File Descriptions

### index.html
- Struktur HTML semantik
- Form untuk action buttons
- Dialog box container
- Script linking

### assets/css/style.css
- Styling retro Undertale
- Animasi heartbeat, typewriter, blink
- Responsive grid layout
- Hover effects dan transitions

### assets/js/script.js
- Game state management
- Action handling (Fight, Act, Item, Mercy)
- Dialog management
- HP calculation dan update
- Sound effects generation
- Keyboard event listeners
- Game over logic

### php/api.php
- RESTful API endpoints
- Game state management
- Action logging
- Dialog retrieval
- Damage calculation
- Battle state checking

### php/config.php
- Configuration constants
- Database settings (optional)
- Game mechanics values
- Error handling setup

## 🎨 Kustomisasi

### Mengubah Karakter
Edit di `index.html`:
```html
<div class="character-name">FRISK</div>
```

### Mengubah Warna
Edit di `assets/css/style.css`:
```css
.dialog-title {
    color: #00ff00; /* Ubah warna dialog title */
}
```

### Mengubah Dialog
Edit di `assets/js/script.js` fungsi `handleMercy()`, `handleAct()`, dll:
```javascript
const mercyOptions = [
    '* Custom dialog 1',
    '* Custom dialog 2'
];
```

## 💾 Data Persistence (Optional)

Untuk menyimpan data permanen:

1. **Database MySQL**
   - Uncomment database connection di `php/api.php`
   - Buat database `undertale_game`
   - Import schema dari `database.sql` (jika ada)

2. **File-based Storage**
   - Actions disimpan di `logs/actions.log`
   - Errors disimpan di `logs/errors.log`

## 🔐 Security Notes

- Input validation dilakukan di backend
- CORS headers sudah dikonfigurasi
- Session management tersedia
- Error reporting disabled di production
- Log files tidak accessible via web

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## 🎵 Audio

Game menggunakan Web Audio API untuk sound effects:
- Sinusoidal oscillator untuk beep sounds
- Frequency-based differentiation
- Dynamic gain envelope

## 📊 Game Mechanics

```
Max HP: 20
Starting Level: 1
Mercy Threshold: 3 actions

Damage Calculation:
- FIGHT: 3-10 damage
- ACT: 0-5 damage
- ITEM: 0 damage (healing)
- MERCY: -5 to 0 damage
```

## 🐛 Debugging

Buka browser console dan gunakan:

```javascript
// Lihat game state
gameState

// Lihat history dialog
logGameState()

// Handle action manual
handleAction('fight')

// Update HP
updateHP(15)
```

## 📝 Lisensi

Inspirasi dari game original Undertale oleh Toby Fox.
Ini adalah project edukatif untuk pembelajaran web development.

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk pembelajaran praktikum pemweb.

---

**Enjoy the peaceful RPG experience!** 💚
