import type {
  TripTab,
  TripType,
  DriverType,
  BookingFormState,
} from "@/types/booking.types";

export const TRIP_TABS: { value: TripTab; label: string }[] = [
  { value: "normal", label: "Normal Trip" },
  { value: "custom", label: "Custom Trip" },
];

/**
 * The "Normal Trip" tab covers both within-city and city-to-city routes.
 * The actual LONG_TRIP vs SHORT_TRIP value sent to the backend is derived
 * from the selected destination's `outsideDistrict` flag, not the tab.
 */
export function deriveApiTripType(
  tripTab: TripTab,
  outsideDistrict?: boolean,
): "LONG_TRIP" | "SHORT_TRIP" | "CUSTOM_TRIP" {
  if (tripTab === "custom") return "CUSTOM_TRIP";
  return outsideDistrict ? "LONG_TRIP" : "SHORT_TRIP";
}

export const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "round-trip", label: "Round Trip" },
  { value: "one-way", label: "One Way" },
];

export const DRIVER_TYPES: { value: DriverType; label: string }[] = [
  { value: "with-driver", label: "With Driver" },
  { value: "self-drive", label: "Self Drive" },
];

export const DESTINATIONS: { from: string; to: string }[] = [
  { from: "Dang", to: "Kathmandu" },
  { from: "Dang", to: "Pokhara" },
  { from: "Dang", to: "Lumbini" },
  { from: "Dang", to: "Illam" },
  { from: "Dang", to: "Nepalgunj" },
  { from: "Dang", to: "Biratnagar" },
];

export const PASSENGER_OPTIONS = [
  "1 Passenger",
  "2 Passengers",
  "3 Passengers",
  "4 Passengers",
  "5 Passengers",
  "6+ Passengers",
];

export const DEFAULT_BOOKING_STATE: BookingFormState = {
  tripTab: "normal",
  tripType: "one-way",
  driverType: "with-driver",
  destination: { from: "", to: "" },
  dateRange: { pickup: "", return: "" },
  pickupTime: "",
  passengers: { adults: 1, children: 0 },
};

export const CUSTOM_TRIP_NOTE =
  "Choose your destination, and our team will contact you shortly with custom pricing and availability.";

export const CUSTOM_TRIP_DESTINATIONS: { id: string; name: string }[] = [
  { id: "kathmandu", name: "Kathmandu" },
  { id: "pokhara", name: "Pokhara" },
  { id: "lalitpur", name: "Lalitpur" },
  { id: "bhaktapur", name: "Bhaktapur" },
  { id: "chitwan", name: "Chitwan (Bharatpur)" },
  { id: "lumbini", name: "Lumbini" },
  { id: "butwal", name: "Butwal" },
  { id: "nepalgunj", name: "Nepalgunj" },
  { id: "dhangadhi", name: "Dhangadhi" },
  { id: "mahendranagar", name: "Mahendranagar" },
  { id: "birgunj", name: "Birgunj" },
  { id: "janakpur", name: "Janakpur" },
  { id: "biratnagar", name: "Biratnagar" },
  { id: "itahari", name: "Itahari" },
  { id: "dharan", name: "Dharan" },
  { id: "ilam", name: "Ilam" },
  { id: "damak", name: "Damak" },
  { id: "bhadrapur", name: "Bhadrapur (Jhapa)" },
  { id: "hetauda", name: "Hetauda" },
  { id: "tansen", name: "Tansen (Palpa)" },
  { id: "baglung", name: "Baglung" },
  { id: "gorkha", name: "Gorkha" },
  { id: "besisahar", name: "Besisahar" },
  { id: "dang", name: "Dang (Ghorahi)" },
  { id: "tulsipur", name: "Tulsipur" },
  { id: "surkhet", name: "Surkhet" },
  { id: "jumla", name: "Jumla" },
  { id: "mustang", name: "Mustang (Jomsom)" },
  { id: "manang", name: "Manang" },
  { id: "tikapur", name: "Tikapur" },
  { id: "dadeldhura", name: "Dadeldhura" },
  { id: "baitadi", name: "Baitadi" },
  { id: "darchula", name: "Darchula" },
  { id: "doti", name: "Doti" },
  { id: "salyan", name: "Salyan" },
  { id: "rolpa", name: "Rolpa" },
  { id: "rukum", name: "Rukum" },
  { id: "pyuthan", name: "Pyuthan" },
  { id: "bhairahawa", name: "Bhairahawa" },
  { id: "bandipur", name: "Bandipur" },
  { id: "damauli", name: "Damauli (Tanahun)" },
  { id: "syangja", name: "Syangja" },
  { id: "gulmi", name: "Gulmi" },
  { id: "dolakha", name: "Dolakha (Charikot)" },
  { id: "sindhupalchok", name: "Sindhupalchok" },
  { id: "rasuwa", name: "Rasuwa (Dhunche)" },
  { id: "dhading", name: "Dhading" },
  { id: "sindhuli", name: "Sindhuli" },
  { id: "banepa", name: "Banepa" },
  { id: "solukhumbu", name: "Solukhumbu (Salleri)" },
];
