/**
 * chatbotData.js — Shared knowledge base for FAQ, Rule Book, and Chatbot.
 * Single source of truth for all GTR 2026 event information.
 */

export const EVENT_INFO = {
  name: 'Grand Tech Racing (GTR) 2026',
  tagline: 'The Ultimate IoT & Robotics Racing Showdown',
  date: 'May 17–18, 2026',
  venue: 'Main Auditorium & Robotics Lab, MSIT Campus',
  organizer: 'IoT & Robotics Club, MSIT',
  registrationLink: 'https://unstop.com/o/1mBACUO?lb=PTE7q0Dz&utm_medium=Share&utm_source=ctazqbso53950&utm_campaign=Competitions',
  teamSize: '2–4 members',
  entryFee: '₹200 per team',
  prizePool: '₹15,000+',
}

export const FAQ_DATA = [
  {
    category: 'General',
    items: [
      {
        q: 'What is GTR 2026?',
        a: 'Grand Tech Racing (GTR) 2026 is the flagship robotics racing competition organized by the IoT & Robotics Club of MSIT. Teams design, build, and race autonomous or remote-controlled cars through challenging tracks.',
        keywords: ['what', 'gtr', 'about', 'event', 'competition']
      },
      {
        q: 'When and where is the event?',
        a: `GTR 2026 takes place on ${EVENT_INFO.date} at the ${EVENT_INFO.venue}.`,
        keywords: ['when', 'where', 'date', 'venue', 'location', 'time']
      },
      {
        q: 'How do I register?',
        a: 'Register your team on Unstop via our official registration link. Click the "Register Now" button on this page or visit the link directly. Registration closes 3 days before the event.',
        keywords: ['register', 'sign up', 'join', 'how', 'registration', 'apply']
      },
      {
        q: 'What is the entry fee?',
        a: `The entry fee is ${EVENT_INFO.entryFee}. Payment is made during registration on Unstop.`,
        keywords: ['fee', 'cost', 'price', 'pay', 'charge', 'money']
      },
    ]
  },
  {
    category: 'Teams & Eligibility',
    items: [
      {
        q: 'What is the team size?',
        a: `Each team must have ${EVENT_INFO.teamSize}. All members must be currently enrolled undergraduate or postgraduate students.`,
        keywords: ['team', 'size', 'members', 'people', 'group', 'how many']
      },
      {
        q: 'Can I participate individually?',
        a: 'No, GTR 2026 is a team event. You need at least 2 members to register. You can find teammates in our Discord server or college groups.',
        keywords: ['individual', 'solo', 'alone', 'single', 'one person']
      },
      {
        q: 'Are cross-college teams allowed?',
        a: 'Yes! Cross-college teams are allowed and encouraged. All members must be valid college students with a valid ID.',
        keywords: ['cross', 'college', 'university', 'different', 'inter']
      },
    ]
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'What type of cars are allowed?',
        a: 'Both remote-controlled (RC) and autonomous cars are allowed. Cars must fit within 30cm × 25cm × 20cm dimensions and weigh under 2kg. No commercial pre-built RC cars — the chassis must be custom-built or significantly modified.',
        keywords: ['car', 'type', 'allowed', 'vehicle', 'bot', 'robot', 'specs', 'specification']
      },
      {
        q: 'What power source can I use?',
        a: 'Battery-powered cars only (max 12V). No combustion engines or external power supplies. LiPo, Li-ion, and NiMH batteries are all acceptable. Batteries must be safely enclosed within the chassis.',
        keywords: ['power', 'battery', 'voltage', 'source', 'energy', 'lipo']
      },
      {
        q: 'Are there any banned components?',
        a: 'Yes — no sharp edges or exposed blades, no flammable liquids, no components exceeding 12V, no wireless frequency jammers, and no pre-built commercial RC cars used as-is.',
        keywords: ['banned', 'prohibited', 'not allowed', 'forbidden', 'restricted']
      },
    ]
  },
  {
    category: 'Race Day',
    items: [
      {
        q: 'What does the track look like?',
        a: 'The track features straight sections, sharp turns, ramps, elevation changes, and obstacle zones. The exact layout is revealed on race day. Track surface is smooth plywood with painted lane markings.',
        keywords: ['track', 'course', 'layout', 'terrain', 'obstacle']
      },
      {
        q: 'How is scoring calculated?',
        a: 'Scoring is based on: Lap Time (50%), Obstacle Completion (25%), Design & Innovation (15%), and Sportsmanship (10%). Fastest lap time wins tiebreakers.',
        keywords: ['score', 'scoring', 'points', 'judging', 'criteria', 'how', 'calculated', 'win']
      },
      {
        q: 'What are the prizes?',
        a: `Total prize pool is ${EVENT_INFO.prizePool}. 1st Place: ₹7,000 + Trophy, 2nd Place: ₹5,000 + Trophy, 3rd Place: ₹3,000 + Certificate. All participants receive participation certificates.`,
        keywords: ['prize', 'reward', 'win', 'winner', 'money', 'trophy', 'certificate']
      },
    ]
  }
]

