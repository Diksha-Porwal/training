var pageNumber = 1;
var subject = "Java";
var baseUrl = "http://it-ebooks-api.info/v1/search/";
var url = baseUrl+subject+"/page/"+pageNumber;

$(document).ready(function() {
  $(window).on("scroll" , function(event) {
    if(($(window).scrollTop() + $(window).height()) > $(document).height()-100 ) {
    pageNumber++;
    url = baseUrl+subject+"/page/"+pageNumber;
    loadBooks();
    }
  });

  loadBooks();

  $("#subject-list li").on("click", function(event){
    pageNumber = 1;
    $("#search").val(" ");
    subject = $(this).text();
    $(window).scrollTop(0);
    url = baseUrl+subject+"/page/"+pageNumber;
    $("#books-list-inner-div").empty();
    loadBooks();
  });
});

function loadBooks() {
  $.get(url , function(data, status){
    if(data.hasOwnProperty("Books") == true){
      $("#error-msg-div").hide();
      setBooks(data);
    } else {
      $("#error-msg-div").show();
    }
  });
}


function setBooks(data) {
  var i = 0;
  while(i < 10) {
      var html = "<div id="+data["Books"][i]["ID"]+" class=\"book-outer-div col-xs-12 col-sm-6 col-md-4 \">\
      <div id=\"img-div\" class=\"img-div\"  data-title='"+data["Books"][i]["Title"]+"'  data-subTitle = '"+data["Books"][i]["SubTitle"] +"' data-description = '"+data["Books"][i]["Description"]+"' data-isbn = '"+data["Books"][i]["isbn"]+"' \
      data-bookOuterDivId = '"+data["Books"][i]["ID"]+"' onmouseenter = \"hoverOnBook(this)\"  > \
      <img class=\"img\" src='"+data["Books"][i]["Image"]+"'/> </div>  </div>";
      $("#books-list-inner-div").append(html);
      i++;
  }
}

function hoverOnBook(obj) {
  var bookOuterDivId   = "#"+obj.dataset.bookouterdivid;
  var html = "<div class=\"overlay-div\" onmouseleave = \"hideOverlay("+obj.dataset.bookouterdivid+")\"   style = \"display:block\"><div id=\"overlay-title-div\" class=\"overlay-title-div\" > "+obj.dataset.title+" </div>\
   <div id=\"overlay-isbn-div\" class=\"overlay-isbn-div\"> "+obj.dataset.isbn+" </div> \
   <div id=\"overlay-detail-btn-div\" class=\"overlay-detail-btn-div\"> \
   <button class=\"overlay-detail-btn\" id = \"overlay-detail-btn\"  data-title = '"+obj.dataset.title+"' data-subTitle = '"+obj.dataset.subtitle+"' data-description = '"+obj.dataset.description+"'  onclick = \"detailBtnClicked(this)\"  > Get Details </button> </div>\
   </div>";
  $(bookOuterDivId).find(".img-div").off("mouseleave");
  var x = $(bookOuterDivId).find(".overlay-div");
  if(x.length > 0) {
    $(bookOuterDivId+" .overlay-div").remove();
  }
  $(bookOuterDivId).append(html);
}

function hideOverlay(bookOuterDivId) {
  $("#"+bookOuterDivId).find(".img-div").on("mouseleave");
  $("#"+bookOuterDivId).find(".overlay-div").css("display", "none");
}

function detailBtnClicked(obj) {
  $(".book-item-overlay-title").text(obj.dataset.title);
  $(".book-item-overlay-subTitle").text(obj.dataset.subtitle);
  $(".book-item-overlay-description").text(obj.dataset.description);
  $(".book-item-overlay").css("display" , "block");
  $("body").css("overflow" , "hidden");
}

function crossBtnClicked() {
  $(".book-item-overlay").css("display" , "none");
  $("body").css("overflow" , "auto");
}

function searchBtnClicked() {
  var searchText = $("#search").val();
  pageNumber = 1;
  k = 1;
  subject = searchText;
  var scroll = function(){ $(window).scrollTop(0)};
  scroll();
  url = baseUrl+subject+"/page/"+pageNumber;
  $("#books-list-inner-div").empty();
  loadBooks();
}
