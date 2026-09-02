<script setup>
import { IonButton, IonIcon } from '@ionic/vue'
import { trash } from 'ionicons/icons'

import TimeRemaining from './TimeRemaining.vue'

const props = defineProps({
  stations: {
    type: Object,
    required: true,
    default: () => ({
      items: []
    })
  }
})

const emit = defineEmits([
  'exclude-station',
  'finish-session'
])

function openExcludeStation(stationId) {
  emit('exclude-station', stationId)
}

function finishSession(station) {
  emit('finish-session', station)
}
</script>

<template>
    <div class="grid">
      <div v-for="station in props.stations.items" :key="station.id" class="card" :style="{ opacity: (station.time > 0 && !station.finished) ? 1 : .5 }">
        <!-- Topo do Card -->
        <div>
          <div class="card-header">
            <div class="card-info">
              <div class="icon-box" :class="station.status">
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="26px"
                  height="26px"
                  viewBox="0 0 512.000000 512.000000"
                  class="icon"
                  
                  preserveAspectRatio="xMidYMid meet"
                  stroke="currentColor"
                >
                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" :fill="(station.status === 'free') ? '#4dd171' : (station.status === 'in_use') ? '#749be1' : '#e8e8e8'" stroke="none">
                    <path
                      d="M2450 5115 c-8 -2 -49 -9 -90 -15 -212 -35 -405 -135 -573 -299 -135
-131 -225 -274 -280 -446 -50 -155 -52 -177 -52 -565 0 -351 1 -367 21 -410
27 -58 86 -118 141 -142 28 -12 44 -27 47 -41 3 -12 10 -51 16 -86 39 -216
166 -395 377 -528 67 -43 73 -49 73 -80 l0 -33 -93 0 c-260 0 -558 -104 -782
-272 l-90 -68 -76 0 c-61 0 -85 -5 -127 -26 -118 -59 -166 -179 -127 -324 l15
-55 -39 -90 c-21 -49 -116 -324 -211 -609 l-172 -519 4 -91 c3 -76 9 -102 35
-159 38 -79 113 -163 181 -200 111 -60 4 -57 1912 -57 1908 0 1801 -3 1912 57
67 37 143 121 181 200 30 64 32 74 31 178 l-1 110 -175 520 c-96 286 -189 551
-207 589 -31 68 -31 69 -16 126 28 107 14 186 -45 260 -48 60 -118 90 -212 90
-71 0 -80 2 -110 29 -210 182 -555 311 -835 311 l-93 0 0 33 c0 31 6 37 73 80
211 133 338 312 377 528 6 35 13 74 16 86 3 14 19 29 47 41 53 24 110 82 139
141 23 45 23 52 23 411 0 388 -2 410 -52 565 -52 161 -133 294 -259 425 -159
164 -344 268 -568 316 -65 14 -301 28 -336 19z m261 -180 c201 -35 355 -113
502 -254 124 -119 218 -285 263 -463 10 -41 18 -131 21 -256 5 -182 5 -194
-12 -190 -20 3 -23 8 -59 90 -32 73 -101 147 -169 181 -29 14 -93 33 -142 42
-174 32 -287 76 -431 166 -60 38 -76 44 -124 44 -49 0 -64 -5 -121 -43 -139
-90 -263 -138 -432 -167 -50 -9 -111 -25 -135 -35 -66 -29 -144 -109 -176
-182 -42 -93 -42 -93 -61 -96 -17 -4 -17 8 -12 190 3 125 11 215 21 256 123
488 588 801 1067 717z m-137 -814 c12 -20 166 -102 252 -135 50 -19 140 -45
200 -56 128 -25 157 -35 196 -68 39 -33 60 -76 69 -142 9 -63 41 -100 87 -100
39 0 90 -35 108 -74 35 -72 -11 -148 -100 -165 -70 -13 -86 -34 -97 -126 -10
-89 -40 -212 -68 -277 -70 -164 -471 -418 -661 -418 -185 0 -578 244 -655 406
-33 69 -63 186 -74 288 -11 93 -26 114 -97 127 -89 17 -135 93 -100 165 18 39
69 74 107 74 40 0 77 35 84 78 22 139 78 200 200 217 153 21 353 96 476 178
57 39 65 42 73 28z m-219 -1690 c92 -35 195 -47 283 -32 42 7 100 22 127 32
28 10 52 19 54 19 2 0 1 -27 -2 -60 -12 -111 -54 -179 -138 -225 -132 -72
-295 -13 -354 128 -14 34 -33 157 -24 157 2 0 27 -9 54 -19z m-207 -153 c3
-13 20 -51 38 -85 l33 -63 -375 0 c-206 0 -374 2 -374 5 0 10 145 77 229 105
118 40 225 58 344 59 94 1 99 0 105 -21z m1098 7 c49 -9 128 -29 176 -45 83
-28 228 -95 228 -105 0 -3 -168 -5 -374 -5 l-375 0 33 63 c18 34 35 72 38 85
6 21 11 22 96 22 49 0 129 -7 178 -15z m852 -345 c12 -11 24 -31 28 -44 3 -15
-60 -275 -173 -703 l-178 -678 -1215 0 -1215 0 -179 678 c-115 440 -176 686
-172 702 3 13 16 34 28 45 22 20 29 20 1538 20 1509 0 1516 0 1538 -20z
m-3053 -955 c64 -242 118 -447 121 -457 3 -12 -5 -19 -29 -27 -36 -12 -76 -50
-98 -91 -7 -14 -15 -73 -17 -132 l-5 -108 -91 0 c-162 0 -252 46 -302 155 -44
93 -41 109 132 629 86 259 159 475 162 481 4 6 7 6 8 0 2 -6 55 -208 119 -450z
m3319 -31 c173 -520 176 -536 132 -629 -50 -109 -140 -155 -302 -155 l-91 0
-5 108 c-2 59 -10 118 -17 132 -22 42 -62 79 -98 91 -19 6 -32 16 -30 23 2 6
58 214 123 463 65 249 122 449 125 445 4 -4 77 -219 163 -478z m-436 -696 l-3
-83 -1365 0 -1365 0 -3 83 -3 82 1371 0 1371 0 -3 -82z"
                    />
                    <path
                      d="M2433 1435 c-237 -64 -358 -266 -270 -448 97 -198 394 -278 622 -167