export const RULEBOOK_SECTIONS = [
  {
    id: 'overview',
    title: 'Event Overview',
    icon: '🏁',
    content: [
      `**${EVENT_INFO.name}** is a competitive robotics racing event where engineering students design, build, and race custom vehicles through a challenging obstacle course.`,
      `**Date:** ${EVENT_INFO.date}`,
      `**Venue:** ${EVENT_INFO.venue}`,
      `**Organized by:** ${EVENT_INFO.organizer}`,
      `The competition tests participants' skills in mechanical design, electronics, programming, and real-time problem solving.`
    ]
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Registration',
    icon: '📋',
    content: [
      `**Team Size:** ${EVENT_INFO.teamSize}`,
      '**Eligibility:** All currently enrolled undergraduate and postgraduate students from any recognized institution.',
      `**Entry Fee:** ${EVENT_INFO.entryFee} (non-refundable)`,
      '**Registration:** Via Unstop platform only. Walk-in registrations will NOT be accepted.',
      '**Deadline:** Registration closes 72 hours before the event.',
      '**Cross-college teams** are welcome. Each member must carry a valid college ID on race day.',
      'A team can register only ONE car per entry.'
    ]
  },
  {
    id: 'car-specs',
    title: 'Car Specifications',
    icon: '🔧',
    content: [
      '**Maximum Dimensions:** 30cm (L) × 25cm (W) × 20cm (H)',
      '**Maximum Weight:** 2 kg (including batteries)',
      '**Power:** Battery-only, maximum 12V. LiPo, Li-ion, NiMH acceptable.',
      '**Control:** Remote-controlled (RF / Bluetooth / Wi-Fi) OR autonomous. Wired control is NOT allowed.',
      '**Chassis:** Must be custom-built or significantly modified. Pre-built commercial RC cars used as-is are disqualified.',
      '**Safety:** No sharp edges, no exposed wiring, no flammable materials. Batteries must be enclosed.',
      '**Kill Switch:** Every car MUST have an easily accessible power kill switch.',
    ]
  },
  {
    id: 'race-rules',
    title: 'Race Rules',
    icon: '🏎️',
    content: [
      '**Format:** Time-trial. Each team gets 2 attempts; best time counts.',
      '**Lap:** One complete run from start to finish through all track sections.',
      '**Time Limit:** Maximum 5 minutes per attempt.',
      '**Restarts:** If your car stalls, you may restart from the last checkpoint (10-second penalty per restart).',
      '**Track Boundaries:** Cars going off-track must be placed back at the point of departure (5-second penalty).',
      '**Obstacles:** Cars must attempt all obstacles. Skipping an obstacle results in a 15-second penalty.',
      '**Interference:** Intentionally interfering with another team\'s car or equipment results in immediate disqualification.',
      '**Autonomous Bonus:** Cars running autonomously (no human input during the race) receive a 20% time bonus.',
    ]
  },
  {
    id: 'scoring',
    title: 'Scoring System',
    icon: '📊',
    content: [
      '**Lap Time: 50%** — Fastest completion time from start to finish.',
      '**Obstacle Completion: 25%** — Successfully navigating all track obstacles.',
      '**Design & Innovation: 15%** — Judged by a panel based on engineering quality, creativity, and robustness.',
      '**Sportsmanship: 10%** — Fair play, team coordination, and conduct.',
      '**Tiebreaker:** In case of equal scores, the fastest individual lap time wins.',
      '**Bonus:** Autonomous cars get a 20% time reduction applied to their lap score.',
    ]
  },
  {
    id: 'conduct',
    title: 'Code of Conduct',
    icon: '⚖️',
    content: [
      'All participants must behave respectfully toward organizers, judges, and fellow competitors.',
      'Any form of sabotage, cheating, or unsportsmanlike conduct will result in immediate disqualification.',
      'Judges\' decisions are FINAL and binding.',
      'Teams must clean up their workspace after the event.',
      'The organizing committee reserves the right to modify rules. Any changes will be communicated at least 24 hours in advance.',
      'By registering, all participants agree to these terms and conditions.',
    ]
  }
]

/**
 * Chatbot Q&A engine — keyword matching with fuzzy tolerance.
 * Searches all FAQ items for the best match.
 */
export function findAnswer(query) {
  const q = query.toLowerCase().trim()
  if (!q || q.length < 2) return null

  const allItems = FAQ_DATA.flatMap(cat => cat.items)
  
  // Score each item by keyword match count
  let bestMatch = null
  let bestScore = 0

  for (const item of allItems) {
    let score = 0
    const words = q.split(/\s+/)
    
    for (const keyword of item.keywords) {
      for (const word of words) {
        if (word.length < 2) continue
        // Exact keyword match
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 2
        }
      }
    }
    
    // Also check question text
    const qLower = item.q.toLowerCase()
    for (const word of words) {
      if (word.length < 2) continue
      if (qLower.includes(word)) {
        score += 1
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = item
    }
  }

  return bestScore >= 2 ? bestMatch : null
}

export const QUICK_REPLIES = [
  'What is GTR 2026?',
  'How do I register?',
  'What are the car specs?',
  'What are the prizes?',
  'When is the event?',
  'How is scoring done?',
]

export const GREETING_MESSAGE = "Hey there! 👋 I'm the GTR 2026 assistant. Ask me anything about the event, rules, registration, or car specifications!"

export const FALLBACK_MESSAGE = "Hmm, I'm not sure about that one. Try checking the **FAQ** or **Rule Book** for more details, or rephrase your question!"
