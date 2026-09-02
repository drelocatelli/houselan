<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  seconds: number;
}>();

const emit = defineEmits<{
  finished: [];
}>();

const remainingSeconds = ref(Math.max(0, Number(props.seconds) || 0));

let timer: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const totalSeconds = remainingSeconds.value;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
});

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const finishSession = () => {
  stopTimer();
  remainingSeconds.value = 0;
  emit('finished');
};

const startTimer = () => {
  if (remainingSeconds.value <= 0) {
    finishSession();
    return;
  }

  timer = setInterval(() => {
    if (remainingSeconds.value <= 1) {
      finishSession();
      return;
    }

    remainingSeconds.value -= 1;
  }, 1000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <span
    v-if="remainingSeconds > 0"
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
