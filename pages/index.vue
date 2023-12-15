<template>
  <div class="bg-svg-background min-h-screen flex flex-col justify-center">
    <div class="text-center mb-20">
      <span class="px-3 mb-4 text-4xl font-bold rounded-lg bg-brand md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        Shop Form AliExpress using</span>
        <span class="px-3 mb-4 text-4xl font-bold rounded-lg bg-brand md:text-5xl">&#x1F1E9;&#x1F1FF;</span>
      <span class="px-3 mb-4 text-4xl font-bold rounded-lg bg-brand md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Dinar!</span>
    </div>
    <div class="container mx-auto flex flex-col items-center gap-y-10 md:gap-y-10 px-7">
      <!-- Input and button -->
      <div class="flex flex-col md:flex-row w-full md:w-3/4">
        <input v-model="searchQuery" type="text" placeholder="Search..." class="flex-grow rounded-lg bg-gray-50 px-4 py-2 mb-4 md:mb-0 md:mr-2 outline-none focus:ring-2 focus:ring-blue-400"/>
        <button @click="searchClicked" class="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-400 text-white font-bold hover:bg-blue-500 focus:ring-2 focus:ring-blue-400">Search</button>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-center">
        <div class="flex flex-row gap-3 mt-4">
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>

      <!-- Card data for mobile view -->
      <div v-if="cardData && !isLoading" class="w-full md:hidden">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-center mb-4">
            <div class="w-48 h-48 rounded-lg overflow-hidden">
              <img :src="cardData.cover" alt="Product Image" class="h-full w-full object-cover">
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ cardData.dzPrice }}</h3>
            <p class="text-gray-700 mb-2">{{ cardData.name }}</p>
            <!-- Other details for mobile -->
            <p class="text-gray-700"><span>&#x1F389;</span> Sales: {{ cardData.sales }} </p>
            <p class="text-gray-700"><span>&#x1F3E2;</span> Store: {{ cardData.store }} </p>
            <p class="text-gray-700"><span>&#x2B50;</span> Store Rate: {{ cardData.storeRate }} </p>
          </div>
          <div class="flex justify-center space-x-7 mt-4">
            <a href="https://m.me/100093485946734" class="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"> Messenger</a>
            <a href="https://wa.me/+213663712471" class="px-4 py-2 rounded-lg bg-green-400 text-white font-bold hover:bg-green-500 focus:ring-2 focus:ring-blue-400"> WhatsApp</a>
          </div>
        </div>
      </div>

      <!-- Card data for desktop view -->
      <div v-if="cardData && !isLoading" class="w-full max-w-3xl mx-auto rounded-lg shadow-md bg-white p-4 md:p-6 hidden md:block">
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
              <!-- Other details for desktop -->
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
        <!-- Variant selection buttons without images -->
  <!-- Variant selection buttons without images -->
  <div v-if="variantButtonsValues.length > 0">
    <template v-for="(variant, index) in variantButtonsValues" :key="index">
      <div class="mt-4">
        <p class="text-gray-700 font-semibold mb-2">{{ variant.skuPropertyName }}: {{ selectedVariantValues[index] }}</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="(value, i) in variant.propertyValues" :key="i" @click="selectVariant(value, index)" :class="{ 'bg-gray-300': selectedVariantValues[index] === value, 'bg-gray-200': selectedVariantValues[index] !== value }" class="px-3 py-1 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            {{ value }}
          </button>
        </div>
      </div>
    </template>
  </div>

  <!-- Variant selection images -->
  <div v-if="variantImagesValues.length > 0">
    <template v-for="(variant, index) in variantImagesValues" :key="index">
      <div class="mt-4">
        <p class="text-gray-700 font-semibold mb-2">{{ variant.skuPropertyName }}: {{ selectedVariantImageValues[index]?.propertyValueName }}</p>
        <div class="flex flex-wrap gap-2">
          <div v-for="(value, i) in variant.skuPropertyImageSummPath" :key="i" @click="selectImageVariant(value, index, variant.skuPropertyName, variant[i])" class="rounded-md overflow-hidden w-12 h-12 cursor-pointer">
            <img :src="value" :alt="value" class="w-full h-full object-cover" :class="{ 'border-2 border-blue-500': selectedVariantImageValues[index]?.skuPropertyImagePath === value }"/>
          </div>
        </div>
      </div>
    </template>
  </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const cardData = ref(null);
const isLoading = ref(false);

const selectedVariantValues = ref([]);
const selectedVariantImageValues = ref([]);


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



const hasImage = (prop) => {
  return prop.skuPropertyValues && prop.skuPropertyValues.some(value => value.skuPropertyImageSummPath !== undefined);
};


const selectImageVariant = (value, index, propertyName, propertyValue) => {
  if (!selectedVariantImageValues.value) {
    selectedVariantImageValues.value = [];
  }
  selectedVariantImageValues.value.splice(index, 1, {
    skuPropertyImagePath: value,
    propertyValueName: propertyValue,
    skuPropertyName: propertyName
  });

  cardData.value.cover = value;
};

const selectVariant = (value, index) => {
  selectedVariantValues.value.splice(index, 1, value);

};


const extractPropertyValues = (prop) => {
  return prop.skuPropertyValues.map(value => value.propertyValueDisplayName);
};

// Computed property to retrieve the values for variant buttons without images
const variantButtonsValues = computed(() => {
  if (cardData.value) {
    return cardData.value.variants.props
      .filter(prop => !hasImage(prop))
      .map(prop => ({
        skuPropertyName: prop.skuPropertyName,
        propertyValues: extractPropertyValues(prop),
        order: prop.order || 0 // Assign 0 if "order" is undefined
      }))
      .sort((a, b) => a.order - b.order); // Sort by "order" property
  }
  return [];
});

// Computed property to retrieve the values for variant images
const variantImagesValues = computed(() => {
  if (cardData.value) {
    return cardData.value.variants.props
      .filter(prop => hasImage(prop))
      .map(prop => ({
        skuPropertyName: prop.skuPropertyName,
        skuPropertyImageSummPath: prop.skuPropertyValues.map(value => value.skuPropertyImagePath),
        order: prop.order || 0 
      }))
      .sort((a, b) => a.order - b.order); // Sort by "order" property
  }
  return [];
});


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
