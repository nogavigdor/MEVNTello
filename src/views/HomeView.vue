<template>
  <div class="font-sans flex items-center justify-center min-h-screen bg-white">
    <div class="container text-center">
      <div class="text-5xl font-bold text-primary mb-4">
        <div>
          <span v-for="(letter, index) in welcomeText" :key="`welcome-${index}`" class="inline-block" :class="`jump-${index}`">
            {{ letter }}
          </span>
        </div>
        <div>
          <span v-for="(letter, index) in toText" :key="`to-${index}`" class="inline-block" :class="`jump-${welcomeText.length + index}`">
            {{ letter }}
          </span>
        </div>
        <div>
          <span v-for="(letter, index) in appName" :key="`app-${index}`" class="inline-block" :class="`jump-${welcomeText.length + toText.length + index}`">
            {{ letter }}
          </span>
        </div>
      </div>
      <p class="text-xl text-gray-700">Your Project Management App</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const router = useRouter();

const welcomeText = ref('Welcome '.split(''));
const toText = ref('to '.split(''));
const appName = ref('MevnTello'.split(''));

// Redirect to dashboard if user is logged in
if (userStore.isAuthenticated) {
  router.push({ name: 'Dashboard' });
}

// Add animation classes on mount
onMounted(() => {
  const combinedText = [...welcomeText.value, ...toText.value, ...appName.value];
  combinedText.forEach((_, index) => {
    setTimeout(() => {
      const letterElement = document.querySelector(`.jump-${index}`);
      if (letterElement) {
        letterElement.classList.add('animate-jump');
      }
    }, index * 100); // Stagger the animation by 100ms for each letter
  });
});
</script>

<style scoped>
.container {
  padding: 16px;
}

@keyframes jump {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}

.animate-jump {
  display: inline-block;
  animation: jump 0.6s ease-in-out;
}
</style>
