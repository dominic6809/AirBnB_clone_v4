$(document).ready(function () {
  const dict = {};
  const $amenitiesCheck = $('input[type=checkbox]');
  const $selectedAmenities = $('div.amenities h4');
  const $filterPlacesButton = $('section.filters button');
  const $statusIndicator = $('div#api_status');
  const statusUri = 'http://localhost:5001/api/v1/status/';
  const placesUri = 'http://localhost:5001/api/v1/places_search/';
  const $placesSection = $('section.places');

  function createMaxGuests (guests) {
    if (guests !== 1) {
      return `<div class="max_guest">${guests} Guests</div>`;
    }

    return `<div class="max_guest">${guests} Guest</div>`;
  }

  function createRooms (rooms) {
    if (rooms !== 1) {
      return `<div class="number_rooms">${rooms} Bedrooms</div>`;
    }

    return `<div class="number_rooms">${rooms} Bedroom</div>`;
  }

  function createBathrooms (bathrooms) {
    if (bathrooms !== 1) {
      return `<div class="number_bathrooms">${bathrooms} Bathrooms</div>`;
    }

    return `<div class="number_bathrooms">${bathrooms} Bathroom</div>`;
  }

  function createArticleTitle (title, price) {
    return `<div class="title_box">
              <h2>${title}</h2>
              <div class="price_by_night">
                $${price}
              </div>
            </div>`;
  }

  function createArticleInfo (guests, rooms, bathrooms) {
    const maxGuests = createMaxGuests(guests);
    const maxRooms = createRooms(rooms);
    const maxBathrooms = createBathrooms(bathrooms);
    return `<div class="information">
              ${maxGuests}
              ${maxRooms}
              ${maxBathrooms}
            </div>`;
  }

  function createArticleDescription (description) {
    return `<div class="description">
              ${description}
            </div>`;
  }

  function createPlace (place) {
    const articleTitle = createArticleTitle(place.name, place.price_by_night);
    const articleInfo = createArticleInfo(place.max_guest, place.number_rooms, place.number_bathrooms);
    const articleDescription = createArticleDescription(place.description);
    return `<article>
              ${articleTitle}
              ${articleInfo}
              ${articleDescription}
            </article>`;
  }

  function fetchPlaces (amenities) {
    return $.ajax({
      url: placesUri,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(amenities),
      contentType: 'application/json',
      done: function (data) {
        return data;
      }
    });
  }

  async function refreshHtmlPlaces (amenities = {}) {
    const places = await fetchPlaces(amenities);

    for (let i = 0; i < places.length; ++i) {
      $placesSection.append(createPlace(places[i]));
    }
  }

  $filterPlacesButton.on('click', function () {
    const amenitiesIds = {
      amenities: Object.keys(dict)
    };

    $placesSection.text('');
    refreshHtmlPlaces(amenitiesIds);
  });

  $amenitiesCheck.click(function () {
    if ($(this).is(':checked')) {
      dict[$(this).data('id')] = $(this).data('name');
      $selectedAmenities.text(Object.values(dict).join(', '));
    } else if ($(this).is(':not(:checked)')) {
      delete dict[$(this).data('id')];
      $selectedAmenities.text(Object.values(dict).join(', '));
    }
  });

  $.ajax({
    url: statusUri,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      if (data.status === 'OK') {
        $statusIndicator.addClass('available');
      } else {
        $statusIndicator.removeClass('available');
      }
    }
  });

  refreshHtmlPlaces();
});
