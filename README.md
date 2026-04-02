# Grotto Seekers

Callum Disley & Niamh Roche — trusted house & pet sitters across the UK and Australia.

Built with [Astro](https://astro.build/) v6.

---

## Getting Started (Local Development)

### Prerequisites

You need **Node.js** installed (version 18 or higher). Download it from [nodejs.org](https://nodejs.org/).

To check if you have it, open a terminal and run:

```bash
node --version
```

### Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

This starts a local server (usually at `http://localhost:4321`). Open that URL in your browser to see the site. Changes you make to the code will update automatically.

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with the final website files.

---

## How to Deploy with GitHub Pages

This guide assumes you have a GitHub account. If not, create one at [github.com](https://github.com/).

### Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `grottoseekers` (or whatever you like)
3. Leave it as **Public**
4. **Don't** tick "Add a README" (we already have one)
5. Click **Create repository**

### Step 2: Connect Your Local Project to GitHub

Open a terminal in your project folder and run these commands one by one:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/grottoseekers.git
git push -u origin main
```

> **Important:** Replace `YOUR-USERNAME` with your actual GitHub username (e.g., `GrottoSeekers`).

If this is your first time using Git, it may ask you to log in. Follow the prompts.

### Step 3: Set Up GitHub Actions to Auto-Deploy

Create a file at `.github/workflows/deploy.yml` in your project (the folders `.github` and `workflows` need to be created too):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ github.pages.url }}
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (the gear icon tab)
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions**
5. That's it — no need to select a branch

### Step 5: Update the Astro Config (if needed)

The `astro.config.mjs` file is already set up for GitHub Pages. If your repository name is different, update the `base` value:

```js
export default defineConfig({
  site: "https://YOUR-USERNAME.github.io",
  base: "/your-repo-name",
});
```

### Step 6: Push and Deploy

Every time you push to the `main` branch, the site will automatically build and deploy:

```bash
git add .
git commit -m "Update site"
git push
```

After a minute or two, your site will be live at:

```
https://YOUR-USERNAME.github.io/grottoseekers/
```

### Step 7: Using a Custom Domain (Optional)

If you want to use a custom domain like `grottoseekers.com`:

1. Buy a domain from a registrar (Namecheap, Google Domains, etc.)
2. In your GitHub repo, go to **Settings > Pages**
3. Under **Custom domain**, type your domain and click **Save**
4. At your domain registrar, add a **CNAME** record pointing to `YOUR-USERNAME.github.io`
5. Update `astro.config.mjs`:
   ```js
   export default defineConfig({
     site: "https://grottoseekers.com",
     base: "/",
   });
   ```
6. Push the changes and wait a few minutes for it to go live

---

## Project Structure

```
/
├── public/              # Static assets (images, favicon, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Services.astro
│   │   ├── Gallery.astro
│   │   ├── Reviews.astro
│   │   ├── Profiles.astro
│   │   └── Enquiry.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Adding Your Photos

Replace the placeholder images in the Gallery and About components:

1. Put your photos in the `public/images/` folder
2. Edit `src/components/Gallery.astro` — replace the placeholder divs with `<img>` tags
3. Edit `src/components/About.astro` — replace the placeholder div with your photo

Example:
```html
<img src="/grottoseekers/images/your-photo.jpg" alt="Description" />
```
