<template>  
  <div>
    <div class="flex w-4/5">

      <div class="w-1/5 flex items-center">
        <label class="text-grey-darker">IP address</label>
      </div>
      <div class="w-3/5">
        <input
          class="appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none"
          type="text"
          v-model="ip"
          @keyup.enter="getDeviceByIp"
        />
      </div>
      <div class="w-1/5 flex items-center">
        <button
          class="ml-2 bg-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded focus:outline-none"
          @click="getDeviceByIp"
        >Search</button>
      </div> 
    </div>
    <div class="flex w-4/5 mt-2">
      <div class="w-1/5"></div>
      <div class="w-3/5"><span class="text-sm text-grey-dark">(use # for fake local device)</span></div>
    </div>
    
    <div class="flex w-4/5 mt-8 text-sm" v-if="device.deviceid">
        <div class="w-1/5 flex items-center"></div>
        <div class="w-3/5">
            <div class="w-full flex mb-2">
                <div class="w-1/3">
                  <label class="text-grey-darker">Device ID</label>
                </div>
                <div class="w-2/3">
                  {{device.deviceid}}
                </div>
            </div>
            <div class="w-full flex mb-2">
                <div class="w-1/3">
                  <label class="text-grey-darker">Version</label>
                </div>
                <div class="w-2/3 flex">
                  {{device.version}}
                </div> 
            </div>
            <div class="w-full flex mb-2">
                <div class="w-1/3">
                  <label class="text-grey-darker">IP address</label>
                </div>
                <div class="w-2/3 flex">
                  {{device.ip}}
                </div> 
            </div>
            <div class="w-full flex justify-center mt-8">
                <button 
                  v-if="differentDevice"
                  class="ml-2 bg-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded focus:outline-none"
                  @click="choose"
                  >Select device</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceChooser',
  data: () =>({
    ip: null,
    device: null,
    error: null,
  }),
  created() {
    this.device = {...this.selectedDevice}
    this.ip = this.device.ip || null
  },
  computed: {
    selectedDevice() {
      return this.$store.state.device
    },
    differentDevice() {
      if(!this.selectedDevice) return true
      else if(!this.device) return true
      else {
        return this.selectedDevice.deviceid !== this.device.deviceid
      }
    }
  },
  methods: {
    getDeviceByIp() {
      if(this.ip === '#') {
        this.device = {
          deviceid: 'Fake local device',
          version: '1.0.0',
          ip: '127.0.0.1',
        }
      }
      else {
        this.$http({
            url: 'http://' + this.ip + '/Service/DeviceInfo',
            timeout: 2000,
            method: 'GET',
        }).then(({data}) => {
          // normalize for Master and Stable (stable is camelcase, master is lower case)
          this.device = data.SystemInfo || data.systeminfo
          this.device.ip = this.ip
        }).catch(err => {
            this.error = 'No device found at this IP address'
        })
      }   
    },
    choose() {
      this.$store.commit('SET_DEVICE', this.device)
    }
  }
}
</script>

<style>
</style>
