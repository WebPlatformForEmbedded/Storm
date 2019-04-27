export default obj => {
  return JSON.parse(JSON.stringify(obj, Object.getOwnPropertyNames(obj)))
}
