<template>
  <div class="absolute bottom-0 w-full bg-player shadow-inner" :class="spotifyEmbedUrl ? 'h-56' : 'h-14'">
    <div class="flex items-center justify-between h-14 px-2">
      <div class="w-1/3">
        <div class="flex items-center gap-2">
          <img v-if="currentTrack.album && currentTrack.album.images" :src="currentTrack.album.images[0].url" alt="cover album musique" class="w-10 h-10 rounded-sm" />
          <div class="flex flex-col mr-5 w-full">
            <p class="text-xs font-trebuchet-pixel truncate">{{ currentTrack.name }}</p>
            <p class="text-xs font-trebuchet-pixel truncate">
              {{ currentTrack.artists ? currentTrack.artists[0].name : '' }}
            </p>
          </div>
        </div>
      </div>
      <div class="w-1/3 flex items-center justify-center">
        <button @click="previousTrack" class="w-6 h-6 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 cursor-pointer">
          <img src="/img/icons/music/previous-icon.webp" alt="Musique précédente" class="w-full h-full" />
        </button>
        <button
          @click="togglePlay"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 relative overflow-hidden play-button cursor-pointer"
          :class="{ 'is-playing': isPlaying }"
        ></button>
        <button @click="nextTrack" class="w-6 h-6 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 cursor-pointer">
          <img src="/img/icons/music/next-icon.webp" alt="Musique suivante" class="w-full h-full" />
        </button>
      </div>
      <div class="w-1/3">
        <p class="text-xs font-trebuchet-pixel text-center">{{ formatTime(currentTime) }} / {{ formatTime(currentTrack.duration_ms) }}</p>
      </div>
    </div>
    <div v-if="spotifyEmbedUrl" class="px-3 pb-3">
      <iframe
        :src="spotifyEmbedUrl"
        width="100%"
        height="152"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'
import { useVolumeStore } from '@/stores/volumeStore'

const props = defineProps({
  playlist: {
    type: Array,
    required: true
  },
  trackToggled: String
})

const volumeStore = useVolumeStore()
const currentTrack = ref(props.playlist[0])
const isPlaying = ref(false)
const currentTime = ref(0)
const spotifyEmbedUrl = ref('')
let audioElement = null

const getAudioFile = (track) => `/musics/${track.id}.mp3`
const getSpotifyEmbedUrl = (track) => `https://open.spotify.com/embed/track/${track.id}`

const localTrackExists = async (audioFile) => {
  try {
    const response = await fetch(audioFile, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

const stopCurrentLocalTrack = () => {
  const currentAudioFile = getAudioFile(currentTrack.value)
  volumeStore.pauseAudio(currentAudioFile)
  volumeStore.resetAudio(currentAudioFile)
  currentTime.value = 0

  if (audioElement) {
    audioElement.removeEventListener('timeupdate', updateCurrentTime)
    audioElement = null
  }

  spotifyEmbedUrl.value = ''
}

const startCurrentTrack = async () => {
  const audioFile = getAudioFile(currentTrack.value)
  const hasLocalTrack = await localTrackExists(audioFile)

  if (hasLocalTrack) {
    volumeStore.playAudio(audioFile)
    audioElement = volumeStore.audioElements[audioFile]
    audioElement.addEventListener('timeupdate', updateCurrentTime)
    return
  }

  spotifyEmbedUrl.value = getSpotifyEmbedUrl(currentTrack.value)
}

const updateCurrentTime = () => {
  if (audioElement) {
    currentTime.value = audioElement.currentTime * 1000 // Convert to milliseconds
  }
  if (currentTime.value >= currentTrack.value.duration_ms) {
    nextTrack()
  }
}

const togglePlay = async () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    await startCurrentTrack()
  } else {
    stopCurrentLocalTrack()
  }
}

const previousTrack = async () => {
  const currentIndex = props.playlist.findIndex((track) => track.id === currentTrack.value.id)
  stopCurrentLocalTrack()

  if (currentIndex === 0) {
    currentTrack.value = props.playlist[props.playlist.length - 1]
  } else {
    currentTrack.value = props.playlist[currentIndex - 1]
  }

  if (isPlaying.value) {
    await startCurrentTrack()
  }
}

const nextTrack = async () => {
  const currentIndex = props.playlist.findIndex((track) => track.id === currentTrack.value.id)
  stopCurrentLocalTrack()

  if (currentIndex === props.playlist.length - 1) {
    currentTrack.value = props.playlist[0]
  } else {
    currentTrack.value = props.playlist[currentIndex + 1]
  }

  if (isPlaying.value) {
    await startCurrentTrack()
  }
}

function formatTime(ms) {
  if (ms == null || isNaN(ms) || ms == undefined) {
    return '0:00'
  }
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// watch the  trackToggled prop to play the track if it's different from the current track
watch(
  () => props.trackToggled,
  async (newTrack) => {
    if (newTrack !== currentTrack.value.id) {
      stopCurrentLocalTrack()

      currentTrack.value = props.playlist.find((track) => track.id === newTrack)
      if (isPlaying.value) {
        await startCurrentTrack()
      }
    }
  }
)

onUnmounted(() => {
  if (audioElement) {
    audioElement.removeEventListener('timeupdate', updateCurrentTime)
  }
  // Reset component state if window is closed
  stopCurrentLocalTrack()
})
</script>

<style scoped>
.play-button {
  background-image: url('/img/icons/music/play-icon.webp');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.play-button:hover {
  background-image: url('/img/icons/music/play-icon-hover.webp');
}

.play-button.is-playing {
  background-image: url('/img/icons/music/pause-icon.webp');
}
</style>
