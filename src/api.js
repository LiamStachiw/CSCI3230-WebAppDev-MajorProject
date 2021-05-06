import axios from 'axios'

// create the axios client
const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

export default {
  // create the execute function
  async execute (method, resource, data) {
    return client({
      method,
      url: resource,
      data
    }).then(req => {
      return req.data
    })
  },
  // define all of the CRUD operations
  getHighscores () {
    return this.execute('get', '/highscores')
  },
  createHighscore (data) {
    return this.execute('post', '/highscores', data)
  },
  updateHighscore (id, data) {
    return this.execute('put', `/highscores/${id}`, data)
  },
  deleteHighscore (id) {
    return this.execute('delete', `/highscores/${id}`)
  }
}