68 33 140 104 172 167 108 222 -103 465 -402 462 -38 0 -94 -7 -122 -14z m262
-184 c130 -57 158 -164 65 -244 -163 -139 -499 -39 -449 135 33 115 238 174
384 109z"
                    />
                  </g>
                </svg>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <span class="station-code">{{ station.title }}</span>
              </div>
            </div>

            <IonButton fill="clear" size="small" class="menu-btn" @click="openExcludeStation(station.id)">
              <IonIcon :icon="trash"></IonIcon>
            </IonButton>
          </div>

          <!-- Status Badge + Tempo -->
          <div class="status-row" style="font-size: 12px; color: #fff; ">
            <div style="display: flex; flex-direction: column; gap: 6px; word-wrap: break-word; flex-wrap: wrap;">
              <span v-show="station.user">Nome: </span>
              <span style="color:#888">
                 {{ station.user }}
              </span>
            </div>
            <TimeRemaining
              v-if="station.time > 0 && !station.finished"
              :seconds="station.time"
              @finished="finishSession(station)"
            />
            <template v-else-if="station.finished">
              <span class="session-timer session-timer--finished">
                Sessão finalizada
              </span>
            </template>
          </div>
          
        </div>
      </div>
    </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card {
  border: 1px solid #e5e7eb1e;
  background: #161616;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.in_use {
  background-color: #2960a865;
  color: #3b82f6;
}

.icon-box.free {
  background-color: #10b98165;
  color: #10b981;
}

.icon-box.maintenance {
  background-color: #f59e0b65;
  color: #f59e0b;
}

.station-code {
  font-size: 1rem;
  color: #9ca3af;
  font-weight: 500;
}

.menu-btn {
  --color: #9ca3af;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;

  margin: 0;
}

.menu-btn:hover {
  --color: #4b5563;
}

.icon {
  width: 20px;
  height: 20px;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  font-size: 12px;
  color: #fff;
}

.session-timer--finished {
  color: #888;
  white-space: nowrap;
}
</style>
