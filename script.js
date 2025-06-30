// Dados padrão
const defaultData = {
  songs: [
    {
      id: 1,
      title: "Brilho do Teu Olhar",
      album: "Singles",
      artist: "JonhMax",
      tags: ["romântica", "acústica"],
      cover: "https://via.placeholder.com/300x300/7c3aed/ffffff?text=Brilho+do+Teu+Olhar",
      audioUrl: "",
      soundcloudEmbed: `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2121343752%3Fsecret_token%3Ds-Su3gjVWFZFY&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>`,
      duration: "3:45",
    },
    {
      id: 2,
      title: "Chamas do Desejo",
      album: "Velvet Rage",
      artist: "JonhMax",
      tags: ["power metal", "emocional"],
      cover: "https://via.placeholder.com/300x300/7c3aed/ffffff?text=Chamas+do+Desejo",
      audioUrl: "",
      soundcloudEmbed: "",
      duration: "4:32",
    },
    {
      id: 3,
      title: "Noite Eterna",
      album: "Velvet Rage",
      artist: "JonhMax",
      tags: ["metal", "atmosférico"],
      cover: "https://via.placeholder.com/300x300/7c3aed/ffffff?text=Noite+Eterna",
      audioUrl: "",
      soundcloudEmbed: "",
      duration: "5:18",
    },
  ],
  albums: [
    {
      id: 1,
      name: "Velvet Rage",
      cover: "https://via.placeholder.com/400x400/7c3aed/ffffff?text=Velvet+Rage",
      description: "Álbum de estreia com sonoridade power metal e letras emocionais",
      year: "2024",
      songs: ["Chamas do Desejo", "Noite Eterna"],
    },
    {
      id: 2,
      name: "Singles",
      cover: "https://via.placeholder.com/400x400/7c3aed/ffffff?text=Singles",
      description: "Coletânea de singles e faixas especiais",
      year: "2024",
      songs: ["Brilho do Teu Olhar"],
    },
  ],
  news: [
    {
      id: 1,
      title: "Bem-vindos ao JonhMax Grupo Virtual",
      content:
        "Marcelo Santos Melo apresenta seu projeto musical inovador que une criação autoral com inteligência artificial. O JonhMax nasce da fusão entre emoção humana e tecnologia, criando uma nova forma de fazer música.",
      image: "https://via.placeholder.com/500x300/7c3aed/ffffff?text=JonhMax+News",
      category: "geral",
      date: new Date().toLocaleDateString("pt-BR"),
      author: "Marcelo Santos Melo",
    },
  ],
}

// Estado da aplicação
const appState = {
  currentTab: "home",
  currentAdminTab: "overview",
  currentSong: null,
  isPlaying: false,
  currentIndex: 0,
  currentTime: 0,
  duration: 0,
  volume: 70,
  isLoading: false,
  playerType: null,
  soundcloudWidget: null,
  soundcloudReady: false,
  songs: [],
  albums: [],
  news: [],
}

// Elementos DOM
const elements = {
  // Tabs
  navTabs: document.querySelectorAll(".nav-tab"),
  tabContents: document.querySelectorAll(".tab-content"),

  // Admin
  adminPanel: document.getElementById("admin-panel"),
  adminTabs: document.querySelectorAll(".admin-tab"),
  adminTabContents: document.querySelectorAll(".admin-tab-content"),

  // Player
  player: document.getElementById("player"),
  audioPlayer: document.getElementById("audio-player"),
  playBtn: document.getElementById("play-btn"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  volumeSlider: document.getElementById("volume-slider"),
  progressSlider: document.getElementById("progress-slider"),
  currentTimeEl: document.getElementById("current-time"),
  durationTimeEl: document.getElementById("duration-time"),
  playerCover: document.getElementById("player-cover"),
  playerTitle: document.getElementById("player-title"),
  playerAlbum: document.getElementById("player-album"),
  playerType: document.getElementById("player-type"),
  playerLoading: document.getElementById("player-loading"),

  // Content containers
  latestSongs: document.getElementById("latest-songs"),
  songsGrid: document.getElementById("songs-grid"),
  albumsGrid: document.getElementById("albums-grid"),
  newsList: document.getElementById("news-list"),

  // Stats
  totalSongs: document.getElementById("total-songs"),
  totalAlbums: document.getElementById("total-albums"),
  totalNews: document.getElementById("total-news"),

  // Forms
  songForm: document.getElementById("song-form"),
  albumForm: document.getElementById("album-form"),
  newsForm: document.getElementById("news-form"),

  // SoundCloud
  soundcloudContainer: document.getElementById("soundcloud-container"),
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadData()
  initializeEventListeners()
  loadSoundCloudAPI()
  renderContent()
  updateStats()
})

