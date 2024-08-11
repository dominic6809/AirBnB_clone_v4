const $ = window.$;
$(document).ready(function () {
  const amenities = {};
  $('.popover li input').click(function () {
    const amenityID = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');
    if ($(this).prop('checked') === true) {
      amenities[amenityID] = amenityName;
    } else {
      delete amenities[amenityID];
    }
    const amenitiesLst = Object.values(amenities);
    $('.amenities h4').text(amenitiesLst.join(', '));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, testStatus) {
    if (data.status === 'OK') {
      $('#api_status').css('background-color', '');
      $('#api_status').addClass('available');
    }
  });
});
