/**
 * Master Phone State Schema (Firebase Firestore & Cloudflare R2 Ready)
 *
 * Collections map directly to Firestore document collections:
 *  - notes          -> firestore.collection('notes')
 *  - smsThreads     -> firestore.collection('smsThreads')
 *  - whatsappChats  -> firestore.collection('whatsappChats')
 *  - tracks         -> firestore.collection('tracks')
 *  - contacts       -> firestore.collection('contacts')
 *  - galleryMedia   -> firestore.collection('galleryMedia') + R2 object keys
 *  - voiceNotes     -> firestore.collection('voiceNotes')   + R2 object keys
 */

export const initialPhoneState = {
  schemaVersion: '1.0.0-firebase-r2',
  backendTargets: {
    firestoreProject: 'pov-artist-phone-prod',
    r2AccountEndpoint: 'https://r2-media.pov-vault.workers.dev',
    r2Buckets: {
      media: 'pov-media-raw',
      audio: 'pov-acapellas',
    },
  },
  adminConfig: {
    pin: '2026',
    ownerHandle: 'RAO_SAAB_POV',
    deviceLabel: 'Titanium Glass-Link 16 Pro',
  },
  deviceMeta: {
    carrier: 'JIO 5G',
    batteryPercent: 84,
    locationTag: 'Gurugram / Sector 29',
  },

  // 1. GALLERY (Authentic, unedited candid photography & raw video clips)
  galleryMedia: [
    {
      id: 'gal-1',
      type: 'image',
      scene: 'rooftop-chai',
      filename: 'IMG_4821.JPG',
      caption: '6:14 AM terrace fog after writing verse 2. Zero color grade.',
      timestamp: 'Today, 6:14 AM',
      cameraMeta: '24mm · f/1.78 · ISO 640 · 1/60s',
      location: 'Rohini Sector 11, Delhi',
      r2Bucket: 'pov-media-raw',
      r2Key: 'camera-roll/2026/11/IMG_4821.JPG',
      publicUrl: 'r2://pov-media-raw/camera-roll/2026/11/IMG_4821.JPG',
    },
    {
      id: 'gal-2',
      type: 'video',
      scene: 'booth-mic-check',
      filename: 'VID_0914.MOV',
      duration: '0:18',
      durationSec: 18,
      caption: 'Raw handheld clip inside vocal booth — U87 pop filter slightly crooked.',
      timestamp: 'Yesterday, 11:48 PM',
      cameraMeta: '1080p · 60fps · Raw Stereo',
      location: 'Gully Basement Studio, GGN',
      r2Bucket: 'pov-media-raw',
      r2Key: 'camera-roll/2026/11/VID_0914.MOV',
      publicUrl: 'r2://pov-media-raw/camera-roll/2026/11/VID_0914.MOV',
    },
    {
      id: 'gal-3',
      type: 'image',
      scene: 'highway-scorpio',
      filename: 'IMG_4809.JPG',
      caption: 'NH-48 toll fog lights through dusty windshield.',
      timestamp: 'Nov 13, 2:09 AM',
      cameraMeta: '35mm · f/2.0 · ISO 1600 · 1/30s',
      location: 'NH-48 Kherki Daula',
      r2Bucket: 'pov-media-raw',
      r2Key: 'camera-roll/2026/11/IMG_4809.JPG',
      publicUrl: 'r2://pov-media-raw/camera-roll/2026/11/IMG_4809.JPG',
    },
    {
      id: 'gal-4',
      type: 'image',
      scene: 'studio-desk-mess',
      filename: 'IMG_4792.JPG',
      caption: 'XLR cable tangle, half-empty Parle-G, and MPC pads.',
      timestamp: 'Nov 12, 4:22 PM',
      cameraMeta: '26mm · f/1.8 · ISO 400 · 1/120s',
      location: 'Studio Room B',
      r2Bucket: 'pov-media-raw',
      r2Key: 'camera-roll/2026/11/IMG_4792.JPG',
      publicUrl: 'r2://pov-media-raw/camera-roll/2026/11/IMG_4792.JPG',
    },
    {
      id: 'gal-5',
      type: 'video',
      scene: 'tubewell-evening',
      filename: 'VID_0887.MOV',
      duration: '0:24',
      durationSec: 24,
      caption: 'Mustard fields near Jhajjar right before dusk — testing hook cadence.',
      timestamp: 'Nov 10, 5:39 PM',
      cameraMeta: '4K · 24fps · Natural Light',
      location: 'Jhajjar Road, Haryana',
      r2Bucket: 'pov-media-raw',
      r2Key: 'camera-roll/2026/11/VID_0887.MOV',
      publicUrl: 'r2://pov-media-raw/camera-roll/2026/11/VID_0887.MOV',
    },
    {
      id: 'gal-6',
      type: 'image',
      scene: 'notebook-ink',
      filename: 'IMG_4755.JPG',
      caption: 'Ballpoint bar breakdowns on ruled register page.',
      timestamp: 'Nov 08, 9:15 PM',
      cameraMeta: '48mm · f/2.2 · ISO 500 · 1/80s',
      location: 'Home Desk',
      r2Bucket: 'pov-media-raw',
      r2Key: 'camera-roll/2026/11/IMG_4755.JPG',
      publicUrl: 'r2://pov-media-raw/camera-roll/2026/11/IMG_4755.JPG',
    },
  ],

  // 2. NOTES (Unreleased Haryanvi & Khariboli rap lyrics with multi-syllable rhyme schemes)
  notes: [
    {
      id: 'note-1',
      title: 'KHARIBOLI KARTUS (Verse 1 - Unreleased)',
      dialect: 'Khariboli / Haryanvi',
      bpm: 138,
      updatedAt: 'Today, 4:12 AM',
      pinned: true,
      rhymeTokens: ['a-chhaati', 'a-raati', 'a-maati', 'b-kharcha', 'b-parcha', 'b-charcha', 'c-sauda', 'c-pauda'],
      body: `[BPM 138 | Dark Desi 808 | No Hook Yet]

Khetan ki mitti mein paale iraadey, yeh kachhe makaan bhi pakke si chhaati,
Bairan ke shehar mein charcha barabar, hum ginti na rakhte yeh chhoti si zaati.
Kaali si gaadi ke sheeshe utaar ke, raahon pe chhod gaye dhool aur maati,
Chaaron dishaon mein goonje dhamaka jab bairi ke ghar mein utarti hai raati.

Bol mere teekhe hain goli ki naali se, tol ke fekoon main alfaaz ka kharcha,
Thaanedaar baithe hain daftar mein soch ke, kis-kis naam pe kaatein yeh parcha.
Mausam badalta hai lehje ke saath, yahan zikr bhi hota hai sangeen charcha,
Chaudhar purani hai khoon ke andar, na banta yeh rutba kisi ke bhi karza.

Dekh ke chaal yeh sehme si bheed, hum beech sadak pe lagate hain morcha,
Kalam ke aage na tikta barood, jab shabdon ka chalta hai seedha sa sauda,
Haath mein tasbeeh na jhoothe bahaane, jahan gaad dein jhanda wahin uge pauda!`,
      rhymeNotes: 'Multi-syllables: "pakke si chhaati / chhoti si zaati / dhool aur maati / utarti hai raati" (4-syllable internal + end cadence) | "alfaaz ka kharcha / kaatein yeh parcha / sangeen charcha"',
    },
    {
      id: 'note-2',
      title: 'DESI TUNGSTEN (Hook + 16 Bars)',
      dialect: 'Haryanvi',
      bpm: 94,
      updatedAt: 'Yesterday, 11:20 PM',
      pinned: true,
      rhymeTokens: [],
      body: `[BPM 94 | Half-time Boom Bap / Drill Flip]

Hook:
Laathi te bhaari zabaan meri chhore, na maange safai na jhukti yeh dhaun,
Chaudhar ke kisse sunaave zamana, par asal mein baithe yahan ginti ke kaun?

Verse:
Bhiwani te leke Gurugram Border, har naake pe naam ki goonje dastak,
Chhori bhi pooche ke likhta hai kya tu, jo kaagaz pe utre toh hille yeh mastak.
Aankhan mein suraj ki garmi bhari hai, par lehja baraf sa rakhe hum thanda,
Kismat ke taale toh khud hi tode, na maanga kisi te bhi bheekh ka chanda.

Baap ki pagdi pe daag na aave, is khatir hi raaton ko jaag ke kheencha,
Paani bhi meetha lage tubewell ka, jab pasine se apna bagicha hai seencha.
Sone ke chain-on ki bhookh nahi manney, bas microphone aage na kaampe yeh seena,
Jitne bhi nakli banaye the raste, un sab pe chala di hai pathar ki meena.`,
      rhymeNotes: 'Internal assonance: "dastak / mastak", "thanda / chanda", "kheencha / seencha", "seena / meena" with alternating alveolar stops.',
    },
    {
      id: 'note-3',
      title: 'MEERUT EXPRESSWAY (Freestyle Draft)',
      dialect: 'Khariboli',
      bpm: 126,
      updatedAt: 'Nov 12, 2:55 AM',
      pinned: false,
      rhymeTokens: [],
      body: `[One-take kitchen table draft]

Nalke ka paani aur lohe ka chulha, wahin se nikalke yeh gaadi chalayi,
Shehar ke chhoron ko lagti kahani, humne toh aankhon se dekhi ladai.
Likhne ki aadat hai bachpan se gahri, har panne pe chhoda hai gehra nishaan,
Chalti hai gaddi toh kaanpein yeh puliya, jaise barasta ho chhat pe toofan.

Chaar guna tez hai soch ka pahiya, na rukta yeh highway ke toll ke paas,
Jitne bhi baithe the ginte sikke, un sab ko dikha di aukaat aur raas.`,
      rhymeNotes: 'Compound multi: "gaadi chalayi / dekhi ladai", "gehra nishaan / chhat pe toofan".',
    },
    {
      id: 'note-4',
      title: 'STUDIO GEAR & MIX CHECKLIST',
      dialect: 'Notes',
      bpm: null,
      updatedAt: 'Nov 09, 6:10 PM',
      pinned: false,
      rhymeTokens: [],
      body: `- Cut 220Hz mud on vocal bus by -2.5dB (too boxy in Rohini room)
- Ask Mxrci for stem bounce without limiter on master
- Fix Havells trimmer charger pin before shoot on Sunday
- Double check GATI ISRC codes before Spotify pitch deadline`,
      rhymeNotes: 'Engineering & release reminders',
    },
  ],

  // 3. MUSIC (Tracks with inline Spotify, Apple Music & YouTube link buttons)
  tracks: [
    {
      id: 'trk-1',
      title: 'KHARIBOLI KARTUS (Demo v3)',
      artist: 'Rao Saab × Mxrci',
      album: 'Zameen Se (Unreleased)',
      duration: '2:54',
      bpm: 138,
      key: 'F# Minor',
      explicit: true,
      coverHue: 'from-amber-600/80 via-stone-900 to-black',
      spotifyUrl: 'https://open.spotify.com/search/Khariboli%20Kartus',
      appleMusicUrl: 'https://music.apple.com/us/search?term=Khariboli%20Kartus',
      youtubeUrl: 'https://www.youtube.com/results?search_query=Haryanvi+Rap+Type+Beat',
      synthTempo: 138,
      synthRoot: 92.5, // F#2
    },
    {
      id: 'trk-2',
      title: 'TUBEWELL TO TERMINAL',
      artist: 'Rao Saab',
      album: 'Sector 29 Tapes',
      duration: '3:18',
      bpm: 94,
      key: 'C Minor',
      explicit: true,
      coverHue: 'from-emerald-700/75 via-zinc-900 to-black',
      spotifyUrl: 'https://open.spotify.com/search/Haryanvi%20Hip%20Hop',
      appleMusicUrl: 'https://music.apple.com/us/search?term=Haryanvi%20Hip%20Hop',
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tubewell+To+Terminal',
      synthTempo: 94,
      synthRoot: 65.41, // C2
    },
    {
      id: 'trk-3',
      title: 'CHAUDHAR KA PARCHA',
      artist: 'Rao Saab ft. Kaka Ji',
      album: 'Single · 2026',
      duration: '2:41',
      bpm: 142,
      key: 'D Minor',
      explicit: true,
      coverHue: 'from-red-700/75 via-neutral-900 to-black',
      spotifyUrl: 'https://open.spotify.com/search/Chaudhar%20Rap',
      appleMusicUrl: 'https://music.apple.com/us/search?term=Chaudhar%20Rap',
      youtubeUrl: 'https://www.youtube.com/results?search_query=Chaudhar+Ka+Parcha',
      synthTempo: 142,
      synthRoot: 73.42, // D2
    },
    {
      id: 'trk-4',
      title: 'NH-48 MIDNIGHT',
      artist: 'Rao Saab',
      album: 'Late Night Vault',
      duration: '3:06',
      bpm: 118,
      key: 'G Minor',
      explicit: false,
      coverHue: 'from-sky-700/75 via-slate-900 to-black',
      spotifyUrl: 'https://open.spotify.com/search/Desi%20Hip%20Hop%20Night%20Drive',
      appleMusicUrl: 'https://music.apple.com/us/search?term=Desi%20Hip%20Hop',
      youtubeUrl: 'https://www.youtube.com/results?search_query=NH48+Midnight+Desi+Rap',
      synthTempo: 118,
      synthRoot: 98.0, // G2
    },
    {
      id: 'trk-5',
      title: 'MAATI KI SAUGANDH (Outro)',
      artist: 'Rao Saab',
      album: 'Zameen Se (Unreleased)',
      duration: '3:44',
      bpm: 86,
      key: 'A Minor',
      explicit: false,
      coverHue: 'from-violet-700/75 via-zinc-950 to-black',
      spotifyUrl: 'https://open.spotify.com/search/Desi%20Rap%20Outro',
      appleMusicUrl: 'https://music.apple.com/us/search?term=Desi%20Rap%20Outro',
      youtubeUrl: 'https://www.youtube.com/results?search_query=Desi+Rap+Acoustic+Outro',
      synthTempo: 86,
      synthRoot: 110.0, // A2
    },
  ],

  // 4. VOICE RECORDER (Raw studio acapellas & voice notes with waveform)
  voiceNotes: [
    {
      id: 'vn-1',
      title: 'Khariboli 16-Bar Raw Acapella (Booth Take 4)',
      tag: 'ACAPELLA · DRY VOCAL',
      recordedAt: 'Today, 2:19 AM',
      durationSec: 28,
      durationLabel: '0:28',
      location: 'Rohini Sector 11 Booth',
      r2Bucket: 'pov-acapellas',
      r2Key: 'acapellas/2026/khariboli-16bar-take4.wav',
      publicUrl: 'r2://pov-acapellas/acapellas/2026/khariboli-16bar-take4.wav',
      cadenceBpm: 138,
      waveform: [18, 34, 62, 78, 45, 86, 92, 54, 30, 74, 88, 95, 68, 42, 79, 91, 65, 38, 84, 96, 72, 49, 26, 61, 88, 76, 44, 82, 90, 57, 33, 71, 85, 60, 29, 48],
    },
    {
      id: 'vn-2',
      title: 'Tubewell Hook Hum + Pocket Click (No Beat)',
      tag: 'VOICE MEMO · HOOK',
      recordedAt: 'Yesterday, 9:41 PM',
      durationSec: 19,
      durationLabel: '0:19',
      location: 'Scorpio Backseat',
      r2Bucket: 'pov-acapellas',
      r2Key: 'memos/2026/tubewell-hook-pocket.m4a',
      publicUrl: 'r2://pov-acapellas/memos/2026/tubewell-hook-pocket.m4a',
      cadenceBpm: 94,
      waveform: [14, 22, 48, 66, 52, 28, 19, 55, 74, 81, 46, 25, 62, 78, 69, 34, 21, 58, 83, 72, 41, 18, 44, 68, 53, 29, 16, 49, 71, 64, 38, 22, 45, 59, 31, 15],
    },
    {
      id: 'vn-3',
      title: 'Desi Tungsten Verse 2 — Breath Control Check',
      tag: 'ACAPELLA · ONE TAKE',
      recordedAt: 'Nov 12, 11:03 PM',
      durationSec: 34,
      durationLabel: '0:34',
      location: 'Gully Studio Room B',
      r2Bucket: 'pov-acapellas',
      r2Key: 'acapellas/2026/desi-tungsten-v2-breath.wav',
      publicUrl: 'r2://pov-acapellas/acapellas/2026/desi-tungsten-v2-breath.wav',
      cadenceBpm: 126,
      waveform: [26, 54, 79, 88, 71, 63, 84, 93, 77, 52, 68, 91, 96, 82, 47, 73, 89, 85, 61, 79, 94, 88, 56, 40, 76, 92, 81, 64, 87, 90, 69, 43, 62, 78, 51, 28],
    },
  ],

  // 5. CONTACTS (Social profiles styled as phone numbers, clickable external hyperlinks)
  contacts: [
    {
      id: 'cnt-1',
      platform: 'Instagram',
      displayName: 'Rao Saab (Official IG)',
      phoneStyledNumber: '+91 98110 • 46782',
      subLabel: 'IG · @raosaab.wav · Reels & Studio Dumps',
      url: 'https://www.instagram.com/',
      badgeColor: 'from-fuchsia-500 via-rose-500 to-amber-400',
      initials: 'IG',
      carrierTag: 'INSTAGRAM MOBILE',
    },
    {
      id: 'cnt-2',
      platform: 'Snapchat',
      displayName: 'Rao Saab (Private Snap)',
      phoneStyledNumber: '+91 99530 • 76271',
      subLabel: 'SNAP · @raosaab.snap · Raw Highway Snaps',
      url: 'https://www.snapchat.com/',
      badgeColor: 'from-yellow-400 to-amber-300 text-black',
      initials: 'SC',
      carrierTag: 'SNAPCHAT DIRECT',
    },
    {
      id: 'cnt-3',
      platform: 'YouTube',
      displayName: 'Rao Saab Music (YT)',
      phoneStyledNumber: '+91 97170 • 96882',
      subLabel: 'YT · @RaoSaabMusic · Visualizers & Live Cyphers',
      url: 'https://www.youtube.com/',
      badgeColor: 'from-red-600 to-rose-700',
      initials: 'YT',
      carrierTag: 'YOUTUBE CHANNEL',
    },
  ],

  // 6. MESSAGES (Native SMS UI with humorous spam + requested placeholders)
  smsThreads: [
    {
      id: 'sms-1',
      sender: 'JD-TELECOM',
      displayTitle: 'JD-AIRTELCARE',
      tag: 'PROMO / SPAM',
      time: '7:18 PM',
      unread: true,
      avatarText: 'JD',
      messages: [
        {
          id: 'm1',
          from: 'them',
          time: '7:18 PM',
          text: 'URGENT ALERT: Your plan is expiring. Recharge now or your career validity will be terminated. Dial *404# or sell your interface immediately to avoid incoming bars block.',
        },
      ],
    },
    {
      id: 'sms-2',
      sender: 'AX-BLUDRT',
      displayTitle: 'AX-BLUEDART',
      tag: 'DELIVERY OTP',
      time: '4:45 PM',
      unread: true,
      avatarText: 'BD',
      messages: [
        {
          id: 'm2',
          from: 'them',
          time: '4:45 PM',
          text: 'Out for Delivery: 1x Havells Beard Trimmer Charger Pin (2-Pin Universal Cable). Your delivery OTP is 482910. Share ONLY with delivery partner Raju (9811XXXXXX) at Sector 29 gate.',
        },
      ],
    },
    {
      id: 'sms-3',
      sender: 'GATI-DIST',
      displayTitle: 'GATI Music Distribution',
      tag: 'OFFICIAL',
      time: '1:12 PM',
      unread: false,
      avatarText: 'GT',
      messages: [
        {
          id: 'm3',
          from: 'them',
          time: '1:12 PM',
          text: '[OFFICIAL ONBOARDING ALERT] Welcome to GATI Music Distribution! Your artist profile (Rao Saab) is verified. ISRC pool INGAT2600412–425 assigned. DSP routing to Spotify, Apple Music & YouTube Content ID is now ACTIVE.',
        },
      ],
    },
    {
      id: 'sms-4',
      sender: 'VK-LOANIN',
      displayTitle: 'VK-INSTACASH',
      tag: 'SPAM',
      time: 'Yesterday',
      unread: false,
      avatarText: '₹',
      messages: [
        {
          id: 'm4',
          from: 'them',
          time: 'Yesterday, 3:05 PM',
          text: 'Congratulations!! Pre-approved ₹2,50,000 Studio Rent Loan without CIBIL!! Reply "BEAT" to unlock 0% interest* (*36% weekly processing fee applies).',
        },
      ],
    },
  ],

  // 7. WHATSAPP (Native-styled artist conversations)
  whatsappChats: [
    {
      id: 'wa-1',
      name: 'Karan Aujla',
      subtitle: 'last seen today at 6:52 PM',
      avatarColor: 'bg-amber-600',
      initials: 'KA',
      unreadCount: 1,
      online: false,
      messages: [
        {
          id: 'w1',
          sender: 'them',
          text: 'Veere heard that Khariboli scratch Mxrci played on FaceTime 🔥',
          time: '6:11 PM',
          status: 'read',
        },
        {
          id: 'w2',
          sender: 'me',
          text: 'Paji abhi raw booth take hai, second verse mein 4-syllable pocket aur tight karna hai',
          time: '6:14 PM',
          status: 'read',
        },
        {
          id: 'w3',
          sender: 'them',
          text: 'Na na raw hi rakh, zyada polish karne se desi grit mar jaata hai. Hook ka tempo 138 pe lock rakhna.',
          time: '6:16 PM',
          status: 'read',
        },
        {
          id: 'w4',
          sender: 'them',
          isVoiceNote: true,
          voiceDuration: '0:14',
          text: 'Voice message (0:14)',
          time: '6:51 PM',
          status: 'read',
        },
        {
          id: 'w5',
          sender: 'them',
          text: 'Delhi aaya toh Studio B mein milte hain next week, stem bhej de mujhe.',
          time: '6:52 PM',
          status: 'delivered',
        },
      ],
    },
    {
      id: 'wa-2',
      name: 'Mxrci (Beats)',
      subtitle: 'online',
      avatarColor: 'bg-emerald-700',
      initials: 'MX',
      unreadCount: 0,
      online: true,
      messages: [
        {
          id: 'w2-1',
          sender: 'them',
          text: 'Bro 808 glide change kar diya bar 9 pe, check mail.',
          time: '4:05 PM',
          status: 'read',
        },
        {
          id: 'w2-2',
          sender: 'me',
          text: 'Solid lag raha hai, sub bass ab Scorpio ke speaker pe phat nahi raha 💯',
          time: '4:09 PM',
          status: 'read',
        },
      ],
    },
    {
      id: 'wa-3',
      name: 'Encore ABJ',
      subtitle: 'last seen today at 2:10 PM',
      avatarColor: 'bg-indigo-600',
      initials: 'EA',
      unreadCount: 0,
      online: false,
      messages: [
        {
          id: 'w3-1',
          sender: 'me',
          text: 'Bhai cypher ke liye Khariboli 16 ready hai, kab pull up karein?',
          time: '1:40 PM',
          status: 'read',
        },
        {
          id: 'w3-2',
          sender: 'them',
          text: 'Kal raat 10 baje Hauz Khas wale basement mein aaja, mic garam rakha hai.',
          time: '2:08 PM',
          status: 'read',
        },
      ],
    },
  ],
}
