# Dermo Layer: Wadi El Nile Derma

Product website for a series of therapeutic skin moisturizers developed by students of the Faculty of Pharmacy, Wadi El Nile University, as their project. The pharmacy students asked me to build the site for their product, and we worked on it together.

## Pages

- **Home**: the project overview and the three-product range
- **Oily skin**, **Dry skin** and **Combination skin**: one page per moisturizer formula

## Features

- Arabic and English interface, switched at runtime from JSON language files (`lang/ar.json`, `lang/en.json`)
- Responsive layout
- Plain HTML, CSS and JavaScript, no build step

## Tech

HTML5, CSS3, JavaScript

## Run locally

Open `index.html` in a browser. To serve it over HTTP, which is needed for the language files to load:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Author

Mahmoud Badea Elzaman, Faculty of Computers and Information, Kafrelsheikh University.
