$(document).ready(() => {
    let req = $.ajax({
        url: 'php/getuser.php',
        method: 'POST',
        data: {
            'token': localStorage.getItem('loginToken')
        }
    });
    req.done((mes) => {
        if (mes === '') {
            tokenCancel();
        } else {
            let res = JSON.parse(mes);
            console.log(mes);
            document.querySelector('.name.input').value = res['name'];
            document.querySelector('.surname.input').value = res['surname'];
            document.querySelector('.lastname.input').value = res['lastname'];
            document.querySelector('.email.input').value = res['email'];
        }
    });
    req.fail((j, m) => {
        alert(m);
    });
})
