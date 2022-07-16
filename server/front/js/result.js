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
    // IVLmap = new ymaps.Map("map_object2", {
    //     center: [60.21957835473155,96.94846497519858],
    //     zoom: 3
    // });
    if(localStorage.getItem('calc_res') === undefined || localStorage.getItem('loaded_data') === undefined)
        return;
    let csv_data = JSON.parse(localStorage.getItem('loaded_data'));
    let maxF = 0;
    for(let i of JSON.parse('[' + localStorage.getItem('calc_res') + ']')){
        if(i > maxF) maxF = i;
    }
    let count = 1;
    let subjects = [];
    JSON.parse('[' + localStorage.getItem('calc_res') + ']').forEach((i, count) => {
        count++;
        if(csv_data[count][4] == 0 || subjects.includes(csv_data[count][3])) return;
        let [R,G,B] = [i / maxF * 255, (1 - i/maxF) * 255, 0];
        // let myCircle = new ymaps.Circle([[csv_data[count][1], csv_data[count][2]], 50000], {
        //     hintContent : csv_data[count][3],
        //     balloonContentHeader: "Город " + csv_data[count][3],
        //     balloonContentBody: "Население: " + Math.floor(csv_data[count][4]) + ' чел., частота заражений: ' + Number((i).toFixed(2))
        // },{
        //     fillColor: 'rgb('+ R +',' + G + ',' + B + ')',
        //     fillOpacity: 0.5,
        //     strokeWidth: '0'
        // });
        // console.log(i + "  " + csv_data[count][3] + "  " + myCircle);
        // coronamap.geoObjects.add(myCircle);
        var placemark = new ymaps.Placemark([csv_data[count][1], csv_data[count][2]], {
            hintContent : csv_data[count][3],
            balloonContentHeader: "Город " + csv_data[count][3],
            balloonContentBody: "Население: " + Math.floor(csv_data[count][4]) + ' чел., скорость распространения вируса: ' + Number((i).toFixed(2))
        }, {
            // Задаем стиль метки (метка в виде круга).
            preset: "islands#dotIcon",
            // Задаем цвет метки (в формате RGB).
            iconColor: 'rgb('+ R +',' + G + ',' + B + ')',

        });
        coronamap.geoObjects.add(placemark);
        subjects.push(csv_data[count][3]);
    });
}
