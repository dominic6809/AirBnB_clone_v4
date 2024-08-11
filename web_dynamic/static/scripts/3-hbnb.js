$(document).ready(function () {
  const apiUrl = 'http://localhost:5001/api/v1/places_search/';

  // Function to create an article for each place
  function createPlaceArticle(place) {
    function createMaxElement(value, unit) {
      return `<div class="max_${unit}">${value} ${unit}${value !== 1 ? 's' : ''}</div>`;
    }

    function createArticleTitle(title, price) {
      return `<div class="title_box">
                <h2>${title}</h2>
                <div class="price_by_night">
                  $${price}
                </div>
              </div>`;
    }

    function createArticleInfo(guests, rooms, bathrooms) {
      const maxGuests = createMaxElement(guests, 'guest');
      const maxRooms = createMaxElement(rooms, 'room');
      const maxBathrooms = createMaxElement(bathrooms, 'bathroom');
      return `<div class="information">
                ${maxGuests}
                ${maxRooms}
                ${maxBathrooms}
              </div>`;
    }

    function createArticleDescription(description) {
      return `<div class="description">
                ${description}
              </div>`;
    }

    const articleTitle = createArticleTitle(place.name, place.price_by_night);
    const articleInfo = createArticleInfo(place.max_guest, place.number_rooms, place.number_bathrooms);
    const articleDescription = createArticleDescription(place.description);

    return `<article>
              ${articleTitle}
              ${articleInfo}
              ${articleDescription}
            </article>`;
  }

  // Function to handle checkbox click event
  function handleCheckboxClick() {
    const dict = {};
    const $amenitiesCheck = $('input[type=checkbox]');
    const $selectedAmenities = $('div.amenities h4');

    $amenitiesCheck.click(function () {
      if ($(this).is(':checked')) {
        dict[$(this).data('id')] = $(this).data('name');
      } else if ($(this).is(':not(:checked)')) {
        delete dict[$(this).data('id')];
      }
      $selectedAmenities.text(Object.values(dict).join(', '));
    });
  }

  // Function to update the status indicator
  function updateStatusIndicator() {
    const $statusIndicator = $('div#api_status');
    const statusUri = 'http://localhost:5001/api/v1/status/';

    $.ajax({
      url: statusUri,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        $statusIndicator.toggleClass('available', data.status === 'OK');
      }
    });
  }

  // Function to update the places in the section.places
  function updatePlaces() {
    const $placesSection = $('section.places');

    $.ajax({
      url: apiUrl,
      type: 'POST',
      dataType: 'json',
      data: '{}',
      contentType: 'application/json',
      success: function (data) {
        $placesSection.empty(); // Clear existing content

        data.forEach(function (place) {
          const article = createPlaceArticle(place);
          $placesSection.append(article);
        });
      },
      error: function () {
        console.error('Failed to fetch places.');
      }
    });
  }

  // Call the functions for setting up the page
  handleCheckboxClick();
  updateStatusIndicator();
  updatePlaces();
});
