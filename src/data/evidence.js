export const EVIDENCE = [
  {
    id: 'torn_manuscript',
    name: 'Torn Manuscript Fragment',
    icon: '◆',
    foundAt: { x: 600, y: 280 },
    chapter: 'ch1',
    description: 'A torn corner of a manuscript page. The edge is rough — this was pulled out, not torn by age.',
    detail: 'The page was removed deliberately and recently. The tear is clean at one end and rough at the other, suggesting someone pulled it quickly.',
    connectsWith: ['broken_seal'],
    deduction: 'Someone entered the archive without permission and removed the page.'
  },
  {
    id: 'broken_seal',
    name: 'Broken Archive Seal',
    icon: '◇',
    foundAt: { x: 1320, y: 200 },
    chapter: 'ch2',
    description: 'The wax seal on the archive door has been broken. The break is fresh.',
    detail: 'The seal was intact yesterday. Whoever entered did so within the last day. The break pattern suggests it was done with a tool, not by accident.',
    connectsWith: ['torn_manuscript', 'footprints'],
    deduction: 'Someone forced entry into the archive.'
  },
  {
    id: 'footprints',
    name: 'Footprints Near Archive',
    icon: '○',
    foundAt: { x: 1100, y: 400 },
    chapter: 'ch2',
    description: 'Boot prints in the dirt behind the archive. They lead away from the village.',
    detail: 'The prints are fresh — no more than a day old. They stop at the tree line. Someone walked here after sunset.',
    connectsWith: ['broken_seal', 'hidden_letter'],
    deduction: 'Someone left the archive after sunset and headed toward the trees.'
  },
  {
    id: 'ink_bottle',
    name: 'Ink Bottle',
    icon: '●',
    foundAt: { x: 400, y: 950 },
    chapter: 'ch3',
    description: 'A small ink bottle, still half-full. The label is handwritten.',
    detail: 'The handwriting on the label matches the manuscript. This ink was used by the same person who wrote the original pages.',
    connectsWith: ['old_letter'],
    deduction: 'The same person who wrote the manuscript also wrote a private letter.'
  },
  {
    id: 'old_letter',
    name: 'Old Letter',
    icon: '◈',
    foundAt: { x: 900, y: 500 },
    chapter: 'ch3',
    description: 'A letter hidden under a loose floorboard. The paper is yellowed but intact.',
    detail: 'The letter warns about outsiders who might destroy the manuscript. The writer was afraid.',
    connectsWith: ['ink_bottle', 'witness_statement'],
    deduction: 'The manuscript was hidden out of fear, not malice.'
  },
  {
    id: 'witness_statement',
    name: 'Witness Statement',
    icon: '▣',
    foundAt: { x: 750, y: 700 },
    chapter: 'ch3',
    description: 'The teacher saw someone near the archive at dusk. The person was carrying papers.',
    detail: 'The figure was described as wearing a long coat. They entered the archive and left shortly after.',
    connectsWith: ['old_letter', 'footprints'],
    deduction: 'A villager entered the archive at dusk with a purpose.'
  },
  {
    id: 'hidden_letter',
    name: 'Hidden Letter',
    icon: '◆',
    foundAt: { x: 1350, y: 180 },
    chapter: 'ch4',
    description: '"The manuscript must not fall into the wrong hands." — unsigned.',
    detail: 'This letter was hidden inside the archive, not outside. Whoever wrote it had access to the building. They were trying to protect, not steal.',
    connectsWith: ['old_letter', 'torn_manuscript'],
    deduction: 'Someone hid the manuscript to protect it from being confiscated.'
  },
  {
    id: 'secret_photo',
    name: 'Old Photograph',
    icon: '◉',
    foundAt: { x: 100, y: 150 },
    chapter: 'ch3',
    description: 'A faded photograph of three young scholars. One of them looks familiar.',
    detail: 'The photograph shows the Elder, the Archivist, and an unknown third person — all young, standing in front of the archive.',
    connectsWith: ['old_letter'],
    deduction: 'The Elder and Archivist have known each other since youth. They share a secret.',
    optional: true
  },
  {
    id: 'secret_map',
    name: 'Hand-Drawn Map',
    icon: '◎',
    foundAt: { x: 1450, y: 900 },
    chapter: 'ch4',
    description: 'A small hand-drawn map showing a hiding spot near the old well.',
    detail: 'The map is recent. Someone planned to hide something. The location is marked with an X.',
    connectsWith: ['hidden_letter'],
    deduction: 'There was a plan to hide something valuable.',
    optional: true
  }
];

// Valid deduction pairs
export const DEDUCTION_PAIRS = [
  { pair: ['torn_manuscript', 'broken_seal'], result: 'Someone entered the archive without permission and removed the page.' },
  { pair: ['footprints', 'broken_seal'], result: 'Someone forced entry into the archive and fled on foot.' },
  { pair: ['ink_bottle', 'old_letter'], result: 'The same person who wrote the manuscript also wrote a private letter.' },
  { pair: ['old_letter', 'witness_statement'], result: 'The manuscript was hidden out of fear, not malice.' },
  { pair: ['hidden_letter', 'old_letter'], result: 'Someone hid the manuscript to protect it from being confiscated.' }
];