// Carregar dados do localStorage
function loadData() {
  const savedSongs = localStorage.getItem("jonhmax-songs")
  const savedAlbums = localStorage.getItem("jonhmax-albums")
  const savedNews = localStorage.getItem("jonhmax-news")

  appState.songs = savedSongs ? JSON.parse(savedSongs) : defaultData.songs
  appState.albums = savedAlbums ? JSON.parse(savedAlbums) : defaultData.albums
  appState.news = savedNews ? JSON.parse(savedNews) : defaultData.news
}

// Salvar dados no localStorage
function saveData() {
  localStorage.setItem("jonhmax-songs", JSON.stringify(appState.songs))
  localStorage.setItem("jonhmax-albums", JSON.stringify(appState.albums))
  localStorage.setItem("jonhmax-news", JSON.stringify(appState.news))
}

// Carregar API do SoundCloud
function loadSoundCloudAPI() {
  if (window.SC) {
    appState.soundcloudReady = true
    updateStatusIndicator()
  } else {
    // A API já está sendo carregada no HTML
    setTimeout(() => {
      if (window.SC) {
        appState.soundcloudReady = true
        updateStatusIndicator()
      }
    }, 2000)
  }
}

// Atualizar indicador de status
function updateStatusIndicator() {
  const statusDot = document.querySelector(".status-dot")
  const statusText = statusDot.nextElementSibling

  if (appState.soundcloudReady) {
    statusDot.classList.add("active")
    statusText.textContent = "SoundCloud OK"
  } else {
    statusDot.classList.remove("active")
    statusText.textContent = "Carregando..."
  }
}

// Event Listeners
function initializeEventListeners() {
  // Navigation tabs
  elements.navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.onclick.toString().match(/'([^']+)'/)[1]
      showTab(tabName)
    })
  })

  // Admin tabs
  elements.adminTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.onclick.toString().match(/'([^']+)'/)[1]
      showAdminTab(tabName)
    })
  })

  // Player controls
  if (elements.playBtn) {
    elements.playBtn.addEventListener("click", togglePlay)
  }
  if (elements.prevBtn) {
    elements.prevBtn.addEventListener("click", previousSong)
  }
  if (elements.nextBtn) {
    elements.nextBtn.addEventListener("click", nextSong)
  }

  // Volume control
  if (elements.volumeSlider) {
    elements.volumeSlider.addEventListener("input", (e) => {
      appState.volume = Number.parseInt(e.target.value)
      updateVolume()
    })
  }

  // Progress control
  if (elements.progressSlider) {
    elements.progressSlider.addEventListener("input", (e) => {
      const newTime = (e.target.value / 100) * appState.duration
      seekTo(newTime)
    })
  }

  // Forms
  if (elements.songForm) {
    elements.songForm.addEventListener("submit", handleSongSubmit)
  }
  if (elements.albumForm) {
    elements.albumForm.addEventListener("submit", handleAlbumSubmit)
  }
  if (elements.newsForm) {
    elements.newsForm.addEventListener("submit", handleNewsSubmit)
  }

  // Audio player events
  if (elements.audioPlayer) {
    elements.audioPlayer.addEventListener("timeupdate", updateProgress)
    elements.audioPlayer.addEventListener("loadedmetadata", updateDuration)
    elements.audioPlayer.addEventListener("ended", nextSong)
    elements.audioPlayer.addEventListener("loadstart", () => setLoading(true))
    elements.audioPlayer.addEventListener("canplay", () => setLoading(false))
    elements.audioPlayer.addEventListener("error", handleAudioError)
  }
}

