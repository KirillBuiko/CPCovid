var coronamap;
var IVLmap;

let downloadCSV = () => {
    if(localStorage.getItem('calc_res') === undefined || localStorage.getItem('loaded_data') === undefined)
        return;
    let csv_data = JSON.parse(localStorage.getItem('loaded_data'));
    let res_text = csv_data[0][0] + ",inf_rate\n";
    let count = 1;
    for(let i of JSON.parse('[' + localStorage.getItem('calc_res') + ']')){
        res_text += csv_data[count][0] + ',' + i + '\n';
        count++;
    }
    download('pickaim_result.csv', res_text);
}

let download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

document.querySelector('.map1 .map_header').addEventListener('click', () => {
    alert(coronamap.getCenter());
    alert(coronamap.getZoom());
});

ymaps.ready(init);
function init(){
    coronamap = new ymaps.Map("map_object1", {
        center: [60.21957835473155,96.94846497519858],
        zoom: 3
    });
    IVLmap = new ymaps.Map("map_object2", {
        center: [60.21957835473155,96.94846497519858],
        zoom: 3
    });
    if(localStorage.getItem('calc_res') === undefined || localStorage.getItem('loaded_data') === undefined)
        return;
    let csv_data = JSON.parse(localStorage.getItem('loaded_data'));
    let days_ivl = JSON.parse('[' + localStorage.getItem('days_ivl') + ']');
    let pred = JSON.parse('[' + localStorage.getItem('calc_res') + ']');
    let maxF = 0;
    let maxDays = 0;
    for(let i = 0; i < pred.length; i++){
        if(pred[i] > maxF) maxF = pred[i];
        if(days_ivl[i] > maxDays) maxDays = days_ivl[i];
    }
    let count = 1;
    let subjects = [];
    pred.forEach((i, count) => {
        count++;
        if(csv_data[count][4] == 0 || subjects.includes(csv_data[count][3])) return;
        let [R,G,B] = [i / maxF * 255, (1 - i/maxF) * 255, 0];
        let placemark_pred = new ymaps.Placemark([csv_data[count][1], csv_data[count][2]], {
            hintContent : csv_data[count][3],
            balloonContentHeader: "Город " + csv_data[count][3],
            balloonContentBody: "Население: " + Math.floor(csv_data[count][4]) + ' чел., скорость распространения вируса: ' + Number((i).toFixed(2))
        }, {
            // Задаем стиль метки (метка в виде круга).
            preset: "islands#dotIcon",
            // Задаем цвет метки (в формате RGB).
            iconColor: 'rgb('+ R +',' + G + ',' + B + ')',

        });
        if(days_ivl[count-1] === -1) days_ivl[count-1] = maxDays;
        [R,G,B] = [(1 - days_ivl[count-1] / maxDays) * 255, 0, days_ivl[count-1] / maxDays * 255];
        let placemark_days = new ymaps.Placemark([csv_data[count][1], csv_data[count][2]], {
            hintContent : csv_data[count][3],
            balloonContentHeader: "Город " + csv_data[count][3],
            balloonContentBody: "Население: " + Math.floor(csv_data[count][4]) + ' чел., ИВЛ осталось на  ' + days_ivl[count-1] + ' дней'
        }, {
            // Задаем стиль метки (метка в виде круга).
            preset: "islands#circleIcon",
            // Задаем цвет метки (в формате RGB).
            iconColor: 'rgb('+ R +',' + G + ',' + B + ')',

        });
        coronamap.geoObjects.add(placemark_pred);
        IVLmap.geoObjects.add(placemark_days);
        subjects.push(csv_data[count][3]);
    });
}
