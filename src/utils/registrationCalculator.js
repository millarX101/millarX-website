// Enhanced Registration Calculator - FY25/26 data where applicable
// All amounts in AUD. Returns GST-inclusive where the source component is GST-inclusive.
// Inputs kept minimal for accuracy: supply tare (kg), cylinders, usage, zone, EV flag.

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Enhanced registration calculation with state-specific logic
 * @param {Object|string} input - Either RegoInput object or legacy state string
 * @returns {Object|number} - RegoBreakdown object or legacy number
 */
export function calculateRego(input) {
  // Backward compatibility: if called with just a state string, return legacy format
  if (typeof input === 'string') {
    return calculateRegoLegacy(input);
  }

  // New enhanced calculation
  return calculateRegoEnhanced(input);
}

/**
 * Legacy calculation for backward compatibility
 * @param {string} state - State abbreviation
 * @returns {number} - Annual registration cost
 */
function calculateRegoLegacy(state) {
  const legacyRates = {
    'VIC': 906.60,  // Metro rate as default (includes TAC)
    'NSW': 950,     // Realistic estimate including CTP
    'QLD': 900,     // Realistic estimate including CTP
    'SA': 800,      // Average estimate (includes CTP)
    'WA': 950,      // Realistic estimate including MII
    'TAS': 750,     // Average estimate (includes MAIB)
    'ACT': 1000,    // Realistic estimate including MAI
    'NT': 790       // Average estimate (includes CTPI)
  };

  return legacyRates[state?.toUpperCase()] || 900;
}

/**
 * Enhanced registration calculation with detailed breakdown
 * @param {Object} input - RegoInput object
 * @returns {Object} - RegoBreakdown object
 */
