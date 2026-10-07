export const DIALOGUE = {
  elder: {
    greeting: [
      { speaker: 'Village Elder', text: 'Welcome, young scholar. You have arrived at an important time.' },
      { speaker: 'Village Elder', text: 'The writings of Abai have traveled across the steppe, but some pages have been lost. Will you help us recover them?' }
    ],
    questHint: [
      { speaker: 'Village Elder', text: 'Search carefully — near trees, houses, and around the village square. The fragments could be anywhere.' }
    ],
    chapter1_ask: [
      { speaker: 'Village Elder', text: 'You found the pages? But one is missing... that is troubling.' },
      { speaker: 'Village Elder', text: 'I remember something. At sunset yesterday, I saw a figure near the archive. I thought nothing of it at the time.' }
    ],
    chapter2_interview: {
      intro: [
        { speaker: 'Village Elder', text: 'Ask your questions, young scholar. An honest question deserves an honest ear.' }
      ],
      choices: [
        {
          id: 'elder_ask_all',
          text: '"What did you see near the archive yesterday?"',
          trust: 10,
          reply: [
            { speaker: 'Village Elder', text: 'I saw someone who carried an iron key. They moved not like a thief, but with a heavy heart.' },
            { speaker: 'Village Elder', text: 'When a man protects what he loves, his steps are deliberate and burdened.' }
          ]
        },
        {
          id: 'elder_ask_content',
          text: '"Do you know what was written on the missing page?"',
          trust: 15,
          reply: [
            { speaker: 'Village Elder', text: 'It was not poetry. The Master’s verses are in the hearts of our youth, but the last page...' },
            { speaker: 'Village Elder', text: 'The last page held the names of those who dared to write them down in secret.' }
          ]
        },
        {
          id: 'elder_ask_trust',
          text: '"You hold the village master key. Did you open the archive?"',
          trust: -10,
          reply: [
            { speaker: 'Village Elder', text: 'I have guarded this village for sixty winters. I do not answer to suspicion, but I forgive your youth.' },
            { speaker: 'Village Elder', text: 'Look deeper before you point fingers, young seeker.' }
          ]
        }
      ]
    },
    chapter4_start: [
      { speaker: 'Village Elder', text: 'You have pieced together the truth. The twelve names on that final page... they are living men and teachers.' },
      { speaker: 'Village Elder', text: 'Yes, it was I who broke the seal. I used my key and sliced out the list before anyone could confiscate it.' },
      { speaker: 'Village Elder', text: 'I wrapped the page in oilcloth and placed it under the flat foundation stone on the south side of the old well.' },
      { speaker: 'Village Elder', text: 'Night has fallen over the steppe. Go to the well, lift the stone, and take custody of the page.' }
    ],
    chapter5_prompt: [
      { speaker: 'Village Elder', text: 'Have you retrieved the page from beneath the stone by the well? Go with haste, darkness has already settled over the village.' }
    ],
    chapter5_shock: [
      { speaker: 'Village Elder', text: 'What?! The stone was moved and the oilcloth torn?!' },
      { speaker: 'Village Elder', text: 'Someone watched me hide it! Search around the well and the archive immediately!' }
    ],
    chapter6_start: [
      { speaker: 'Village Elder', text: 'The truth is laid bare. The Archivist acted out of terror, but his heart was true.' },
      { speaker: 'Village Elder', text: 'Now the sacred roster of twelve copyists is in your hands, young scholar.' },
      { speaker: 'Village Elder', text: 'Choose its destiny. Whatever you decide, we will honor your wisdom.' }
    ]
  },

  teacher: {
    greeting: [
      { speaker: 'Teacher', text: 'Greetings! I teach the children here. It is humble work, but Abai believed education shapes the nation.' },
      { speaker: 'Teacher', text: 'The Alash movement — enlightenment, culture, language. These ideals live in every page we preserve.' }
    ],
    questHint: [
      { speaker: 'Teacher', text: 'Look carefully near the carts and along the beaten trails. Papers catch in the scrub.' }
    ],
    chapter1_ask: [
      { speaker: 'Teacher', text: 'A missing page? That is alarming. I noticed unusual agitation in the village yesterday.' }
    ],
    chapter2_interview: {
      intro: [
        { speaker: 'Teacher', text: 'I want to help. The school and our books are everything to me.' }
      ],
      choices: [
        {
          id: 'teacher_ask_rumors',
          text: '"What rumors have you heard from the surrounding auls?"',
          trust: 10,
          reply: [
            { speaker: 'Teacher', text: 'Inspectors have been searching schools in Karkaraly. They are looking for handwritten copies of nationalist poetry.' },
            { speaker: 'Teacher', text: 'If they find names of the scribes, dozens of families will suffer.' }
          ]
        },
        {
          id: 'teacher_ask_ink',
          text: '"What can you tell me about the ink used on these manuscripts?"',
          trust: 10,
          reply: [
            { speaker: 'Teacher', text: 'It is a distinctive violet lampblack ink mixed with walnut oil. Only master copyists who studied in Semey used it.' },
            { speaker: 'Teacher', text: 'I keep a bottle on my veranda for cataloguing. The writer of the manuscript was trained by the same masters.' }
          ]
        },
        {
          id: 'teacher_ask_nervous',
          text: '"Why are you so frightened? Are you hiding something?"',
          trust: -5,
          reply: [
            { speaker: 'Teacher', text: 'Frightened? Of course I am frightened! If the authorities suspect us, my school will be boarded up!' },
            { speaker: 'Teacher', text: 'The children’s future is at stake. That is not guilt — that is responsibility.' }
          ]
        }
      ]
    },
    chapter3_start: [
      { speaker: 'Teacher', text: 'Search around the village carefully. There are clues near the old cart and by the well.' },
      { speaker: 'Teacher', text: 'Use the Case File (TAB) to link what you find. Every scrap of handwriting has a story.' }
    ]
  },

  archivist: {
    greeting: [
      { speaker: 'Archivist', text: 'Welcome to the archive. These shelves hold precious writings of our people.' },
      { speaker: 'Archivist', text: 'Paper is fragile. Fire, damp, and fear can destroy centuries of wisdom in a single heartbeat.' }
    ],
    questHint: [
      { speaker: 'Archivist', text: 'The manuscript fragments are small. Search near the fences and village trees.' }
    ],
    chapter1_start: [
      { speaker: 'Archivist', text: 'The manuscript is incomplete. Two pages were scattered near the village square... but the final page is gone.' },
      { speaker: 'Archivist', text: 'Look at the binding: the thread was severed cleanly. Someone removed it with purpose. Find the scattered folios first!' }
    ],
    chapter1_missing: [
      { speaker: 'Archivist', text: 'You found the two folios, and this ragged corner. Look closely: the page was sliced out with a quill knife.' },
      { speaker: 'Archivist', text: 'This was no accident of the steppe wind. Someone took it. Question the villagers. Find out why!' }
    ],
    chapter2_start: [
      { speaker: 'Archivist', text: 'You wish to question me? Speak, but remember that silence is sometimes the only shield we have.' }
    ],
    chapter2_interview: {
      intro: [
        { speaker: 'Archivist', text: 'I have spent my life guarding these shelves. What do you want to know?' }
      ],
      choices: [
        {
          id: 'arch_ask_seal',
          text: '"The wax seal at your door was pried open with a key, not smashed."',
          trust: 15,
          reply: [
            { speaker: 'Archivist', text: '...You have the keen eyes of a true scholar. Yes. The seal was opened from the inside with the master key.' },
            { speaker: 'Archivist', text: 'I dared not speak of it openly. Panic would bring inspectors down upon us like vultures.' }
          ]
        },
        {
          id: 'arch_ask_danger',
          text: '"Why would anyone steal this particular page?"',
          trust: 10,
          reply: [
            { speaker: 'Archivist', text: 'Because verses can be recited from memory, but a list of names written in violet ink is an arrest warrant.' },
            { speaker: 'Archivist', text: 'Whoever took it knew that living men were in mortal danger.' }
          ]
        },
        {
          id: 'arch_ask_hostile',
          text: '"You are concealing evidence. Are you trying to protect a thief?"',
          trust: -10,
          reply: [
            { speaker: 'Archivist', text: 'A thief steals for profit. If a man risks Siberia to save his brethren, what word would you use?' },
            { speaker: 'Archivist', text: 'Be careful how you judge things you do not yet understand.' }
          ]
        }
      ]
    },
    puzzleOffer: [
      { speaker: 'Archivist', text: 'Before you continue your search, could you help me organize the reference catalog?' },
      { speaker: 'Archivist', text: 'Matching the historical concepts will bring clarity to what we are trying to preserve.' }
    ],
    puzzleDone: [
      { speaker: 'Archivist', text: 'Exquisite work! Murseyit, Abai, Alash — you truly understand what we are fighting for.' },
      { speaker: 'Archivist', text: 'Take this knowledge into your investigation. It will serve you well.' }
    ],
    chapter5_busy: [
      { speaker: 'Archivist', text: 'I... I am completing an urgent inventory of the archives before the night carriage arrives. Please leave me be for a moment!' }
    ],
    chapter5_confront: [
      { speaker: 'Archivist', text: 'You found my traveling valise?! Please, lower your voice!' },
      { speaker: 'Archivist', text: 'I saw the Elder hide the page under the well stone at dawn. But the well is where everyone in the village gathers!' },
      { speaker: 'Archivist', text: 'If a single soldier kicks that stone, all twelve copyists will hang!' },
      { speaker: 'Archivist', text: 'I took it to put it in my travel chest. I booked the dawn carriage to Semey to deliver it directly to the Alash committee!' },
      { speaker: 'Archivist', text: 'Here — take it! The page is intact. You decide what must be done!' }
    ]
  }
};

export const INTERVIEW_CHOICES = {
  elder: DIALOGUE.elder.chapter2_interview,
  teacher: DIALOGUE.teacher.chapter2_interview,
  archivist: DIALOGUE.archivist.chapter2_interview
};