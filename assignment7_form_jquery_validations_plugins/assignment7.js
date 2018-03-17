$(document).ready(function() {
  $("#form").validate({
    //ignore : [],   // for input fields with type hidden
    rules: {
      firstname: {
        required: true,
        charactersOnly: true
      },
      lastname: {
        required: true,
        charactersOnly: true
      },
      dateofbirth: {
        required: true
      },
      username: {
        required: true,
        usernameValidation: true
      },
      email: {
        required: true,
        emailValidation: true
      },
      password: {
        required: true,
        passwordValidation: true
      },
      repassword: {
        required: true,
        repasswordValidation: true
      }
    },
    messages :{
      firstname: {
        required: "First name is required"
      },
      lastname: {
        required: "Last name is required"
      },
      dateofbirth: {
        required: "Date of birth is required"
      },
      username: {
        required: "Username is required"
      },
      email: {
        required: "We need to email you to confirm your account."
      },
      password: {
        required: "Password is required"
      },
      repassword: {
        required: "Confirm your password"
      }
    }
  });

  $.validator.addMethod("charactersOnly",function(value, element) {
                   return /^[a-z]{0,}[A-Z]{0,}$/.test(value);
           },"Only characters allowed.");

  $.validator.addMethod("usernameValidation",function(value, element) {
                   return /^\w{1,}$/.test(value);
           },"Your username can only contain letter A-Z or number 0-9.");

  $.validator.addMethod("emailValidation",function(value, element) {
                   return /^[a-zA-Z0-9]{1,}@[a-z]{1,}\.[a-z]{1,}$/.test(value);
           },"Enter valid email address");

  $.validator.addMethod("passwordValidation",function(value, element) {
                   return /^\S{8,}$/.test(value);
           },"Must be atleast 8 characters long with no spaces.");

  $.validator.addMethod("repasswordValidation",function(value, element) {
                  if ($("#password").val() == $("#repassword").val()) {
                    return true;
                  } else {
                    return false;
                  }
           },"It should match with your password");


  var options = {
    map: ".map",
    details: ".location-details",
  };
  $("#location").geocomplete(options);
});