function calculateRegoEnhanced(input) {
  const {
    state,
    term = 12,
    privateUse = true,
    ev = false,
    vicZone,
    tareKg,
    cylinders,
    saRegion,
    gvmLt3t
  } = input;

  const monthly = term / 12;

  switch (state?.toUpperCase()) {
    // VIC: VicRoads publishes totals by zone for passenger vehicles (includes rego+TAC).
    // Ref table (cars/SUVs, 12m): metro 906.60, outer metro 848.40, rural 780.10.
    case 'VIC': {
      const zone = vicZone || 'metro';
      const zoneTotals = {
        metro: 906.60,
        outer_metro: 848.40,
        rural: 780.10,
      };
      const base = zoneTotals[zone];
      if (!base) {
        console.warn('VIC zone not recognized, defaulting to metro');
        const total = round2(906.60 * monthly);
        return {
          state: 'VIC',
          term,
          includes: ['VicRoads registration', 'TAC charge'],
          excludes: ['number plates (new issues)', 'duty', 'inspection', 'admin misc'],
          components: { rego_plus_TAC: total },
          total,
          notes: ['Passenger vehicle schedule. Use TAC postcode zoning for precision if desired.'],
        };
      }
      const total = round2(base * monthly);
      return {
        state: 'VIC',
        term,
        includes: ['VicRoads registration', 'TAC charge'],
        excludes: ['number plates (new issues)', 'duty', 'inspection', 'admin misc'],
        components: { rego_plus_TAC: total },
        total,
        notes: ['Passenger vehicle schedule. Use TAC postcode zoning for precision if desired.'],
      };
    }

    // NSW: $82 registration fee + Motor Vehicle Tax by tare band (private use).
    // 2025 bands (annual, private cars): up to254:$73; 255–764:$133; 765–975:$240; 976–1154:$268;
    // 1155–1504:$312; 1505–2504:$469; 2505–2794:$766; 2795–4500:$852.
    case 'NSW': {
      const ctpCost = 475; // Annual CTP Green Slip cost

      if (!tareKg) {
        // Use default estimate if no tare weight provided
        const regoFee = 82;
        const mvt = 240; // Average for typical passenger cars
        const components = {
          rego_fee: round2(regoFee * monthly),
          motor_vehicle_tax: round2(mvt * monthly),
          ctp_green_slip: round2(ctpCost * monthly),
        };
        const total = round2(components.rego_fee + components.motor_vehicle_tax + components.ctp_green_slip);
        return {
          state: 'NSW',
          term,
          includes: ['registration fee', 'motor vehicle tax', 'CTP Green Slip'],
          excludes: ['plate fee (new issues)', 'inspection', 'duty'],
          components,
          total,
          notes: ['Estimated using average tare weight. Provide tareKg for precise calculation.'],
        };
      }

      const regoFee = 82; // annual fixed
      const bands = [
        [254, 73, 73], [764, 133, 133], [975, 240, 240], [1154, 268, 268],
        [1504, 312, 312], [2504, 469, 469], [2794, 766, 766], [4500, 852, 852],
      ];
      const band = bands.find(([max]) => tareKg <= max);
      if (!band) {
        console.warn('NSW tare out of light-vehicle range, using max band');
        const mvt = 852;
        const components = {
          rego_fee: round2(regoFee * monthly),
          motor_vehicle_tax: round2(mvt * monthly),
          ctp_green_slip: round2(ctpCost * monthly),
        };
        const total = round2(components.rego_fee + components.motor_vehicle_tax + components.ctp_green_slip);
        return {
          state: 'NSW',
          term,
          includes: ['registration fee', 'motor vehicle tax', 'CTP Green Slip'],
          excludes: ['plate fee (new issues)', 'inspection', 'duty'],
          components,
          total,
        };
      }
      const mvt = privateUse ? band[1] : band[2]; // business uses different table; here same placeholders per ref
      const components = {
        rego_fee: round2(regoFee * monthly),
        motor_vehicle_tax: round2(mvt * monthly),
        ctp_green_slip: round2(ctpCost * monthly),
      };
      const total = round2(components.rego_fee + components.motor_vehicle_tax + components.ctp_green_slip);
      return {
        state: 'NSW',
        term,
        includes: ['registration fee', 'motor vehicle tax', 'CTP Green Slip'],
        excludes: ['plate fee (new issues)', 'inspection', 'duty'],
        components,
        total,
      };
    }

    // QLD: Registration fee by cylinders + Traffic Improvement Fee (private), excl CTP.
    // 12m NEW/RENEW private totals (excl plate) per 16 Sep 2025 schedule:
    // 1-3: 358.25 ; 4: 437.90 ; 5-6: 655.35 ; 7-8: 891.80 ; 9-12: 1034.70
    case 'QLD': {
      const ctpCost = 400; // Annual CTP cost

      if (!cylinders) {
        // Use default estimate for 4-cylinder vehicle
        const regoPlusTraffic = round2(437.90 * monthly);
        const ctpProrated = round2(ctpCost * monthly);
        const components = {
          rego_plus_traffic: regoPlusTraffic,
          ctp: ctpProrated,
        };
        const total = round2(regoPlusTraffic + ctpProrated);
        return {
          state: 'QLD',
          term,
          includes: ['registration fee', 'traffic improvement fee', 'CTP'],
          excludes: ['plate (new issues)', 'duty', 'inspection'],
          components,
          total,
          notes: ['Estimated for 4-cylinder vehicle. Provide cylinders for precise calculation.'],
        };
      }

      const c = cylinders;
      const map = (c <= 3) ? 358.25 : (c === 4) ? 437.90 : (c <= 6) ? 655.35 : (c <= 8) ? 891.80 : 1034.70;
      const regoPlusTraffic = round2(map * monthly);
      const ctpProrated = round2(ctpCost * monthly);
      const components = {
        rego_plus_traffic: regoPlusTraffic,
        ctp: ctpProrated,
      };
      const total = round2(regoPlusTraffic + ctpProrated);
      return {
        state: 'QLD',
        term,
        includes: ['registration fee', 'traffic improvement fee', 'CTP'],
        excludes: ['plate (new issues)', 'duty', 'inspection'],
        components,
        total,
      };
    }

    // SA: Published 12m totals by cylinders and metro/country for cars/utes (includes CTP estimate + admin levies).
    // Metro 12m: 4cyl/EV $675 ; 6cyl $840 ; 8cyl $980 ; ute<1.5t $1060 ; ute 1.5–4.499t $1185
    // Country 12m: 4cyl/EV $575 ; 6cyl $735 ; 8cyl $870 ; ute<1.5t $730 ; ute 1.5–4.499t $970
    case 'SA': {
      if (!cylinders && !ev) {
        // Use default estimate for 4-cylinder metro vehicle
        const total = round2(675 * monthly);
        return {
          state: 'SA',
          term,
          includes: ['registration', 'CTP estimate', 'LSS/ESL where applicable'],
          excludes: ['duty', 'inspection'],
          components: { rego_package: total },
          total,
          notes: ['Estimated for 4-cylinder metro vehicle. Provide cylinders or ev=true for precise calculation.'],
        };
      }

      const region = saRegion || 'metro';
      const isUte = false; // extend if you capture body type
      let annual = 0;
      if (isUte) {
        // placeholder: require mass split; default to <1.5t
        annual = region === 'metro' ? 1060 : 730;
      } else {
        if (ev || (cylinders <= 4)) annual = region === 'metro' ? 675 : 575;
        else if (cylinders <= 6) annual = region === 'metro' ? 840 : 735;
        else annual = region === 'metro' ? 980 : 870;
      }
      const total = round2(annual * monthly);
      return {
        state: 'SA',
        term,
        includes: ['registration', 'CTP estimate', 'LSS/ESL where applicable'],
        excludes: ['duty', 'inspection'],
        components: { rego_package: total },
        total,
        notes: ['Tables are rounded guide; SA calculator yields exact insurer MAI.'],
      };
    }

    // WA: Licence fee = $28.64 per 100 kg (rounded up to next 100 kg) + prescribed flat fee ($6.60 on 12m renewals).
    // MII (CTP equivalent) is separate via ICWA premium schedule for Class 1 passenger vehicles.
    case 'WA': {
      const miiCost = 450; // Annual Motor Injury Insurance cost

      if (!tareKg) {
        // Use default estimate for 1500kg vehicle
        const defaultTareKg = 1500;
        const per100 = 28.64;
        const rounded100 = Math.ceil(defaultTareKg / 100) * 100;
        const licence = per100 * (rounded100 / 100);
        const flatFee12m = 6.60;
        const licenceProrated = round2(licence * monthly);
        const flatProrated = round2(flatFee12m * monthly);
        const miiProrated = round2(miiCost * monthly);
        const components = {
          licence_fee: licenceProrated,
          prescribed_flat_fee: flatProrated,
          motor_injury_insurance: miiProrated,
        };
        const total = round2(components.licence_fee + components.prescribed_flat_fee + components.motor_injury_insurance);
        return {
          state: 'WA',
          term,
          includes: ['licence fee', 'prescribed flat fee', 'Motor Injury Insurance (MII)'],
          excludes: ['plates', 'duty', 'inspection'],
          components,
          total,
          notes: ['Estimated for 1500kg vehicle. Provide tareKg for precise calculation.'],
        };
      }

      const per100 = 28.64;
      const rounded100 = Math.ceil(tareKg / 100) * 100;
      const licence = per100 * (rounded100 / 100);
      const flatFee12m = 6.60; // discounted 12m renewal rate
      const licenceProrated = round2(licence * monthly);
      const flatProrated = round2(flatFee12m * monthly);
      const miiProrated = round2(miiCost * monthly);
      const components = {
        licence_fee: licenceProrated,
        prescribed_flat_fee: flatProrated,
        motor_injury_insurance: miiProrated,
      };
      const total = round2(components.licence_fee + components.prescribed_flat_fee + components.motor_injury_insurance);
      return {
        state: 'WA',
        term,
        includes: ['licence fee', 'prescribed flat fee', 'Motor Injury Insurance (MII)'],
        excludes: ['plates', 'duty', 'inspection'],
        components,
        total,
      };
    }

    // TAS: Light vehicles renewal fees by cylinders, <3t vs 3–4.5t. EV under 3t priced like 4 cyl.
    case 'TAS': {
      const lt3 = gvmLt3t !== false; // default <3t
      let annual = 0;

      if (!cylinders && !ev) {
        // Use default estimate for 4-cylinder <3t vehicle
        annual = 625.66;
      } else {
        if (lt3) {
          if (ev) annual = 625.66;
          else if (!cylinders || cylinders <= 3) annual = 601.66;
          else if (cylinders === 4) annual = 625.66;
          else if (cylinders <= 6) annual = 667.66;
          else if (cylinders <= 8) annual = 744.66;
          else annual = 779.66;
        } else {
          if (!cylinders || cylinders <= 4) annual = 779.66;
          else if (cylinders <= 6) annual = 830.66;
          else if (cylinders <= 8) annual = 885.66;
          else annual = 938.66;
        }
      }

      const total = round2(annual * monthly);
      return {
        state: 'TAS',
        term,
        includes: ['registration', 'MAIB premium', 'levies'],
        excludes: ['duty', 'inspection', 'plates (new issues)'],
        components: { rego_package: total },
        total,
        notes: cylinders || ev ? [] : ['Estimated for 4-cylinder <3t vehicle. Provide cylinders or ev=true for precise calculation.'],
      };
    }

    // ACT: Emissions-based schedule needs CO2 band + weight/use, and MAI insurer premium. Use ACT calculator/API.
    case 'ACT': {
      const maiCost = 500; // Annual Motor Accident Insurance cost
      const estimatedRego = 500; // Base registration estimate (reduced from 830)

      const regoProrated = round2(estimatedRego * monthly);
      const maiProrated = round2(maiCost * monthly);
      const components = {
        estimated_rego: regoProrated,
        motor_accident_insurance: maiProrated,
      };
      const total = round2(regoProrated + maiProrated);

      return {
        state: 'ACT',
        term,
        includes: ['estimated registration', 'Motor Accident Insurance (MAI)'],
        excludes: ['plates', 'duty', 'inspection'],
        components,
        total,
        notes: ['ACT uses emissions-based fees by CO2 band, weight, and use. Precise calculation requires ACT calculator.'],
      };
    }

    // NT: Prescribed rego fee + CTPI included and varies by class; full total requires NT MVR tables.
    case 'NT': {
      return {
        state: 'NT',
        term,
        includes: ['registration', 'CTPI (Compulsory Third Party Insurance)'],
        excludes: ['plates', 'duty', 'inspection'],
        components: { estimated_rego: round2(790 * monthly) },
        total: round2(790 * monthly),
        notes: ['NT bundles CTPI in rego. Use MVR schedule by vehicle class to compute accurately.'],
      };
    }

    default:
      console.warn('Unsupported state, using default estimate');
      return {
        state: state || 'UNKNOWN',
        term,
        includes: ['estimated registration'],
        excludes: ['CTP', 'plates', 'duty', 'inspection'],
        components: { estimated_rego: round2(900 * monthly) },
        total: round2(900 * monthly),
        notes: ['Default estimate used. Provide a valid Australian state for accurate calculation.'],
      };
  }
}

// Export enhanced types for TypeScript compatibility (if needed)
export const STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];
export const TERMS = [3, 6, 12];

// Helper function to create input object for enhanced calculation
export function createRegoInput({
  state,
  term = 12,
  privateUse = true,
  ev = false,
  vicZone = 'metro',
  tareKg = null,
  cylinders = null,
  saRegion = 'metro',
  gvmLt3t = true
}) {
  return {
    state,
    term,
    privateUse,
    ev,
    vicZone,
    tareKg,
    cylinders,
    saRegion,
    gvmLt3t
  };
}

/**
 * Get simple annual registration cost for a state (for calculator use)
 * @param {string} state - State code
 * @param {boolean} isEV - Is electric vehicle
 * @returns {number} - Annual registration cost including CTP
 */
export function getAnnualRegistration(state, isEV = false) {
  const result = calculateRego({
    state,
    term: 12,
    ev: isEV,
    cylinders: isEV ? null : 4  // Default to 4 cylinders for non-EV
  });

  return typeof result === 'number' ? result : result.total;
}
