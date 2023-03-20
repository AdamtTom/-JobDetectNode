
function loginHandler(data) {
    if (data.errMsg) {
        document.getElementById("loginErrorMessage").style.display = 'block';
        document.getElementById("loginErrorMessage").innerHTML = data.errMsg
    } else {
        window.location = '/'
    }
}

$('#loginBtn').click(() => {
    /**
     * AJAX that sends the values from email and password fields to /login and if the
     * email and password match the databse records call the helper function.
     */
    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
        },
        success: loginHandler
    })
});