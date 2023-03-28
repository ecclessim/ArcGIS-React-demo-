import React, { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';

const Map = () => {
  const [view, setView] = useState(null);
  const [viewType, setViewType] = useState('map');
  const [basemapToggle, setBasemapToggle] = useState(null);
  const centerCoordinates = [103.8863, 1.3612];
  useEffect(() => {
    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/widgets/BasemapToggle',
        'esri/widgets/Popup',
        'esri/widgets/Search',
      ],
      { css: true }
    )
      .then(([Map, MapView, SceneView, BasemapToggle, Popup, Search]) => {
        const map = new Map({
          basemap: 'streets-navigation-vector',
          labelsVisible: true,
        });
        let view = null;
        if (viewType === 'map') {
          const mapView = new MapView({
            container: 'mapContainer',
            map: map,
            center: centerCoordinates,
            zoom: 16,
          });
          view = mapView;
        } else {
          const sceneView = new SceneView({
            container: 'mapContainer',
            map: map,
            center: centerCoordinates,
            zoom: 16,
          });
          view = sceneView;
        }

        const searchWidget = new Search({
          view: view,
        });

        const basemapToggle = new BasemapToggle({
          view: view,
          nextBasemap: 'hybrid',
        });
        const popup = new Popup({
          autoOpenEnabled: false,
          location: null,
          dockOptions: { position: 'top-left', buttonEnabled: true },
        });
        view.popup = popup;
        view.on('click', (event) => {
          const lat = event.mapPoint.latitude.toFixed(4);
          const long = event.mapPoint.longitude.toFixed(4);
          popup.title = 'Clicked point';
          popup.content = `Latitude: ${lat}<br>Longitude: ${long}`;
          view.popup.open({
            location: event.mapPoint,
          });
        });

        setView(view);

        view.ui.add(basemapToggle, 'top-right');
        view.ui.add(searchWidget, {
          position: 'top-left',
        });
        setBasemapToggle(basemapToggle);
      })
      .catch((err) => console.error(err));
  }, [viewType]);

  return (
    <div>
      <button
        className="view-type-btn"
        onClick={() =>
          setViewType((viewType) => (viewType === 'map' ? 'scene' : 'map'))
        }
      >
        {viewType === 'map' ? '3D' : '2D'}
      </button>
      <div id="mapContainer" style={{ height: '100vh' }} />
    </div>
  );
};
export default Map;
