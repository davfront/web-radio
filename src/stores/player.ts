import { ref, unref, computed, isRef } from 'vue'
import { defineStore } from 'pinia'
import { Howl } from 'howler'

import type { Station } from '@/types'
import type { Ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const sound = ref<Howl | null>(null)
  const currentStation = ref<Station | null>(null)
  const status = ref<'unloaded' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>('unloaded')

  const stop = () => {
    sound.value?.unload()
    sound.value = null
    currentStation.value = null
    status.value = 'unloaded'
  }

  const load = (station: Station | Ref<Station>) => {
    stop()
    currentStation.value = unref(station)
    status.value = 'loading'
    sound.value = new Howl({
      src: [currentStation.value.streamUrl],
      html5: true,
      autoplay: true,
      onplayerror: () => {
        status.value = 'error'
      },
      onplay: () => {
        status.value = 'playing'
      },
      onpause: () => {
        status.value = 'paused'
      },
      onend: () => {
        status.value = 'ended'
      }
    })
  }

  const pause = () => {
    sound.value?.pause()
  }

  const play = () => {
    sound.value?.play()
  }

  const isCurrentStation = (station: Station | Ref<Station>) => {
    return currentStation.value?.id === unref(station).id
  }

  const hasStation = computed(() => currentStation.value !== null)

  const isLoading = computed(() => status.value === 'loading')

  const isPlaying = computed(() => status.value === 'playing')

  const isPaused = computed(() => status.value === 'paused')

  const isEnded = computed(() => status.value === 'ended')

  const hasError = computed(() => status.value === 'error')

  return {
    currentStation,
    status,
    load,
    stop,
    pause,
    play,
    isCurrentStation,
    hasStation,
    isLoading,
    isPlaying,
    isPaused,
    isEnded,
    hasError
  }
})
