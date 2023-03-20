
function registerHandler(data) {
    if (data.errMsg) {
        document.getElementById("registerErrorMessage").style.display = 'block';
        document.getElementById("registerErrorMessage").innerHTML = data.errMsg
    } else {
        window.location = '/'
    }
}

$('#registerBtn').click(() => {
    const formData = $('#form').serializeArray().reduce((function(acc, val) {
        acc[val.name] = val.value;
        return acc;
      }), {});

    let {name, email, password, repeat_password} = document.form
    if(!name.reportValidity() || !email.reportValidity() || !password.reportValidity() || !repeat_password.reportValidity()){
        return;
    }
    if ($('#password').val() != $('#repeat_password').val()){
        document.getElementById("registerErrorMessage").style.display = 'block';
        document.getElementById("registerErrorMessage").innerHTML = "Passwords don't match"
        return;
    }

    $.ajax({
        url: '/register',
        type: 'POST',
        data: formData,
        success: registerHandler
    })
});