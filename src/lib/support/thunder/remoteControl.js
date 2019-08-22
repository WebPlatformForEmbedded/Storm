const keyMapping = {
  1: '0x0021',
  2: '0x0022',
  3: '0x0023',
  4: '0x0024',
  5: '0x0025',
  6: '0x0026',
  7: '0x0027',
  8: '0x0028',
  9: '0x0029',
  0: '0x0020',
  exit: '0x0009',
  a: '0x8004',
  b: '0x8005',
  c: '0x8006',
  d: '0x8007',
  e: '0x8008',
  f: '0x8009',
  g: '0x800A',
  h: '0x800B',
  i: '0x800C',
  back: '0x0032',
  j: '0x800D',
  k: '0x800E',
  l: '0x800F',
  m: '0x8010',
  n: '0x8011',
  o: '0x8012',
  p: '0x8013',
  q: '0x8014',
  r: '0x8015',
  up: '0x0001',
  ok: '0x002B',
  s: '0x8016',
  t: '0x8017',
  u: '0x8018',
  v: '0x8019',
  w: '0x801A',
  x: '0x801B',
  y: '0x801C',
  z: '0x801D',
  left: '0x0003',
  down: '0x0002',
  right: '0x0004',
}

export default function(thunderJS) {
  const call = (key, nr = 1, pause = 300) => {
    return Array(nr)
      .fill(() => {
        return new Promise((resolve, reject) => {
          thunderJS.RemoteControl.send({
            device: 'DevInput',
            code: keyMapping[key],
            key: '',
            modifiers: [''],
          })
            .then(res => {
              this.reporter.log('Clicked ' + key + ' on remote control')
              setTimeout(() => {
                resolve(res)
              }, pause)
            })
            .catch(reject)
        })
      })
      .reduce((p, item) => p.then(() => item()), Promise.resolve(null))
  }

  return {
    up() {
      return call.apply(null, ['up', ...arguments])
    },
    down() {
      return call.apply(null, ['down', ...arguments])
    },
    left() {
      return call.apply(null, ['left', ...arguments])
    },
    right() {
      return call.apply(null, ['right', ...arguments])
    },
    ok() {
      return call.apply(null, ['ok', ...arguments])
    },
    back() {
      return call.apply(null, ['back', ...arguments])
    },
    exit() {
      return call.apply(null, ['exit', ...arguments])
    },
    key(key) {
      return call.apply(null, ['exit', ...arguments])
    },
  }
}
