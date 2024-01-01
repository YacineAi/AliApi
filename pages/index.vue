<template>
  <div class="bg-svg-background min-h-screen flex flex-col justify-center">
    <div class="text-center mb-20">
      <span class="px-3 mb-4 text-4xl font-bold rounded-lg bg-brand md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        Shop from AliExpress using</span>
        <span class="px-3 mb-4 text-4xl font-bold rounded-lg bg-brand md:text-5xl">&#x1F1E9;&#x1F1FF;</span>
      <span class="px-3 mb-4 text-4xl font-bold rounded-lg bg-brand md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Dinar!</span>
    </div>
    <div class="container mx-auto flex flex-col items-center gap-y-10 md:gap-y-10 px-7">
      <!-- Input and button -->
      <div class="flex flex-col md:flex-row w-full md:w-3/4">
        <input v-model="searchQuery" type="text" placeholder="https://a.aliexpress... Or 100XXXXXXXX" class="flex-grow rounded-lg bg-gray-50 px-4 py-2 mb-4 md:mb-0 md:mr-2 outline-none focus:ring-2 focus:ring-blue-400"/>
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
        <div v-if="cardData.ok == false">
          <div class="text-center bg-white p-4 rounded-lg shadow-md">
            <p class="text-gray-500 mr-1 font-bold"> المنتج الذي أدخلته غير موجود! 🧐 </p>
          </div>
        </div>
        <div v-else>
          <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-center mb-4">
            <div class="w-48 h-48 rounded-lg overflow-hidden">
              <img :src="cardData.cover" alt="Product Image" class="h-full w-full object-cover">
            </div>
          </div>
          <div class="text-center">
            <div v-if="cardData.shippingInfo.dz == false">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">!هذا المنتج لا يشحن للجزائر</h3>
            </div>
            <div v-else>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ calcPrice() }}</h3>
              <h2 class="text-xm text-gray-600 mb-2">+ {{ calcShipping() }}</h2>
            </div>
            <p class="text-gray-700 mb-2">{{ cardData.name }}</p>
            <!-- Other details for mobile -->
            <p class="text-gray-700"><span>&#x1F389;</span> Sales: {{ cardData.sales }} </p>
            <p class="text-gray-700"><span>&#x1F3E2;</span> Store: {{ cardData.store }} </p>
            <p class="text-gray-700"><span>&#x2B50;</span> Store Rate: {{ cardData.storeRate }} </p>
          </div>
          <div class="flex items-center gap-2">
          <button :disabled="items === 1" title="Remove" class="group cursor-pointer outline-none" @click="removeItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
              <path d="M8 12H16" stroke-width="1.5"></path>
            </svg>
          </button>
          <p>{{ items }}</p>
          <button title="Add" class="group cursor-pointer outline-none" @click="addItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
              <path d="M8 12H16" stroke-width="1.5"></path>
              <path d="M12 16V8" stroke-width="1.5"></path>
            </svg>
          </button>
        </div>
          <!-- Variant selection buttons without images -->
        <div v-if="cardData.variants.props != 'No SKU property available'">
          <template v-for="(variant, index) in cardData.variants.props" :key="index">
            <div class="mt-4">
              <p class="text-gray-700 font-semibold mb-2"> {{ variant.skuPropertyName }}: {{ getName(cardData.variants.defAttr, index) }} </p>
              <div class="flex flex-wrap gap-2">
                <template v-for="(value, vIndex) in variant.skuPropertyValues" :key="vIndex">
                  <div v-if="value.skuPropertyImageSummPath !== undefined">
                    <!-- If available is 0, make the image disabled -->
                    <img v-if="value.skuPropertyImageSummPath" :src="value.skuPropertyImageSummPath" :class="getImgClasses(index, vIndex)" @click="setSelectedImage(index, vIndex)" class="w-12 h-12 object-cover rounded-lg"/>
                  </div>
                  <div v-else>
                    <!-- Disable the button and add a dashed border if available is 0 -->
                    <button :disabled="isPropertyValueUnavailable(index, vIndex)" :class="getButtonClasses(index, vIndex)" class="bg-gray-200 rounded-lg px-3 py-1" @click="value.available !== 0 && setSelectedButton(index, vIndex)"> {{ value.skuPropertyTips }} </button>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <!-- -->
          <div class="flex justify-center space-x-7 mt-4">
            <a href="https://m.me/ozerve.shop" class="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"> Messenger</a>
            <a href="https://wa.me/+213668219714" class="px-4 py-2 rounded-lg bg-green-400 text-white font-bold hover:bg-green-500 focus:ring-2 focus:ring-blue-400"> WhatsApp</a>
          </div>
        </div>
        </div>
      </div>
      <!-- Card data for desktop view -->
      <div v-if="cardData && !isLoading" class="w-full max-w-3xl mx-auto rounded-lg shadow-md bg-white p-4 md:p-6 hidden md:block">
        <div v-if="cardData.ok == false">
          <div class="text-center items-center">
            <p class="text-gray-500 mr-1 font-bold"> المنتج الذي أدخلته غير موجود! 🧐 </p>
          </div>
        </div>
        <div v-else>
          <div class="flex w-full items-center">
          <div class="h-48 w-48 rounded-lg object-cover flex-shrink-0">
            <img :src="cardData.cover" alt="Product Image" class="h-full w-full rounded-lg object-cover">
          </div>
          <div class="flex flex-col justify-between ml-5">
            <div>
              <div v-if="cardData.shippingInfo.dz == false">
                <h3 class="text-2xl font-bold text-gray-800">!هذا المنتج لا يشحن للجزائر</h3>
              </div>
              <div v-else>
                <h3 class="text-2xl font-bold text-gray-800">{{ calcPrice() }}</h3>
                <h2 class="text-xm text-gray-600">+ {{ calcShipping() }}</h2>
              </div>
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
              <a href="https://m.me/ozerve.shop" class="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"> Messenger</a>
              <a href="https://wa.me/+213668219714" class="px-4 py-2 rounded-lg bg-green-400 text-white font-bold hover:bg-green-500 focus:ring-2 focus:ring-blue-400"> WhatsApp</a>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button :disabled="items === 1" title="Remove" class="group cursor-pointer outline-none" @click="removeItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
              <path d="M8 12H16" stroke-width="1.5"></path>
            </svg>
          </button>
          <p>{{ items }}</p>
          <button title="Add" class="group cursor-pointer outline-none" @click="addItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
              <path d="M8 12H16" stroke-width="1.5"></path>
              <path d="M12 16V8" stroke-width="1.5"></path>
            </svg>
          </button>
        </div>
        <!-- Variant selection buttons without images -->
        <div v-if="cardData.variants.props != 'No SKU property available'">
          <template v-for="(variant, index) in cardData.variants.props" :key="index">
            <div class="mt-4">
              <p class="text-gray-700 font-semibold mb-2"> {{ variant.skuPropertyName }}: {{ getName(cardData.variants.defAttr, index) }} </p>
              <div class="flex flex-wrap gap-2">
                <template v-for="(value, vIndex) in variant.skuPropertyValues" :key="vIndex">
                  <div v-if="value.skuPropertyImageSummPath !== undefined">
                    <!-- If available is 0, make the image disabled -->
                    <img v-if="value.skuPropertyImageSummPath" :src="value.skuPropertyImageSummPath" :class="getImgClasses(index, vIndex)" @click="setSelectedImage(index, vIndex)" class="w-12 h-12 object-cover rounded-lg"/>
                  </div>
                  <div v-else>
                    <!-- Disable the button and add a dashed border if available is 0 -->
                    <button :disabled="isPropertyValueUnavailable(index, vIndex)" :class="getButtonClasses(index, vIndex)" class="bg-gray-200 rounded-lg px-3 py-1" @click="value.available !== 0 && setSelectedButton(index, vIndex)"> {{ value.skuPropertyTips }} </button>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <!-- -->
        </div>
        
      </div>
    </div>
  </div>