// Navegação entre tabs
function showTab(tabName) {
  // Update nav tabs
  elements.navTabs.forEach((tab) => tab.classList.remove("active"))
  document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add("active")

  // Update tab contents
  elements.tabContents.forEach((content) => content.classList.remove("active"))
  document.getElementById(`${tabName}-tab`).classList.add("active")

  appState.currentTab = tabName
}

// Admin panel
function toggleAdmin() {
  elements.adminPanel.classList.toggle("hidden")
}

function showAdminTab(tabName) {
  // Update admin tabs
  elements.adminTabs.forEach((tab) => tab.classList.remove("active"))
  document.querySelector(`[onclick="showAdminTab('${tabName}')"]`).classList.add("active")

  // Update admin tab contents
  elements.adminTabContents.forEach((content) => content.classList.remove("active"))
  document.getElementById(`admin-${tabName}`).classList.add("active")

  appState.currentAdminTab = tabName
}

// Renderizar conteúdo
function renderContent() {
  renderLatestSongs()
  renderSongsGrid()
  renderAlbumsGrid()
  renderNewsList()
}

// Renderizar últimas músicas
function renderLatestSongs() {
  if (!elements.latestSongs) return

  const latestSongs = appState.songs.slice(0, 3)
  elements.latestSongs.innerHTML = latestSongs
    .map(
      (song) => `
        <div class="song-item">
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-album">${song.album}</div>
                <div class="song-tags">
                    ${song.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
                <div class="song-types">
                    ${song.audioUrl ? '<span class="type-badge type-audio">🎵 Áudio Direto</span>' : ""}
                    ${song.soundcloudEmbed ? '<span class="type-badge type-soundcloud">🎧 SoundCloud</span>' : ""}
                </div>
            </div>
            <div class="song-duration">${song.duration}</div>
            <button class="play-btn" onclick="playSong(${song.id})">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `,
    )
    .join("")
}

