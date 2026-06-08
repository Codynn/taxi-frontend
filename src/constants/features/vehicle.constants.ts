import { Vehicle, VehicleTab } from "@/types/features/vehicle.types";

export const VEHICLE_TABS: VehicleTab[] = [
  { value: "CAR", label: "Cars", icon: "vehicle/car.svg" },
  {
    value: "AUTO_RICKSHAW",
    label: "Auto Rickshaw",
    icon: "vehicle/auto.svg",
  },
  { value: "BIKE_SCOOTER", label: "Bike & Scooters", icon: "vehicle/bike.svg" },
];

// export const VEHICLES: Vehicle[] = [
//   {
//     id: "v1",
//     name: "SUV Carrera S 2024",
//     plateNumber: "Ba 1 PA 1414",
//     image: "vehicle/suv1.png",
//     rating: 5.0,
//     trips: 120,
//     category: "cars",
//     currency: "Rs",
//     startingPrice: 5000,
//     features: [
//       { icon: "vehicle/battery.svg", label: "Electric" },
//       { icon: "vehicle/wind.svg", label: "AC" },
//       { icon: "vehicle/seat.svg", label: "5 Seats" },
//     ],
//   },
//   {
//     id: "v2",
//     name: "SUV Carrera S 2024",
//     plateNumber: "Ba 1 PA 1414",
//     image: "vehicle/suv2.png",
//     rating: 5.0,
//     trips: 120,
//     category: "cars",
//     currency: "Rs",
//     startingPrice: 5000,
//     features: [
//       { icon: "vehicle/battery.svg", label: "Electric" },
//       { icon: "vehicle/wind.svg", label: "AC" },
//       { icon: "vehicle/seat.svg", label: "5 Seats" },
//     ],
//   },
//   {
//     id: "v3",
//     name: "SUV Carrera S 2024",
//     plateNumber: "Ba 1 PA 1414",
//     image: "vehicle/suv3.png",
//     rating: 5.0,
//     trips: 120,
//     category: "cars",
//     currency: "Rs",
//     startingPrice: 5000,
//     features: [
//       { icon: "vehicle/battery.svg", label: "Electric" },
//       { icon: "vehicle/wind.svg", label: "AC" },
//       { icon: "vehicle/seat.svg", label: "5 Seats" },
//     ],
//   },
//   {
//     id: "v4",
//     name: "SUV Carrera S 2024",
//     plateNumber: "Ba 1 PA 1414",
//     image: "vehicle/suv3.png",
//     rating: 5.0,
//     trips: 120,
//     category: "cars",
//     currency: "Rs",
//     startingPrice: 5000,
//     features: [
//       { icon: "vehicle/battery.svg", label: "Electric" },
//       { icon: "vehicle/wind.svg", label: "AC" },
//       { icon: "vehicle/seat.svg", label: "5 Seats" },
//     ],
//   },
// ];

export const RIDES_READY_CONTENT = {
  heading: "Rides Ready",
  highlightedWord: "for Your Trip",
  description: "Compare and choose the one that suits your needs and budget.",
  browseAllLabel: "Browse All",
};

export const FILTER_OPTIONS = {
  vehicleTypes: [
    { label: "All", count: 8 },
    { label: "Economic", count: 8 },
    { label: "Luxary", count: 10 },
    { label: "Premium", count: 100 },
  ],
  gearTypes: [
    { label: "All", count: 8 },
    { label: "Automatic", count: 8 },
    { label: "Manual", count: 10 },
  ],
  fuelTypes: [
    { label: "All", count: 8 },
    { label: "Petrol", count: 10 },
    { label: "Diesel", count: 10 },
    { label: "Electric", count: 100 },
  ],
  priceRange: { min: 0, max: 1000, defaultMin: 150, defaultMax: 650 },
};

export const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "A to Z", value: "a-z" },
  { label: "Z to A", value: "z-a" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];
