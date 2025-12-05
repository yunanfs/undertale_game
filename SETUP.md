# UNDERTALE GAME - SETUP GUIDE

## 📋 Requirements

- PHP 7.4+ atau higher
- Web server (Apache, Nginx, atau built-in PHP server)
- Modern web browser dengan Web Audio API support
- Git (opsional)

## 🚀 Installation Steps

### Method 1: Built-in PHP Server (Recommended untuk development)

1. **Buka Terminal/Command Prompt**
   ```bash
   cd "d:\Pendidikan\kuliah\semester 3\praktikum pemweb1\undertale_game"
   ```

2. **Jalankan PHP Server**
   ```bash
   php -S localhost:8000
   ```

3. **Buka di Browser**
   ```
   http://localhost:8000
   ```

4. **Stop Server (Ctrl + C)**
   ```
   CTRL + C
   ```

### Method 2: Apache Web Server

1. **Lokasi Folder**
   - Pindahkan folder ke `htdocs` (XAMPP) atau `www` (WAMP)
   - Contoh: `C:\xampp\htdocs\undertale_game`

2. **Konfigurasi Apache**
   - Virtual host (optional):
   ```apache
   <VirtualHost *:80>
       ServerName undertale.local
       DocumentRoot "C:\xampp\htdocs\undertale_game"
   </VirtualHost>
   ```

3. **Akses Website**
   ```
   http://localhost/undertale_game
   atau
   http://undertale.local (jika virtual host dikonfigurasi)
   ```

### Method 3: Nginx Web Server

1. **Konfigurasi Nginx** (nginx.conf)
   ```nginx
   server {
       listen 80;
       server_name undertale.local;
       root /var/www/undertale_game;
       
       location ~ \.php$ {
           fastcgi_pass 127.0.0.1:9000;
           fastcgi_index index.php;
           include fastcgi_params;
       }
   }
   ```

2. **Restart Nginx**
   ```bash
   nginx -s reload
   ```

## 📂 Folder Permissions

Pastikan folder `logs/` memiliki write permission:

**Windows (XAMPP/WAMP):**
- Biasanya sudah writable secara default

**Linux/Mac:**
```bash
chmod 755 undertale_game
chmod 777 undertale_game/logs
```

## 🔧 Konfigurasi Optional

### 1. Database Setup (MySQL)

Jika ingin menggunakan database:

1. **Create Database**
   ```sql
   CREATE DATABASE undertale_game;
   USE undertale_game;
   ```

2. **Import Schema**
   - Buka `php/database.php`
   - Copy SQL script dari comment area
   - Paste ke MySQL client atau phpMyAdmin

3. **Update Config**
   - Edit `php/config.php`
   - Sesuaikan DB_USER, DB_PASSWORD, DB_NAME

### 2. Environment Variables

Buat file `.env` di root folder:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=undertale_game
APP_ENV=development
APP_DEBUG=true
```

## 🎮 First Launch Checklist

- [ ] Server berjalan di localhost:8000 atau sesuai config
- [ ] Website terbuka tanpa error 404
- [ ] Sound effects terdengar saat klik button
- [ ] HP bar berubah warna sesuai persentase
- [ ] Dialog animasi berjalan dengan smooth
- [ ] Keyboard shortcuts berfungsi (F, A, I, M)
- [ ] Responsive design OK di mobile

## 🐛 Troubleshooting

### "Port 8000 already in use"
```bash
# Gunakan port lain
php -S localhost:8001
```

### "Cannot access php files"
- Check folder permissions
- Pastikan .htaccess tidak di-block
- Verify Apache mod_rewrite enabled

### "No sound effects"
- Check browser console untuk errors
- Verify Web Audio API support di browser
- Coba browser lain (Chrome, Firefox)

### "404 - File not found"
- Verify file structure sesuai dokumentasi
- Check file paths di HTML/CSS/JS
- Pastikan case sensitivity (Linux/Mac)

### "Database connection failed"
- Verify MySQL service running
- Check credentials di config.php
- Create database dan tables

## 📊 Performance Tips

1. **Enable Gzip Compression** (di .htaccess sudah included)
2. **Cache Static Files** (setup di .htaccess)
3. **Minimize CSS/JS** (opsional untuk production)
4. **Use CDN** (untuk assets besar)

## 🔐 Production Deployment

Before going live:

1. Update `.htaccess` dengan production settings
2. Disable error display:
   ```php
   ini_set('display_errors', 0);
   ```
3. Enable error logging
4. Setup SSL/HTTPS
5. Update CORS headers
6. Add proper authentication
7. Backup database regularly

## 📞 Support

Jika ada masalah:

1. Check browser console (F12)
2. Check server logs di `logs/` folder
3. Verify file permissions
4. Test dengan PHP built-in server
5. Check PHP version: `php -v`

## 📚 Additional Resources

- [PHP Official Documentation](https://www.php.net/docs.php)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTML5 Reference](https://html.spec.whatwg.org/)
- [CSS3 Guide](https://www.w3schools.com/css/)

---

**Happy Gaming!** 🎮❤️
