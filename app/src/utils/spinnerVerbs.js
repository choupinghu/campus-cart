/**
 * NUS-themed spinner verbs for AI loading states.
 * Linus is the NUS lion mascot — he does the heavy lifting.
 */
export const NUS_SPINNER_VERBS = [
  'Linus is on it...',
  'Roaring through the data...',
  'Linus is sniffing it out...',
  'Charging through UTown...',
  'Consulting the Central Library...',
  'Sprinting down Kent Ridge...',
  'Linus never gives up...',
  'Sharpening those claws...',
  'Prowling the campus...',
  'Scanning the watering hole...',
  'Roar! Almost there...',
  'Linus is working his magic...',
  'Hunting through the listings...',
  'One paw at a time...',
  'Linus says hold tight...',
]

/** Returns a random verb from the list. */
export function getRandomVerb() {
  return NUS_SPINNER_VERBS[Math.floor(Math.random() * NUS_SPINNER_VERBS.length)]
}
