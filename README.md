# Final Touch Window Cleaning — Website

A complete, from-scratch redesign of the marketing site for **Final Touch Window Cleaning**, a home
exterior cleaning company serving Palos Verdes and the wider South Bay, California.

Built with vanilla HTML, CSS and JavaScript — no build step, no dependencies, no environment variables.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html            Single-page site (hero, services, about, process, reviews,
                      gallery, service areas, FAQ, contact, footer)
terms.html            Terms & Conditions
privacy-policy.html   Privacy Policy
css/styles.css        Design system + all component and responsive styles
js/main.js            Nav drawer, dropdowns, FAQ accordion, form validation,
                      gallery lightbox, scroll reveal, back-to-top
favicon.svg           Brand favicon
robots.txt            Crawl directives
sitemap.xml           Sitemap
```

## Design

- **Palette:** deep navy (`#0B1B33`) with the brand's signature yellow (`#FFC629`) and clean neutrals,
  taken from the company logo.
- **Type:** Plus Jakarta Sans for headings, Inter for body copy.
- **Trust-first layout:** a 5-star Google Reviews badge in the hero, a six-item trust strip, a dedicated
  Google Reviews card linking to the live business profile, and repeated free-estimate messaging.
- Fully responsive from 320px up, with a sticky mobile call/quote bar.

## Accessibility & SEO

- Semantic landmarks, skip link, visible focus rings, ARIA on the nav, accordion and lightbox.
- Honours `prefers-reduced-motion`.
- Descriptive alt text on every image.
- Open Graph + Twitter cards, canonical URL, and JSON-LD for `HomeAndConstructionBusiness` and `FAQPage`.

## Business details

- **Phone:** (310) 755-9071
- **Email:** finaltouchsouthbay@gmail.com
- **Hours:** Mon–Fri 7:30am – 5:00pm · Sat & Sun closed
- **Services:** Window Cleaning · Pressure Washing · Screen Repair · Gutter Rinse · Solar Panel Cleaning · Surface Cleaning
- **Service areas:** Palos Verdes · Rolling Hills · San Pedro · Torrance · Redondo Beach · Long Beach · Manhattan Beach · Hermosa Beach · El Segundo

## Notes

The contact and quote forms are front-end only — they validate input and show a confirmation prompting
the visitor to call or email. Wire the `submit` handlers in `js/main.js` to a form endpoint to enable
server-side delivery.
