<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  time: number;
  dateTime: string;
}>();

const emit = defineEmits<{
  finished: [];
}>();

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
let emitted = false

const startMs = computed(() => {
  const t = new Date(props.dateTime).getTime()
  return Number.isNaN(t) ? Date.now() : t
})

const durationMs = computed(() => Number(props.time || 0) * 1000)

const endMs = computed(() => startMs.value + durationMs.value)

const remainingSeconds = computed(() => Math.max(0, Math.ceil((endMs.value - now.value) / 1000)))

const isFinished = computed(() => remainingSeconds.value <= 0)

const formattedTime = computed(() => {
  const total = remainingSeconds.value;

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return hours > 0 ? `${String(hours).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
});


const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const finishSession = () => {
  stopTimer();
  if(emitted) return
  emitted = true
  emit('finished');
};

const tick = () => {
  now.value = Date.now();
  if(remainingSeconds.value <= 0) {
    finishSession();
  }
}

const startTimer = () => {
  stopTimer()
  emitted = false
  tick()
  if(emitted) return
  timer = setInterval(tick, 1000);
};

watch(() => [props.dateTime, props.time], startTimer);

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <span
    v-if="!isFinished"
    class="session-timer"
  >
    Termina em {{ formattedTime }}
  </span>

  <span
    v-else
    class="session-timer session-timer--finished"
  >
    Sessão finalizada
  </span>
</template>

<style scoped>
.session-timer {
  font-variant-numeric: tabular-nums;
}

.session-timer--finished {
  color: #e5484d;
  font-weight: 600;
}
</style>
