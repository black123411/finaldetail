<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Showroom Quality Detailing - Local Setup Guide

This application is a full-stack web app built with React (Vite), Express (Node.js), and integrated with Square and Firebase.

## Prerequisites

- **Node.js**: [Download and install](https://nodejs.org/) (Version 18 or higher recommended).
- **Git**: (Optional) For version control.

## Getting Started

1. **Export the Code**: 
   Export this project from AI Studio as a ZIP file or to a GitHub repository.

2. **Open Terminal**: 
   Open your terminal (Terminal on Mac/Linux, Command Prompt or PowerShell on Windows).

3. **Navigate to the Project**:
   ```bash
   cd path/to/your/unzipped-folder
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

5. **Environment Setup**:
   Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and fill in your API keys:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
   - `SQUARE_ACCESS_TOKEN`: Your Square Sandbox or Production token.
   - `SQUARE_LOCATION_ID`: Your Square business location ID.

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000`.

## Building for Production

To create a production-ready build:

```bash
npm run build
```

The static files will be generated in the `dist` folder.

## Project Structure

- `/src`: Frontend React code.
- `/server.ts`: Backend Express server (handles Square API & Proxy).
- `/src/data/services.ts`: Master service list and pricing.
- `/firebase-applet-config.json`: Firebase configuration.

## Features

- **Live Square Sync**: Prices are fetched in real-time from your Square catalog.
- **Quote Engine**: Dynamic estimation based on vehicle size.
- **Vision Scan**: AI-powered condition assessment.
- **Admin Dashboard**: Manage blog posts and FAQ content.
