<template>
  <div class="SearchStationView">
    <div v-if="player.currentStation">
      <h1>Current Station</h1>
      <div>
        <img :src="player.currentStation.image" :alt="player.currentStation.name" height="64" />
        <div>
          <h2>{{ player.currentStation.name }}</h2>
          <div>{{ player.currentStation.streamUrl }}</div>
          <div>{{ player.currentStation.genres.join(', ') }}</div>
          <button v-if="player.isPlaying" @click="player.pause()">Pause</button>
          <button v-if="player.isPaused" @click="player.play()">Play</button>
          <button @click="player.stop()">Close</button>
        </div>
      </div>
    </div>
    <h1>Search Station</h1>
    <div>
      <label for="search">Search</label>
      <input type="text" id="search" v-model="searchInput" />
    </div>
    <div v-if="isSearching">Searching...</div>
    <table v-else-if="stations.length > 0">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Stream URL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="station in stations" :key="station.id">
          <td><img :src="station.image" :alt="station.name" height="64" /></td>
          <td>{{ station.name }}</td>
          <td>{{ station.streamUrl }}</td>
          <td>
            <button v-if="!player.isCurrentStation(station)" @click="player.load(station)">
              Play
            </button>
            <template v-else>
              <span>{{ player.status }}</span>
              <button v-if="player.isPlaying" @click="player.pause()">Pause</button>
              <button v-if="player.isPaused" @click="player.play()">Play</button>
              <button @click="player.stop()">Close</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>No station found!</div>
  </div>
</template>

<script setup lang="ts">
import { RadioBrowserApi } from 'radio-browser-api'
import { ref, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'

import type { Station as RadioBrowserStation } from 'radio-browser-api/types'
import type { Station } from '@/types'

const api = new RadioBrowserApi('davfront-radio')
const stations = ref<Station[]>([])

const searchInput = ref('')
const isSearching = ref(false)

const fetchStations = async () => {
  isSearching.value = true
  try {
    const queryResponse: RadioBrowserStation[] =
      (await api.searchStations({
        countryCode: 'FR',
        hidebroken: true,
        is_https: true,
        limit: 100,
        name: searchInput.value,
        order: 'clickcount',
        reverse: true
      })) || []

    stations.value = queryResponse.map((station) => ({
      id: station.id,
      name: station.name,
      streamUrl: station.urlResolved.split('?')[0],
      image: station.favicon,
      genres: station.tags
    }))
  } catch (error) {
    console.error(error)
    stations.value = []
  }
  isSearching.value = false
}

watch(searchInput, fetchStations, { immediate: true })

// player store
const player = usePlayerStore()
</script>

<style scoped>
.SearchStationView {
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    td,
    th {
      border: 1px solid #000;
      overflow: hidden;
    }
  }
}
</style>