</template>



<script setup>
import ratesData from '~/assets/rates.json';

const rateLessThanOne = ratesData[0]['rate'];
const rateLessThanTen = ratesData[1]['rate'];
const rateLessThanHundred = ratesData[2]['rate'];
const rateHundredAndAbove = ratesData[3]['rate'];

const searchQuery = ref('');
const cardData = ref(null);
const isLoading = ref(false);
const items = ref(1);;

const selectedValues = ref([]);
const selectedButtons = ref([]);


const addItem = () => {
  items.value++; // Increment items
};

const removeItem = () => {
  if (items.value > 0) {
    items.value--; // Decrement items only if it's greater than 0
  }
};

const getName = (key, index) => {

  if (cardData.value.variants.shippingid != "Auto") {
    const clean = key.replace(`${cardData.value.variants.shippingid};`, "").replace(`;${cardData.value.variants.shippingid}`, "")
    const pairs = clean.split(';');
    console.log("prop index : ", pairs[index])
    const [ skuPropertyId, propertyValueId ] = pairs[index].split(':');
    //console.log(skuPropertyId+":" + propertyValueId)
    const matchingProp = cardData.value.variants.props.find(prop => prop.skuPropertyId == skuPropertyId);
    if (matchingProp) {
      const matchingValue = matchingProp.skuPropertyValues.find(value => value.propertyValueId == propertyValueId);
      if (matchingValue) {
        return matchingValue.skuPropertyTips;
      }
    }
  return 'nonValue';
  } else {
    const pairs = key.split(';');
    console.log("prop index : ", pairs[index])
    const [ skuPropertyId, propertyValueId ] = pairs[index].split(':');
    //console.log(skuPropertyId+":" + propertyValueId)
    const matchingProp = cardData.value.variants.props.find(prop => prop.skuPropertyId == skuPropertyId);
    if (matchingProp) {
      const matchingValue = matchingProp.skuPropertyValues.find(value => value.propertyValueId == propertyValueId);
      if (matchingValue) {
        return matchingValue.skuPropertyTips;
      }
    }
  return 'nonValue';
  }
};

