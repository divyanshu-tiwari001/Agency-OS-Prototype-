<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1oNWZajSFXAjIt19kUaAr7gtp8VhBJcUQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env` file in the root directory and add your Gemini API key:
   `VITE_GEMINI_API_KEY=your_api_key_here`
3. Run the app:
   `npm run dev`

## Build for Production

To build the app for production deployment:

```bash
npm run build
```

This will create a `dist/` directory with optimized production files.

To preview the production build locally:

```bash
npm run preview
```

## Deploy

The app includes deployment configurations for:
- **Vercel**: Uses `vercel.json` 
- **Netlify**: Uses `netlify.toml`

Make sure to set the `VITE_GEMINI_API_KEY` environment variable in your deployment platform's settings.
