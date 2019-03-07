const axios = require('axios')

module.exports = {
    dummy(x) {
        return x
    },
    getUrl(url) {
        return axios.get(url).catch(err => {
            return err.response
        })
    },
    stopPlugin(plugin) {
        const url = 'http://' + config.ip + '/Service/Controller/Deactivate/' + plugin
        return axios({
            url: url,
            method: 'PUT',
        })
        .catch(err => {
            return err.response ?
                (err.response.status || err.response) :
                (err.code || err)
        });
    },
    startPlugin(plugin) {
        const url = 'http://' + config.ip + '/Service/Controller/Activate/' + plugin
        return axios({
            url: url,
            method: 'PUT',
        })
        .catch(err => {
            return err.response ?
                (err.response.status || err.response) :
                (err.code || err)
        })
    },
    resumePlugin(plugin) {
        const url = 'http://' + config.ip + '/Service/' + plugin + '/Resume'
        return axios({
            url: url,
            method: 'POST',
        }).catch(err => {
            return err.response ?
                (err.response.status || err.response) :
                (err.code || err)
        });
    },
    suspendPlugin() {
        const url = 'http://' + config.ip + '/Service/' + plugin + '/Suspend'
        return axios({
            url: url,
            method: 'POST',
        }).catch(err => {
            return err.response ?
                (err.response.status || err.response) :
                (err.code || err)
        });
    },
    setPluginUrl(plugin, target) {
        const url = 'http://' + config.ip + '/Service/' + plugin + '/URL'
        return axios({
            url: url,
            method: 'POST',
            data: {
                url: target
            }
        }).catch(err => {
            return err.response ?
                (err.response.status || err.response) :
                (err.code || err)
        });
    },
    getCpuLoad() {
        const url = 'http://' + config.ip + '/Service/DeviceInfo'
        return axios({
            url: url,
            method: 'GET',
        }).then(({data}) => {
            // switch for Master and Stable (stable is camelcase, master is lower case)
            const systemInfo = data.SystemInfo || data.systeminfo
            if(!systemInfo) {
                throw new Error('System Info not found')
            }
            const cpuLoad = systemInfo ? 
                // switch for Master and Stable (stable is camelcase, master is lower case)
                parseFloat(systemInfo.cpuLoad || systemInfo.cpuload) : null

            if(!cpuLoad) {
                throw new Error('CPU load not found in System Info')
            }

            return cpuLoad
        })
        .catch(err => {
            return err.message
        });
    },

}
