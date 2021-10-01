const facebookGetLink = require('facebook-video-link');
const url = 'https://www.facebook.com/EpochTimesTrending/videos/310155606660409'
facebookGetLink(url).then(response => {
  console.log(response)
})

