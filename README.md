# OLMC Patch Dialer PWA

Static PWA for Vercel/GitHub Pages. It lets you search a hospital/line, shows the number tree, and opens the phone dialer with either the main number or the full pause-based dial sequence.

## Deploy to Vercel

1. Create a new GitHub repo.
2. Upload these files to the repo root.
3. In Vercel, choose **Add New Project** and import the repo.
4. Framework preset: **Other** / static.
5. Build command: leave blank.
6. Output directory: leave blank or use `.`.
7. Deploy.

## Important

The auto-dial button uses commas in the `tel:` link to add pauses between menu digits. Some phones/carriers may handle this differently. The app also includes a manual dial button so the tree can be followed normally.
