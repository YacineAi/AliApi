export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)

    const details = await $fetch(`https://coinpi.onrender.com/detail?id=${url}`);
    //console.log(details)
    return { details }
})