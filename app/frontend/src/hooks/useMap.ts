/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useState } from 'react';

import { Marker } from '@/components/Map/Marker';
import {
  DEFAULT_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
} from '@/constants';
import { TMap, TMapMarker } from '@/types';

const { Tmapv3 } = window;

export const useMap = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [mapInstance, setMapInstance] = useState<TMap | null>(null);
  const [currentMarker, setCurrentMarker] = useState<TMapMarker | null>(null);

  useEffect(() => {
    if (mapRef.current?.firstChild || mapInstance) {
      return;
    }

    const map = new Tmapv3.Map('map', {
      center: new Tmapv3.LatLng(INITIAL_LATITUDE, INITIAL_LONGITUDE),
      zoom: DEFAULT_ZOOM_LEVEL,
      zoomControl: false,
    });

    map.setZoomLimit(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);
    setMapInstance(map);
  }, [mapRef, mapInstance]);

  const updateMarker = useCallback(
    (
      coord: { latitude: number | null; longitude: number | null },
      theme: 'green' | 'red',
      labelText?: string,
    ) => {
      const { latitude, longitude } = coord;
      if (!(latitude && longitude) || !mapInstance) {
        return;
      }

      if (currentMarker) {
        const currMarker = currentMarker.getPosition();
        const prevLatitude = currMarker._lat;
        const prevLongitude = currMarker._lng;
        if (prevLatitude === latitude && prevLongitude === longitude) {
          mapInstance?.setCenter(new Tmapv3.LatLng(latitude, longitude));
          mapInstance?.setZoom(DEFAULT_ZOOM_LEVEL);
          return;
        }
      }

      currentMarker?.setMap(null);
      const position = new Tmapv3.LatLng(latitude, longitude);

      const marker = Marker({
        mapContent: mapInstance,
        position,
        theme,
        labelText,
      });
      setCurrentMarker(marker);
      mapInstance?.setCenter(position);
    },
    [mapInstance, currentMarker],
  );

  return { mapInstance, updateMarker, currentMarker };
};
