# Chattanooga.Digital: site review and stream curriculum draft

Prepared 2026-10-03 from the public site only (https://chattanooga.digital). Read-only: no logins, no forms, no contact with anyone.

How this was gathered, and its limits: every page was read through the WebFetch tool, which returns a machine-summarized version of each page, not raw HTML. Quoted strings below are as that tool returned them. Three things could not be confirmed that way: the home page Contact section text, any events on /calendar (it may be a script-rendered embed), and the workshops index (/workshops returned HTTP 404). A quick look in a normal browser before anyone edits the site is worth the two minutes.

Items marked **ASSUMPTION** are my own inference, not something the site says.

---

## Site review

### What is fleshed out

| Page | URL | Verdict | Evidence |
|---|---|---|---|
| Home | https://chattanooga.digital/ | Fleshed out, except the timeline | Tagline "Own your apps. Own your data. Own what you do!"; mission as a "community tech cooperative"; four value blocks (Programs, Services, Hack Sessions, six standard apps). |
| Blog | https://chattanooga.digital/blog | The strongest content on the site | About 19 to 20 posts from Aug 2025 to 18 Sep 2026. Includes an 11-part "How We Built It" series (Preface x2, Parts 0 to 10) covering Docker install, Drupal Recipes, components, data model, calendar, forms, cron, deploy with Portainer and Docker Swarm, maintenance, and a CRM inside Drupal. Also a business-plan summary and a post on social platforms. |
| Tech Strategy Tool | https://chattanooga.digital/tech-strategy | Fleshed out | A structured self-analysis form: stakeholders, strategic considerations, current tech stack, and eight value-chain areas (Administer & Manage, Buy & Hire, Inbound Logistics, Produce & Provide, Outbound Logistics, Sell & Market, Support Customers, Support Operations). "Allow yourself 30 to 60 minutes"; "we don't autosave." |
| Services | https://chattanooga.digital/services | Fleshed out as a catalogue, no prices | Splits into community apps (Mastodon at toot.chattanooga.digital, Hubzilla at hub.chattanooga.digital), member apps (Cryptpad, Discourse, Drupal, Email lists, Nextcloud) and six wish-list categories (Productivity & Office, Communication & Social, Commerce & Operations, Infrastructure & Cloud, Media & Content, Specialty & Emerging). Support is limited: "support services are limited to ensuring the infrastructure is operating and accessible"; more "on a case-by-case basis." |
| Apps | https://chattanooga.digital/apps | Fleshed out descriptions | One paragraph each for CryptPad, Discourse, Drupal, Email lists, Mastodon, Nextcloud, written in present tense. Only Mastodon carries a URL (https://toot.chattanooga.digital/). No pricing. |
| Chattanooga Venturing | https://chattanooga.digital/chattanooga-venturing | Fleshed out | Two parts: a Venturing Study Group and a Facilitator Bank. Notes that the program is planned to migrate to the Eduity website. |
| Basic Drupal workshop | https://chattanooga.digital/workshops/basic-drupal | Described, no logistics | "Build your first Drupal CMS v2 site from scratch." Topics: content modeling, Canvas page builder, theming basics, deployment pipeline (Docker, Portainer, Traefik). No dates, length or prerequisites. |
| Business plan post | https://chattanooga.digital/blog/2026-08/executive-summary-our-business-plan | Fleshed out | Two member classes (customers and providers); "an annual membership fee and a monthly utilization fee based on how much compute they use"; pilot members "anchor the advisory council." No dollar amounts for member fees; no launch date. |

### What is thin (a paragraph, no schedule)

| Page | URL | What is there | What is missing |
|---|---|---|---|
| Programs index | https://chattanooga.digital/programs | Four program cards (Digital Survival Skills, Let's Learn Linux, Open for Business, Tech for Leaders) plus a Hack Sessions blurb. | No dates, prices or schedules. Two typos (see Stale items). Venturing is not in the card list although it is in the menu. |
| Digital Survival Skills | https://chattanooga.digital/programs/discover-open-source | Topics named: removing personal data from the internet, password and passkey management, device security. "This program will address a wide range of topics from the community." | Everything else. No session list. |
| Let's Learn Linux | https://chattanooga.digital/programs/lets-learn-linux | "Hands-on Linux study group covering installation, daily use, and server administration. Open to all skill levels." | No day, time or place. "Meets regularly; check the calendar for upcoming sessions." |
| Tech for Leaders | https://chattanooga.digital/programs/tech-for-leaders | Targets non-technical leaders: tech stacks, vendor evaluation, build versus buy, SaaS contracts, managing development teams. Programs index adds "Includes a customized action plan!" | No schedule. Links to the Tech Strategy Tool. |
| Hack Sessions | https://chattanooga.digital/hack-sessions | One heading plus "Check the calendar for upcoming sessions." | No frequency, place or format. |
| Nextcloud workshop | https://chattanooga.digital/workshops/nextcloud | "Self-host file storage, calendars, contacts, and collaborative documents"; "the privacy-respecting alternative to Google Workspace and Microsoft 365." | No outline, dates, length or prerequisites. |
| Membership | https://chattanooga.digital/membership | An application form. "Now accepting pilot members!" Choices: info request, updates (max two monthly), or join by email. | No tiers or prices on the page. |

### What is placeholder

| Page | URL | Placeholder text |
|---|---|---|
| Sponsors | https://chattanooga.digital/sponsors | "Sponsor logos and descriptions go here once the sponsor program is finalized." No sponsors named. Button reads "Become a sponsor." |
| Open for Small Business | https://chattanooga.digital/programs/open-for-business | A "Sessions" heading with nothing under it. Only text: "Want to attend? Fill out our interest form and we'll send you an invite when the next session is scheduled." |
| Calendar | https://chattanooga.digital/calendar | Fetch showed subscription options but no event titles. If it really is empty, the "check the calendar" pointers on four other pages lead nowhere. |
| Workshops list (the five planned topics) | https://chattanooga.digital/ and https://chattanooga.digital/programs | Accounting, AI, content management, digital marketing and groupware exist only as a promise: "New workshops added on member demand" (home) and "planning a variety of programs ... including workshops on general topics and specific applications such as accounting, artificial intelligence, content management, digital marketing, and groupware" (Programs). Only two workshop pages exist. |
| App roster | https://chattanooga.digital/ and /services | "Others coming soon based on your needs!" |

Count: of the pages that matter for planning, three are solid (Blog, Tech Strategy Tool, Services/Apps catalogue), one program page is solid (Venturing), and the rest are one-paragraph stubs. The co-op has content to teach from (the blog series is effectively a Drupal course) but almost no published schedule.

---

## Stale items

Quotes are exact as returned by the fetch tool.

| # | Page and URL | Exact text | Problem | Suggested fix |
|---|---|---|---|---|
| 1 | Home, Timeline section, https://chattanooga.digital/ | "Onboarding members · Q2 2026" | Q2 2026 ended 30 June. It is 3 October 2026. It is the only timeline entry the fetch found. The rest of the site says "Now accepting pilot members!" (home, /programs, /membership, each program page), and the Aug 2026 business plan post says "now accepting pilot members" with no launch date. | Replace with a current status plus the next milestone, for example "Accepting pilot members" and a dated next step. The date has to come from the co-op. |
| 2 | Sponsors, https://chattanooga.digital/sponsors | "Sponsor logos and descriptions go here once the sponsor program is finalized." | Internal build note shown to the public, on a live menu item. | Hide the menu item until real, or write one real sentence. |
| 3 | Open for Small Business, https://chattanooga.digital/programs/open-for-business | "Sessions" (empty heading) and "we'll send you an invite when the next session is scheduled." | Empty section. No session has been scheduled. | Remove the heading or add the first date. |
| 4 | Programs index, https://chattanooga.digital/programs | "Building Capabilites, Strengthening Community" and "Collaborarive Learning for Problem-Solving" | Two spelling errors in headings. | Fix to "Capabilities" and "Collaborative". |
| 5 | Programs index vs menu and page title | Card reads "Open for Business"; menu and home read "Open for Small Business"; the page heading is "Open for _(Small)_ Business". | Same program, two names. | Pick one. |
| 6 | Hack Sessions, two definitions. https://chattanooga.digital/programs and https://chattanooga.digital/hack-sessions | Programs: hack sessions are events where "business and civic leaders ... 'problem owners'" meet "technology leaders ... 'problem solvers'". Hack Sessions page: "Open coworking and collaboration time. Bring your projects and your questions." | Two different formats under one name. Matters for the capstone module below. | Decide which one it is, or say there are two kinds. |
| 7 | Workshops index, https://chattanooga.digital/workshops | HTTP 404 Not Found | The menu groups two workshops under "Workshops" but the parent address does not exist. Unclear whether anything links to it. | Check whether a menu item or link points there. |
| 8 | Services vs Apps vs Home | Services lists Hubzilla (hub.chattanooga.digital) as a community service. Home "Standard apps" and /apps list six apps and do not include Hubzilla. Mastodon is a "community" service on /services but a member app on home and /apps. | Rosters disagree. | Make one roster and reference it everywhere. |
| 9 | Calendar and the four pages that point at it | "Check the calendar for upcoming sessions." (/hack-sessions), "Meets regularly; check the calendar for upcoming sessions." (/programs/lets-learn-linux) | Fetch showed no events on https://chattanooga.digital/calendar. If that is accurate, the instructions are stale or premature. Unverified because the calendar may be a script embed. | Look in a browser. If empty, either add events or soften the wording. |
| 10 | Venturing, https://chattanooga.digital/chattanooga-venturing | "Program migration to Eduity website is planned." | Pending move. The page will go stale when it happens. Not wrong today. | Add a redirect or note when it moves. |
| 11 | Newsletter form on /programs/lets-learn-linux and /programs/tech-for-leaders | "Leave this field blank" | Probably an anti-spam honeypot label. If a visitor can see it, that is a bug. Low confidence. | Eyeball in a browser. |
| 12 | Membership, https://chattanooga.digital/membership | Form asks for street address, phone number and birth date (per the fetch). | Not stale. Worth checking whether birth date is required, since it is a lot to ask of a pilot sign-up. Prices are also absent while the business plan post says there is an annual fee and a monthly utilization fee. | Confirm what is required; consider stating the fee model in plain words. |

Checked and fine: the footer reads "© Copyright 2026", which is correct for October 2026 (one fetch flagged it as a possible placeholder; it is not). Blog is current: newest post is 18 Sep 2026.

---

## Curriculum modules

### Working title

"Own Your Stack": a series for members, business owners and civic leaders who want to run on software they own. Built from the co-op's own program list, its five planned workshop topics, and its six hosted apps.

### Session format (every session)

Target 70 minutes, hard cap 75. Suggested shape: 5 min recap, 10 min why it matters, 40 min live demo, 10 min questions, 5 min homework and Discord thread. One Discord scheduled event per session, titled "Module name, session n of N", with the prerequisites pinned in the event description. One Discord thread per module for homework and questions. VOD link added to the thread after the stream. (Discord and Twitch mechanics are per the brief; the 70-minute shape is my suggestion.)

### Ordering rule

The list is in teaching order. No module depends on a module below it. "Hard" prerequisites must be done first; "soft" ones are recommended.

### Table

| # | Module | One-line description | Sessions | Prerequisites | Grounding on the site |
|---|---|---|---|---|---|
| 1 | Digital Survival Skills | Stay safe online: passwords and passkeys, removing personal data from the internet, device security. | 3 | None | /programs/discover-open-source names these three topics. |
| 2 | Co-op and Open Source Orientation | What the co-op is, what "own your apps, own your data" means in practice, and a walk through filling in the Tech Strategy Tool. | 2 | None (module 1 soft) | Home page, /apps, /tech-strategy (30 to 60 minute form). |
| 3 | Open Source Strategy for Leaders | Open source as a business option: build versus buy, vendor and SaaS contract questions, and finishing with a written action plan. Merges two site programs. | 3 | Module 2 (hard), with the Tech Strategy Tool filled in | /programs/open-for-business and /programs/tech-for-leaders. |
| 4 | Linux, Terminal and Docker On-ramp | A one-room schoolhouse for the command line: installing Linux, daily use, and the first Docker commands. | 4 | Module 1 (soft) | /programs/lets-learn-linux names install, daily use and server administration. The Docker part is ASSUMPTION, added because later modules need it. |
| 5 | Groupware I: CryptPad | Encrypted shared documents, spreadsheets, kanban boards and forms for a small team. | 2 | Module 1 (hard, for passkeys and sharing safely) | /apps#cryptpad. |
| 6 | Groupware II: Nextcloud | File sync and sharing, calendars, contacts, notes and collaborative editing; replacing Google Workspace or Microsoft 365 for a small group. | 3 | Module 1 (hard); module 5 (soft) | /workshops/nextcloud. Session breakdown is ASSUMPTION; the page has no outline. |
| 7 | Community Forums: Discourse | Stand up a forum for a group: categories, moderation, civil long-form discussion. | 2 | Module 1 (hard) | /apps#discourse. |
| 8 | Federated Social: Mastodon and Hubzilla | How the fediverse works, getting an account on toot.chattanooga.digital, and choosing between Mastodon, Hubzilla and others. | 2 | Module 1 (hard) | /apps#mastodon, /services, and the 18 Sep 2026 post "Own Your Social Media!" which compares many platforms. |
| 9 | Email Lists | Run an announcement list for a group: setup, subscribe and unsubscribe flow, writing for a list. | 2 | Module 1 (hard) | /apps#email-lists says only "Managed mailing lists give groups, projects, and the co-op itself a reliable way to send announcements." Everything past that is ASSUMPTION. |
| 10 | Drupal I: Install, Recipes and Branding | Get a Drupal CMS v2 site running in Docker, understand what a Recipe is, and brand it. | 3 | Module 1 (hard, for token and repo hygiene); module 4 (soft, otherwise use copy-paste commands) | Blog: Preface (Opening a Repo), Preface (A Token Is an Identity), Parts 0, 1, 2. |
| 11 | Drupal II: Content Model and Canvas Page Building | Content types and fields (the Event type as the worked example), then building pages and homepage components with Canvas. | 3 | Module 10 (hard) | Blog Parts 3 and 4; /workshops/basic-drupal lists "Content modeling" and "Canvas page builder." |
| 12 | Drupal III: Calendar, Forms and Cron | A community calendar with recurring dates, Webform forms with conditional logic, and scheduled jobs that keep the site alive. | 3 | Module 11 (hard) | Blog Parts 5, 6, 7. |
| 13 | Drupal IV: Deploy and Maintain | Take the site live with Portainer, Docker Swarm and Traefik, then keep it patched and healthy. | 3 | Module 4 (hard), module 12 (hard) | Blog Parts 8 and 9; /workshops/basic-drupal "Deployment pipeline (Docker, Portainer, Traefik)." |
| 14 | Drupal V: A CRM Inside Your Website | Moving a PHP application into Drupal and the seven things that broke on the way. Optional advanced module. | 2 | Module 13 (hard) | Blog Part 10. |
| 15 | Digital Marketing on Channels You Own | A content calendar across your own site, email list, forum and Mastodon account, with the website as home base. | 3 | Modules 7, 8, 9 (hard); module 11 (soft, for a site to point at) | "Digital marketing" is named as a planned workshop (/programs, home). Content is ASSUMPTION. |
| 16 | Accounting for Small Orgs | Bookkeeping basics and choosing open source accounting tools; keeping records in an owned cloud. | 3 | Modules 2 and 6 (hard) | "Accounting" is named as a planned workshop; /services lists accounting and ERP under Productivity & Office. The site names no accounting app, so the tool pick is ASSUMPTION and should be decided with the co-op before scheduling. |
| 17 | AI for Small Orgs | AI literacy and safe use, then local and open options, then using an AI coding assistant on your own repository. | 4 | Modules 1 (hard), 4 (hard for the local options session) | "Artificial intelligence" is a planned workshop (/programs); /services lists AI under Specialty & Emerging; blog Preface (A Token Is an Identity) covers letting an AI assistant open issues and commit as you. Split into 2 + 2 is ASSUMPTION. |
| 18 | Capstone Hack Session | Bring a real problem from your organization and solve it live, using your Tech Strategy Tool output. | 2 | Module 3 (hard) plus any one app module | /hack-sessions and /programs. Format depends on which definition of "hack session" the co-op means (see Stale item 6). |

**Total: 18 modules, 49 sessions, about 57 hours of streaming at 70 minutes each.**

### Not included, on purpose

- Chattanooga Venturing study group and Facilitator Bank: a discussion and consulting program, and the page says it is moving to the Eduity website.
- The "Others coming soon" wish-list categories (ERP, point-of-sale, smart home, robotics and so on): nothing on the site says any of these is deployed.

### Suggested release in three seasons (ASSUMPTION: weekly cadence, 70 minutes)

| Season | Saturday lane (non-Drupal) | Wednesday lane (Drupal) |
|---|---|---|
| 1 (about 12 weeks) | Modules 1, 2, 3, 4: 12 sessions | Modules 10, 11, 12: 9 sessions, then office hours until module 4 has finished |
| 2 (about 11 weeks) | Modules 5, 6, 7, 8, 9: 11 sessions | Modules 13, 14: 5 sessions, then a Drupal catch-up or office hours |
| 3 (about 12 weeks) | Modules 15, 16, 17, 18: 12 sessions | Open: reruns, Q&A, or new Drupal topics |

---

## Slot fit

Existing ET grid: Tue 6 PM "Can We Actually Build It?", Wed 7 PM "Drupal CMS v2 Free Forever, Canvas Page Building", Fri 6 PM live build, Sat 2 PM live build, Sun 10:30 AM "Sunday Sharp".

| Slot | Recommendation | Reason |
|---|---|---|
| Tue 6 PM | Leave alone. | Brief says not to displace "Can We Actually Build It?". |
| **Wed 7 PM** | **Drupal modules 10 to 14.** | Already the Drupal slot, and the site has a ready spine for it: the 11-part "How We Built It" series and the Basic Drupal workshop page. Module 11 (Content Model and Canvas) is the closest match to the existing show title. ASSUMPTION: the current Wednesday episodes already teach some Canvas; link them as prior viewing instead of repeating them. |
| **Sat 2 PM** | **Everything that is not Drupal (modules 1 to 9, 15 to 18).** Best fit. | The audience the site describes (small business owners, civic leaders, general members) is likelier to be free on a weekend afternoon than at 6 PM on a weekday. ASSUMPTION: that audience guess is mine. Cost: it replaces or alternates with the Saturday live build. Alternating weeks (curriculum on odd weeks) halves the pace and stretches 35 non-Drupal sessions to about 70 weeks, so weekly is better if the live build can move to Fri. |
| Fri 6 PM | Backup lane, and home for module 18 (Capstone Hack Session) once a month. | A Friday evening "bring your problem" session suits the hack-session idea and leaves Saturday for teaching. |
| Sun 10:30 AM | Do not use for full modules. At most, a short recap of the week's homework. | I do not know the format of "Sunday Sharp" and it should not be displaced. |

Discord side: one scheduled event per session, created at the start of each season from the table above, with the matching Twitch link. Wednesday events carry a "Drupal" tag and Saturday events a module name, so members can subscribe to only the lane they want. This mapping is a suggestion; I did not look at the current Discord server.

### What needs to come from the co-op before this goes live

1. A current timeline line to replace "Onboarding members · Q2 2026" (Stale item 1).
2. A decision on which meaning of "hack session" is real (Stale item 6), since module 18 depends on it.
3. Which accounting tool, if any, the co-op will stand behind (module 16).
4. Whether the co-op wants its own members' Drupal or Nextcloud instances shown on stream, or only fresh demo instances. The site does not say.
