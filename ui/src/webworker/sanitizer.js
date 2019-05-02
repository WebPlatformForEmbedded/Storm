export default obj => {
  return JSON.parse(JSON.stringify(obj, obj && Object.getOwnPropertyNames(obj)))
}
