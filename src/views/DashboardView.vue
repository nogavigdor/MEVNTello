<template>
    <div class="flex min-h-screen bg-gray-100">
      <div class="flex-1 p-8">
        <h1 class="text-2xl font-bold text-primary mb-4">Dashboard</h1>
        <div class="space-y-4">
          <div class="p-4 bg-white rounded-lg shadow">
            <h2 class="text-xl font-semibold text-gray-900">Welcome back!</h2>
            <p class="text-gray-600">Here's what's happening with your projects today:</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-white rounded-lg shadow">
              <h3 class="font-semibold text-gray-900">Upcoming Tasks</h3>
              <ul class="list-disc list-inside text-gray-600">
                <li>Task One - due tomorrow</li>
                <li>Task Two - due next week</li>
              </ul>
            </div>
            <div class="p-4 bg-white rounded-lg shadow">
              <h3 class="font-semibold text-gray-900">Recent Activity</h3>
              <p class="text-gray-600">You updated "Project XYZ" an hour ago.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
 
  </script>
  
  <style scoped>
  /* Tailwind utilities are used here, you might want to adjust margins, paddings and other aspects based on your actual layout needs */
  </style>
  