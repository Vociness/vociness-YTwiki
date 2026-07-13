// Each guide = one topic page. Add new ones here, app.js renders them automatically.
const GUIDES = {

  "perfect-script": {
    title: "🧩 Writing The Perfect Script",
    section: "scripting",
    stat: { num: "8", label: "sentence framework" },
    intro: "The 8-sentence intro framework. Get straight to the point, make everything in the intro build to the payoff, no extra fluff. 🎯",
    rules: [
      {
        title: "🪝 Sentence 1: The Hook",
        body: "Super eye-catching visuals, psychological triggers, give context to the viewer. Hooking techniques: make the viewer question something, create urgency, include someone recognizable (famous) in the first clip or frame, anti-hook (no context, straight into the video), immediate consequence (show the result before the explanation), contradictory hook (directly conflicts with what the viewer assumes).",
        example: "\"Doing this ruined my sleep for 3 weeks.\" (immediate consequence)\n\"Healthy food can be worse for you than junk food.\" (contradictory hook)\n\"Do you know why MrBeast turned down 1 billion dollars?\" (recognizable person + making the viewer question + urgency)"
      },
      {
        title: "🤝 Sentence 2: The Supporting Hook",
        body: "Set an expectation, then overdeliver on it. Flow: set an expectation, give context, overdeliver. Don't overcomplicate this, if you don't know what you're doing, don't do it. Techniques: read the viewer's thought, then shut it down by telling them they're completely wrong.",
        example: "\"You may think it's because MrBeast doesn't actually want to sell his channel, or maybe even because he already has enough money, but you would be completely wrong.\""
      },
      {
        title: "📍 Sentences 3 to 4: Setting The Scene",
        body: "Set a time or location and develop context of the video slowly, leading into the payoff. Don't overexplain.",
        example: "\"Recently, MrBeast went on Andrew Schultz's podcast and revealed that he had been offered 1 billion dollars for the sale of all of his businesses combined.\""
      },
      {
        title: "📊 Sentences 5 to 6: Setting The Stakes",
        body: "Turn the context and curiosity into an investment, add extra context or facts to help the next techniques land. Techniques: \"why did they do this?\", tease the viewer for the payoff, make the viewer solve a puzzle, rehook (remind the viewer why they're watching).",
        example: "\"If he accepted this offer, MrBeast would not only become YouTube's first billionaire, but also the youngest self-made billionaire in history. So, what was the crazy reason he gave for declining this offer?\""
      },
      {
        title: "🎁 Sentence 7: The Payoff",
        body: "Deliver the payoff fast. Keep it simple.",
        example: "\"So who is it? Well, his name is Chandler.\""
      },
      {
        title: "🔁 Sentence 8: CTA (optional)",
        body: "Tie the call-to-action into the actions of the video itself. Add a loop when ending the video, it boosts retention.",
        example: "\"...and subscribe if you want to work for MrBeast.\" (CTA tied directly to the story's action)"
      }
    ]
  },

  "scripting-rules": {
    title: "📝 Scripting Rules",
    section: "scripting",
    stat: { num: "4️⃣", label: "non-negotiable" },
    intro: "Pulled straight from feedback on the top-performing videos. Apply these EVERY single time a script gets written or reviewed. No exceptions. 🚫",
    rules: [
      {
        title: "⏱️ Front-load the value in the first 25 seconds",
        body: "The hook has to tell viewers everything they're getting before you dive in. Give them a map so they have a reason to stay for the whole video, not just the next 10 seconds.",
        example: "Roblox did X, Y, Z and a LOT more in this video, let's get into it."
      },
      {
        title: "🔁 Never restate the same point twice",
        body: "The single biggest retention killer. After writing any paragraph, ask: did I already say this? If yes, cut the first version and keep the sharper one.",
        example: "❌ WRONG: \"further in the wrong direction because in the midst of the Great Chat depression, Roblox somehow managed to announce an update that's arguably even worse\", says \"bad direction\" twice.\n✅ FIX: \"further in the wrong direction, Roblox just announced [the update].\""
      },
      {
        title: "1️⃣ One example maximum in the opening",
        body: "Multiple flat examples back to back kill retention early. One punchy example with audio emphasis is enough to prove the point, then move on. Viewers want the point, not a lecture. 🎯",
        example: "Instead of listing three separate clothing creators who got hit by the fee change, pick the one with the most dramatic number and use it alone: \"One creator watched their payout drop from $4,000 a month to $600 overnight.\" That's it, then move straight to the news."
      },
      {
        title: "💭 Opinion → news, not opinion → opinion → news",
        body: "State the take, then go straight to the thing that proves it. Don't explain the take, restate it, and then get to the news. Cut straight to the evidence.",
        example: "❌ WRONG: \"I think this update is genuinely one of the worst decisions Roblox has made this year, and honestly it shows how out of touch the team is with what players actually want, but let's get into what changed.\"\n✅ FIX: \"This update is one of the worst decisions Roblox has made all year. Here's what changed.\""
      }
    ]
  },

  "shorts-structure": {
    title: "⚡ Shorts Structure",
    section: "scripting",
    stat: { num: "81%+", label: "watch % target" },
    intro: "Hook, build tension, payoff at the very end. Pay off early and retention falls off a cliff. 📉",
    rules: [
      {
        title: "🛑 First 2 seconds interrupt the scroll",
        body: "The hook starts before your mouth even opens. The first frame can't look dead, it has to grab attention instantly.",
        example: "Instead of opening on someone sitting still about to talk, open already mid-action, a hand slamming a phone down, a number flashing on screen, a jump cut to the messiest part of the story. If the first frame could pass as a paused thumbnail, it's already too slow."
      },
      {
        title: "🎁 Hold the payoff until the last line",
        body: "Start with conflict, reveal the answer at the very end. Every dip in the retention graph is people leaving because they already got the answer and have no reason left to stay.",
        example: "\"He turned down a billion dollars... and the reason isn't what you think.\" Keep circling that line for the first 15 seconds before actually answering it in the last 2."
      },
      {
        title: "🏒 Short and high-retention beats long and mid",
        body: "A 15 to 20 second short with 120%+ retention (rewatches) will beat a 40 second short with 60% retention every time.",
        example: "A tight 18-second short that loops cleanly and gets watched twice beats a stretched-out 45-second version of the same idea almost every time, even with a smaller raw view count."
      },
      {
        title: "🔇 It has to work on mute",
        body: "Watch it back with no sound. If you can't tell what's happening, it's not universal enough. Always caption, a lot of people scroll silent.",
        example: "If understanding the short depends on hearing the voiceover explain a graph on screen, add on-screen text or a clearer visual instead of leaning on audio to carry the point."
      },
      {
        title: "😱 Every short needs an emotion",
        body: "Curiosity, anger, surprise, ego, something. No emotion means scroll. You're making a stranger feel something in under a minute, not posting a clip.",
        example: "\"Wait, this actually works?\" (curiosity) lands completely differently than a flat recap of facts with nothing at stake. Pick the emotion before writing a single line of the script."
      },
      {
        title: "🔔 Ask for the sub before the payoff",
        body: "Drop the prompt while the viewer is still locked in, not after. Keep it small or transparent, the moment it feels like an ad, they swipe.",
        example: "\"Subscribe, because you're not gonna believe what happens next\" dropped right before the reveal, not tacked onto a dead outro after the payoff that nobody sticks around for."
      }
    ]
  },

  "longform-structure": {
    title: "🎥 Long-Form Structure",
    section: "scripting",
    stat: { num: "8min+", label: "for mid-roll ads" },
    intro: "Different rules from Shorts. Viewers forget why they stayed, remind them. 🧠",
    rules: [
      {
        title: "🪝 Use multiple hooks throughout",
        body: "Viewers naturally forget why they clicked. Restate the reason to keep watching at intervals through the video, not just at the top.",
        example: "Every 90 seconds or so, drop a line like \"but this is where it gets even crazier\" to re-hook someone who's been half-watching and forgot why they clicked in the first place."
      },
      {
        title: "⏳ Always aim past 8 minutes",
        body: "That's the mid-roll ad eligibility threshold. A one-hour video multiplies RPM roughly 6x versus average because viewers see far more ads, but never pad runtime at the expense of retention. 💰",
        example: "A 12-minute video with strong retention will often out-earn a 6-minute video with the exact same view count, purely because it clears the mid-roll threshold and can run extra ads."
      },
      {
        title: "🖼️ Title and thumbnail work together",
        body: "They should give the viewer complete context of what they'll miss by not clicking, not duplicate each other, complement each other.",
        example: "Thumbnail shows the shocked reaction, title reads \"He Spent $1,000,000 On This\" — together they explain the what and the why, but neither one gives away the ending by itself."
      }
    ]
  },

  "thumbnails": {
    title: "👀 Thumbnails & CTR",
    section: "packaging",
    stat: { num: "4 to 5%", label: "average CTR" },
    intro: "CTR is the first gate. Below 3% and YouTube won't push the video, full stop. 🚪",
    rules: [
      {
        title: "🎰 CTR is a filter, not a vanity metric",
        body: "Every impression is a slot. Why would YouTube give one to a low-CTR video when a high-CTR video is proven to get clicks? Below 3% CTR, expect no push.",
        example: "Two videos each get 10,000 impressions. One pulls 6% CTR, the other pulls 2%. YouTube keeps feeding the first one new impressions and quietly stops showing the second."
      },
      {
        title: "🤖 YouTube's AI actually scans the thumbnail",
        body: "Faces, objects, and text are read by the algorithm, the thumbnail isn't just for humans, it's classification data too.",
        example: "A thumbnail with one clearly readable face and 2-3 bold words gets classified faster and more accurately than a busy, text-heavy collage the algorithm can't parse as easily."
      },
      {
        title: "💡 Idea beats design",
        body: "CTR is driven by thumbnail, title, and the underlying idea together. A well-designed thumbnail for a weak idea still underperforms.",
        example: "A beautifully designed thumbnail for \"my thoughts on this week's news\" loses to a rough, unpolished thumbnail for \"I got banned from every casino in Vegas\" — the idea is doing the work, not the Photoshop."
      }
    ]
  },

  "titles": {
    title: "🏷️ Titles & Metadata",
    section: "packaging",
    stat: { num: "#1", label: "priority on a new channel" },
    intro: "Metadata is the most important lever on a channel YouTube doesn't trust yet. 🔑",
    rules: [
      {
        title: "🗣️ The title has to tell YouTube what the video is",
        body: "Vague titles force YouTube to guess the audience. Given the choice, YouTube would rather push a video it understands than risk showing the wrong content to the wrong person.",
        example: "\"This Changed Everything\" tells the algorithm nothing. \"Roblox Just Changed How Payouts Work For Every Creator\" tells YouTube exactly who to show it to."
      },
      {
        title: "🧩 Fill out tags, chapters, and timestamps",
        body: "All of it gives the algorithm more context for classification. Empty descriptions are a wasted signal.",
        example: "Chapters like \"0:00 The Announcement / 2:14 Why Creators Are Furious / 5:30 What Happens Next\" give YouTube structured signals it can match to search and suggested traffic."
      },
      {
        title: "⏰ First 24 to 48 hours is a review window",
        body: "After upload, YouTube transcribes the audio, scans the thumbnail, and classifies the content before it starts really pushing. That's why a new video's first views are slow to arrive, it's still being profiled.",
        example: "A video might sit at a few hundred views for the first several hours while YouTube transcribes and classifies it, then suddenly start climbing once it's confident who to show it to. That early lull isn't a bad sign by itself."
      }
    ]
  },

  "retention": {
    title: "📈 Retention Graph",
    section: "algorithm",
    stat: { num: "60%", label: "target @ 8min EOV" },
    intro: "More important than CTR. Flat, high, smallest possible initial dip. 🏔️",
    hasGraph: true,
    rules: [
      {
        title: "📉 The graph always trends down, that's normal",
        body: "Viewers naturally leave over time. What matters is the shape, not the fact that it declines.",
        example: "A graph that starts at 100% and settles around 55-65% by the 8-minute mark is healthy. A graph that stays flat at 100% the whole way usually just means almost nobody watched it at all."
      },
      {
        title: "⚠️ A steep early dip means a bad hook",
        body: "If a lot of viewers bail in the first seconds, the hook isn't doing its job, it didn't earn the click.",
        example: "Retention cratering from 100% to 60% in the first 15 seconds means the opening line didn't earn the click, that's a hook problem, not an editing problem."
      },
      {
        title: "🐌 A steep dip mid-video means bad pacing",
        body: "If retention craters partway through, that's a storytelling and pacing problem, not a hook problem, usually a restated point or a payoff given too early.",
        example: "If retention is smooth and flat until 3:40, then drops off a cliff, go check what happens right at 3:40, it's almost always a restated point, an early payoff, or a slow section that should've been cut."
      }
    ]
  },

  "waves": {
    title: "🌊 Wave System",
    section: "algorithm",
    stat: { num: "3", label: "core signals tracked" },
    intro: "How YouTube actually decides who sees a new video. 🎯",
    hasWaveGraph: true,
    rules: [
      {
        title: "🧪 Small test groups first",
        body: "YouTube pushes to a small audience and watches how they respond before deciding whether to ramp up, slow down, or plateau.",
        example: "A brand-new upload might only get shown to a few hundred people in the first hour. If they watch and click through at a strong rate, YouTube expands the test; if they don't, it quietly stops there."
      },
      {
        title: "📡 Browse feed is tested before suggested feed",
        body: "Suggested (the sidebar) depends more heavily on target-audience data, so YouTube waits for more signal before showing a video there. Suggested impressions are worth more because they keep people on-platform longer.",
        example: "A video can perform fine in the home feed for days before it ever shows up in the \"Up Next\" sidebar, suggested placement is the second, harder gate, not the first."
      },
      {
        title: "⏱️ Session time is the strongest signal of all",
        body: "YouTube's real goal is total time on platform. A video that leads to another video watched, even an unrelated one via end-screen or playlist, is one of the strongest pushes a creator can trigger.",
        example: "A video that ends with a strong end-screen recommendation, where the viewer clicks straight into another video, even someone else's, sends a stronger signal to YouTube than a slightly higher view count alone would."
      }
    ]
  },

  "editing-workflow": {
    title: "✂️ Editing Workflow",
    section: "channelops",
    stat: { num: "2", label: "core tools" },
    intro: "Scripting comes first, editing only fixes what a bad script can't. 🛠️",
    rules: [
      {
        title: "🔍 Script audit before edit audit",
        body: "If a video underperforms despite decent CTR, check the script and retention graph before blaming the edit.",
        example: "A video with a 4% CTR but a retention graph that nosedives at 0:20 doesn't need a better edit, it needs a better hook. Check the script before re-cutting anything."
      },
      {
        title: "💵 Editor pay structure",
        body: "Bonuses based on videos completed, not views, editors are inconsistent contributors to view count, but consistency of delivery is something they control directly.",
        example: "An editor delivering 4 clean videos a week on time gets paid the same whether one of those videos does 10,000 views or 500,000, their job is consistency, not the algorithm's decision."
      },
      {
        title: "📁 Shared drive for materials",
        body: "Keep scripts, assets, and raw footage in one shared Google Drive so editors always pull from the same source of truth.",
        example: "Raw footage, the final script, and thumbnail assets all live in one dated folder per video, e.g. \"2026-07-12_RobloxUpdate\", so an editor never has to ask where something is."
      }
    ]
  },

  "branding": {
    title: "🎨 Visual Branding",
    section: "channelops",
    stat: { num: "1", label: "signature look" },
    intro: "Differentiation matters, a look that blends into the niche gets skipped over. 👻",
    rules: [
      {
        title: "🫥 Blend-in aesthetics blend into scroll-past",
        body: "If the thumbnail style matches five other channels in the niche, viewers pattern-match past it without registering who posted it.",
        example: "If five channels in the same niche all use the same bold-red-arrow, shocked-face thumbnail style, a viewer's eye slides right past all five without registering which one is actually yours."
      },
      {
        title: "🎭 A mascot or glitch-style identity creates recognition",
        body: "A distinct visual anchor, a mascot, a consistent visual glitch effect, a specific color language, gives viewers something to recognize at a glance, separate from any one thumbnail.",
        example: "A recurring visual glitch effect on every intro, or a small mascot in the corner of every thumbnail, lets a viewer recognize the channel on sight before they even read the title."
      }
    ]
  }

};
