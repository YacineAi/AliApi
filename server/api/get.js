export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)

    const data = await $fetch(`https://coinpi.onrender.com/detail?id=${url}`);

    const calcPrice = () => {
        if (data.shipping == "Free Shipping") {
            if (data.discountPrice == "No discount Price") {
                if (data.price < 1) {
                    var priceDz = data.price * 250;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                } else if (data.price < 10) {
                    var priceDz = data.price * 245;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                } else if (data.price < 100) {
                    var priceDz = data.price * 240;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                } else if (data.price > 100) {
                    var priceDz = data.price * 235;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                }
            } else {
                if (data.discountPrice < 1) {
                    var priceDz = data.discountPrice * 250;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                } else if (data.discountPrice < 10) {
                    var priceDz = data.discountPrice * 245;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                } else if (data.discountPrice < 100) {
                    var priceDz = data.discountPrice * 240;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                } else if (data.discountPrice > 100) {
                    var priceDz = data.discountPrice * 235;
                    return `${Math.ceil(priceDz)} DZD (شحن مجاني)`;
                }
            }
        } else {
            if (data.discountPrice == "No discount Price") {
                if (data.price < 1) {
                    var priceDz = (data.price + data.shipping) * 250;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                } else if (data.price < 10) {
                    var priceDz = (data.price + data.shipping) * 245;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                } else if (data.price < 100) {
                    var priceDz = (data.price + data.shipping) * 240;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                } else if (data.price > 100) {
                    var priceDz = (data.price + data.shipping) * 235;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                }
            } else {
                if (data.discountPrice < 1) {
                    var priceDz = (data.discountPrice + data.shipping) * 250;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                } else if (data.discountPrice < 10) {
                    var priceDz = (data.discountPrice + data.shipping) * 245;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                } else if (data.discountPrice < 100) {
                    var priceDz = (data.discountPrice + data.shipping) * 240;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                } else if (data.discountPrice > 100) {
                    var priceDz = (data.discountPrice + data.shipping) * 235;
                    return `${Math.ceil(priceDz)} DZD (مع الشحن)`;
                }
            }
        }
    };
    var dzPrice = calcPrice();
    const details = {
        ...data,
        dzPrice
    };
    return { details }
})