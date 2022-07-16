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
}
