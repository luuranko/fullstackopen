import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = { headers: { Authorization: token } }
  const res = await axios.post(baseUrl, newBlog, config)
  return res.data
}

const update = async blog => {
  const res = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return res.data
}

const remove = async id => {
  const config = { headers: { Authorization: token } }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

export default { getAll, create, setToken, update, remove }
