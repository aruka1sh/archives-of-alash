export const QUESTS = {
  quest1: {
    id: 'quest1',
    title: 'Find the Missing Pages',
    description: 'Search the village for 3 scattered manuscript fragments.',
    objective: 'Find manuscript fragments hidden around the village.',
    progressText: 'Fragments',
    target: 3,
    reward: 10,
    rewardText: 'Heritage Points'
  },
  quest2: {
    id: 'quest2',
    title: "Understand Abai's Wisdom",
    description: 'Speak with the Village Elder and answer a question about Abai\'s teachings.',
    objective: 'Visit the Village Elder and reflect on Abai\'s philosophy.',
    progressText: 'Status',
    target: 1,
    reward: 10,
    rewardText: 'Heritage Points'
  },
  quest3: {
    id: 'quest3',
    title: 'Restore the Archive',
    description: 'Visit the Archivist and complete the catalog matching puzzle.',
    objective: 'Go to the Archive and help organize the reference catalog.',
    progressText: 'Status',
    target: 1,
    reward: 20,
    rewardText: 'Heritage Points'
  }
};

export const QUEST_ORDER = ['quest1', 'quest2', 'quest3'];