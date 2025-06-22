"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
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
  color: string;
  estimatedDistance?: string;
  bestFor?: string[];
  travelMode: "WALKING" | "DRIVING" | "TRANSIT" | "BICYCLING"; // Use string literals
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const JourneyPlanner: React.FC = () => {
  const [selectedTransport, setSelectedTransport] =
    useState<TransportOption | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>("");
  const [locationStep, setLocationStep] = useState<number>(0); // 0: not started, 1: entering origin, 2: showing directions
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
      bestFor: ["Exercise", "Nearby locations", "Enjoying the scenery"],
      steps: [],
      tips: "Wear comfortable shoes and carry an umbrella. The route has sidewalks but can be crowded in the mornings.",
      color: "from-emerald-400 to-emerald-600",
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
      bestFor: ["Families", "Bad weather", "Carrying items"],
      steps: [],
      tips: "Sunday parking fills up by 9:30am. Carpool if possible. Security guards monitor the parking area.",
      color: "from-blue-400 to-blue-600",
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
      bestFor: ["Quick trips", "Avoiding traffic", "Solo travelers"],
      steps: [],
      tips: "Always wear the provided helmet. Have exact change ready. Avoid riding in heavy rain.",
      color: "from-orange-400 to-orange-600",
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
      bestFor: ["Budget travelers", "No rush", "Group travel"],
      steps: [],
      tips: "Buses run every 10-15 minutes. Have small bills ready. Morning buses are most crowded.",
      color: "from-purple-400 to-purple-600",
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
    setLocationStep(1); // Move to location input step
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
      setLocationStep(2); // Move to directions display
    }
  };

  const nextStep = (): void => {
    if (
      selectedTransport &&
      currentStep < (selectedTransport.steps?.length || 0)
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetJourney = () => {
    setSelectedTransport(null);
    setLocationStep(0);
    setOrigin("");
    setUserLocation(null);
  };

  // Location input step
  if (locationStep === 1) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
            <button
              onClick={resetJourney}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to options
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <MapPin size={24} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Where are you coming from?
                </h2>
                <p className="text-white/90 mt-2">
                  We'll use this to give you the best route to Gofamint Student
                  Fellowship, UI
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmitOrigin} className="space-y-6">
              <div>
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your location or address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your address or location"
                    required
                  />
                  {origin && (
                    <button
                      type="button"
                      onClick={() => setOrigin("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

  // Directions display step
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
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div
                className={`bg-gradient-to-r ${selectedTransport.color} p-6 text-white`}
              >
                <button
                  onClick={resetJourney}
                  className="mb-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back to options
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    {selectedTransport.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {selectedTransport.name}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-white/90 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock size={16} /> {selectedTransport.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} /> {selectedTransport.cost}
                      </span>
                      {selectedTransport.estimatedDistance && (
                        <span className="flex items-center gap-1">
                          <Compass size={16} />{" "}
                          {selectedTransport.estimatedDistance}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold">
                      Directions to Gofamint Student Fellowship, UI
                    </h3>
                    <p className="text-sm text-gray-500">
                      {origin} → {destination}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-[50svh] rounded-lg overflow-hidden mb-4">
                    <Map
                      defaultCenter={{ lat: 7.3775, lng: 3.947 }} // Ibadan coordinates
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

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <span className="bg-blue-100 p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </span>
                      Helpful Tip
                    </h4>
                    <p className="text-blue-700">{selectedTransport.tips}</p>
                  </div>

                  <button
                    onClick={resetJourney}
                    className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
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

  // Initial transport selection view
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Journey to Gofamint Student Fellowship, UI
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Plan your visit to our church at{" "}
            <span className="font-semibold text-blue-600">
              Water Bus stop, Ibadan
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {transportOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
              onClick={() => handleGetDirections(option)}
            >
              <div
                className={`bg-gradient-to-br ${option.color} p-6 text-white`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{option.name}</h3>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock size={14} />
                    <span>{option.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <DollarSign size={14} />
                    <span>{option.cost}</span>
                  </div>
                  {option.estimatedDistance && (
                    <div className="flex items-center gap-2 text-white/90">
                      <Compass size={14} />
                      <span>{option.estimatedDistance}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                  <Navigation size={16} />
                  Get Directions
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gray-50 rounded-xl p-6 inline-block max-w-2xl border border-gray-200">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Phone size={20} className="text-blue-500" />
              <h4 className="font-semibold text-gray-800">
                Need Help Finding Us?
              </h4>
            </div>
            <p className="text-gray-600 mb-4">
              Our hospitality team is available to guide you
            </p>
            <a
              href="tel:+234123456789"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Phone size={16} />
              Call +234 123 456 789
            </a>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

// Directions Renderer Component
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
      // Safe to use google.maps here
      const service = new window.google.maps.DirectionsService();
      setDirectionsService(service);
    }
  }, []);

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;

    // Safely initialize services only when google is available
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  // Use directions service
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

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer || routes.length === 0) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer, routes]);

  if (!leg) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-md mx-auto">
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{selected.summary}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={14} />
          <span>{leg.duration?.text}</span>
          <span>•</span>
          <Compass size={14} />
          <span>{leg.distance?.text}</span>
        </div>
        <div className="text-sm">
          <p className="font-medium">From: {leg.start_address.split(",")[0]}</p>
          <p className="font-medium">To: {leg.end_address.split(",")[0]}</p>
        </div>
      </div>

      {routes.length > 1 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Alternative Routes:</h4>
          <div className="flex flex-wrap gap-2">
            {routes.map((route, index) => (
              <button
                key={route.summary}
                onClick={() => setRouteIndex(index)}
                className={`px-3 py-1 text-sm rounded-full ${
                  index === routeIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
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
