var API_URL = 'https://floating-harbor-78336.herokuapp.com/fastfood';

$(function() {
  $('.btn-search').click(function() {
    var searchKeyword = $('#txt-search').val();
    search(1, null, searchKeyword);
  });

  $('#txt-search').on('keypress', function(e) {
    if (e.keyCode === 13) {
      $('.btn-search').trigger('click');
    }
  });

  $('#txt-search').focus();
});

function search(page, perPage, searchKeyword) {
  if (typeof page !== 'number' || page < 1)
    page = 1;
  perPage = Number($('#viewlist').val());

  $.get(API_URL, {
    page: page,
    perPage: perPage,
    searchKeyword: searchKeyword
  }, function(data) {
    var list = data.list;
    var total = data.total;

    $('.total').html('총 ' + total + '개의 패스트푸드점을 찾았습니다.');
    $('#viewlist').show();
    var $list = $('.list').empty();

    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var $elem = $('#item-template')
        .clone()
        .removeAttr('id');

      var no = (page - 1) * perPage + i + 1;

      $elem.find('.item-no').html(no);
      $elem.find('.item-name').html(item.name);
      $elem.find('.item-addr').html(item.addr);

      $list.append($elem);
    }

    showPaging(page, perPage, total, searchKeyword);
  });
}

function showPaging(page, perPage, total, searchKeyword) {
  var $paging = $('.paging').empty();
  var numPages = 5;
  var pageStart = Math.floor((page - 1) / numPages) * numPages + 1;
  var pageEnd = pageStart + numPages - 1;
  var totalPages = Math.floor(total / perPage) + 1;

  if (pageEnd > totalPages)
    pageEnd = totalPages;

  var prevPage = pageStart - 1;

  if (prevPage < 1)
    prevPage = 1;

  var nextPage = pageEnd + 1;

  if (nextPage > totalPages)
    nextPage = totalPages;

  var $prevElem = $('<a href="javascript:search(' + prevPage + ',' + perPage + ',\'' + searchKeyword + '\')">이전</a>');
  $prevElem.addClass('prev');
  $paging.append($prevElem);

  for (var i = pageStart; i <= pageEnd; i++) {
    var $elem = $('<a href="javascript:search(' + i + ',' + perPage + ',\'' + searchKeyword + '\')">' + i + '</a>');

    if (i === page) {
      $elem.addClass('current');
    }

    $paging.append($elem);
  }

  var $nextElem = $('<a href="javascript:search(' + nextPage + ',' + perPage + ',\'' + searchKeyword + '\')">다음</a>');
  $nextElem.addClass('next');
  $paging.append($nextElem);
}

function changelist(){
  search(1, Number($('#viewlist').val()), $('#txt-search').val());
}
