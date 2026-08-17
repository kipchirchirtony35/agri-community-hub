// Central officer directory. Used by the public Officers listing, the
// officer login form, and the officer dashboard, so there's one source
// of truth for who the officers are and what they cover.
export const officers = [
  {
    id: 1,
    username: "amina",
    password: "officer123",
    name: "Dr. Amina Okello",
    role: "Agricultural Extension Officer",
    specialty: "Crop Production & Soil Health",
    phone: "+254 712 345 678",
    email: "amina@agriconnect.gov",
  },
  {
    id: 2,
    username: "james",
    password: "officer123",
    name: "James Mwangi",
    role: "Livestock Officer",
    specialty: "Cattle, Poultry & Animal Health",
    phone: "+254 723 456 789",
    email: "james@agriconnect.gov",
  },
  {
    id: 3,
    username: "sarah",
    password: "officer123",
    name: "Sarah Wanjiku",
    role: "Irrigation & Water Management",
    specialty: "Drip Systems & Water Harvesting",
    phone: "+254 734 567 890",
    email: "sarah@agriconnect.gov",
  },
  {
    id: 4,
    username: "peter",
    password: "officer123",
    name: "Peter Ochieng",
    role: "Market Linkage Officer",
    specialty: "Value Addition & Market Access",
    phone: "+254 745 678 901",
    email: "peter@agriconnect.gov",
  },
];

export function findOfficerByUsername(username) {
  return officers.find(
    (o) => o.username.toLowerCase() === username.trim().toLowerCase()
  );
}
