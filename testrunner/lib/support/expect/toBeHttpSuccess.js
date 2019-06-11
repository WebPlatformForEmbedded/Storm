import toBeHttpStatus from './toBeHttpStatus'

export default function(response) {
  return toBeHttpStatus(response, 200)
}
