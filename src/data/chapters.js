export const CHAPTERS = {
  ch1: {
    id: 'ch1',
    title: 'The Missing Page',
    number: 1,
    description: 'Find the scattered manuscript pages.',
    objective: 'Search the village for manuscript fragments. Something is wrong with the third page.',
    targetPages: 3,
    unlocksChapter: 'ch2',
    reward: 10,
    entryDialogue: {
      npc: 'archivist',
      key: 'chapter1_start'
    }
  },
  ch2: {
    id: 'ch2',
    title: 'Voices of the Village',
    number: 2,
    description: 'Interview the villagers about the missing page.',
    objective: 'Speak with the Elder, Teacher, and Archivist. Ask the right questions.',
    targetsToInterview: ['elder', 'teacher', 'archivist'],
    unlocksChapter: 'ch3',
    reward: 10,
    entryDialogue: {
      npc: 'archivist',
      key: 'chapter2_start'
    }
  },
  ch3: {
    id: 'ch3',
    title: 'The Evidence',
    number: 3,
    description: 'Collect evidence and connect the clues.',
    objective: 'Find evidence around the village. Use the Evidence Board (TAB) to connect clues.',
    evidenceToFind: 4,
    deductionsNeeded: 2,
    unlocksChapter: 'ch4',
    reward: 15,
    entryDialogue: {
      npc: 'teacher',
      key: 'chapter3_start'
    }
  },
  ch4: {
    id: 'ch4',
    title: 'After Dark',
    number: 4,
    description: 'Return to the archive at night.',
    objective: 'Wait for evening, then investigate the archive one final time.',
    unlocksChapter: 'ch5',
    reward: 15,
    entryDialogue: {
      npc: 'elder',
      key: 'chapter4_start'
    }
  },
  ch5: {
    id: 'ch5',
    title: 'The Final Decision',
    number: 5,
    description: 'Decide the fate of the manuscript.',
    objective: 'You know what happened. Now you must choose what to do.',
    unlocksChapter: null,
    reward: 10,
    entryDialogue: {
      npc: 'elder',
      key: 'chapter5_start'
    }
  }
};

export const CHAPTER_ORDER = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];

export const FINAL_CHOICES = [
  {
    id: 'preserve',
    title: 'PRESERVE',
    description: 'Hide the manuscript safely so it survives.',
    detail: 'You choose to protect the manuscript until it can be safely preserved.',
    ending: 'THE PRESERVER',
    endingText: '"The manuscript survived because you protected it."'
  },
  {
    id: 'reveal',
    title: 'REVEAL',
    description: 'Share the manuscript with the Alash intellectuals.',
    detail: 'You choose to share the manuscript so its ideas can reach others.',
    ending: 'THE SCHOLAR',
    endingText: '"The manuscript became part of a wider intellectual legacy."'
  },
  {
    id: 'guardian',
    title: 'GUARDIAN',
    description: 'Destroy one copy to protect the original.',
    detail: 'You choose to sacrifice one copy to protect the original.',
    ending: 'THE GUARDIAN',
    endingText: '"One copy was lost, but the original survived."'
  }
];