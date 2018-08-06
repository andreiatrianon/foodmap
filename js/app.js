$(document).ready(function() {
  
  $('#animation').delay('2500').fadeToggle('slow');
  $('main, #map').delay('2500').fadeIn('slow');

  $('input').val('');

  getDropdownItems();

  $('input').on('focus', function () {
    $('.my-dropdown-menu').fadeIn('slow');
  });

  $('input').on('blur', function () {
    $('.my-dropdown-menu').fadeOut('slow');
  });
 
  $('input').on('input', function () {
    getItemsOnSearch();
  });

  $('li').click(function() {
    $('input').val($(this).html());
  });

  $('#btn-search').click(function() {
    getRestaurantsSelected();
  });

});

function getDropdownItems() {
  var typesOfRestaurants = [];
  for (restaurant of restaurantes) {
    typesOfRestaurants.push(restaurant['type']);
  }

  typesOfRestaurants = typesOfRestaurants.filter( function(type, index, nonDuplicateItems) {
    return nonDuplicateItems.indexOf(type) == index;
  });

  for (typeOfRestaurant of typesOfRestaurants) {
    var newLi = $('<li></li>').html(typeOfRestaurant).addClass('dropdown-item');
    $('.my-dropdown-menu').append(newLi);
  }
}

function getItemsOnSearch() {
  var inputValue = $('input').val();
  var inputValueLength = inputValue.length;

  $('li').each(function( ) {
    var li = $(this).html();
    var liLetters = li.slice(0, inputValueLength);
    if (liLetters === inputValue) {
      $(this).fadeIn('slow');
    } else {
      $(this).fadeOut('slow');
    }
  });
}

function getRestaurantsSelected() {
  var typeSelected = $('input').val();
  var restaurantsSelected = [];
  for (restaurant of restaurantes) {
    var typeOfRestaurant = restaurant['type'];
    if (typeSelected === '' || typeSelected === typeOfRestaurant) {
      restaurantsSelected.push(restaurant);
    }
  }
  myMap(restaurantsSelected);
  getRestaurantsImages(restaurantsSelected);
}

function getRestaurantsLocations(restaurantsSelected, locations) {
  for (restaurant of restaurantsSelected) {
    var newlocation = [];
    var latitude = restaurant['latitude'];
    var longitude = restaurant['longitude'];
    var restaurantName = restaurant['name'];
    newlocation.push(latitude);
    newlocation.push(longitude);
    newlocation.push(restaurantName);
    locations.push(newlocation);
  }
  return locations;
}

function getRestaurantsImages(restaurantsSelected) {
  $('#img-restaurants').html('');
  for (restaurant of restaurantsSelected) {
    var srcImage = restaurant['image'];
    var indexOfrestaurant = restaurantsSelected.indexOf(restaurant);
    var img = $('<img>').attr('src', srcImage).attr('id', 'img' + indexOfrestaurant).addClass('col-6 mb-2');
    var idOfImage = '#' + img.attr('id');
    $('#img-restaurants').append(img);

    $(idOfImage).click(function() {
      var srcImageSelected = $(this).attr('src');
      getRestaurantModal(srcImageSelected);
      $(this).attr('data-toggle', 'modal').attr('data-target', '#exampleModal');
    });
  }
}

function getRestaurantModal(srcImageSelected) {
  for (restaurant of restaurantes) {
    var restaurantImage = restaurant['image'];
    var restaurantName = restaurant['name'];
    var typeOfRestaurant = restaurant['type'];
    var description = restaurant['description'];
    if (restaurantImage === srcImageSelected) {
      $('.modal-body h2').html(restaurantName);
      $('.modal-body img').attr('src', srcImageSelected);
      $('.modal-body h6').html('comida ' + typeOfRestaurant);
      $('.modal-body p').html(description);
    }
  }
}

function myMap(restaurantsSelected) {
  var locations = [];
  getRestaurantsLocations(restaurantsSelected, locations);

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(-23.556866, -46.660902),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  for (i = 0; i < locations.length; i++) {  
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][0], locations[i][1]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(locations[i][2]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
}