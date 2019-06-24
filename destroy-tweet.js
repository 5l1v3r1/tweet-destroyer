const curl = new (require('curl-request'))()
const config = require('./config.json')

function destroyTweet(id) {
  return curl
    .setHeaders([
      `cookie: ${config.cookie}`,
      'origin: https://twitter.com',
      'accept-encoding: gzip, deflate, br',
      'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36',
      'content-type: application/x-www-form-urlencoded; charset=UTF-8',
      'accept: application/json, text/javascript, */*; q=0.01',
      `referer: https://twitter.com/${config.username}/status/${id}`,
      'authority: twitter.com',
      'x-requested-with: XMLHttpRequest',
      'x-twitter-active-user: yes',
      'dnt: 1'
    ])
    .setBody({
      _method: 'DELETE',
      authenticity_token: config.authenticityToken,
      id
    })
    .post('https://twitter.com/i/tweet/destroy')
}

module.exports = destroyTweet
