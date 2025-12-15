// BYO Finance Calculator Constants
// These are separate from main calculator to avoid breaking existing functionality

// Fixed interest rates by term (years)
export const BYO_TERM_RATES = {
  1: 9.50,
  2: 8.00,
  3: 7.50,
  4: 7.35,
  5: 7.30
}

// ATO minimum balloon/residual percentages by lease term
export const BYO_ATO_BALLOONS = {
  1: 65.00,
  2: 56.25,
  3: 46.88,
  4: 37.50,
  5: 28.13
}

// Stamp duty rates by state (with EV discounts)
export const BYO_STAMP_DUTY_RATES = {
  VIC: { rate: 0.055, ev_rate: 0.042 },
  NSW: { rate: 0.045, ev_rate: 0.045 },
  QLD: { rate: 0.035, ev_rate: 0.020 },
  SA: { rate: 0.040, ev_rate: 0.020 },
  WA: { rate: 0.055, ev_rate: 0.027 },
  TAS: { rate: 0.040, ev_rate: 0.000 },
  ACT: { rate: 0.045, ev_rate: 0.000 },
  NT: { rate: 0.030, ev_rate: 0.015 }
}

// Registration costs by state (estimated)
export const BYO_REGISTRATION_COSTS = {
  VIC: 900,
  NSW: 950,
  QLD: 850,
  SA: 800,
  WA: 850,
  TAS: 750,
  ACT: 830,
  NT: 790
}

// Establishment fee
export const BYO_ESTABLISHMENT_FEE = 500

// Provider configurations with playbooks
export const BYO_PROVIDER_CONFIG = {
  'self-managed': {
    badge: 'Easy Setup Process',
    badgeClass: 'low',
    steps: 'Ask for Self-Managed Novated Lease - you provide the finance approval and they handle the tax benefits.',
    playbook: {
      intro: 'Most administrators can process a self-managed (BYO finance) lease when the employer permits it.',
      items: [
        'Send external Finance Approval (PDF) + driver licence to the administrator',
        'Request their Novation Deed; countersign by employer/payroll',
        'Provide dealer Tax Invoice (or order form) to trigger doc-pack',
        'Confirm payroll start date (first full pay-cycle after settlement)'
      ],
      foot: 'Ask for fee schedule in writing and confirm no bundled insurances or brokerage are added.'
    }
  },
  'maxxia': {
    badge: 'Easy Setup Process',
    badgeClass: 'low',
    steps: 'Maxxia commonly administers external finance where employers allow it. Ask for "BYO Finance / finance-only".',
    playbook: {
      intro: 'Typical flow when BYO is permitted:',
      items: [
        'Email finance approval & vehicle details to your Maxxia consultant',
        'Request novation documents and fee disclosure (admin, card, account fees)',
        'Provide dealer invoice to generate doc pack',
        'Confirm payroll deduction and settlement timeline (often 1-3 business days after docs)'
      ],
      foot: 'If pushed towards panel lenders or add-ons, request policy in writing and escalate via payroll if needed.'
    }
  },
  'smartleasing': {
    badge: 'Moderate Setup Required',
    badgeClass: 'medium',
    steps: 'Smartleasing can administer external finance depending on the employer. Ask for "finance-only" setup and fee schedule.',
    playbook: {
      intro: 'Practical sequence reported by users:',
      items: [
        'Share finance approval + ID; request external-finance administration',
        'Ask for a line-by-line disclosure of any fees added to the lease budget',
        'Confirm residual, term, and your employer\'s approval path',
        'Provide tax invoice; align settlement and payroll dates'
      ],
      foot: 'If BYO is declined, request the written policy and consider an employer HR/payroll escalation.'
    }
  },
  'remserv': {
    badge: 'Additional Work Required',
    badgeClass: 'high',
    steps: 'Some employers using RemServ prefer panel lenders. Use our "pressure-test" email to request rate match and remove add-ons.',
    playbook: {
      intro: 'If external finance meets resistance:',
      items: [
        'Ask for written policy and all applicable fees',
        'Request rate match against your approval (finance-only, no add-ons)',
        'Escalate to employer payroll for a BYO exception if beneficial to you',
        'Consider our Lease Rescue Pack if a better structure is required'
      ],
      foot: 'Outcomes vary by employer policy. Keep everything documented in writing.'
    }
  },
  'fleetcare': {
    badge: 'Moderate Setup Required',
    badgeClass: 'medium',
    steps: 'Policy varies by employer. Ask for clarification on administering external finance and a full fee breakdown.',
    playbook: {
      intro: 'Suggested steps:',
      items: [
        'Share finance approval; request fee schedule and "finance-only" setup',
        'Confirm card/admin fees applied to your running-cost budget',
        'Provide dealer invoice; align settlement with payroll'
      ],
      foot: 'If unclear, request policy in writing and involve employer payroll.'
    }
  },
  'paywise': {
    badge: 'Moderate Setup Required',
    badgeClass: 'medium',
    steps: 'Often manageable as finance-only when employer agrees. Confirm fee schedule and timing in writing.',
    playbook: {
      intro: 'Typical items required:',
      items: [
        'External finance approval + ID',
        'Novation deed for employer countersignature',
        'Dealer tax invoice to produce doc pack',
        'Payroll start date confirmation'
      ],
      foot: 'Ask for any admin/establishment charges applied to your budget.'
    }
  },
  'sgfleet': {
    badge: 'Moderate Setup Required',
    badgeClass: 'medium',
    steps: 'Depends on employer. Request finance-only and full disclosure of any fees added to the lease.',
    playbook: {
      intro: 'What usually happens:',
      items: [
        'Provide approval + vehicle details; confirm employer permits external finance',
        'Obtain novation deed; coordinate signatures',
        'Send dealer invoice; align settlement & payroll start'
      ],
      foot: 'If external finance is discouraged, seek written policy and discuss with payroll.'
    }
  },
  'restricted': {
    badge: 'Additional Work Required',
    badgeClass: 'high',
    steps: 'Request the provider\'s written position on external finance administration, then compare with our BYO option or use Lease Rescue Pack.',
    playbook: {
      intro: 'If the provider is unclear or resistant:',
      items: [
        'Request policy & fee schedule in writing',
        'Ask for rate match and removal of non-essential add-ons',
        'Loop in employer payroll/HR if policy appears inflexible'
      ],
      foot: 'We can help with template emails and a clean structure that your employer can accept.'
    }
  }
}

