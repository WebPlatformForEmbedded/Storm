export default function(response, status) {
  const pass = response.status === status
  if (pass) {
    return {
      message: () => `expected ${response.status} not to be ${status}`,
      pass: true,
    }
  } else {
    return {
      message: () => `expected ${response.status} to be ${status}`,
      pass: false,
    }
  }
}
