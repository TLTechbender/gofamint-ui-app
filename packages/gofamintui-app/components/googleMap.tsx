// src/components/home/GoogleMap.tsx
"use client";
import { Map, Marker } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";

interface GoogleMapProps {
  address: string;
  mapId?: string;
  className?: string;
  onLoad?: () => void;
}

const GoogleMap = ({ address, mapId, className, onLoad }: GoogleMapProps) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status === "OK" && data.results[0]?.geometry?.location) {
          const { lat, lng } = data.results[0].geometry.location;
      
          setCoordinates({ lat, lng });
        } else {
          throw new Error(
            data.error_message || "Address could not be geocoded"
          );
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError(err instanceof Error ? err.message : "Failed to load map");
      } finally {
        setLoading(false);
        onLoad?.();
      }
    };

    geocodeAddress();
  }, [address, onLoad]);

  if (error) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center p-4 text-gray-600">
          <p>Map could not be loaded</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !coordinates) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Map
        mapId={mapId}
        defaultZoom={15}
        defaultCenter={coordinates}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        className="w-full h-full"
      >
        <Marker position={coordinates} />
      </Map>
    </div>
  );
};

export default GoogleMap;