//

const isPropertyValueUnavailable = (index, vIndex) => {
  //console.log("vIndex : ", vIndex)
  const propPairs = cardData.value.variants.defAttr.split(';');
  propPairs[index] = `${cardData.value.variants.props[index].skuPropertyId}:${cardData.value.variants.props[index].skuPropertyValues[vIndex].propertyValueId}`;
  
  // Find matching propinfo based on attr
  const matchingPropInfo = cardData.value.variants.propinfo.find(prop => {
    return prop.attr.includes(propPairs.join(';'));
  });
  //console.log(matchingPropInfo.attr)
  return matchingPropInfo ? matchingPropInfo.available == 0 : false;
};

const getButtonClasses = (index, vIndex) => {
  const isDisabled = isPropertyValueUnavailable(index, vIndex);
  return {
    'border-2 border-black': isButtonSelected(index, vIndex),
    'opacity-50 pointer-events-none border-dashed': isDisabled,
  };
};

const getImgClasses = (index, vIndex) => {
  const isDisabled = isPropertyValueUnavailable(index, vIndex);
  return {
    'border-2 border-black': isImageSelected(index, vIndex),
    'opacity-50 pointer-events-none': isDisabled,
  };
};


const isImageSelected = (index, vIndex) => {
  return selectedValues.value[index] == vIndex;
};

const isButtonSelected = (index, vIndex) => {
  return selectedButtons.value[index] == vIndex;
};

const setSelectedImage = (index, vIndex) => {
  if (cardData.value.variants.props[index].skuPropertyValues.length == 1) {
    return;
  }

  selectedValues.value[index] = vIndex;
  const propPairs = cardData.value.variants.defAttr.split(';');
  propPairs[index] = `${cardData.value.variants.props[index].skuPropertyId}:${cardData.value.variants.props[index].skuPropertyValues[vIndex].propertyValueId}`;
  cardData.value.variants.defAttr = propPairs.join(';');
  cardData.value.cover = cardData.value.variants.props[index].skuPropertyValues[vIndex].skuPropertyImagePath;
};

