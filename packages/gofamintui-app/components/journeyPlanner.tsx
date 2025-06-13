"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  CheckCircle,
} from "lucide-react";

interface TransportOption {
  id: string;
  name: string;
  icon: string;
  time: string;
  cost: string;
  difficulty: string;
  steps: string[];
  tips: string;
  color: string;
}

const JourneyPlanner: React.FC = () => {
  const [selectedTransport, setSelectedTransport] =
    useState<TransportOption | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const transportOptions: TransportOption[] = [
    {
      id: "walking",
      name: "Walking",
      icon: "🚶‍♂️",
      time: "15-20 mins",
      cost: "Free",
      difficulty: "Easy",
      steps: [
        "Exit your location and head towards Grace Street",
        "Walk north for about 800 meters",
        "Turn right at the Water Bus stop junction",
        "Grace Centre will be on your left - look for the church sign",
      ],
      tips: "Wear comfortable shoes and carry an umbrella if it looks like rain",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      id: "car",
      name: "Driving",
      icon: "🚗",
      time: "5-8 mins",
      cost: "₦200 fuel",
      difficulty: "Easy",
      steps: [
        "Start your engine and follow GPS to Water Bus stop",
        "Take the main road towards Ibadan center",
        "Look for Grace Centre signage near Water Bus stop",
        "Park in the designated church parking area",
      ],
      tips: "Parking is free on Sundays. Arrive 10 minutes early for better parking spots",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "okada",
      name: "Okada (Motorcycle)",
      icon: "🏍️",
      time: "8-12 mins",
      cost: "₦100-150",
      difficulty: "Moderate",
      steps: [
        "Go to the nearest Okada point/junction",
        'Tell the rider "Grace Centre, Water Bus stop"',
        "Negotiate the fare (₦100-150 is fair)",
        "Hold on tight and enjoy the ride!",
      ],
      tips: "Always negotiate fare before starting. Wear a helmet if provided",
      color: "from-orange-400 to-orange-600",
    },
  ];

  const handleGetDirections = (transport: TransportOption): void => {
    setSelectedTransport(transport);
    setCurrentStep(1);
  };

  const nextStep = (): void => {
    if (selectedTransport && currentStep < selectedTransport.steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (selectedTransport) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div
            className={`bg-gradient-to-r ${selectedTransport.color} p-6 text-white`}
          >
            <button
              onClick={() => setSelectedTransport(null)}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2"
            >
              ← Back to options
            </button>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{selectedTransport.icon}</div>
              <div>
                <h2 className="text-3xl font-bold">{selectedTransport.name}</h2>
                <div className="flex gap-4 mt-2 text-white/90">
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> {selectedTransport.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} /> {selectedTransport.cost}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Step-by-Step Directions</h3>
                <span className="text-sm text-gray-500">
                  Step {currentStep} of {selectedTransport.steps.length}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      currentStep <= selectedTransport.steps.length
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {currentStep}
                  </div>
                  <p className="text-lg flex-1">
                    {selectedTransport.steps[currentStep - 1]}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={
                    currentStep === (selectedTransport?.steps.length || 0)
                  }
                  className={`px-6 py-2 rounded-lg text-white transition-colors flex-1 ${
                    currentStep === (selectedTransport?.steps.length || 0)
                      ? "bg-green-500 hover:bg-green-600"
                      : `bg-gradient-to-r ${selectedTransport?.color || ""} hover:opacity-90`
                  }`}
                >
                  {currentStep === (selectedTransport?.steps.length || 0) ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> You've Arrived!
                    </span>
                  ) : (
                    "Next Step"
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                💡 Helpful Tip
              </h4>
              <p className="text-blue-700">{selectedTransport?.tips}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          How will you get to Church?
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We are at{" "}
          <span className="font-semibold">
            Grace Centre, Water Bus stop, Ibadan, Oyo State.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {transportOptions.map((option) => (
          <div
            key={option.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
            onClick={() => handleGetDirections(option)}
          >
            <div className={`bg-gradient-to-br ${option.color} p-6 text-white`}>
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{option.name}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock size={16} />
                  <span className="text-sm">{option.time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <DollarSign size={16} />
                  <span className="text-sm">{option.cost}</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Navigation size={16} />
                Get Directions
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="bg-gray-50 rounded-xl p-6 inline-block">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Phone size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-800">
              Need Help Finding Us?
            </span>
          </div>
          <p className="text-gray-600">
            Call us at <span className="font-bold">+234 bala blu bala</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JourneyPlanner;