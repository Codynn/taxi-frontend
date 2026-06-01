import { Vehicle, VehicleTab } from "@/types/features/vehicle.types";

export const VEHICLE_TABS: VehicleTab[] = [
  { value: "cars", label: "Cars", icon: "vehicle/car.svg" },
  {
    value: "auto-rickshaw",
    label: "Auto Rickshaw",
    icon: "vehicle/auto.svg",
  },
  { value: "bikes", label: "Bike and Scooters", icon: "vehicle/bike.svg" },
];

export const VEHICLES: Vehicle[] = [
  {
    id: "v1",
    name: "SUV Carrera S 2024",
    plateNumber: "Ba 1 PA 1414",
    image: "vehicle/suv1.png",
    rating: 5.0,
    trips: 120,
    category: "cars",
    currency: "Rs",
    startingPrice: 5000,
    features: [
      { icon: "vehicle/battery.svg", label: "Electric" },
      { icon: "vehicle/wind.svg", label: "AC" },
      { icon: "vehicle/seat.svg", label: "5 Seats" },
    ],
  },
  {
    id: "v2",
    name: "SUV Carrera S 2024",
    plateNumber: "Ba 1 PA 1414",
    image: "vehicle/suv2.png",
    rating: 5.0,
    trips: 120,
    category: "cars",
    currency: "Rs",
    startingPrice: 5000,
    features: [
      { icon: "vehicle/battery.svg", label: "Electric" },
      { icon: "vehicle/wind.svg", label: "AC" },
      { icon: "vehicle/seat.svg", label: "5 Seats" },
    ],
  },
  {
    id: "v3",
    name: "SUV Carrera S 2024",
    plateNumber: "Ba 1 PA 1414",
    image: "vehicle/suv3.png",
    rating: 5.0,
    trips: 120,
    category: "cars",
    currency: "Rs",
    startingPrice: 5000,
    features: [
      { icon: "vehicle/battery.svg", label: "Electric" },
      { icon: "vehicle/wind.svg", label: "AC" },
      { icon: "vehicle/seat.svg", label: "5 Seats" },
    ],
  },
  {
    id: "v4",
    name: "SUV Carrera S 2024",
    plateNumber: "Ba 1 PA 1414",
    image: "vehicle/suv3.png",
    rating: 5.0,
    trips: 120,
    category: "cars",
    currency: "Rs",
    startingPrice: 5000,
    features: [
      { icon: "vehicle/battery.svg", label: "Electric" },
      { icon: "vehicle/wind.svg", label: "AC" },
      { icon: "vehicle/seat.svg", label: "5 Seats" },
    ],
  },
];

export const RIDES_READY_CONTENT = {
  heading: "Rides Ready",
  highlightedWord: "for Your Trip",
  description: "Compare and choose the one that suits your needs and budget.",
  browseAllLabel: "Browse All",
};
