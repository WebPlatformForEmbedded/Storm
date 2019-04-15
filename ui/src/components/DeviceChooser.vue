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
    
    <div class="flex w-4/5 mt-8 text-sm" v-if="device">
        <div class="w-1/5 flex items-center"></div>
        <div class="w-3/5">
            <div class="w-full flex mb-2">
                <div class="w-1/3">
                    <label class="text-grey-darker">Device ID</label>
                </div>
                <div class="w-2/3">
                    {{device.systeminfo.deviceid}}
                </div>
            </div>
            <div class="w-full flex mb-2">
                <div class="w-1/3">
                    <label class="text-grey-darker">Version</label>
                </div>
                <div class="w-2/3 flex">
                    {{device.systeminfo.version}}
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
  computed: {
    selectedDevice() {
      return this.$store.state.device
    },
    differentDevice() {
        if(!this.selectedDevice) return true
        else if(!this.device) return true
        else {
            this.selectedDevice.systeminfo.deviceid !== this.device.systeminfo.deviceid
        }
    }
  },
  methods: {
    getDeviceByIp() {
        if(this.ip === '#') {
            this.device = {
                systeminfo: {
                    deviceid: 'fake device',
                    version: '1.0.0'
                }
            }
        }
        else {
            this.$http({
                url: 'http://' + this.ip + '/Service/DeviceInfo',
                timeout: 2000,
                method: 'GET',
            }).then(({data}) => {
                this.device = data
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
