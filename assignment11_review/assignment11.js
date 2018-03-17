function Application() {
  var posts = {"posts" : [
    {"id" : 1 ,"name" : "Jacob Thornton" , "description" : "Lorem Ipsum is simply dummy text of the\
     printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy \
      text ever since the 1500s, when an unknown printer took a galley of type and scrambled \
       it to make a type specimen book. It has survived not only five centuries." , "imageUrl" : "https://bootstrap-themes.github.io/application/assets/img/avatar-fat.jpg" , "postingTime" : "Wed Mar 14 2018 10:04:40 GMT+0530 (IST)"},
    {"id" : 0 , "name" : "Mark Otto" , "description" : "Lorem Ipsum is simply dummy text of the\
     printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy \
      text ever since the 1500s, when an unknown printer took a galley of type and scrambled \
       it to make a type specimen book. It has survived not only five centuries.", "imageUrl" : "https://bootstrap-themes.github.io/application/assets/img/avatar-fat.jpg" , "postingTime" : "Wed Mar 14 2018 10:04:40 GMT+0530 (IST)"},
  ]}; // to show the initial 2 posts when the local storage will be emptied
  if(!localStorage.getItem('posts')){
    localStorage.setItem("posts" , JSON.stringify(posts) ); // not to reset the local storage each time on refresh,
    //stringified as data needs to be sent in form of string
  }

  this.initialise = function() {
    try {
      var data = JSON.parse(localStorage.getItem("posts"));
    } catch(err) {
      console.log(err);
    }

    //calculating the time differences for each post
    var currentTime = new Date();
    for(var i = 0; i < data["posts"].length; i++) {
      var diffInMs = currentTime.getTime() - new Date(data["posts"][i]["postingTime"]).getTime() ;
      var diff = calculateTimeDifference(diffInMs);
      var diffString = "";
      if(diff["d"] > 0) diffString += diff["d"] +" day ";
      if(diff["h"] > 0) diffString += diff["h"] +" hr ";
      if(diff["m"] > 0) diffString += diff["m"] +" min ";
      if(diff["s"] > 0) diffString += diff["s"] +" sec";
      data["posts"][i]["time"] = diffString; //time property added here on local object, not stored on local storage
    }

    //rendering the already existing data on document ready using external mustache file
    $.get('template.mustache', function(template) {
    var html = Mustache.render(template, data);
    $(".post-container").append(html);
    $('[data-toggle="popover"]').popover();
    });

    // jquery validation for the form to add new post
    $("#add-new-post-form").validate({
      rules : {
        newname: {
          required: true
        },
        newdescription: {
          required: true
        },
        newimageurl: {
          required: true,
          isUrlValid: true,
          imageExists: true
        }
      },
      messages : {
        newimageurl: {
          isValid : "Enter a valid url."
        }
      }
    });
    $.validator.addMethod("isUrlValid", function(value, element) {
        return /^(?:http(s)?:\/\/)[a-zA-Z0-9/.\/\-]{1,}(jpg|png|jpeg)$/.test(value);
    },"Enter valid url");
    var exists = false;
    //following method to check existence of image on server while validating by sending ajax request
    $.validator.addMethod("imageExists", function(value, element) {
       $.ajax({
          url: value,
          type:'HEAD',
          success: function() { //no need of error as exists = false by default
            exists = true;
          }
        });
     return exists;
    },"image does not exist");

    //following to add the new post data
    $("#add-new-post-form").on("submit", function() {
      if($(this).valid()) {
        var p = JSON.parse(localStorage.getItem("posts"));
        var newPost = {"posts" : {"id" : p.posts.length , "name" : $(".modal-body .new-name").val() ,
       "description" : $(".modal-body .new-description").val() , "imageUrl" : $(".modal-body .new-image-url").val() ,
       "postingTime" : new Date()}};
        p.posts.unshift(newPost.posts);//adding new post on the top of the existing array
        localStorage.setItem("posts", JSON.stringify(p));

        //rendering the newly added post
        newPost["time"] = "Just now";//local object time property
        $.get('template.mustache', function(template) {
        var html = Mustache.render(template, newPost);
        $(".post-container").prepend(html);
        $('[data-toggle="popover"]').popover();
        });
        $("#myModal").modal('hide');
      }
    });

    // to reset the new post form on modal
    $(".new-post-btn").on("click", function() {
      $("#add-new-post-form")[0].reset(); //valid or not , form needs to be reset
      $("#add-new-post-form").validate().resetForm(); // to remove all the error messages and error classes
      history.pushState(null,null,"add");
    });

    //to get all the images in the photos section to make a carousel
    var images = $(".photos img");
    var position;

    //following to show modal on click of an image
    $(".photos img").on("click", function() {
      var clickedImageUrl = $(this).attr("src");
      for(var j=0; j<images.length; j++) {
        if(images[j].getAttribute("src") == clickedImageUrl) {
          position = j;
          break;
        }
      }
      $("#pic-modal .modal-body").css("background-image", "url("+clickedImageUrl+")");
      $("#pic-modal").modal();
    });

    $(".left-button").on("click", function() {
      $("#pic-modal .modal-body").css("background-image", "url("+images[position].src+")");
      position-- ;
      if(position < 0) {position = (images.length - 1)}
    });

    $(".right-button").on("click", function() {
      $("#pic-modal .modal-body").css("background-image", "url("+images[position].src+")");
      position++ ;
      if(position == images.length) {position = 0}
    });

    $("#myModal").on("hidden.bs.modal", function(){
       history.pushState(null,null,"assignment11.html")
     });
  };

  var calculateTimeDifference = function(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return { "d": d, "h": h, "m": m, "s": s };
  }
}
