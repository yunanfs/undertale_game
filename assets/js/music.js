// ============================================
// UNDERTALE MUSIC PLAYER
// ============================================

class MusicPlayer {
    constructor() {
        this.playlist = [
            { title: 'Once Upon A Time', file: 'menu', duration: 92 },
            { title: 'Your Best Friend', file: 'friend', duration: 102 },
            { title: 'Heartache', file: 'heartache', duration: 120 },
            { title: 'Bonetrousle', file: 'bone', duration: 112 },
            { title: 'Megalovania', file: 'mega', duration: 158 },
            { title: 'Death By Glamour', file: 'glamour', duration: 142 },
            { title: 'ASGORE', file: 'asgore', duration: 139 }
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
        this.volume = 0.5;
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.currentTime = 0;
        this.intervalId = null;
    }

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.setupPlayer();
        this.setupControls();
    }

    setupPlayer() {
        const playerHTML = `
            <div id="music-player" class="music-player">
                <div class="music-player-header">
                    <span class="music-icon">♪</span>
                    <span class="music-label">MUSIC</span>
                    <button id="music-toggle" class="music-toggle" aria-label="Toggle player">▼</button>
                </div>
                <div id="music-player-content" class="music-player-content">
                    <div class="music-info">
                        <div id="track-title" class="track-title">Once Upon A Time</div>
                        <div id="track-time" class="track-time">0:00 / 1:32</div>
                    </div>
                    <div class="music-controls">
                        <button id="btn-prev" class="music-btn" aria-label="Previous">⏮</button>
                        <button id="btn-play" class="music-btn music-btn-play" aria-label="Play">▶</button>
                        <button id="btn-next" class="music-btn" aria-label="Next">⏭</button>
                    </div>
                    <div class="volume-control">
                        <span class="volume-icon">🔊</span>
                        <input type="range" id="volume-slider" class="volume-slider" min="0" max="100" value="50">
                    </div>
                    <div class="playlist">
                        <div class="playlist-title">PLAYLIST:</div>
                        <div id="playlist-items" class="playlist-items"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
        
        // Populate playlist
        this.updatePlaylist();
    }

    setupControls() {
        // Toggle player
        const toggleBtn = document.getElementById('music-toggle');
        const content = document.getElementById('music-player-content');
        
        toggleBtn.addEventListener('click', () => {
            content.classList.toggle('hidden');
            toggleBtn.textContent = content.classList.contains('hidden') ? '▼' : '▲';
        });
        
        // Play/Pause
        document.getElementById('btn-play').addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });
        
        // Previous
        document.getElementById('btn-prev').addEventListener('click', () => {
            this.previous();
        });
        
        // Next
        document.getElementById('btn-next').addEventListener('click', () => {
            this.next();
        });
        
        // Volume
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            if (this.gainNode) {
                this.gainNode.gain.value = this.volume * 0.3;
            }
        });
        
        // Playlist items
        document.getElementById('playlist-items').addEventListener('click', (e) => {
            const item = e.target.closest('.playlist-item');
            if (item) {
                const index = parseInt(item.dataset.index);
                this.playTrack(index);
            }
        });
    }

    updatePlaylist() {
        const playlistEl = document.getElementById('playlist-items');
        playlistEl.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (index === this.currentTrack) {
                item.classList.add('active');
            }
            item.dataset.index = index;
            item.innerHTML = `<span class="playlist-number">${index + 1}.</span> ${track.title}`;
            playlistEl.appendChild(item);
        });
    }

    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        document.getElementById('btn-play').textContent = '⏸';
        
        // Create simple tone (simulating music)
        this.playTone();
        
        // Update time
        this.currentTime = 0;
        this.intervalId = setInterval(() => {
            this.currentTime++;
            this.updateTimeDisplay();
            
            // Auto next track
            if (this.currentTime >= this.playlist[this.currentTrack].duration) {
                this.next();
            }
        }, 1000);
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('btn-play').textContent = '▶';
        
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    playTone() {
        if (this.oscillator) {
            this.oscillator.stop();
        }
        
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();
        
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        
        // Different frequency for each track
        const frequencies = [440, 523, 587, 659, 698, 784, 880];
        this.oscillator.frequency.value = frequencies[this.currentTrack];
        this.oscillator.type = 'sine';
        
        this.gainNode.gain.value = this.volume * 0.3;
        
        this.oscillator.start();
    }

    next() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.playTrack(this.currentTrack);
    }

    previous() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.playTrack(this.currentTrack);
    }

    playTrack(index) {
        const wasPlaying = this.isPlaying;
        this.pause();
        this.currentTrack = index;
        this.currentTime = 0;
        
        document.getElementById('track-title').textContent = this.playlist[index].title;
        this.updateTimeDisplay();
        this.updatePlaylist();
        
        if (wasPlaying) {
            this.play();
        }
    }

    updateTimeDisplay() {
        const current = this.formatTime(this.currentTime);
        const total = this.formatTime(this.playlist[this.currentTrack].duration);
        document.getElementById('track-time').textContent = `${current} / ${total}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize music player when DOM is ready
let musicPlayer = null;

document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        musicPlayer = new MusicPlayer();
        musicPlayer.init();
        window.musicPlayer = musicPlayer;
    }, 500);
});