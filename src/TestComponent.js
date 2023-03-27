import React, { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';

const Map = () => {
  const [view, setView] = useState(null);
  const [basemapToggle, setBasemapToggle] = useState(null);
  const [searchWidget, setSearchWidget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const centerCoordinates = [103.8863, 1.3612];
  useEffect(() => {
    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/BasemapToggle',
        'esri/widgets/Popup',
        'esri/widgets/Search',
      ],
      { css: true }
    )
      .then(([Map, MapView, BasemapToggle, Popup, Search]) => {
        const map = new Map({
          basemap: 'streets-navigation-vector',
          labelsVisible: true,
        });
        const view = new MapView({
          container: 'mapContainer',
          map: map,
          center: centerCoordinates,
          zoom: 16,
        });
        const searchWidget = new Search({
          view: view,
        });
        // Create a new Popup object
        const popup = new Popup({
          autoOpenEnabled: false,
          location: null,
          dockOptions: { position: 'top-left', buttonEnabled: true },
        });
        view.popup = popup;
        // Add click event listener to the view
        view.on('click', (event) => {
          // Get the coordinates of the clicked point
          const lat = event.mapPoint.latitude.toFixed(4);
          const long = event.mapPoint.longitude.toFixed(4);

          // Set the title and content of the popup
          popup.title = 'Clicked point';
          popup.content = `Latitude: ${lat}<br>Longitude: ${long}`;

          // Open the popup at the clicked location
          view.popup.open({
            location: event.mapPoint,
          });
        });

        setView(view);

        const basemapToggle = new BasemapToggle({
          view: view,
          nextBasemap: 'hybrid',
        });
        view.ui.add(basemapToggle, 'top-right');
        view.ui.add(searchWidget, {
          position: 'top-right',
        });
        setBasemapToggle(basemapToggle);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = () => {
    searchQuery
      ? searchWidget.search(searchQuery).then((results) => {
          setSearchQuery('');
          if (results.numResults > 0) {
            const [result] = results.results[0].results;
            setSearchResults(results.results[0].results);
            view.goTo(result.extent);
          }
        })
      : console.warn('Empty input in search box');
  };
  return (
    <div>
      <div id="mapContainer" style={{ height: '100vh' }} />
    </div>
  );
};
export default Map;
