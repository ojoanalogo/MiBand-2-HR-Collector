const miband = require('miband');
const ms = require('ms');
const bluetooth = navigator.bluetooth;

global.jQuery = require("jquery");

class MiBand {
    constructor() {
        this.bindEvents();
        this.band = null;
        this.chart = [];
        this.dataStore = [];
        this.createChart();
    }
    bindEvents() {
        $('#start').click(() => {
            this.connect();
        });
        $('#stop').click(() => {
            this.stopMedition();
        });
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    log(data) {
        $('#output').append(data + '\n');
    }
    async connect() {
        if (!bluetooth) {
            this.log('This browser doesnt support bluetooth web API 🚫');
            return false;
        }
        try {
            const device = await bluetooth.requestDevice({
                filters: [{ services: [miband.advertisementService] }],
                optionalServices: miband.optionalServices
            });
            // device.addEventListener('gattserverdisconnected', () => {
            //     log('Device disconnected');
            // });
            // await device.gatt.disconnect();
            this.log('Connecting to device...');
            const server = await device.gatt.connect();
            this.log('Connected');
            this.band = new miband(server);
            this.startBandInit();
        } catch (error) {
            console.log(error);
            this.log('Could not connect to this device');
        }
    }
    async startBandInit() {
        try {
            await this.band.init();
            this.log('Starting heart rate medition...');
            await this.band.showNotification('message');
            await this.delay(1000);
            this.band.on('heart_rate', (rate) => {
                this.log('<span class="has-text-danger">❤</span> Heart Rate: ' + rate)
                const time = Date.now();
                this.dataStore.push({ time: time, val: rate });
                const timeF = new Date(time);
                const label = timeF.getHours() + ":" + timeF.getMinutes();
                this.updateChart(label, rate);
            });
            const date = new Date();
            this.log('Start hour: ' + date.getHours() + ':' + date.getMinutes());
            await this.band.hrmStart();
            if ($('#time').val()) {
                const time = $('#time').val();
                this.delay(ms(time));
                await this.delay(ms(time)).then(() => {
                    this.band.hrmStop().then(() => {
                        this.stopMedition();
                    });
                });
            }
        } catch (error) {
            this.log('Error while trying to get heart rate');
        }
    }
    stopMedition() {
        const csv = this.convertArrayOfObjectsToCSV(this.dataStore);
        const name = $('#name').val() || 'data';
        const hiddenElement = document.createElement('a');
        this.log('Saving data (' + name + '.csv' + ')...');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = name + '.csv';
        hiddenElement.click();
    }
    convertArrayOfObjectsToCSV(arrayData) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
        data = arrayData || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = ',';
        lineDelimiter = '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
    createChart() {
        var ctx = document.getElementById("chart");
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Heart rate value',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)'
                    ],
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    }]
                }
            }
        });
    }
    updateChart(label, data) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        this.chart.update();
    }
}

new MiBand();