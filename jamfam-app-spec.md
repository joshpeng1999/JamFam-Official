# Jamfam — App Build Spec

## Role

You are a senior mobile software engineer, an expert in building fully functional apps with React Native and Expo. Your code is clean, readable, and well documented.

## Stack

- React Native + Expo
- Firebase (backend)

## Product Overview

Jamfam is an app for musicians and artists to share works-in-progress and connect with collaborators. Think **TikTok meets LinkedIn**: a vertical, swipeable feed of music projects (video, audio, or lyrics) paired with a professional networking/connection layer for reaching out to collaborators.

The closest existing comparable is **Vampr** — but without music lessons or ads, and focused purely on scrolling music projects and connecting with the ones that resonate.

**Core loop:** An artist posts a project (video, audio, or lyrics) and tags the type of collaborator they're looking for (e.g., a beat posted with a "Rapper" tag, or a vocal track tagged "Drummer" / "Producer"). Other artists scroll the feed, discover projects, and request to connect.

## Assets

- All screen reference photos are in `~/assets` (`photo1.png` – `photo17.png`, referenced below).
- `logo.svg` is in `~/assets` — use it as part of the splash screen.

Build the app end-to-end, following the workflows below in order, from first screen to last.

---

## Workflow 1: Viewing a Project

- **photo1.png** — Main feed screen. Full-screen video/music content the artist has posted, similar to a TikTok/Reels feed.
- **photo2.png** — Tapping "more" on the description expands it Instagram-Reels-style. From here, the user can tap **Get Connected** to reach out to the artist.
- **photo3.png** — A footer overlay slides up (bottom sheet) where the user types a short connection message, similar to a LinkedIn connection request.
- **photo4.png** — Same layout as photo1, but for an audio-only post — shown as a waveform instead of video.

## Workflow 2: Follow / Connection Requests

- **photo5.png** — Notifications tab showing incoming connection requests, including which project each request relates to. Accepting/replying works like LinkedIn's connection flow — request, reply, and become "connected."

## Workflow 3: Creating & Posting a Project

- **photo6.png** — A **+** button in the center of the footer tab bar opens the post-creation flow → leads to photo7.png.
- **photo7.png** — Choose post type: **Video**, **Audio**, or **Lyrics** (text-only).
  - Video → photo8.png
  - Audio → photo16.png
- **photo8.png** — Prompts the user to select a video from their device → leads to photo9.png.
- **photo9.png** — Title the work and trim the video to a max 1-minute duration. **Next** → photo10.png.
- **photo10.png** — Add a description. Needs a button (not yet in the design) to open the collaborator-tagging sheet (photo11.png). This screen also has the **Share** button (replacing "Next") that publishes the post and closes the flow.
- **photo11.png** — Bottom sheet for tagging the type(s) of artist the poster is looking for (e.g., Rapper, Drummer, Producer). These tags display on the published post.
- **photo16.png** — Select an audio file from the device's file system → leads to photo17.png.
- **photo17.png** — Same as photo9.png but for audio: title the work and trim to 1 minute. **Next** returns to photo10.png (shared description/tagging/share step for both video and audio).

## Workflow 4: Artist Profile

- **photo12.png** — Bottom-right footer tab opens the user's profile: a folder-based collection of posts (Instagram-profile-style grid), letting users organize posts by project. Tapping a folder → photo13.png. Tapping the **About** tab → photo14.png.
  - Ignore the "Projects in Progress" and "Completed Projects" tabs.
- **photo13.png** — Shows all posts within a given project/folder. May also show who has requested to connect on this project, and a status indicator (top right) for whether the project is complete.
- **photo14.png** — Artist profile details: location, artist type, social media links, musical influences. Scrolling down reveals a "Get to Know Me" section with self-answered prompts (see photo15.png).
- **photo15.png** — Pre-made prompt questions for the "Get to Know Me" section.

---

## Build Order

1. Splash screen (using `logo.svg`)
2. Feed / project viewing (photo1–4)
3. Connection requests / notifications (photo5)
4. Post creation flow — video, audio, lyrics (photo6–11, 16–17)
5. Artist profile (photo12–15)

Install and configure any dependencies needed (video/audio playback, trimming, file picking, bottom sheets, etc.) to fully implement each screen.
