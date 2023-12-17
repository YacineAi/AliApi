import https from 'https';
export default defineEventHandler(async (event) => {
    setInterval(() => {
        https.get(`${process.env.RENDER_EXTERNAL_URL}/api/ping`, (resp) => {
          if (resp.statusCode === 200) {
            console.log('Ping successful');
          } else {
            console.error('Ping failed');
          }
        });
      }, 5 * 60 * 1000);

      return { "status" : 200 }
})