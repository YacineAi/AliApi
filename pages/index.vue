<template>
  <div class="bg-gray-100 min-h-screen flex flex-col justify-center">
    <div class="container mx-auto flex flex-col items-center gap-y-4 md:gap-y-10">
      <div class="flex w-full md:w-1/2">
        <input v-model="searchQuery" type="text" placeholder="Search..." class="w-full rounded-lg bg-gray-50 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"/>
        <button @click="searchClicked" class="px-4 py-2 rounded-r-lg bg-blue-400 text-white font-bold hover:bg-blue-500 focus:ring-2 focus:ring-blue-400">Search</button>
      </div>

      <div v-if="isLoading">
        <div class="flex flex-row gap-2">
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>

      <div v-if="cardData && !isLoading" class="w-full max-w-md mx-auto rounded-lg shadow-md bg-white p-4">
        <div class="flex">
          <div class="flex-shrink-0 w-32 h-32">
            <img :src="cardData.cover" alt="Product Image" class="w-full h-full rounded-lg object-cover">
          </div>
          <div class="flex flex-col justify-between ml-4">
            <div>
              <h3 class="text-2xl font-bold text-gray-800">{{ cardData.price }}</h3>
              <div class="flex items-center">
                <div class="text-yellow-400">
                  <!-- Render stars based on the rate (you can modify this based on your rating system) -->
                  <!-- Replace 'cardData.rate' with your actual rating -->
                  <!-- Example for a star icon: ★ -->
                </div>
                <p class="text-gray-600 ml-1">{{ cardData.rate }}</p>
              </div>
              <p class="text-gray-700 mb-2">{{ cardData.name }}</p>
            </div>
            <div class="text-center">
              <a :href="cardData.link" class="inline-block px-4 py-2 rounded-lg bg-blue-400 text-white font-bold hover:bg-blue-500 focus:ring-2 focus:ring-blue-400">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const cardData = ref(null);
const isLoading = ref(false);

const searchClicked = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await useFetch('/api/get', {
      query: { url: searchQuery.value },
    });

    if (data) {
      cardData.value = {
        ...data.value.details,
      };
    } else if (error) {
      console.error(error);
    }
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
</style>