const setSelectedButton = (index, vIndex) => {
  if (cardData.value.variants.props[index].skuPropertyValues.length == 1) { return; }

  selectedButtons.value[index] = vIndex;

  const propPairs = cardData.value.variants.defAttr.split(';');
  propPairs[index] = `${cardData.value.variants.props[index].skuPropertyId}:${cardData.value.variants.props[index].skuPropertyValues[vIndex].propertyValueId}`;
  cardData.value.variants.defAttr = propPairs.join(';');
};

const initializeSelectedImagesAndButtons = () => {
  if (cardData.value.variants.shippingid != "Auto") {
    if (cardData.value && cardData.value.variants && cardData.value.variants.defAttr) {
      const clean = cardData.value.variants.defAttr.replace(`${cardData.value.variants.shippingid};`, "").replace(`;${cardData.value.variants.shippingid}`, "")
      const defAttrPairs = clean.split(';');
    defAttrPairs.forEach((pair, index) => {
      const [skuPropertyId, propertyValueId] = pair.split(':');
      const matchingProp = cardData.value.variants.props[index];

      if (matchingProp) {
        const matchingImageIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingImageIndex !== -1) {
          selectedValues.value[index] = matchingImageIndex;
        }

        const matchingButtonIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingButtonIndex !== -1) {
          selectedButtons.value[index] = matchingButtonIndex;
        }
      }
    });
  }
  } else {
    if (cardData.value && cardData.value.variants && cardData.value.variants.defAttr) {
    const defAttrPairs = cardData.value.variants.defAttr.split(';');
    defAttrPairs.forEach((pair, index) => {
      const [skuPropertyId, propertyValueId] = pair.split(':');
      const matchingProp = cardData.value.variants.props[index];

      if (matchingProp) {
        const matchingImageIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingImageIndex !== -1) {
          selectedValues.value[index] = matchingImageIndex;
        }

        const matchingButtonIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingButtonIndex !== -1) {
          selectedButtons.value[index] = matchingButtonIndex;
        }
      }
    });
  }
  }
};

watch(cardData, () => {
  initializeSelectedImagesAndButtons();
});

//



/* calc */ 

const calcPrice = () => {
  if (!cardData.value || !cardData.value.variants || !cardData.value.variants.defAttr || !cardData.value.variants.propinfo) {
    if (cardData.value.variants == "No SKU property available") {
      let finalPrice = cardData.value.discountPrice != "No discount Price" || cardData.value.price;
      const shippingCost = cardData.value.shipping == 'Free Shipping' ? 0 : cardData.value.shipping;
      let totalPrice = finalPrice + shippingCost;
      if (totalPrice < 1) {
        finalPrice *= rateLessThanOne;
      } else if (totalPrice < 10) {
        finalPrice *= rateLessThanTen;
      } else if (totalPrice < 100) {
        finalPrice *= rateLessThanHundred;
      } else {
        finalPrice *= rateHundredAndAbove;
      }
      //console.log(totalPrice)
      // Math.round((totalPrice + 50 / 2) / 50) * 50
      // (${cardData.value.shipping == 'Free Shipping' ? 'شحن مجاني' : 'مع الشحن'})
      const one = Math.round((finalPrice + 50 / 2) / 50) * 50;
      return `${one * items.value} DZD`;
    }
    return 'Price not available';
  }

  const requiredAttributes = cardData.value.variants.defAttr.split(';').map(pair => pair.split(':')[1]);
  
  const matchingPropInfo = cardData.value.variants.propinfo.find(prop => {
    const propAttributes = prop.attr.split(';').map(pair => pair.split(':')[1]);
    return requiredAttributes.every(attr => propAttributes.includes(attr));
  });

  if (matchingPropInfo) {
    let finalPrice = matchingPropInfo.price;

    const shippingCost = cardData.value.shipping == 'Free Shipping' ? 0 : cardData.value.shipping;
    
    let totalPrice = finalPrice + shippingCost;

    if (totalPrice < 1) {
      finalPrice *= rateLessThanOne;
    } else if (totalPrice < 10) {
      finalPrice *= rateLessThanTen;
    } else if (totalPrice < 100) {
      finalPrice *= rateLessThanHundred;
    } else {
      finalPrice *= rateHundredAndAbove;
    }
    //console.log(totalPrice)
    // Math.round((totalPrice + 50 / 2) / 50) * 50
    // (${cardData.value.shipping == 'Free Shipping' ? 'شحن مجاني' : 'مع الشحن'})
    const one = Math.round((finalPrice + 50 / 2) / 50) * 50;
    return `${one * items.value} DZD`;
  } else {
    return 'Price not available';
  }
};

