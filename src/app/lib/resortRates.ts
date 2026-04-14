/** AML's Resort — Grand Event Hall pax-based venue rates (9am–9pm package). */
export const EVENT_HALL_PAX_RATES = [
  { minPax: 30, maxPax: 40, price: 5500 },
  { minPax: 41, maxPax: 50, price: 6000 },
  { minPax: 51, maxPax: 60, price: 6500 },
  { minPax: 61, maxPax: 70, price: 7500 },
  { minPax: 71, maxPax: 80, price: 8500 },
  { minPax: 81, maxPax: 90, price: 9500 },
  { minPax: 91, maxPax: 100, price: 10500 },
  { minPax: 101, maxPax: 120, price: 11500 },
  { minPax: 121, maxPax: 140, price: 12500 },
  { minPax: 141, maxPax: 9999, price: 13000 },
] as const;

export const EVENT_HALL_INCLUSIONS = [
  'Use of venue 9am–9pm',
  'Videoke',
  'Tables and chairs without cover (if not provided by client catering)',
  'Guests and visitors may use the swimming pool (pool is shared — not private)',
] as const;

export const EVENT_HALL_NOTES = [
  'Additional ₱1,000 for lights and sounds brought in by the guest/client.',
  "Open daily 9am–9pm — AML's Resort.",
] as const;

export const RESORT_HOURS_NOTE = "Open every day 9am–9pm — AML's Resort.";
