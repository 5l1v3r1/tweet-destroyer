const fs = require('fs-promise')
const ProgressBar = require('progress')
const destroyTweet = require('./destroyTweet')

function getCursor() {
  return fs
    .readFile('./cursor', 'UTF-8')
    .then(Number)
    .catch(() => 0)
}

function saveCursor(cursor) {
  return fs.writeFile('./cursor', cursor)
}

async function getTweets() {
  let currentFile
  let allTweets = []
  const files = await fs.readdir('./data')

  while ((currentFile = files.shift())) {
    let currentTweet

    const tweets = await fs
      .readFile(`./data/${currentFile}`, 'UTF-8')
      .then(str => str.replace(/[\w\W]+?\n+?/, ''))
      .then(JSON.parse)
      .catch(error => {
        console.error(error)
        process.exit(1)
      })

    while ((currentTweet = tweets.shift())) {
      allTweets.push(currentTweet.id_str)
    }
  }

  return allTweets
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function main() {
  const cursor = await getCursor()
  const tweets = await getTweets()

  const bar = new ProgressBar('[:bar] :current/:total | :percent | :message', {
    curr: cursor,
    total: tweets.length,
    width: 23,
    incomplete: ' ',
    complete: '='
  })

  asyncForEach(tweets.slice(cursor), async (tweet, index) => {
    let message

    try {
      const { statusCode } = await destroyTweet(tweet)

      if (statusCode !== 200) {
        throw new Error(statusCode)
      }

      message = `${tweet} ✅`
    } catch (err) {
      message = `${tweet} ⛔️`
    }

    await saveCursor(index)

    bar.tick({ message })
  })
}

main()