// Renderizar grid de músicas
function renderSongsGrid() {
  if (!elements.songsGrid) return

  elements.songsGrid.innerHTML = appState.songs
    .map(
      (song) => `
        <div class="song-card">
            <img src="${song.cover}" alt="${song.title}" class="song-card-cover">
            <div class="song-card-info">
                <div class="song-title">${song.title}</div>
                <div class="song-album">${song.album}</div>
                <div class="song-tags">
                    ${song.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
                <div class="song-types">
                    ${song.audioUrl ? '<span class="type-badge type-audio">🎵 Direto</span>' : ""}
                    ${song.soundcloudEmbed ? '<span class="type-badge type-soundcloud">🎧 SoundCloud</span>' : ""}
                </div>
            </div>
            <div class="song-card-footer">
                <span class="song-duration">${song.duration}</span>
                <button class="play-btn" onclick="playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Renderizar grid de álbuns
function renderAlbumsGrid() {
  if (!elements.albumsGrid) return

  elements.albumsGrid.innerHTML = appState.albums
    .map(
      (album) => `
        <div class="album-card">
            <div class="album-content">
                <img src="${album.cover}" alt="${album.name}" class="album-cover">
                <div class="album-info">
                    <div class="album-title">${album.name}</div>
                    <div class="album-year">${album.year}</div>
                    <div class="album-description">${album.description}</div>
                    <div class="album-tracks">
                        <h4>Faixas:</h4>
                        ${album.songs
                          .map(
                            (song, index) => `
                            <p>${index + 1}. ${song}</p>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Renderizar lista de notícias
function renderNewsList() {
  if (!elements.newsList) return

  elements.newsList.innerHTML = appState.news
    .map(
      (item) => `
        <div class="news-item">
            <div class="news-content">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" class="news-image">` : ""}
                <div class="news-info">
                    <div class="news-header">
                        <div class="news-title">${item.title}</div>
                        <span class="news-category">${item.category}</span>
                    </div>
                    <div class="news-text">${item.content}</div>
                    <div class="news-meta">
                        <span><i class="fas fa-calendar"></i> ${item.date}</span>
                        <span><i class="fas fa-user"></i> ${item.author}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Atualizar estatísticas
function updateStats() {
  if (elements.totalSongs) elements.totalSongs.textContent = appState.songs.length
  if (elements.totalAlbums) elements.totalAlbums.textContent = appState.albums.length
  if (elements.totalNews) elements.totalNews.textContent = appState.news.length
}

// Player functions
function playSong(songId) {
  const song = appState.songs.find((s) => s.id === songId)
  if (!song) return

  if (appState.currentSong?.id === songId) {
    togglePlay()
    return
  }

  // Stop current playback
  if (elements.audioPlayer) {
    elements.audioPlayer.pause()
  }
  if (appState.soundcloudWidget) {
    appState.soundcloudWidget.pause()
  }

  appState.currentSong = song
  appState.currentIndex = appState.songs.findIndex((s) => s.id === songId)
  appState.currentTime = 0
  setLoading(true)

  // Show player
  elements.player.classList.remove("hidden")
  updatePlayerInfo()

  // Determine player type
  if (song.audioUrl) {
    appState.playerType = "audio"
    elements.audioPlayer.src = song.audioUrl
    elements.audioPlayer.load()
    playAudio()
  } else if (song.soundcloudEmbed && appState.soundcloudReady) {
    appState.playerType = "soundcloud"
    setupSoundCloudWidget(song.soundcloudEmbed)
  } else {
    setLoading(false)
    alert("Esta música não tem áudio disponível.")
  }
}

function togglePlay() {
  if (appState.isPlaying) {
    pauseCurrentSong()
  } else {
    playCurrentSong()
  }
}

function playCurrentSong() {
  if (appState.playerType === "audio" && elements.audioPlayer) {
    playAudio()
  } else if (appState.playerType === "soundcloud" && appState.soundcloudWidget) {
    appState.soundcloudWidget.play()
  }
}

function pauseCurrentSong() {
  if (appState.playerType === "audio" && elements.audioPlayer) {
    elements.audioPlayer.pause()
  } else if (appState.playerType === "soundcloud" && appState.soundcloudWidget) {
    appState.soundcloudWidget.pause()
  }
}

function playAudio() {
  const playPromise = elements.audioPlayer.play()
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        appState.isPlaying = true
        updatePlayButton()
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erro ao reproduzir:", error)
        setLoading(false)
      })
  }
}

function previousSong() {
  const prevIndex = appState.currentIndex === 0 ? appState.songs.length - 1 : appState.currentIndex - 1
  const prevSong = appState.songs[prevIndex]
  if (prevSong && (prevSong.audioUrl || prevSong.soundcloudEmbed)) {
    playSong(prevSong.id)
  }
}

function nextSong() {
  const nextIndex = (appState.currentIndex + 1) % appState.songs.length
  const nextSong = appState.songs[nextIndex]
  if (nextSong && (nextSong.audioUrl || nextSong.soundcloudEmbed)) {
    playSong(nextSong.id)
  }
}

function updatePlayerInfo() {
  if (!appState.currentSong) return

  elements.playerCover.src = appState.currentSong.cover
  elements.playerCover.alt = appState.currentSong.title
  elements.playerTitle.textContent = appState.currentSong.title
  elements.playerAlbum.textContent = appState.currentSong.album

  // Update player type indicator
  if (appState.playerType === "audio") {
    elements.playerType.textContent = "🎵 Player Interno"
    elements.playerType.className = "player-type type-audio"
  } else if (appState.playerType === "soundcloud") {
    elements.playerType.textContent = "🎧 SoundCloud Embed"
    elements.playerType.className = "player-type type-soundcloud"
  }
}

function updatePlayButton() {
  const icon = elements.playBtn.querySelector("i")
  if (appState.isPlaying) {
    icon.className = "fas fa-pause"
  } else {
    icon.className = "fas fa-play"
  }
}

function setLoading(loading) {
  appState.isLoading = loading
  elements.playerLoading.classList.toggle("hidden", !loading)
  elements.playBtn.disabled = loading
}

function updateVolume() {
  if (appState.playerType === "audio" && elements.audioPlayer) {
    elements.audioPlayer.volume = appState.volume / 100
  } else if (appState.playerType === "soundcloud" && appState.soundcloudWidget) {
    appState.soundcloudWidget.setVolume(appState.volume)
  }
}

function seekTo(time) {
  if (appState.playerType === "audio" && elements.audioPlayer) {
    elements.audioPlayer.currentTime = time
    appState.currentTime = time
  } else if (appState.playerType === "soundcloud" && appState.soundcloudWidget) {
    appState.soundcloudWidget.seekTo(time * 1000)
  }
}

function updateProgress() {
  if (appState.playerType === "audio" && elements.audioPlayer) {
    appState.currentTime = elements.audioPlayer.currentTime
    const progress = appState.duration ? (appState.currentTime / appState.duration) * 100 : 0
    elements.progressSlider.value = progress
    elements.currentTimeEl.textContent = formatTime(appState.currentTime)
  }
}

function updateDuration() {
  if (appState.playerType === "audio" && elements.audioPlayer) {
    appState.duration = elements.audioPlayer.duration || 0
    elements.durationTimeEl.textContent = formatTime(appState.duration)
  }
}

function formatTime(time) {
  if (isNaN(time)) return "0:00"
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function handleAudioError(e) {
  console.error("Erro ao carregar áudio:", e)
  setLoading(false)
  appState.isPlaying = false
  updatePlayButton()
}

// SoundCloud Widget functions
function setupSoundCloudWidget(embedCode) {
  if (!window.SC || !appState.soundcloudReady) {
    alert("SoundCloud API ainda não carregou. Tente novamente em alguns segundos.")
    setLoading(false)
    return
  }

  try {
    // Clear previous widget
    elements.soundcloudContainer.innerHTML = ""

    // Extract URL from embed code
    const srcMatch = embedCode.match(/src="([^"]*)"/)
    if (!srcMatch) {
      alert("Código embed inválido")
      setLoading(false)
      return
    }

    // Create iframe
    const iframe = document.createElement("iframe")
    iframe.width = "100%"
    iframe.height = "166"
    iframe.scrolling = "no"
    iframe.frameBorder = "no"
    iframe.allow = "autoplay"
    iframe.src = srcMatch[1]
    iframe.style.display = "none"

    elements.soundcloudContainer.appendChild(iframe)

    // Setup widget
    iframe.onload = () => {
      const widget = window.SC.Widget(iframe)
      appState.soundcloudWidget = widget

      widget.bind(window.SC.Widget.Events.READY, () => {
        setLoading(false)
        widget.setVolume(appState.volume)
        widget.play()
      })

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        appState.isPlaying = true
        updatePlayButton()
      })

      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        appState.isPlaying = false
        updatePlayButton()
      })

      widget.bind(window.SC.Widget.Events.FINISH, () => {
        appState.isPlaying = false
        updatePlayButton()
        nextSong()
      })

      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data) => {
        appState.currentTime = data.currentPosition / 1000
        if (data.loadedProgress > 0) {
          appState.duration = data.loadedProgress / 1000
        }

        const progress = appState.duration ? (appState.currentTime / appState.duration) * 100 : 0
        elements.progressSlider.value = progress
        elements.currentTimeEl.textContent = formatTime(appState.currentTime)
        elements.durationTimeEl.textContent = formatTime(appState.duration)
      })

      widget.bind(window.SC.Widget.Events.ERROR, (error) => {
        console.error("Erro no SoundCloud widget:", error)
        setLoading(false)
        alert("Erro ao reproduzir música do SoundCloud")
      })
    }

    iframe.onerror = () => {
      console.error("Erro ao carregar iframe do SoundCloud")
      setLoading(false)
      alert("Erro ao carregar música do SoundCloud")
    }
  } catch (error) {
    console.error("Erro ao configurar SoundCloud widget:", error)
    setLoading(false)
    alert("Erro ao configurar player do SoundCloud")
  }
}

