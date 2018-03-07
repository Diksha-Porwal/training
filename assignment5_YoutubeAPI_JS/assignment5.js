var resultJSON = {"nextPageToken" : "" , "items" : []};
var searchString = "html5";
var modal;
var hasNextPageToken = true;

document.addEventListener("DOMContentLoaded", function(){
  var url = "https://www.googleapis.com/youtube/v3/search?part=id,snippet&fields=nextPageToken,prevPageToken,items(id(videoId,playlistId),snippet(title,description,thumbnails(medium(url))))&maxResults=12&key=AIzaSyBizn4PYAR7XDS2JSHRuAoyehYJiEoIwvs&q=";
  url+= searchString;
  loadVideoList(url);
});

function loadVideoList (url){
  showLoader();
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      hideLoader();
      var json = JSON.parse(this.responseText);
      resultJSON["nextPageToken"] = json["nextPageToken"];
       resultJSON["items"] = resultJSON["items"].concat(json["items"]);
         resetResultDiv();
         setVideoList();
         if(json["items"].length == 0)
         {
           document.getElementById("no-items").style.display = "block";
         }
         else {
           document.getElementById("no-items").style.display = "none";
         }
         if(!json.hasOwnProperty("nextPageToken")) {
           hasNextPageToken = false;
         }
         else{
           hasNextPageToken = true;
         }
       }
     };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function setVideoList() {
  var i = 0;
  var resultDiv = document.getElementById("result");
  var resultOuterChildDiv = document.createElement("div");
  resultOuterChildDiv.setAttribute("id","result-outer-child-div");
  while(i < resultJSON["items"].length) {
    var videoOuterDiv = document.createElement("div");
    var videoDiv = document.createElement("div");
    var imgDiv = document.createElement("div");
    var titleDiv = document.createElement("div");
    var descriptionDiv = document.createElement("div");
    var watchButtonDiv = document.createElement("div");
    var watchButton = document.createElement("button");
    var bellIconSpan = document.createElement("span");
    videoOuterDiv.className = "col-xs-12 col-sm-4 col-md-3 video-outer-div";
    videoDiv.className = "video-div";
    imgDiv.className = "thumbnail-image";
    imgDiv.style.backgroundImage = "url('"+resultJSON["items"][i]["snippet"]["thumbnails"]["medium"]["url"]+"')";
    titleDiv.className = "image-title";
    titleDiv.innerHTML = resultJSON["items"][i]["snippet"]["title"];
    descriptionDiv.className = "image-description";
    descriptionDiv.innerHTML = resultJSON["items"][i]["snippet"]["description"];
    watchButtonDiv.className = "watch-button-div";
    watchButton.className = "watch-button";
    watchButton.innerHTML = "WATCH";
    bellIconSpan.className = "notification-icon glyphicon glyphicon-bell";
    bellIconSpan.setAttribute("data-status","off");
    bellIconSpan.addEventListener("click", function(event) { bellIconSpanClicked()});
    for(var key in resultJSON["items"][i]["id"]) {
      if(key == "videoId"){
        watchButton.setAttribute("id",resultJSON["items"][i]["id"]["videoId"]);
        watchButton.setAttribute("data-idType","videoId");
      } else {
        watchButton.setAttribute("id",resultJSON["items"][i]["id"]["playlistId"]);
        watchButton.setAttribute("data-idType","playlistId");
      }
      watchButton.setAttribute("data-title",resultJSON["items"][i]["snippet"]["title"]);
      watchButton.setAttribute("data-description",resultJSON["items"][i]["snippet"]["description"]);
    }
    watchButton.addEventListener("click", function(event) { watchButtonClicked() });
    watchButtonDiv.appendChild(watchButton);
    watchButtonDiv.appendChild(bellIconSpan);
    videoDiv.appendChild(imgDiv);
    videoDiv.appendChild(titleDiv);
    videoDiv.appendChild(descriptionDiv);
    videoDiv.appendChild(watchButtonDiv);
    videoOuterDiv.appendChild(videoDiv);
    resultOuterChildDiv.appendChild(videoOuterDiv);
    i++;
  }
  resultDiv.appendChild(resultOuterChildDiv);
}

function bellIconSpanClicked() {
  if(event.target.getAttribute("data-status") == "off") {
    event.target.style.color = "#9B0808";
    event.target.setAttribute("data-status","on") ;
  }
  else if(event.target.getAttribute("data-status") == "on") {
    event.target.style.color = "#EB0801";
    event.target.setAttribute("data-status","off") ;
  }
}

function watchButtonClicked() {
  modal = document.getElementById('modal');
  modal.style.display = "block";
  var span = document.getElementById("close");
  span.onclick = function() {
      modal.style.display = "none";
  }
  var iframe = document.getElementById("iframe");
  var src = "https://www.youtube.com/embed/";
  if(event.target.getAttribute("data-idType") == "videoId") {
    src+= event.target.getAttribute("id");
  } else if (event.target.getAttribute("data-idType") == "playlistId") {
    src+= "?listType=playlist&list=";
    src+= event.target.getAttribute("id");
  }
  iframe.src = src;
  var titleLabel = document.getElementById("modal-title");
  titleLabel.innerHTML = event.target.getAttribute("data-title");
  document.getElementById("modal-footer").innerHTML = event.target.getAttribute("data-description");
}

function searchButtonClicked()
{
  resultJSON = {"nextPageToken" : "" , "items" : []};
  var ss = document.getElementById("search-box").value;
  if(ss != "")
  {
    searchString = ss;
    url = "";
    url+= "https://www.googleapis.com/youtube/v3/search?part=id,snippet&fields=nextPageToken,prevPageToken,items(id(videoId,playlistId),snippet(title,description,thumbnails(medium(url))))&maxResults=12&key=AIzaSyBizn4PYAR7XDS2JSHRuAoyehYJiEoIwvs";
    url+= "&q=";
    url+= searchString;
    loadVideoList(url);
  }
}

function resetResultDiv() {
  var x = document.getElementById("result-outer-child-div");
  document.getElementById("result").removeChild(x);
}

function nextButtonClicked() {
    url = "";
    url = "https://www.googleapis.com/youtube/v3/search?";
    url+= "pageToken=";
    url+= resultJSON["nextPageToken"];
    url+= "&part=id,snippet&fields=nextPageToken,prevPageToken,items(id(videoId,playlistId),snippet(title,description,thumbnails(medium(url))))&maxResults=12&key=AIzaSyBizn4PYAR7XDS2JSHRuAoyehYJiEoIwvs";
    url+= "&q=";
    url+= searchString;
    loadVideoList(url);
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function enterPressed() {
  if(window.event.keyCode=='13'){
       searchButtonClicked();
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
        if (hasNextPageToken){
          nextButtonClicked();
        }
        else {
        alert("No more items");
        }
    }
  },100);
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
  }

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
