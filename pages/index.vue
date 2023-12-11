<template>
  <div class="bg-svg-background min-h-screen flex flex-col justify-center">
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

      <div v-if="cardData && !isLoading" class="w-full max-w-3xl mx-auto rounded-lg shadow-md bg-white p-4 flex flex-col">
        <div class="flex w-full items-center">
          <div class="h-48 w-48 rounded-lg object-cover flex-shrink-0">
            <img :src="cardData.cover" alt="Product Image" class="h-full w-full rounded-lg object-cover">
          </div>
          <div class="flex flex-col justify-between ml-5">
            <div>
              <h3 class="text-2xl font-bold text-gray-800">{{ cardData.dzPrice }}</h3>
              <div class="flex items-center">
                <p class="text-gray-500 mr-1 font-bold"> {{ cardData.rate }} </p>
                <div class="text-yellow-400 text-xl">
                  <template v-if="cardData.rate == 0.0"> ☆ </template>
                  <template v-else>
                    <span v-for="i in Math.floor(cardData.rate)" :key="i">★</span>
                    <span v-if="cardData.rate % 1 !== 0">☆</span>
                  </template>
                </div>
                <p class="text-sm text-gray-700 "> ({{ cardData.totalRates }})  </p>
              </div>
              <p class="text-gray-700 mb-2">{{ cardData.name }}</p>
              <!-- New Details -->
              <p class="text-gray-700"><span>&#11088;</span> Total Rates: {{ cardData.totalRates }} </p>
              <p class="text-gray-700"><span>&#x1F389;</span> Sales: {{ cardData.sales }} </p>
              <p class="text-gray-700"><span>&#x1F3E2;</span> Store: {{ cardData.store }} </p>
              <p class="text-gray-700"><span>&#x2B50;</span> Store Rate: {{ cardData.storeRate }} </p>
            </div>
            
            <div class="flex justify-end space-x-4 mt-4">
              <a href="https://m.me/100093485946734" class="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"> Messenger</a>
              <a href="https://wa.me/+213663712471" class="px-4 py-2 rounded-lg bg-green-400 text-white font-bold hover:bg-green-500 focus:ring-2 focus:ring-blue-400"> WhatsApp</a>
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
.bg-svg-background {
  background-image: url('https://svgshare.com/i/10cc.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
}
</style>