const calcShipping = () => {
  if (!cardData.value || !cardData.value.variants || !cardData.value.variants.defAttr || !cardData.value.variants.propinfo) {
    if (cardData.value.variants == "No SKU property available") {
      if (cardData.value.shipping == "Free Shipping") {
        return "(شحن مجاني)";
      } else {
        const finalPrice = cardData.value.discountPrice != "No discount Price" || cardData.value.price;
        let shippingCost = cardData.value.shipping;
        console.log(finalPrice)
        let totalPrice = finalPrice + cardData.value.shipping;
        
        if (totalPrice < 1) {
          shippingCost *= rateLessThanOne;
        } else if (totalPrice < 10) {
          shippingCost *= rateLessThanTen;
        } else if (totalPrice < 100) {
          shippingCost *= rateLessThanHundred;
        } else {
          shippingCost *= rateHundredAndAbove;
        }
        return `${Math.round((shippingCost + 50 / 2) / 50) * 50} DZD (سعر الشحن)`;
      }
    }
    return 'Price not available';
  }

  const requiredAttributes = cardData.value.variants.defAttr.split(';').map(pair => pair.split(':')[1]);
  
  const matchingPropInfo = cardData.value.variants.propinfo.find(prop => {
    const propAttributes = prop.attr.split(';').map(pair => pair.split(':')[1]);
    return requiredAttributes.every(attr => propAttributes.includes(attr));
  });

  if (cardData.value.shipping == "Free Shipping") {
    return "(شحن مجاني)";
  } else {
    const finalPrice = matchingPropInfo.price;
    let shippingCost = cardData.value.shipping;
    console.log(finalPrice)
    let totalPrice = finalPrice + cardData.value.shipping;

    if (totalPrice < 1) {
      shippingCost *= rateLessThanOne;
    } else if (totalPrice < 10) {
      shippingCost *= rateLessThanTen;
    } else if (totalPrice < 100) {
      shippingCost *= rateLessThanHundred;
    } else {
      shippingCost *= rateHundredAndAbove;
    }

    return `${Math.round((shippingCost + 50 / 2) / 50) * 50} DZD (سعر الشحن)`;
  }
};
///////


const extractURL = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const numberRegex = /^\d+$/;
        if (numberRegex.test(text)) {
            return text;
        } else {
            const matches = text.match(urlRegex);
            if (matches && matches.length > 0) {
                return matches[0]; // Return the extracted URL
            } else {
                return null; // No URL found
            } 
        }
    };
    
const searchClicked = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await useFetch('/api/get', {
      query: { url: extractURL(searchQuery.value) },
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



useSeoMeta({
  title: 'Ozerve Store',
  ogTitle: 'Ozerve Store',
  description: 'Shop from AliExpress using 🇩🇿 Dinar!',
  ogDescription: 'Shop from AliExpress using 🇩🇿 Dinar!',
  ogImage: 'https://i.ibb.co/8xnDMGG/Manfaat-Toko-Online.jpg',
})

</script>

<style scoped>
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
.bg-svg-background {
  background-image: url('/back.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
}
</style>