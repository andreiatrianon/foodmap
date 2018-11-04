var platform = new H.service.Platform({
  app_id,
  app_code,
  useHTTPS: true
});

var pixelRatio = window.devicePixelRatio || 1;

var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

function initializeMap(locations) {
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map,{
    center: {lat: -23.556866, lng: -46.660902},
    zoom: 16,
    pixelRatio: pixelRatio
  });

  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  addInfoBubble(map, ui, locations);
}

function addInfoBubble(map, ui, locations) {
  var group = new H.map.Group();
  map.addObject(group);
  group.addEventListener('tap', function (evt) {
    var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
      content: evt.target.getData()
    });
    ui.addBubble(bubble);
  }, false);
  
  locations.map(location => {
    addMarkerToGroup(group, {lat:location[0], lng:location[1]},
      `<div class='text-center'>${location[2]}</div>`);
    })
}

function addMarkerToGroup(group, coordinate, html) {
  var marker = new H.map.Marker(coordinate);
  marker.setData(html);
  group.addObject(marker);
}