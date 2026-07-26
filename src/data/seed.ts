import { avatarPalette } from '../theme/colors';
import type { ConnectionRequest, Conversation, Post, Project, User } from './types';

// Small public sample media used purely as placeholder demo content for seeded
// posts. Anything a user creates in the app uses their own real local file.
const SAMPLE_VIDEO_1 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const SAMPLE_VIDEO_2 =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
const SAMPLE_AUDIO_1 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const SAMPLE_AUDIO_2 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
const SAMPLE_AUDIO_3 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

export const seedUsers: User[] = [
  {
    id: 'u1',
    name: 'Ian Dooley',
    pronouns: 'he/him',
    age: 24,
    location: 'Remote',
    tagline: 'Always chasing new sounds and stories.',
    bio: 'Guitarist, songwriter, and occasional producer. I write songs about the small moments and post the messy first drafts here before they turn into something polished.',
    roles: ['Guitarist', 'Songwriter', 'Producer', 'Lyricist'],
    avatarColor: avatarPalette[0],
    socialLinks: [{ label: 'Instagram', url: 'https://instagram.com/iandooleymusic' }],
    portfolioUrl: 'https://iandooleymusic.com',
    musicalInfluences: ['John Mayer', 'Jeff Buckley', 'Radiohead', 'Fleetwood Mac'],
    preferredGenres: ['Indie Folk', 'Alternative Rock', 'Blues', 'Singer-Songwriter'],
    prompts: [
      { question: 'If I could jam with any artist, living or dead, it’d be…', answer: 'Easily Eddie Van Halen!' },
      { question: 'What’s your go-to song to kick off a jam session?', answer: 'Sweet Child O’ Mine' },
      {
        question: 'Music connects people because…',
        answer:
          'because it speaks a universal language, expressing what words often can’t. It brings together emotions, stories, and creativity, building bonds across cultures and experiences.',
      },
    ],
  },
  {
    id: 'u2',
    name: 'Samantha Rodriguez',
    pronouns: 'she/her',
    age: 27,
    location: 'Austin, TX',
    tagline: 'Chasing melodies and midnight inspiration.',
    bio: 'Songwriter and composer working mostly in piano-driven pieces. I post works-in-progress because I write better when someone else can hear where a song might go.',
    roles: ['Songwriter', 'Composer'],
    avatarColor: avatarPalette[1],
    socialLinks: [{ label: 'Instagram', url: 'https://instagram.com/samrodmusic' }],
    portfolioUrl: 'https://samrodriguez.com',
    musicalInfluences: ['Sara Bareilles', 'Ludovico Einaudi', 'Norah Jones'],
    preferredGenres: ['Neo-Classical', 'Piano Pop', 'Jazz'],
    prompts: [
      { question: 'What’s your go-to song to kick off a jam session?', answer: 'River Flows in You' },
      { question: 'Music connects people because…', answer: 'it says what conversation can’t.' },
    ],
  },
  {
    id: 'u3',
    name: 'Victoria Smith',
    pronouns: 'she/her',
    age: 25,
    location: 'Los Angeles, CA',
    tagline: 'Synths, drum machines, and late-night sketches.',
    bio: 'Songwriter and composer building atmospheric, drum-driven demos. Looking for collaborators to help turn sketches into finished tracks.',
    roles: ['Songwriter', 'Composer'],
    avatarColor: avatarPalette[2],
    socialLinks: [],
    musicalInfluences: ['Tame Impala', 'HAIM', 'The 1975'],
    preferredGenres: ['Synth Pop', 'Indie Rock'],
    prompts: [{ question: 'If I could jam with any artist, living or dead, it’d be…', answer: 'Prince, no contest.' }],
  },
  {
    id: 'u4',
    name: 'Phillip Eden',
    pronouns: 'he/him',
    age: 31,
    location: 'Chicago, IL',
    tagline: 'Piano first, everything else second.',
    bio: 'Pianist and producer. I record improvisations on my upright and turn the good ones into full productions.',
    roles: ['Pianist', 'Producer'],
    avatarColor: avatarPalette[3],
    socialLinks: [],
    musicalInfluences: ['Bill Evans', 'Robert Glasper'],
    preferredGenres: ['Jazz', 'Neo-Soul'],
    prompts: [],
  },
  {
    id: 'u5',
    name: 'Joseph Putra',
    pronouns: 'he/him',
    age: 22,
    location: 'Seattle, WA',
    tagline: 'Violin, verses, and everything in between.',
    bio: 'Violinist and songwriter writing lyrics first, melody second. Always looking for producers to build around a vocal or string idea.',
    roles: ['Violinist', 'Songwriter'],
    avatarColor: avatarPalette[4],
    socialLinks: [],
    musicalInfluences: ['Ludwig Göransson', 'Hozier'],
    preferredGenres: ['Folk', 'Cinematic'],
    prompts: [],
  },
];

