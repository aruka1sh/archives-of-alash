export const DIALOGUE = {
  elder: {
    greeting: [
      {
        speaker: 'Village Elder',
        text: 'Ah, young scholar! Welcome. You have arrived at an important time.'
      },
      {
        speaker: 'Village Elder',
        text: 'The writings of Abai have traveled across the steppe, inspiring minds young and old. But time and weather take their toll on paper.'
      },
      {
        speaker: 'Village Elder',
        text: 'Some pages from an important manuscript have been scattered around our village. Will you help us recover them?'
      }
    ],
    questHint: [
      {
        speaker: 'Village Elder',
        text: 'Search carefully. The manuscript fragments could be anywhere — near the trees, by the houses, or around the village square. Keep your eyes open.'
      }
    ],
    quest2Intro: [
      {
        speaker: 'Village Elder',
        text: 'You found all the fragments! Excellent work, young scholar. Your dedication reminds me of why our ancestors valued knowledge so highly.'
      },
      {
        speaker: 'Village Elder',
        text: 'Now, let me ask you something. Not every question has a simple answer — but wisdom begins with reflection.'
      },
      {
        speaker: 'Village Elder',
        text: 'Two young villagers argue about whether education is truly necessary for their future. One says books have no place on the steppe. The other believes learning opens every door.'
      },
      {
        speaker: 'Village Elder',
        text: 'What do you think, young scholar? Which perspective aligns with the wisdom of Abai?'
      }
    ],
    correctAnswer: [
      {
        speaker: 'Village Elder',
        text: 'Well said! Abai valued education above almost everything else. He believed that knowledge was the light that could guide our people toward a brighter future.'
      },
      {
        speaker: 'Village Elder',
        text: '"A man\"s character is revealed by his thoughts, his thoughts by his words, and his words by his actions." These are Abai\"s own words.'
      },
      {
        speaker: 'Village Elder',
        text: 'You have earned 10 Heritage Points. Now, the archivist at the archive building needs your help with one final task.'
      }
    ],
    wrongAnswer: [
      {
        speaker: 'Village Elder',
        text: 'That does not reflect the spirit of Abai\"s teachings, young scholar. Abai believed deeply in the transformative power of education — for everyone, not just the wealthy.'
      },
      {
        speaker: 'Village Elder',
        text: 'He spent his life learning and writing, encouraging others to seek knowledge wherever it could be found. Let us try again.'
      }
    ],
    questComplete: [
      {
        speaker: 'Village Elder',
        text: 'You have done a great service today. The archive is whole again, and the words of Abai will continue to inspire generations to come.'
      },
      {
        speaker: 'Village Elder',
        text: 'A nation that forgets its poets and thinkers forgets itself. You have helped ensure that does not happen here.'
      }
    ]
  },

  teacher: {
    greeting: [
      {
        speaker: 'Teacher',
        text: 'Greetings! I teach the children of this village. It is humble work, but Abai himself believed that a teacher shapes the future of an entire nation.'
      },
      {
        speaker: 'Teacher',
        text: 'The Alash movement — have you heard of it? Our intellectuals dreamed of a modern, educated Kazakhstan. They built schools, wrote books, and published newspapers.'
      },
      {
        speaker: 'Teacher',
        text: 'Education and cultural development were at the heart of everything they did. Without knowledge, there can be no true progress.'
      }
    ],
    questHint: [
      {
        speaker: 'Teacher',
        text: 'I saw something glinting near the trees yesterday. It might have been one of the missing manuscript fragments.'
      },
      {
        speaker: 'Teacher',
        text: 'Check around the village square as well — many people pass through there. A fragment could have been dropped by anyone.'
      }
    ],
    wisdom: [
      {
        speaker: 'Teacher',
        text: 'Abai\"s philosophy teaches us that a person must develop both their mind and their character. Knowledge without morality is like a lamp without oil.'
      },
      {
        speaker: 'Teacher',
        text: 'The Alash leaders — Alikhan Bokeikhanov, Akhmet Baitursynov, Mirjaqip Dulatov — they all believed that education was the foundation of national identity.'
      }
    ]
  },

  archivist: {
    greeting: [
      {
        speaker: 'Archivist',
        text: 'Shh... not too loud! These shelves hold some of the most precious writings in the region. Copies of Abai\"s poetry, Alash newspaper articles, historical records...'
      },
      {
        speaker: 'Archivist',
        text: 'I have dedicated my life to preserving these documents. Paper is fragile — a single spark, a little water, and an entire world of knowledge can disappear.'
      },
      {
        speaker: 'Archivist',
        text: 'If you find any manuscript fragments, please bring them to me. I can help restore them to their proper place.'
      }
    ],
    questHint: [
      {
        speaker: 'Archivist',
        text: 'The fragments you\"re looking for — they would be small pieces of aged paper. Look for something that seems out of place. Near buildings, under trees...'
      },
      {
        speaker: 'Archivist',
        text: 'When you find them all, return to me. There is a special task I need help with — restoring the archive catalog.'
      }
    ],
    puzzleIntro: [
      {
        speaker: 'Archivist',
        text: 'You found all three fragments! Now, before I can properly file them, I need to organize our reference system.'
      },
      {
        speaker: 'Archivist',
        text: 'Can you help me match the key concepts with their descriptions? This will ensure everything is catalogued correctly.'
      },
      {
        speaker: 'Archivist',
        text: 'Let me open the reference cards for you. Match each concept on the left with its correct description on the right.'
      }
    ],
    puzzleDone: [
      {
        speaker: 'Archivist',
        text: 'Perfect! The catalog is now in order. The fragments have been restored to their rightful place in the archive.'
      },
      {
        speaker: 'Archivist',
        text: 'You have earned 20 Heritage Points for your careful work. Go speak with the elder — I believe he has something to tell you.'
      }
    ]
  }
};

export const QUEST2_CHOICES = {
  question: 'Two young villagers argue about whether education is truly necessary for their future. What do you believe?',
  options: [
    {
      id: 'A',
      text: 'Knowledge helps a person understand the world and improve it.',
      correct: true,
      feedback: 'Correct! Abai strongly valued knowledge, education, and personal development. He believed learning was essential for both individual growth and the progress of society.'
    },
    {
      id: 'B',
      text: 'Education is only useful for wealthy people.',
      correct: false,
      feedback: 'Abai believed education should be for everyone, not just the wealthy. He saw knowledge as the key to lifting up the entire community, regardless of status.'
    },
    {
      id: 'C',
      text: 'Young people should accept tradition without questioning it.',
      correct: false,
      feedback: 'Abai encouraged critical thinking and reflection. He believed that tradition should be understood and built upon — not blindly followed without thought.'
    }
  ]
};