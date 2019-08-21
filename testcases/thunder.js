export default {
  title: 'Dummy - Thunder',
  description: 'Testing that we can use the ThunderJS to make calls to a Thunder enabled device',
  steps: [
    {
      description: 'Getting Device Info',
      test() {
        return this.$thunder.DeviceInfo.systeminfo()
      },
      validate(result) {
        if (this.$expect(result).to.be.object() !== true) {
          return false
        }
        return this.$expect(Object.keys(result)).to.include(
          'version',
          'uptime',
          'totalram',
          'freeram',
          'devicename',
          'cpuload',
          'totalgpuram',
          'freegpuram',
          'serialnumber',
          'deviceid',
          'time'
        )
      },
    },
    {
      description: 'Activating the Webkit plugin',
      test() {
        return this.$thunder.Controller.activate({ callsign: 'WebKitBrowser' })
          .then(() => true)
          .catch(err => err)
      },
      assert: true,
    },
    {
      description: 'Setting the URL to metrological.com',
      test(url) {
        return this.$thunder.WebKitBrowser.url(url)
          .then(() => {
            this.$log('Set url to ' + url)
            return true
          })
          .catch(err => err)
      },
      params: 'http://www.metrological.com',
      assert: true,
    },
    {
      description: 'Confirming the URL is set to metrological.com',
      sleep: 2,
      test() {
        return this.$thunder.WebKitBrowser.url()
          .then(result => result)
          .catch(err => err)
      },
      validate(result) {
        return this.$expect(result).to.be.equal('https://www.metrological.com/')
      },
    },
  ],
}
