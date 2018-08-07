const miband = require('miband');
const bluetooth = navigator.bluetooth;

global.jQuery = require("jquery");

function log(data) {
    $('#output').append(data + '\n');
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

let banda;
let data = [];

async function connect() {
    if (!bluetooth) {
        log('Este navegador no soporta bluetooth web');
    }
    try {
        const device = await bluetooth.requestDevice({
            filters: [
                { services: [miband.advertisementService] }
            ],
            optionalServices: miband.optionalServices
        });

        device.addEventListener('gattserverdisconnected', () => {
            log('Device disconnected');
        });

        await device.gatt.disconnect();

        log('Conectado al dispositivo...');
        const server = await device.gatt.connect();
        log('Conectado');

        banda = new miband(server);

        await banda.init();
        log('Iniciando medición...');

        banda.on('heart_rate', (rate) => {
            log('<span class="has-text-danger">❤</span> Ritmo cardiaco: ' + rate)
            data.push({ time: Date.now(), val: rate });
        });
        const fecha = new Date();
        log('Hora de inicio: ' + fecha.getHours() + ':' + fecha.getMinutes());
        await banda.hrmStart();
        if($('#tiempo').val()) {
            const time = $('#tiempo').val();
            console.log('Tiene tiempo establecido, minutos: ' + time);
            const timeMS = parseInt(time)*60*1000
            await delay(timeMS);
            await banda.hrmStop();
        }

    } catch (error) {
        console.log(error);
        log('No se pudo conectar al dispositivo');
    }
}

$('#iniciar').click(function () {
    connect();
});


$('#parar').click(function () {
    const nombre = $('#nombre').val() || 'datos';
    banda.hrmStop();
    log('Parando medición...');
    console.log(data);
    const csv = convertArrayOfObjectsToCSV(data);
    console.log('csv::');
    console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = nombre + '.csv';
    hiddenElement.click();
});

function convertArrayOfObjectsToCSV(datos) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = datos || null;
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