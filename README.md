# Personal Live Streaming Website

![App Preview](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=300&fit=crop&auto=format)

A beautiful personal live streaming platform powered by Mux Video and Cosmic CMS. Features a centered, responsive video player with professional design elements for conducting high-quality live streams.

## ✨ Features

- **Mux Video Integration**: High-quality streaming with adaptive bitrate
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing
- **Professional Layout**: Clean, centered design with elegant typography
- **Stream Status**: Live indicators and offline messaging
- **Content Management**: Easy stream information updates via Cosmic CMS
- **Archive Support**: Display and manage past stream recordings
- **Fast Loading**: Optimized performance with Next.js 15

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "I want to build my own personal live streaming website using the the MUX video player. I have all the information from MUX. What do you need for the content model for a site like this?"

### Code Generation Prompt

> "Build a personal live streaming website for me to conduct my own personal livestream. Use the following code to implement my live stream video player:

<iframe
  src="https://player.mux.com/NPQ01ZJs9TAkBnsxlfsF2CvNwHXTooFdcxrgGXFEi7cs?primary-color=%2329abe2&secondary-color=%23f7fbfc"
  style="width: 100%; border: none;"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  allowfullscreen
></iframe>

center the video player and around it make it be nicely designed. Use the MUX documents if you have any questions on setting this up. Note that most of the heavy lifting with the streaming is done on the MUX side so don't worry about building that in. Just get the player added and we should be good to go."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless content management
- **Mux Video** - Professional video streaming platform
- **Responsive Design** - Mobile-first approach

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with content configured
- Mux account for video streaming

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 Cosmic SDK Examples

```typescript
// Fetch stream information
const { objects } = await cosmic.objects
  .find({ type: 'streams' })
  .props(['title', 'slug', 'metadata'])
  .depth(1)

// Get live stream status
const stream = await cosmic.objects
  .findOne({ type: 'streams', slug: 'current-stream' })
  .depth(1)
```

## 🎯 Cosmic CMS Integration

The application integrates with your Cosmic CMS to manage:

- **Stream Information**: Titles, descriptions, and scheduling
- **Live Status**: Control when streams appear as live
- **Archive Content**: Manage past stream recordings
- **Announcements**: Stream-related updates and notifications
- **Settings**: Site configuration and branding options

Your content model supports live streaming metadata including stream keys, playback IDs, and status management.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Set environment variables in Netlify dashboard

Make sure to configure your environment variables in your hosting platform's dashboard for production deployment.
