let showError = (err) => {
    document.querySelector('.error_text').style.height = 'max(calc(200px - 10vw), 80px)';
    document.querySelector('.error_text').style.paddingBlock = '30px';
    document.querySelector('.error_text').style.opacity = '1';
    document.querySelector('.error_text').innerHTML = err;
}

let hideError = () => {
    document.querySelector('.error_text').style.height = '0';
    document.querySelector('.error_text').style.paddingBlock = '0';
    document.querySelector('.error_text').style.opacity = '0';
    document.querySelector('.error_text').innerHTML = '';
}

$(document).ready(() => {
    document.querySelector('.submit_button').addEventListener('click', () => {
        hideError();
        let req = $.ajax({
            url:'php/reg.php',
            method: 'POST',
            data:{
                'name': document.querySelector('.name.input').value,
                'surname': document.querySelector('.surname.input').value,
                'lastname': document.querySelector('.lastname.input').value,
                'login': document.querySelector('.login.input').value,
                'password': document.querySelector('.password.input').value,
                'email': document.querySelector('.email.input').value
            }
        });
        req.done((mes) => {
            console.log(mes);
            let res = JSON.parse(mes);
            if(res['error'] !== ''){
                showError(res['error']);
            }
            else{
                localStorage.setItem('loginToken', res['token']);
                location.replace('index.html');
            }
        });
        req.fail((j, m) => {
           alert(m);
        });
    });
})