// State options for select
export const BYO_STATES = [
  { value: 'VIC', label: 'Victoria' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' }
]

// Vehicle type options
export const BYO_VEHICLE_TYPES = [
  { value: 'petrol', label: 'Petrol Vehicle' },
  { value: 'hybrid', label: 'Hybrid Vehicle' },
  { value: 'ev', label: 'Electric Vehicle' }
]

// Payment frequency options
export const BYO_PAY_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' }
]

// Lease term options
export const BYO_LEASE_TERMS = [
  { value: 1, label: '1 Year' },
  { value: 2, label: '2 Years' },
  { value: 3, label: '3 Years' },
  { value: 4, label: '4 Years' },
  { value: 5, label: '5 Years' }
]

// Payment structure options
export const BYO_PAYMENT_STRUCTURES = [
  { value: 'full_term', label: 'Full term payments (e.g. 60 payments)' },
  { value: 'deferred_2', label: '2 months deferred (e.g. 58 payments)' }
]

// Provider options for select
export const BYO_PROVIDERS = [
  { value: 'self-managed', label: 'Self-Managed/BYO Allowed' },
  { value: 'maxxia', label: 'Maxxia' },
  { value: 'smartleasing', label: 'Smartleasing' },
  { value: 'remserv', label: 'RemServ' },
  { value: 'fleetcare', label: 'FleetCare' },
  { value: 'paywise', label: 'Paywise' },
  { value: 'sgfleet', label: 'SG Fleet / nlc' },
  { value: 'restricted', label: 'Restricted/Unclear Provider' }
]
