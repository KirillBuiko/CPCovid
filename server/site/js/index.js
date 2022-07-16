const host = window.location.protocol + "//" + window.location.host;

document.querySelector('#file_input').addEventListener('change', (event) => {
    document.querySelector('.file_text').value = document.querySelector('#file_input').files[0].name;
});

let uploadFile = () => {
    let file = document.querySelector('#file_input').files[0];
    if(document.querySelector('.submit_button').classList.contains('loading')){
        return;
    }
    if(file === undefined){
        alert('Сначала выберите файл.');
        return;
    }
    document.querySelector('.text_body').classList.add('loading');
    document.querySelector('#file_input').disabled = true;
    console.log(file.name);
    const fd = new FormData();
    fd.append('file', file);

    fetch(host+'/upload', {
        method: 'POST',
        body: fd
    })
        .then(response => response.json())
        .then(result => {
            localStorage.setItem('calc_res', result);
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                let csv_obj = $.csv.toArrays(reader.result);
                alert(csv_obj[0].length);
                if(csv_obj[0].length === 1){
                    csv_obj = $.csv.toArrays(reader.result, {separator: ';'});
                    alert(csv_obj[0].length);
                }
                if(csv_obj[0].length === 1){
                    uploadError();
                    return;
                }
                localStorage.setItem('loaded_data', JSON.stringify(csv_obj));
                uploadSuccess();
            };

            reader.onerror = function() {
                uploadError();
            };


            })
        .catch(error => {
            uploadError();
        });
}

let uploadError = () => {
    alert('Загруженный файл некорректен. Попробуйте другой или измените его.');
    document.querySelector('#file_input').value = "";
    document.querySelector('.file_text').value = "";
    document.querySelector('#file_input').disabled = false;
    document.querySelector('.text_body').classList.remove('loading');
}

let uploadSuccess = () => {
    document.querySelector('#file_input').value = "";
    document.querySelector('#file_input').disabled = false;
    document.querySelector('.text_body').classList.remove('loading');
    document.querySelector('.text_body').classList.add('ready');
    document.querySelector('.submit_button.button').innerHTML = "Перейти к результатам";
    document.querySelector('.submit_button.button').removeEventListener('click', uploadFile);
    document.querySelector('.submit_button.button').onclick = () => {
        location.href = (host + '/result');
    }
}

document.querySelector('.submit_button.button').addEventListener('click', uploadFile);