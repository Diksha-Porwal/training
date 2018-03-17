function BookComponent() {
  var pageNumber = 1;
  var subject = "Java";
  var baseUrl = "http://it-ebooks-api.info/v1/search/";
  var windowRef = $(window);

  this.load = function() {
    windowRef.on("scroll", function(event) {
      if((windowRef.scrollTop() + windowRef.height()) > $(document).height() - 100) {
      pageNumber++;
      loadBooks(subject, pageNumber);
      }
    });
    loadBooks(subject, pageNumber);
    $(".subject-list li").on("click", function(event){
      pageNumber = 1;
      $("#search").val(" ");
      subject = $(this).text();
      windowRef.scrollTop(0);
      $("#books-list-inner-div").empty();
      loadBooks(subject, pageNumber);
    });
  };

  var loadBooks = function(selectedSubject, pageNumber) {
    var url = baseUrl+selectedSubject+"/page/"+pageNumber;
    $.get(url, function(data, status){
      if(data.hasOwnProperty("Books") == true){
        $("#error-msg-div").hide();
        setBooks(data);
      } else {
        $("#error-msg-div").show();
      }
    });
  };

  var setBooks = function(data) {
    var template = $("#book-template").html();
    var html = Mustache.render(template, data);
    $("#books-list-inner-div").append(html);
    $('.book-img').lazy();
    $('.book-outer-div').mouseenter(function() {
      hoverOnBook($(this));
    });
  };

  var hoverOnBook = function($elem) {
    var jsonData = { bTitle : $elem.data('title') , bIsbn : $elem.data('isbn') , bSubTitle : $elem.data('sub-title') ,
    bDescription : $elem.data('description') };
    var template = $("#book-overlay-template").html();
    var html = Mustache.render(template, jsonData);
    $(".img-div").off("mouseleave");
    $elem.find(".overlay-area").html(html);
    $('.overlay-div').mouseleave(function() {
      $(".img-div").on("mouseleave");
      $(this).css("display", "none");
    });
    $('.book-detail-btn').click(function() {
      detailBtnClicked($(this));
    });
  };

  var detailBtnClicked = function($elem) {
    $(".book-overlay-title").text($elem.data('title'));
    $(".book-overlay-subTitle").text($elem.data('sub-title'));
    $(".book-overlay-description").text($elem.data('description'));
    $(".book-overlay").css("display", "block");
  };

  var crossBtnClicked = function() {
    $(".book-overlay").css("display", "none");
  };

  var searchBtnClicked = function() {
    var searchText = $("#search").val();
    pageNumber = 1;
    subject = searchText;
    windowRef.scrollTop(0);
    $("#books-list-inner-div").empty();
    loadBooks(subject, pageNumber);
  };
}
