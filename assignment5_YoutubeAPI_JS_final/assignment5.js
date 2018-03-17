var resultJSON = {"nextPageToken" : "" , "items" : []};
var searchString = "html5";
var modal;
var hasNextPageToken = true;

document.addEventListener("DOMContentLoaded", function(){
  var url = makeUrl();
  //enter key pressed on search box
  document.getElementById("search-form").addEventListener("keydown", function() {
    if(window.event.keyCode=='13'){
         searchButtonClicked();
      }
  });
  loadVideoList(url);
});

function loadVideoList (url){
  document.getElementById("loader").style.display = "block"; //show loader
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("loader").style.display = "none"; // hide loader
      var json = JSON.parse(this.responseText);
      resultJSON["nextPageToken"] = json["nextPageToken"];
      resultJSON["items"] = resultJSON["items"].concat(json["items"]);
         document.getElementById("result").removeChild(document.getElementById("result-outer-child-div")); // reset result div
         setVideoList();
         if(json["items"].length == 0)
         {
           document.getElementById("no-items").style.display = "block";
         }
         else {
           document.getElementById("no-items").style.display = "none";
         }
         (!json.hasOwnProperty("nextPageToken")) ? (hasNextPageToken = false) : (hasNextPageToken = true)
       }
     };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function setVideoList() {
  var resultDiv = document.getElementById("result");
  var template = $("#video-template").html();
  var html = Mustache.render(template, resultJSON);
  var resultOuterChildDiv = "<div id=\"result-outer-child-div\">"+html+"</div>";
  resultDiv.innerHTML = resultOuterChildDiv;
}

function bellIconSpanClicked(elem) {
  if(elem.dataset.status == "off") {
    elem.style.color = "#9B0808";
    elem.dataset.status = "on";
  }
  else if(elem.dataset.status == "on") {
    elem.style.color = "#EB0801";
    elem.dataset.status = "off";
  }
}

function watchButtonClicked(elem) {
  modal = document.getElementById('modal');
  modal.style.display = "block";
  document.getElementById("close").onclick = function() {
  modal.style.display = "none";
  }
  var src = "https://www.youtube.com/embed/";
  if (elem.dataset.idtype == "playlistId") {
    src+= "?listType=playlist&list=";
  }
  src+= elem.id;
  document.getElementById("iframe").src = src;
  document.getElementById("modal-title").innerHTML = elem.dataset.title;
  document.getElementById("modal-footer").innerHTML = elem.dataset.description;
}

function searchButtonClicked() {
  resultJSON = {"nextPageToken" : "" , "items" : []};
  var ss = document.getElementById("search-box").value;
  if(ss != "")
  {
    searchString = ss;
    url = makeUrl();
    loadVideoList(url);
  }
}

function makeUrl(val) {
  var url = "";
  url += "https://www.googleapis.com/youtube/v3/search?";
  if(val != undefined) {
    url += "pageToken=" + resultJSON["nextPageToken"];
  }
  url+= "&part=id,snippet&fields=nextPageToken,prevPageToken,items(id(videoId,playlistId),snippet(title,description,thumbnails(medium(url))))&maxResults=12&key=AIzaSyBizn4PYAR7XDS2JSHRuAoyehYJiEoIwvs&q=" + searchString;
  return url;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var timer; // scroll was getting called multiple times automatically so set the timeout
window.addEventListener("scroll",function(event){
  if(timer)
  {
    window.clearTimeout(timer);
  }
  timer = window.setTimeout(function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(hasNextPageToken) {
          url = makeUrl(resultJSON["nextPageToken"]);
          loadVideoList(url);
        }  else {
          (alert("No more items"));
        }
    }
  },100);
});
