# Editing irisonthemove.nl — guide for Iris

This is your step-by-step. You're going to use **Cursor** (a code editor with a built-in AI assistant). You don't need to know any code. You just talk to the AI in plain English about what you want changed, and it does everything else — finds the right file, makes the change, saves it to GitHub, and shows you a preview link.

You'll only ever need this one app. No GitHub Desktop, no Terminal.

---

## One-time setup (10 minutes)

### 1. Install Cursor
1. Go to **[cursor.com/downloads](https://cursor.com/downloads)** on your MacBook.
2. Download the **macOS** version (Apple Silicon if your Mac is from 2020 or newer).
3. Open the downloaded file → drag Cursor into your Applications folder → open it.

### 2. Sign in with GitHub
1. In Cursor, when prompted, click **"Sign in"** and choose **GitHub**.
2. A browser window opens — approve the access request.
3. Done. Cursor now knows your GitHub account.

### 3. Get the website onto your Mac
1. In Cursor, press **⌘ ⇧ P** (Command + Shift + P).
2. A search bar appears at the top — type **"Clone Repository"** and press Enter.
3. Paste this URL: `https://github.com/RonLevTab/irisonthemove`
4. Choose where to save it — **Documents** is fine. Cursor creates an `irisonthemove` folder there.
5. When Cursor asks "Open the cloned repository?", click **"Open"**.

You're set. Next time you want to edit, just open Cursor and pick the project from the recent list.

---

## Making a change (your everyday workflow)

### 1. Open the AI agent
- Press **⌘ I** (Command + I). A chat panel opens on the right.

### 2. Tell it what you want, in plain English
Some examples:
- *"Change the homepage tagline to 'Cinematic stories from the road.'"*
- *"Replace the hero image with this photo."* (then drag your image file into the chat)
- *"Add a new destination called 'Florence, Italy' with the excerpt: 'A weekend among the duomo and the Arno.'"*
- *"Update the contact email to hello@irisonthemove.nl."*
- *"Swap the third reel on the homepage with this video."* (drag the video into the chat)
- *"Change the 'Countries visited' number to 28."*

### 3. Read the agent's preview
The agent will explain what it's going to change, in plain English. For example:
> "This will change the homepage tagline from 'Cinematic storytelling through video and photography' to 'Cinematic stories from the road.' Is that right?"

### 4. Confirm
- Reply **"yes"** if it's right.
- Reply **"no, actually I meant…"** if you want to refine it.

### 5. The agent saves it to GitHub
After your "yes", the agent puts the change on GitHub and gives you **two links**:
- A **Preview** link (Vercel) — opens the website *with your change applied*. Look it over.
- A **Change page** link (GitHub) — this is where you publish it for real.

### 6. Make it live
Once you're happy with how the preview looks:
- Tell the agent **"publish it"** or **"make it live"** — it'll handle the rest.
- Or open the Change page link and click the green **Merge** button yourself.

About 2 minutes later, the change is live at **irisonthemove.nl**. 🎉

---

## Common edits — what to ask the agent

| What you want to change | What to type to the agent |
| --- | --- |
| Homepage tagline | *"Change the homepage tagline to '…'"* |
| Hero image | *"Replace the hero image with this"* + drop the image |
| Hero portrait alt text | *"Update the hero portrait alt text to '…'"* |
| Services list | *"Add a new service called '…' with this description: '…'"* |
| Add a destination | *"Add a destination called 'Florence, Italy' in Western Europe, excerpt: '…'"* |
| Reel video | *"Swap social-proof reel #3 with this video"* + drop the video |
| Contact email or social links | *"Update the contact email to '…'"* / *"Change the Instagram URL to '…'"* |
| Site stats (countries visited) | *"Change countries visited to 28"* |
| About-page sections | *"Change the second About section title to '…' and body to '…'"* |
| Work page CTA button | *"Change the work page CTA button to say 'Let's talk' linking to /contact"* |

If your edit isn't on the list, just describe it — the agent will figure it out.

---

## Tips

- **Be specific.** "Change the headline" is ambiguous; "Change the homepage hero headline" is clear.
- **Drag files into the chat.** Works for images and videos. The agent puts them in the right folder for you.
- **You can undo.** If something looks wrong in the preview, tell the agent **"undo that"** and it'll revert.
- **Preview before publishing.** The Preview link is your safety net. Always check it before clicking Merge.
- **Don't worry about breaking things.** Every change goes to a draft first; the live site only updates when you say "publish".

---

## When something feels wrong

1. **Preview looks broken** — tell the agent *"the preview shows X but I expected Y, please fix"*. It'll iterate.
2. **You meant to undo a change you already published** — tell the agent *"please revert the last published change"*.
3. **Something more serious** — message Ron with a screenshot of what you see. Ron handles anything that isn't pure content (visual changes, the deploy itself, the domain).

---

## What you don't have to think about

You never need to:
- Open a Terminal
- Type any `git` commands
- Manage branches manually
- Touch the deploy / hosting
- Worry about file paths or syntax

The agent handles all of it. Your only job is: **describe the change, check the preview, say "publish it".**