export const seedProjects: Project[] = [
  {
    id: 'p1',
    ownerId: 'u1',
    title: 'Acoustic Sketches',
    description: 'A collection of raw acoustic ideas I’m slowly turning into full songs.',
    status: 'in_progress',
    collaboratorIds: ['u1', 'u3', 'u4', 'u5'],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'p2',
    ownerId: 'u2',
    title: 'The End! Sessions',
    description: 'Piano piece I’ve been sitting with — feels unfinished. Open to feedback and a possible rework.',
    status: 'in_progress',
    collaboratorIds: ['u2'],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'p3',
    ownerId: 'u3',
    title: 'Night Drive',
    description: 'Synth-driven demos for a short EP about driving around at 2am.',
    status: 'in_progress',
    collaboratorIds: ['u3'],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'p4',
    ownerId: 'u4',
    title: 'Upright Improvisations',
    description: 'Weekly piano improv recordings, unedited.',
    status: 'completed',
    collaboratorIds: ['u4'],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'p5',
    ownerId: 'u5',
    title: 'Late Bloom',
    description: 'A folk-leaning concept EP about growing up slowly.',
    status: 'in_progress',
    collaboratorIds: ['u5'],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export const seedPosts: Post[] = [
  // Ian's own posts (live on his profile, grouped under project p1)
  {
    id: 'post_e',
    projectId: 'p1',
    authorId: 'u1',
    type: 'video',
    title: 'This Is How I Disappear',
    description:
      'I’ve been noodling around on my guitar and stumbled onto this riff that I think could be something cool. It’s got a chill, emotional feel, but I’m still shaping it into something more polished.\n\nI’d love to hear what you think — does it flow? Does it feel complete, or is something missing? Be brutally honest (but also nice, lol).\n\nDrop your thoughts below, and thanks for listening!',
    mediaUri: SAMPLE_VIDEO_1,
    durationSec: 55,
    lookingForTags: ['Producer', 'Lyricist'],
    waveformSeed: 11,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'post_f',
    projectId: 'p1',
    authorId: 'u1',
    type: 'audio',
    title: 'Fingerstyle Warmup',
    description: 'A quick fingerstyle warmup take — thinking this could open the record.',
    mediaUri: SAMPLE_AUDIO_1,
    durationSec: 48,
    lookingForTags: ['Drummer'],
    waveformSeed: 22,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 'post_g',
    projectId: 'p1',
    authorId: 'u1',
    type: 'lyrics',
    title: 'Chorus Idea',
    description: 'A chorus idea I keep coming back to. Needs a bridge.',
    lyricsBody:
      'This is how I disappear\nQuiet as the streetlights, halfway here\nYou won’t notice till I’m gone\nSinging to myself the whole way home',
    lookingForTags: ['Feedback', 'Lyricist', 'Composer'],
    waveformSeed: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
  // Feed posts from other artists
  {
    id: 'post_a',
    projectId: 'p2',
    authorId: 'u2',
    type: 'audio',
    title: 'The End!',
    description:
      'I’ve been working on this piece, and I’d love to get your thoughts on it. It’s still a work in progress, but I’m hoping to have it finished soon.',
    mediaUri: SAMPLE_AUDIO_2,
    durationSec: 55,
    lookingForTags: ['Feedback', 'Vocalist', 'Lyricist'],
    waveformSeed: 33,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'post_b',
    projectId: 'p3',
    authorId: 'u3',
    type: 'video',
    title: 'Night Drive Sketch',
    description:
      'Synth line I wrote at 2am and couldn’t stop humming the next day. Needs drums and a bassline to really lock in the groove.',
    mediaUri: SAMPLE_VIDEO_2,
    durationSec: 52,
    lookingForTags: ['Drummer', 'Bassist'],
    waveformSeed: 44,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'post_c',
    projectId: 'p4',
    authorId: 'u4',
    type: 'audio',
    title: 'Piano Improv No. 4',
    description: 'Unedited improv from this week’s practice. Curious if a vocal line could sit on top of this.',
    mediaUri: SAMPLE_AUDIO_3,
    durationSec: 58,
    lookingForTags: ['Feedback', 'Vocalist'],
    waveformSeed: 55,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'post_d',
    projectId: 'p5',
    authorId: 'u5',
    type: 'lyrics',
    title: 'Late Bloom (Verse 1)',
    description: 'First verse for the title track. Looking for a producer to help build the world around this.',
    lyricsBody:
      'I was late to everything — the party, the punchline, the love\nStill figuring out how the light gets in\nBut I’m here now, a little slower, a little sure',
    lookingForTags: ['Producer', 'Composer'],
    waveformSeed: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export const seedConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    fromUserId: 'u3',
    toUserId: 'u1',
    postId: 'post_e',
    message: 'Hey, I was wanting to collaborate with you on this track…',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'req2',
    fromUserId: 'u4',
    toUserId: 'u1',
    postId: 'post_e',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'req3',
    fromUserId: 'u5',
    toUserId: 'u1',
    postId: 'post_f',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'req4',
    fromUserId: 'u2',
    toUserId: 'u1',
    postId: 'post_e',
    message: 'Loved the vibe on this — would love to add some harmonies.',
    status: 'accepted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

export const seedConversations: Conversation[] = [
  {
    id: 'conv1',
    userId: 'u2',
    lastMessage: 'Loved the vibe on this — would love to add some harmonies.',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];
