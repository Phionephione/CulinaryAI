# CulinaryAI Fridge Assistant

CulinaryAI is a sleek, intelligent kitchen companion designed to turn your fridge contents into gourmet meals. Using the power of Google's Gemini AI, the app analyzes photos of your fridge, identifies ingredients, and generates personalized recipes tailored to your dietary needs.

## 🌟 Features

-   **Smart Vision Analysis**: Snap or upload a photo of your open fridge. The app uses `gemini-3-pro-preview` to identify visible food items automatically.
-   **Dynamic Recipe Engine**: Based on detected ingredients and your chosen dietary filters (Keto, Vegan, etc.), the app generates unique recipes using `gemini-3-flash-preview`.
-   **Hands-Free Cooking Mode**: An immersive, large-text interface for step-by-step cooking.
-   **AI Voice Assistant**: Integrated text-to-speech (TTS) powered by `gemini-2.5-flash-preview-tts` reads instructions aloud so you can keep your hands on the whisk.
-   **Integrated Shopping List**: One-click addition of missing ingredients to a persistent shopping list.
-   **Dietary Personalization**: Filter recipes by Vegetarian, Vegan, Keto, Paleo, or Gluten-Free restrictions.

## 🛠️ Technical Architecture

The application is built with a modern frontend stack and leverages multiple specialized Gemini models for a multi-modal experience.

### AI Models Used
-   **`gemini-3-pro-preview`**: Handles the complex task of visual ingredient recognition from fridge photos.
-   **`gemini-3-flash-preview`**: Powers the recipe generation engine, providing structured JSON data for fast and accurate recipe suggestions.
-   **`gemini-2.5-flash-preview-tts`**: Provides high-quality, natural-sounding voice synthesis for the "Read Aloud" feature in cooking mode.

### Tech Stack
-   **Framework**: React (v19)
-   **Styling**: Tailwind CSS
-   **Icons**: Font Awesome 6
-   **State Management**: React Hooks (useState, useEffect, useCallback)
-   **API Client**: `@google/genai` (Google GenAI SDK)

## 📁 Project Structure

```text
/
├── App.tsx             # Main application logic and state
├── index.tsx           # React entry point
├── index.html          # Main HTML template
├── types.ts            # TypeScript interfaces and enums
├── geminiService.ts    # Centralized service for all AI interactions
├── components/         # UI Components
│   ├── Sidebar.tsx      # Navigation and Dietary filters
│   ├── CameraCapture.tsx# Image upload and camera logic
│   ├── RecipeGrid.tsx   # Display for suggested recipe cards
│   ├── CookingMode.tsx  # Immersive cooking UI with TTS
│   └── ShoppingList.tsx # List management for missing items
└── metadata.json       # App configuration and permissions
```

## 🚀 How to Use

1.  **Analyze Your Fridge**: Start on the "My Fridge" tab. Click the camera area to upload a photo of your fridge interior.
2.  **Filter Results**: Use the sidebar to select any dietary restrictions (e.g., "Keto").
3.  **Browse Recipes**: Switch to the "Recipes" tab to see AI-generated suggestions including difficulty ratings, prep time, and calories.
4.  **Cook**: Select a recipe to enter "Cooking Mode".
    -   Use the **Checklist** view to see what you need. Add missing items to your shopping list with the `+` button.
    -   Use the **Cooking** view for a focused, step-by-step experience.
    -   Click the **Speaker Icon** to have the AI read the current step aloud.
5.  **Shop**: Visit the "Shopping List" tab to manage ingredients you need to buy for your next meal.

## 🔑 Environment Requirements

The application requires a valid Gemini API key provided through the environment variable `process.env.API_KEY`.
