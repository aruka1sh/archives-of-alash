export const CHAPTERS = {
  ch1: {
    id: 'ch1',
    title: 'The Missing Page',
    number: 1,
    objective: 'Search the village for the manuscript pages, then return to the Archivist.',
    reward: 10,
  },
  ch2: {
    id: 'ch2',
    title: 'Voices of the Village',
    number: 2,
    objective: 'Question the Elder, the Teacher and the Archivist. Trust opens doors.',
    targetsToInterview: ['elder', 'teacher', 'archivist'],
    reward: 10,
  },
  ch3: {
    id: 'ch3',
    title: 'The Evidence',
    number: 3,
    objective: 'Find evidence and connect clues (TAB). Learn what was on the missing page.',
    evidenceToFind: 5,
    deductionsNeeded: 3,
    keyDeduction: 'names_list',
    reward: 15,
  },
  ch4: {
    id: 'ch4',
    title: 'After Dark',
    number: 4,
    objective: 'Ask the Elder what to do next.',
    reward: 15,
  },
  ch5: {
    id: 'ch5',
    title: 'The Empty Cache',
    number: 5,
    objective: 'Check the hiding place under the stone by the old well.',
    reward: 15,
  },
  ch6: {
    id: 'ch6',
    title: 'The Final Decision',
    number: 6,
    objective: 'Decide the fate of the page.',
    reward: 10,
  },
};

export const CHAPTER_ORDER = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'];

// Points that are not tied to evidence / deductions / chapters
export const BONUS_POINTS = {
  evidence: 5,
  deduction: 10,
  puzzle: 10,
  cipher: 10,
  secret: 5,          // trust-gated confessions
  finalChoice: 10,
  accusationMistake: -5,
};

export const FINAL_CHOICES = [
  {
    id: 'preserve',
    title: 'PRESERVE',
    description: 'Hide the whole manuscript, names and all, somewhere safer.',
    detail: 'Abai\'s words and the record of everyone who carried them survive together. But as long as the page exists, every name on it is in danger.',
    ending: 'THE PRESERVER',
    endingText: 'The manuscript survived, whole and dangerous, because you protected it.',
  },
  {
    id: 'reveal',
    title: 'REVEAL',
    description: 'Send the manuscript to the Alash intellectuals in the city.',
    detail: 'In their hands it could be printed and read by thousands. But the road is long, letters are opened, and the names travel with the pages.',
    ending: 'THE SCHOLAR',
    endingText: 'The words reached the people who were building a new nation.',
  },
  {
    id: 'guardian',
    title: 'GUARDIAN',
    description: 'Burn the list of names. Keep Abai\'s words.',
    detail: 'No one will ever be arrested because of this page. But the memory of the people who saved Abai\'s words goes up in smoke.',
    ending: 'THE GUARDIAN',
    endingText: 'The names were lost, and every person on the list was safe.',
  },
];

export const LOST_ENDING = {
  id: 'lost',
  ending: 'THE LOST PAGE',
  endingText: 'The clerk left the village at dawn, with the page.',
};

// Epilogue text per ending. {high} is used when the village trusts you, {low} otherwise.
export const EPILOGUES = {
  preserve: {
    high: 'The Elder, the Teacher and the Archivist kept the secret together. Years later the hidden manuscript was found intact, and historians read every name on its last page.',
    low: 'You hid the manuscript alone. The villagers never quite forgave you for keeping secrets from them, but the page survived the dark years ahead.',
  },
  reveal: {
    high: 'The village helped you send the manuscript east, sewn into a saddle blanket. It arrived. Some of the names on the list later appeared among the first readers of Alash newspapers.',
    low: 'You sent the manuscript by post. It arrived, though someone had clearly opened the parcel along the way. You never learned who.',
  },
  guardian: {
    high: 'The Elder lit the fire himself. "Sabit would have wanted the living to stay living," he said. Abai\'s words lived on in a hundred hand-made copies.',
    low: 'You burned the page in silence. Nobody thanked you. Nobody was arrested, either.',
  },
  lost: {
    high: 'The villagers stood by you, but the page was already gone. That winter, men in uniform came asking about the names. The Teacher\'s school was closed.',
    low: 'Without proof, nobody believed you. That winter, men in uniform came asking about the names. The village learned to keep its books buried.',
  },
};

export const HISTORY_CARDS = [
  {
    title: '1909 — ABAI IN PRINT',
    text: 'The first collection of Abai Kunanbaiuly\'s poems was printed in St. Petersburg in 1909, five years after his death. Before that, his words lived in hand-made copies passed from village to village.',
  },
  {
    title: 'THE COPYISTS',
    text: 'Much of Abai\'s work survived because devoted scribes copied it by hand. These manuscripts are now treasured by scholars, and they remind us that heritage is kept by ordinary people.',
  },
  {
    title: '1917 — ALASH ORDA',
    text: 'Inspired by ideas of education and national identity, the Alash movement proclaimed the Alash Orda autonomy in December 1917. Its leaders included Alikhan Bukeikhanov, Akhmet Baitursynov and Mirzhakyp Dulatov.',
  },
  {
    title: 'SILENCE AND RETURN',
    text: 'In the 1930s most Alash leaders were repressed. Bukeikhanov and Baitursynov were executed in 1937. Their works were banned for decades and returned to readers only at the end of the 1980s.',
  },
];