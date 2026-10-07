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
        { speaker: 'Village Elder', text: 'Ask your questions, young scholar. I will tell you what I can.' }
      ],
      choices: [
        { id: 'elder_ask_all', text: '"Tell me everything you saw."', trust: 5, reply: [
          { speaker: 'Village Elder', text: 'I was walking back from the well at sunset. A figure in a long coat entered the archive. They were carrying something — papers, perhaps.' },
          { speaker: 'Village Elder', text: 'I did not see their face. But they moved with purpose, not like a thief.' }
        ]},
        { id: 'elder_ask_access', text: '"Who had access to the archive?"', trust: 5, reply: [
          { speaker: 'Village Elder', text: 'Only a few people. The Archivist, of course. The Teacher sometimes helps catalogue materials. And I have an old key, though I rarely use it.' },
          { speaker: 'Village Elder', text: 'But anyone determined could find a way in. These buildings are not fortresses.' }
        ]},
        { id: 'elder_ask_trust', text: '"Why should I believe you?"', trust: -10, reply: [
          { speaker: 'Village Elder', text: 'I have lived in this village for sixty years. I have nothing to hide — but I understand your caution.' },
          { speaker: 'Village Elder', text: 'In times like these, trust is a fragile thing. I do not blame you for doubting.' }
        ]}
      ]
    },
    chapter4_start: [
      { speaker: 'Village Elder', text: 'You have gathered much evidence. But there is one place you have not searched — the archive at night.' },
      { speaker: 'Village Elder', text: 'Wait until evening. Go to the archive. I believe you will find what you are looking for.' }
    ],
    chapter5_start: [
      { speaker: 'Village Elder', text: 'Now you understand. The manuscript was hidden — not stolen. Someone was trying to protect Abai\'s words from those who would destroy them.' },
      { speaker: 'Village Elder', text: 'But now you must decide. What you do next will determine the fate of these pages.' }
    ]
  },

  teacher: {
    greeting: [
      { speaker: 'Teacher', text: 'Greetings! I teach the children here. It is humble work, but Abai believed a teacher shapes the future of a nation.' },
      { speaker: 'Teacher', text: 'The Alash movement — education, culture, national identity. These ideas live in every page we preserve.' }
    ],
    questHint: [
      { speaker: 'Teacher', text: 'I saw something glinting near the trees yesterday. And near the village square — many people pass through. Check everywhere.' }
    ],
    chapter1_ask: [
      { speaker: 'Teacher', text: 'A missing page? That is... concerning. I thought I heard something last night.' },
      { speaker: 'Teacher', text: 'An argument, I think. Near the archive. Two voices. I could not make out the words.' }
    ],
    chapter2_interview: {
      intro: [
        { speaker: 'Teacher', text: 'I want to help. Ask me anything.' }
      ],
      choices: [
        { id: 'teacher_ask_all', text: '"Tell me what you heard."', trust: 5, reply: [
          { speaker: 'Teacher', text: 'It was after dark. Two people arguing. One voice was older, calmer. The other was agitated. I heard the word "manuscript" clearly.' },
          { speaker: 'Teacher', text: 'I was afraid to go closer. I regret that now.' }
        ]},
        { id: 'teacher_ask_access', text: '"Who would want to harm the manuscript?"', trust: 5, reply: [
          { speaker: 'Teacher', text: 'Not harm — protect. There has been talk of outsiders who want to confiscate our writings. Some say we should hide everything.' },
          { speaker: 'Teacher', text: 'The Archivist has been especially worried. He barely sleeps.' }
        ]},
        { id: 'teacher_ask_trust', text: '"Why are you so nervous?"', trust: -5, reply: [
          { speaker: 'Teacher', text: 'I... I am not nervous. I am concerned. There is a difference.' },
          { speaker: 'Teacher', text: 'But yes, I am afraid. If the authorities find out we are hiding materials, the school could be closed.' }
        ]}
      ]
    },
    chapter3_start: [
      { speaker: 'Teacher', text: 'Look around the village carefully. There may be evidence others have overlooked. Check near the archive, the well, the old cart.' },
      { speaker: 'Teacher', text: 'And if you find anything in writing — bring it to me. Handwriting can tell us much.' }
    ]
  },

  archivist: {
    greeting: [
      { speaker: 'Archivist', text: 'Welcome to the archive. These shelves hold some of the most precious writings in the region.' },
      { speaker: 'Archivist', text: 'Paper is fragile. A spark, a little water — and an entire world of knowledge can disappear. I protect what I can.' }
    ],
    questHint: [
      { speaker: 'Archivist', text: 'The missing pages are small pieces of aged paper. Look near buildings, under trees. When you find them, return to me.' }
    ],
    chapter1_start: [
      { speaker: 'Archivist', text: 'The manuscript is incomplete. Two pages remain... but the final page is gone. Not lost — removed.' },
      { speaker: 'Archivist', text: 'Look at the binding. The tear is fresh. Someone did this deliberately. Find the other pages first — then we will investigate.' }
    ],
    chapter1_missing: [
      { speaker: 'Archivist', text: 'The third page... it is not here. Instead, you find a torn corner. Someone removed this page recently.' },
      { speaker: 'Archivist', text: 'This is no accident. We must find out what happened. Speak with the others. Someone knows something.' }
    ],
    chapter2_start: [
      { speaker: 'Archivist', text: 'You want to ask about the missing page? Fine. But I have already told you — I know nothing.' },
      { speaker: 'Archivist', text: 'Or rather... I know nothing I can share. Some things are better left unsaid.' }
    ],
    chapter2_interview: {
      intro: [
        { speaker: 'Archivist', text: 'Make it quick. I have work to do.' }
      ],
      choices: [
        { id: 'arch_ask_all', text: '"Tell me what really happened."', trust: -5, reply: [
          { speaker: 'Archivist', text: 'I told you — nobody entered the archive. The seal was intact. The pages were all accounted for. Until they were not.' },
          { speaker: 'Archivist', text: 'But... the seal. I checked it this morning and it was... fine. I am certain of it.' }
        ]},
        { id: 'arch_ask_access', text: '"The seal was broken. You know that."', trust: 10, reply: [
          { speaker: 'Archivist', text: '...You noticed. Yes. The seal was broken. I did not want to admit it.' },
          { speaker: 'Archivist', text: 'I feared that if people knew, they would panic. Or worse — come looking for other materials to destroy.' }
        ]},
        { id: 'arch_ask_trust', text: '"You are hiding something."', trust: -10, reply: [
          { speaker: 'Archivist', text: 'Perhaps I am. And perhaps I have good reason. Not every truth is safe to speak aloud.' },
          { speaker: 'Archivist', text: 'But if you truly care about preserving these words, you will understand.' }
        ]}
      ]
    },
    chapter4_archive: [
      { speaker: 'Archivist', text: 'You came back. Good. There is something I need to show you.' },
      { speaker: 'Archivist', text: 'I found this letter hidden behind a loose brick. It was meant for me — but I never received it.' },
      { speaker: 'Archivist', text: '"The manuscript must not fall into the wrong hands." Someone was trying to warn me. Someone was trying to help.' }
    ]
  }
};

// Investigation choices for each NPC in Chapter 2
export const INTERVIEW_CHOICES = {
  elder: DIALOGUE.elder.chapter2_interview,
  teacher: DIALOGUE.teacher.chapter2_interview,
  archivist: DIALOGUE.archivist.chapter2_interview
};