// App constants

// Finance constants
export const FIXED_RATE = 0.075 // 7.5% interest rate
export const ESTABLISHMENT_FEE = 500
export const DEFERRAL_MONTHS = 1
export const GST_CAP = 63340

// ATO Balloon/Residual percentages by lease term (years)
export const BALLOON_PERCENTS = {
  1: 0.6563,
  2: 0.5625,
  3: 0.4688,
  4: 0.3750,
  5: 0.2813
}

// Tax brackets (FY 2024-25)
export const TAX_BRACKETS = [
  [0, 18200, 0, 0],
  [18201, 45000, 0.19, 0],
  [45001, 135000, 0.30, 5094],
  [135001, 190000, 0.37, 31494],
  [190001, Infinity, 0.45, 53094]
]

// FBT exempt EV threshold
export const EV_FBT_THRESHOLD = 91387

// State stamp duty rates (as decimal)
export const STAMP_DUTY_RATES = {
  VIC: 0.046,
  NSW: 0.04,
  QLD: 0.03,
  SA: 0.04,
  WA: 0.0275,
  TAS: 0.04,
  NT: 0.03,
  ACT: 0.04
}

// Base registration cost estimate
export const BASE_REGISTRATION = 900

// Running cost base multipliers by vehicle type
export const RUNNING_COST_MULTIPLIERS = {
  'Electric Vehicle': 0.85,
  'Hybrid': 0.92,
  'Large Ute': 1.15,
  'SUV': 0.95,
  'Hatch': 0.90,
  'Sedan': 1.00,
  'Ute': 1.00
}

// Base running costs (annual)
export const BASE_RUNNING_COSTS = {
  insurance: 1900,
  rego: 900,
  service: 480
}

// Fuel consumption by vehicle type (L/100km)
export const FUEL_CONSUMPTION = {
  'Large Ute': 14,
  'Ute': 12,
  'SUV': 11,
  'Sedan': 8.5,
  'Hatch': 8,
  'Hybrid': 6
}

// Fuel price per litre
export const FUEL_PRICE = 2.10

// EV electricity cost per km
export const EV_COST_PER_KM = 0.042

// Hybrid blended cost calculation
export const HYBRID_EV_USAGE_RATIO = 0.55      // 55% of driving assumed electric
export const HYBRID_PETROL_CONSUMPTION = 6      // L/100km when running on petrol

// Tyres cost per set and km interval
export const TYRES_COST_PER_SET = 1200
export const TYRES_KM_INTERVAL = 45000

// Pay periods
export const PAY_PERIODS = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12
}

// Popular EVs with drive-away prices
export const POPULAR_EVS = {
  tesla_model3_rwd: { make: 'Tesla', model: 'Model 3', year: '2024', trim: 'RWD', price: 60200 },
  tesla_model3_lr: { make: 'Tesla', model: 'Model 3', year: '2024', trim: 'Long Range AWD', price: 70625 },
  tesla_model3_perf: { make: 'Tesla', model: 'Model 3', year: '2024', trim: 'Performance', price: 87297 },
  tesla_modely_rwd: { make: 'Tesla', model: 'Model Y', year: '2024', trim: 'RWD', price: 64373 },
  tesla_modely_lr: { make: 'Tesla', model: 'Model Y', year: '2024', trim: 'Long Range', price: 74793 },
  byd_seal: { make: 'BYD', model: 'Seal', year: '2024', trim: 'Premium', price: 58998 },
  byd_sealion7: { make: 'BYD', model: 'Sealion 7', year: '2024', trim: 'Premium', price: 65998 },
  bmw_ix3: { make: 'BMW', model: 'iX3', year: '2024', trim: 'xDrive30e', price: 84900 },
  bmw_i4: { make: 'BMW', model: 'i4', year: '2024', trim: 'eDrive35', price: 79900 },
  mini_cooper: { make: 'Mini', model: 'Cooper SE', year: '2024', trim: 'Electric', price: 58900 },
  hyundai_kona: { make: 'Hyundai', model: 'Kona EV', year: '2024', trim: 'Elite', price: 62500 },
  kia_ev6: { make: 'Kia', model: 'EV6', year: '2024', trim: 'Air', price: 67990 },
  kia_ev3: { make: 'Kia', model: 'EV3', year: '2024', trim: 'Air', price: 54990 },
  kia_ev5: { make: 'Kia', model: 'EV5', year: '2024', trim: 'Air', price: 62990 },
  mg_mg4: { make: 'MG', model: 'MG4', year: '2024', trim: 'Excite', price: 38990 }
}

// Vehicle types
export const VEHICLE_TYPES = [
  'Electric Vehicle',
  'Hybrid',
  'SUV',
  'Ute',
  'Large Ute',
  'Hatch',
  'Sedan'
]

// Lease terms (years)
export const LEASE_TERMS = [1, 2, 3, 4, 5]

// Australian states
export const STATES = [
  { value: 'VIC', label: 'Victoria' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' }
]

// Navigation links
export const NAV_LINKS = [
  { path: '/novated-leasing', label: 'Novated Leasing' },
  { path: '/lease-analysis', label: 'Lease Analysis' },
  { path: '/employers', label: 'Employers' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
]

// Footer links
export const FOOTER_LINKS = {
  legal: [
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms & Conditions' },
    { path: '/complaints', label: 'Complaints' },
    { path: '/credit-guide', label: 'Credit Guide' }
  ],
  contact: {
    email: 'enquiries@millarx.com.au',
    phone: '0492 886 857',
    website: 'www.millarx.com.au'
  }
}

// Business/Company Details
export const COMPANY = {
  tradingName: 'millarX',
  legalName: 'Blackrock Leasing Pty Ltd',
  abn: '15 681 267 818',
  acn: '681 267 818',
  acl: '569484',
  address: {
    suburb: 'Ivanhoe',
    state: 'VIC',
    postcode: '3079',
    country: 'Australia',
    full: 'Ivanhoe, VIC 3079'
  },
  contact: {
    phone: '0492 886 857',
    email: 'enquiries@millarx.com.au',
    complaintsEmail: 'info@millarx.com.au',
    website: 'www.millarx.com.au'
  },
  responsibleManager: 'Benjamin John Millar',
  afca: {
    name: 'Australian Financial Complaints Authority',
    website: 'www.afca.org.au',
    phone: '1800 931 678',
    email: 'info@afca.org.au',
    address: 'GPO Box 3, Melbourne VIC 3001'
  },
  oaic: {
    name: 'Office of the Australian Information Commissioner',
    website: 'www.oaic.gov.au',
    phone: '1300 363 992'
  },
  creditReportingBodies: [
    { name: 'Equifax Pty Ltd', website: 'www.equifax.com.au' },
    { name: 'Illion Australia Pty Ltd', website: 'www.illion.com.au' },
    { name: 'Experian Australia Credit Services Pty Ltd', website: 'www.experian.com.au' }
  ]
}
