/* global _ */
var userService = window.skilly.userService;

$(document).ready(function (event) {
    $('#form-signup').on('click', function (event) {
        event.preventDefault();
        var user = _.object($("#form-signup").serializeArray().map(function (v) {
            return [v.name, v.value];
        }));
        userService.signUp(user);
    });
    
    $('#form-signin').on('submit', function (event) {
        event.preventDefault();
        var creds = _.object($("#form-signin").serializeArray().map(function (v) {
            return [v.name, v.value];
        }));
        $('#btn-close-auth').trigger('click');
        userService.auth(creds);
    });
});

