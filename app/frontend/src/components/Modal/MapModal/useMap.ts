/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { Marker } from '@/components/Map/Marker';
import {
  DEFAULT_ZOOM_LEVEL,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from '@/constants';
import { queryKeys } from '@/queries';
import { TMap, TMapEvent, TMapLatLng, TMapMarker } from '@/types';

const { Tmapv3 } = window;

export const useMap = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [mapInstance, setMapInstance] = useState<TMap | null>(null);
  const [currentMarker, setCurrentMarker] = useState<TMapMarker | null>(null);
  const [currentCoord, setCurrentCoord] = useState<TMapLatLng | null>(null);

  const coord = {
    latitude: currentCoord?.lat() || 0,
    longitude: currentCoord?.lng() || 0,
  };

  const { data: addressData } = useQuery({
    ...queryKeys.tmap.getAddressFromCoord({
      latitude: coord.latitude,
      longitude: coord.longitude,
    }),

    placeholderData: keepPreviousData,
  });
  const currentAddress = addressData?.addressInfo.fullAddress || '';

  const setCenterToSelectedCoord = (position: TMapLatLng) => {
    mapInstance?.setCenter(position);
  };

  useEffect(() => {
    if (!currentCoord) {
      return;
    }

    const makeMarker = (position: TMapLatLng) => {
      if (!mapInstance) {
        return;
      }

      currentMarker?.setMap(null);

      const marker = Marker({
        mapContent: mapInstance,
        position,
        theme: 'green',
      });

      setCurrentMarker(marker);
    };

    makeMarker(currentCoord);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCoord, mapInstance]);

  useEffect(() => {
    if (mapRef.current?.firstChild || mapInstance) {
      return;
    }

    const map = new Tmapv3.Map('map', {
      zoom: DEFAULT_ZOOM_LEVEL,
      zoomControl: false,
      center: new Tmapv3.LatLng(INITIAL_LATITUDE, INITIAL_LONGITUDE),
    });

    map.setZoomLimit(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);
    setMapInstance(map);
  }, [mapRef, mapInstance]);

  useEffect(() => {
    if (!mapInstance) {
      return;
    }

    const renderMarker = (e: TMapEvent) => {
      const { lngLat } = e.data;
      const position = new Tmapv3.LatLng(lngLat._lat, lngLat._lng);

      setCurrentCoord(position);
    };

    mapInstance.on('Click', renderMarker);
  }, [mapInstance, currentCoord]);

  const updateMarker = useCallback(
    (tempCoord: {
      latitude: number | undefined;
      longitude: number | undefined;
    }) => {
      const { latitude, longitude } = tempCoord;
      if (!(latitude && longitude) || !mapInstance) {
        return;
      }

      const position = new Tmapv3.LatLng(latitude, longitude);

      setCurrentCoord(position);
      mapInstance?.setCenter(position);
    },
    [mapInstance],
  );

  const setCoord = (currCoord: { latitude: number; longitude: number }) => {
    const position = new Tmapv3.LatLng(currCoord.latitude, currCoord.longitude);
    setCurrentCoord(position);
    setCenterToSelectedCoord(position);
  };

  const initMapModal = () => {
    currentMarker?.setMap(null);
    setCurrentCoord(null);
    setCurrentMarker(null);
  };

  return {
    mapInstance,
    updateMarker,
    coord,
    setCoord,
    currentAddress,
    initMapModal,
  };
};
