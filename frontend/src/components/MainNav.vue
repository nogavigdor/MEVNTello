<template>
  <header class="w-full text-sm">
    <div class="w-full h-16 fixed bg-white">
      <div
        class="flex flex-nowrap justify-between items-center h-full w-full border-b border-brand-red border-solid px-8 mx-auto"
      >
        <a href="/" class="text-xl"> {{ appName }} </a>
        <nav class="ml-12 h-full">
          <ul class="flex h-full list-none">
            <li v-for="menuItem in menuItems" :key="menuItem.name" class="h-full ml-9 first:ml-0">
              <a :href="menuItem.url" class="flex h-full items-center p-2.5">{{ menuItem.name }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'MainVew',
  data() {
    return {
      appName: 'MEVNTello - A Projects Management App',
      menuItems: [{ name: 'Login', url: '/login' }]
    }
  }
}
</script>
