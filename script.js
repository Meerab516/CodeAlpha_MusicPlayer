// ============================================================
// SONGS: add your own mp3 files inside a "songs" folder next to
// this script, then update the list below with the file names,
// titles and artists. Free royalty-free tracks: pixabay.com/music
// or the YouTube Audio Library.
// ============================================================
const songs = [
  { title: "Song One",   artist: "Artist One",   src: "songs/track1.mp3" },
  { title: "Song Two",   artist: "Artist Two",   src: "songs/track2.mp3" },
  { title: "Song Three", artist: "Artist Three", src: "songs/track3.mp3" },
];

const audio = document.getElementById('audio');
const art = document.getElementById('art');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const playlistItems = document.getElementById('playlistItems');

let currentIndex = 0;
let isPlaying = false;

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function loadSong(index) {
  const song = songs[index];
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  audio.src = song.src;
  highlightActive(index);
}

function playSong() {
  isPlaying = true;
  audio.play();
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';
  art.classList.add('playing');
  playBtn.setAttribute('aria-label', 'Pause');
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  art.classList.remove('playing');
  playBtn.setAttribute('aria-label', 'Play');
}

function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

// Progress bar updates as song plays
audio.addEventListener('timeupdate', () => {
  if (!isNaN(audio.duration)) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

// Autoplay next track when current one ends (bonus feature)
audio.addEventListener('ended', nextSong);

// Seek when user drags the progress bar
progressBar.addEventListener('input', () => {
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

// Volume control (bonus feature)
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});
audio.volume = volumeBar.value / 100;

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Build playlist UI (bonus feature)
function renderPlaylist() {
  playlistItems.innerHTML = '';
  songs.forEach((song, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${song.title}</span><span class="item-artist">${song.artist}</span>`;
    li.addEventListener('click', () => {
      currentIndex = i;
      loadSong(currentIndex);
      playSong();
    });
    playlistItems.appendChild(li);
  });
}

function highlightActive(index) {
  [...playlistItems.children].forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
}

renderPlaylist();
loadSong(currentIndex);
