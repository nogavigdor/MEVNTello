<template>
  <header class="w-full text-sm">
    <nav class="w-full h-16 fixed bg-white">
      <div
        class="flex flex-nowrap items-center h-full w-full border-b border-brand-red border-solid px-8 mx-auto"
      >
        <a href="/" class="text-xl"> {{ appName }} </a>
      </div>
    </nav>
  </header>
</template>
<script>
export default {
  name: 'MainVew',
  data() {
    return {
      appName: 'MEVNTello - A Projects Management App'
    }
  }
}
</script>