// Form handlers
function handleSongSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("song-title").value
  const album = document.getElementById("song-album").value
  const duration = document.getElementById("song-duration").value
  const tags = document.getElementById("song-tags").value
  const audioUrl = document.getElementById("song-audio-url").value
  const soundcloudEmbed = document.getElementById("song-soundcloud-embed").value

  if (!title || !album) {
    alert("Preencha pelo menos título e álbum!")
    return
  }

  if (!audioUrl && !soundcloudEmbed) {
    alert("Adicione pelo menos um link de áudio ou código embed do SoundCloud!")
    return
  }

  const song = {
    id: Date.now(),
    title,
    album,
    artist: "JonhMax",
    tags: tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    cover: `https://via.placeholder.com/300x300/7c3aed/ffffff?text=${encodeURIComponent(title)}`,
    audioUrl,
    soundcloudEmbed,
    duration: duration || "0:00",
  }

  appState.songs.push(song)
  saveData()
  renderContent()
  updateStats()

  // Reset form
  elements.songForm.reset()
  alert("Música adicionada com sucesso!")
}

function handleAlbumSubmit(e) {
  e.preventDefault()

  const name = document.getElementById("album-name").value
  const year = document.getElementById("album-year").value
  const description = document.getElementById("album-description").value
  const coverUrl = document.getElementById("album-cover-url").value

  if (!name || !year) {
    alert("Preencha pelo menos nome e ano do álbum!")
    return
  }

  const album = {
    id: Date.now(),
    name,
    year,
    description,
    cover: coverUrl || `https://via.placeholder.com/400x400/7c3aed/ffffff?text=${encodeURIComponent(name)}`,
    songs: [],
  }

  appState.albums.push(album)
  saveData()
  renderContent()
  updateStats()

  // Reset form
  elements.albumForm.reset()
  alert("Álbum adicionado com sucesso!")
}

function handleNewsSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("news-title").value
  const content = document.getElementById("news-content").value
  const category = document.getElementById("news-category").value
  const imageUrl = document.getElementById("news-image-url").value

  if (!title || !content) {
    alert("Preencha pelo menos título e conteúdo da notícia!")
    return
  }

  const newsItem = {
    id: Date.now(),
    title,
    content,
    category,
    image: imageUrl || `https://via.placeholder.com/500x300/7c3aed/ffffff?text=${encodeURIComponent(title)}`,
    date: new Date().toLocaleDateString("pt-BR"),
    author: "Marcelo Santos Melo",
  }

  appState.news.unshift(newsItem)
  saveData()
  renderContent()
  updateStats()

  // Reset form
  elements.newsForm.reset()
  alert("Notícia adicionada com sucesso!")
}

// Audio player event handlers
if (elements.audioPlayer) {
  elements.audioPlayer.addEventListener("play", () => {
    appState.isPlaying = true
    updatePlayButton()
  })

  elements.audioPlayer.addEventListener("pause", () => {
    appState.isPlaying = false
    updatePlayButton()
  })
}
