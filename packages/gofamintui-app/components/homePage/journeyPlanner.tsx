"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  Clock,
  DollarSign,
  Navigation,
  Phone,
  ArrowLeft,
  Compass,
  Footprints,
  Car,
  Bike,
  Bus,
  X,
  Search,
  LocateFixed,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

interface TransportOption {
  id: string;
  name: string;
  icon: JSX.Element;
  time: string;
  cost: string;
  difficulty: string;
  steps: string[];
  tips: string;
  estimatedDistance?: string;

  travelMode: "WALKING" | "DRIVING" | "TRANSIT" | "BICYCLING";
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const JourneyPlanner: React.FC = () => {
  const [selectedTransport, setSelectedTransport] =
    useState<TransportOption | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>("");
  const [locationStep, setLocationStep] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const transportOptions: TransportOption[] = [
    {
      id: "walking",
      name: "Walking",
      icon: <Footprints className="w-6 h-6" />,
      time: "15-20 mins",
      cost: "Free",
      difficulty: "Easy",
      estimatedDistance: "1.2 km",
    
      steps: [],
      tips: "Wear comfortable shoes and carry an umbrella. The route has sidewalks but can be crowded in the mornings.",
      travelMode: "WALKING",
    },
    {
      id: "car",
      name: "Driving",
      icon: <Car className="w-6 h-6" />,
      time: "5-8 mins",
      cost: "₦200 fuel",
      difficulty: "Easy",
      estimatedDistance: "2.5 km",
   
      steps: [],
      tips: "Sunday parking fills up by 9:30am. Carpool if possible. Security guards monitor the parking area.",
      travelMode: "DRIVING",
    },
    {
      id: "okada",
      name: "Okada (Motorcycle)",
      icon: <Bike className="w-6 h-6" />,
      time: "8-12 mins",
      cost: "₦100-150",
      difficulty: "Moderate",
      estimatedDistance: "2 km",
   
      steps: [],
      tips: "Always wear the provided helmet. Have exact change ready. Avoid riding in heavy rain.",
      travelMode: "DRIVING",
    },
    {
      id: "bus",
      name: "Public Bus",
      icon: <Bus className="w-6 h-6" />,
      time: "20-30 mins",
      cost: "₦50-80",
      difficulty: "Moderate",
      estimatedDistance: "3 km",
    
      steps: [],
      tips: "Buses run every 10-15 minutes. Have small bills ready. Morning buses are most crowded.",
      travelMode: "TRANSIT",
    },
  ];

  const destination = "7.441096969995874, 3.8965077854294417";

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results[0]) {
        return data.results[0].formatted_address;
      }
      return `${lat}, ${lng}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${lat}, ${lng}`;
    }
  };

  const handleGetDirections = (transport: TransportOption): void => {
    setSelectedTransport(transport);
    setLocationStep(1);
    setCurrentStep(1);
    setShowMap(false);
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const address = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setOrigin(address);
          setLocationStep(2);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Could not get your location. Please enter your address manually."
          );
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSubmitOrigin = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim()) {
      setLocationStep(2);
    }
  };

  const resetJourney = () => {
    setSelectedTransport(null);
    setLocationStep(0);
    setOrigin("");
    setUserLocation(null);
  };

  // Location input step - Minimalist Design
  if (locationStep === 1) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-6">
            <button
              onClick={resetJourney}
              className="mb-6 text-gray-600 hover:text-black flex items-center gap-2 transition-colors font-light"
            >
              <ArrowLeft size={18} />
              Back to options
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Your Location
              </span>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-light text-black leading-tight mb-4">
                Where are you coming from?
              </h2>
              <p className="text-lg text-black font-light">
                {`We'll use this to give you the best route to Gofamint Student
                Fellowship, UI`}
              </p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmitOrigin} className="space-y-6">
              <div>
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-black mb-3"
                >
                  Your location or address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-light text-black"
                    placeholder="Enter your address or location"
                    required
                  />
                  {origin && (
                    <button
                      type="button"
                      onClick={() => setOrigin("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 border border-gray-300 hover:bg-gray-100 transition-colors font-light"
                >
                  {isLocating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  ) : (
                    <>
                      <LocateFixed size={18} />
                      Use Current Location
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
                  disabled={!origin.trim()}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Directions display step - Minimalist Design
  if (locationStep === 2 && selectedTransport) {
    return (
      <APIProvider apiKey={API_KEY}>
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTransport.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="bg-white border-b border-gray-200 p-6">
                <button
                  onClick={resetJourney}
                  className="mb-6 text-gray-600 hover:text-black flex items-center gap-2 transition-colors font-light"
                >
                  <ArrowLeft size={18} />
                  Back to options
                </button>

                <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 text-blue-500">
                    {selectedTransport.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
                      {selectedTransport.name}
                    </h2>
                    <div className="flex flex-wrap gap-6 text-sm text-black font-light">
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-400" />
                        {selectedTransport.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <DollarSign size={16} className="text-blue-400" />
                        {selectedTransport.cost}
                      </span>
                      {selectedTransport.estimatedDistance && (
                        <span className="flex items-center gap-2">
                          <Compass size={16} className="text-blue-400" />
                          {selectedTransport.estimatedDistance}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-black mb-2">
                    Directions to Gofamint Student Fellowship, UI
                  </h3>
                  <p className="text-sm text-gray-600 font-light">
                    {origin} → Water Bus stop, Ibadan
                  </p>
                </div>

                <div className="mb-8">
                  <div className="h-[50vh] border border-gray-200 overflow-hidden mb-6">
                    <Map
                      defaultCenter={{ lat: 7.3775, lng: 3.947 }}
                      defaultZoom={13}
                      gestureHandling={"greedy"}
                      fullscreenControl={false}
                      mapId={process.env.NEXT_PUBLIC_MAP_ID}
                    >
                      <DirectionsRenderer
                        origin={origin}
                        destination={destination}
                        travelMode={selectedTransport.travelMode}
                      />
                    </Map>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-6 mb-8">
                    <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Helpful Tip
                    </h4>
                    <p className="text-blue-700 font-light leading-relaxed">
                      {selectedTransport.tips}
                    </p>
                  </div>

                  <button
                    onClick={resetJourney}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-300 hover:bg-gray-100 transition-colors font-medium text-black"
                  >
                    Plan Another Journey
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </APIProvider>
    );
  }

  // Initial transport selection view - Clean Minimalist Design
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-px bg-blue-400"></div>
            <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
              Journey Planner
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 leading-tight">
            Visit Gofamint Student Fellowship
          </h1>
          <p className="text-lg md:text-xl text-black font-light mb-2 max-w-3xl mx-auto leading-relaxed">
            Plan your visit to our church at{" "}
            <span className="font-medium">Water Bus stop, Ibadan</span>
          </p>
        </div>

        {/* Clean Transport Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {transportOptions.map((option, index) => (
            <motion.div
              key={option.id}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
              onClick={() => handleGetDirections(option)}
            >
              {/* Icon Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-blue-500 group-hover:bg-blue-100 transition-colors">
                  {option.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-light text-black mb-4 group-hover:text-blue-500 transition-colors">
                  {option.name}
                </h3>

                {/* Transport Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-black font-light">
                    <Clock size={16} className="text-blue-400" />
                    <span>{option.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-black font-light">
                    <DollarSign size={16} className="text-blue-400" />
                    <span>{option.cost}</span>
                  </div>
                  {option.estimatedDistance && (
                    <div className="flex items-center gap-3 text-sm text-black font-light">
                      <Compass size={16} className="text-blue-400" />
                      <span>{option.estimatedDistance}</span>
                    </div>
                  )}
                </div>

             
              </div>

              {/* Action Button */}
              <div className="p-6">
                <button className="w-full bg-black hover:bg-blue-500 text-white py-3 font-medium transition-colors flex items-center justify-center gap-2">
                  <Navigation size={16} />
                  Get Directions
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Clean Contact Section */}
        <div className="text-center">
          <div className="inline-block bg-white border border-gray-200 shadow-sm p-8 max-w-2xl">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Need Help?
              </span>
            </div>
            <h4 className="text-xl font-light text-black mb-4">
              Our hospitality team is available to guide you
            </h4>
            <a
              href="tel:+234123456789"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
            >
              <Phone size={18} />
              Call +234 123 456 789
            </a>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

// Clean Directions Renderer Component
const DirectionsRenderer = ({
  origin,
  destination,
  travelMode,
}: {
  origin: string;
  destination: string;
  travelMode: "WALKING" | "DRIVING" | "TRANSIT" | "BICYCLING";
}) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      const service = new window.google.maps.DirectionsService();
      setDirectionsService(service);
    }
  }, []);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination)
      return;

    const modeEnum =
      google.maps.TravelMode[travelMode as keyof typeof google.maps.TravelMode];

    directionsService
      .route({
        origin,
        destination,
        travelMode: modeEnum,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
  }, [directionsService, directionsRenderer, origin, destination, travelMode]);

  useEffect(() => {
    if (!directionsRenderer || routes.length === 0) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer, routes]);

  if (!leg) return null;

  return (
    <div className="w-full bg-white border border-gray-200 p-6 my-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-black">{selected.summary}</h3>
        <div className="flex items-center gap-6 text-sm text-black font-light">
          <span className="flex items-center gap-2">
            <Clock size={16} className="text-blue-400" />
            {leg.duration?.text}
          </span>
          <span className="flex items-center gap-2">
            <Compass size={16} className="text-blue-400" />
            {leg.distance?.text}
          </span>
        </div>
        <div className="text-sm space-y-1 font-light">
          <p>
            <span className="font-medium">From:</span>{" "}
            {leg.start_address.split(",")[0]}
          </p>
          <p>
            <span className="font-medium">To:</span>{" "}
            {leg.end_address.split(",")[0]}
          </p>
        </div>
      </div>

      {routes.length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-black mb-3">
            Alternative Routes:
          </h4>
          <div className="flex flex-wrap gap-3">
            {routes.map((route, index) => (
              <button
                key={route.summary}
                onClick={() => setRouteIndex(index)}
                className={`px-4 py-2 text-sm font-light transition-colors ${
                  index === routeIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {route.summary}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyPlanner;
