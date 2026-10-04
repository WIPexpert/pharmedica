# Pharmedica website prototype

Static site, no build step. Three pages:

- `index.html` – company home: technology, products and pipeline, partners, team, contact
- `icling.html` – English storefront for iCling™ (checkout links to the current store at icling.co.il)
- `investors.html` – investor overview and investor-pack request

Shared files: `assets/css/style.css`, `assets/js/main.js` (glossary tooltips, film demo, charts, forms), `assets/img/`.

## Publish on GitHub Pages

1. Create a repository (for example `pharmedica-site`) and upload the contents of this folder to the root of the `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
3. After a minute the site is live at `https://<your-account>.github.io/pharmedica-site/`.
4. Custom domain (optional): add it under **Settings → Pages → Custom domain** and point a CNAME DNS record to `<your-account>.github.io`.

The `.nojekyll` file tells GitHub Pages to serve the files as they are.

## Editing

- Glossary terms (tooltips and the Glossary panel) live in one place: the `GLOSSARY` object at the top of `assets/js/main.js`. In the HTML, mark a term with `<span class="t" data-t="key">word</span>`.
- Forms have no server. They open the visitor's email app with the message filled in (`data-mailto` on the `<form>`). Swap in Formspree, HubSpot or similar when going live.

## Before launch

Review notes are hidden on the live site. To see them, open any page with `?review` at the end of the address (for example `.../investors.html?review`): an orange **Review notes** button appears bottom left and highlights every statement that needs the company's confirmation. Hover a highlighted item to read the note. The notes live in the HTML as `class="chk" data-note="..."`; delete them once each item is settled.

Open items flagged in the prototype:

1. 150 mg dose: the deck says "up to (exceptional) 150 mg". Agree public wording.
2. iCling price: product page ₪98 vs store FAQ ₪79.
3. iCling placement: upper gum (pharmedica.co.il) vs inner cheek or palate (store).
4. iCling duration: "up to 2 hours" (store) vs "several hours" (deck, old site).
5. Registration: deck says AMAR approval + FDA OTC monograph; store says "CE/FDA pending".
6. "Natural ingredients only" claim vs ingredient list (PEG 400, propylene glycol, sucralose).
7. 91% feedback and ~90 min figures: confirm which study and what can be published.
8. Partner names (Colgate-Palmolive, Dr. Reddy's, IDF): written approval and agreement status.
9. Pipeline stages and Q3 2026 US-sales milestone: update to current status.
10. CannaBeyond structure.
11. 2023 US provisional patent applications: converted or lapsed?
12. Business-plan figures on a public page; raise size intentionally not shown (US general-solicitation rules). Counsel/OBEX review.
13. Address: Ness Ziona (current) vs Haifa P.O. Box (old dry-mouth page).
14. Team photos are low-resolution crops from the deck; English pack shot needed.
15. Competitor table: source the figures before naming competitors publicly.
16. Shop checkout: keep redirect to the Hebrew store or add an English checkout.
