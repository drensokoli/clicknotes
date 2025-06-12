# ClickNotes: Your All-in-One Media Management Solution

## Overview
ClickNotes is a modern, full-stack web application built with Next.js and TypeScript that revolutionizes how users manage their media collections. It seamlessly integrates with Notion to create a powerful, unified platform for organizing movies, TV shows, and books. The application leverages multiple APIs (TMDB, Google Books, and New York Times) to provide comprehensive media discovery and management capabilities.

## Key Features

### 🎬 Media Integration
- **Movies & TV Shows**: Powered by TMDB API, offering access to an extensive database of films and television series
- **Books**: Integration with Google Books API and New York Times Bestsellers list
- **Real-time Search**: Instant search functionality with debounced queries for optimal performance
- **Rich Media Details**: Comprehensive information including ratings, descriptions, release dates, and more

### 📱 Modern Technology Stack
- **Frontend**: Next.js 13+ with TypeScript for type-safe development
- **Authentication**: Secure Google OAuth integration via NextAuth.js
- **Database**: MongoDB for user data storage
- **Caching**: Redis for optimized performance
- **Progressive Web App (PWA)**: Offline capabilities and mobile-first design
- **Styling**: Tailwind CSS for responsive and modern UI

### 🔒 Security & Privacy
- AES encryption for sensitive data (Notion API keys)
- Secure session management
- Privacy-focused design
- GDPR-compliant data handling

### 🎯 Notion Integration
- One-click saving to custom Notion databases
- Automated template creation
- Secure API key management
- Real-time synchronization

## Technical Architecture

### Core Technologies
- **Framework**: Next.js 13.3.1
- **Language**: TypeScript 5.0.4
- **Authentication**: NextAuth.js 4.22.1
- **Database**: MongoDB 5.3.0
- **Caching**: Redis (ioredis 5.3.2)
- **UI Framework**: Tailwind CSS 3.3.2
- **State Management**: React Hooks
- **API Integration**: 
  - TMDB API for movies and TV shows
  - Google Books API for book data
  - New York Times API for bestsellers
  - Notion API for database integration

### Performance Optimizations
- Server-side rendering (SSR) for improved SEO
- Client-side caching with Redis
- Debounced search queries
- Optimized image loading
- PWA support for offline access

## Getting Started

### Prerequisites
- Node.js >= 14.0.0
- MongoDB instance
- Redis server
- API keys for:
  - TMDB
  - Google Books
  - New York Times
  - Google OAuth
  - Notion

### Installation

1. Clone the repository:
```bash
git clone https://github.com/drensokoli/clicknotes.git
cd clicknotes
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# Authentication
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
NEXTAUTH_URL=<YOUR_NEXTAUTH_URL>
JWT_SECRET=<YOUR_JWT_SECRET>
NEXTAUTH_SECRET=<YOUR_NEXTAUTH_SECRET>

# Database
MONGODB_URI=<YOUR_MONGODB_URI>
MONGODB_DB_NAME=<YOUR_MONGODB_DB_NAME>
MONGODB_COLLECTION=<YOUR_MONGODB_COLLECTION>

# API Keys
TMDB_API_KEY=<YOUR_TMDB_API_KEY>
GOOGLE_BOOKS_API_KEY=<YOUR_GOOGLE_BOOKS_API_KEY>
NYTIMES_API_KEY=<YOUR_NYTIMES_API_KEY>

# Cache
REDIS_URL=<YOUR_REDIS_URL>

# Security
ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY>
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Deployment
ClickNotes is optimized for deployment on Vercel, but can be deployed on any platform that supports Next.js applications. For detailed deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
If you find ClickNotes useful, consider supporting its development:
[Buy me a coffee](https://www.buymeacoffee.com/drenso)

## Author
- **Dren Sokoli** - [GitHub](https://github.com/drensokoli) | [LinkedIn](https://linktr.ee/drensokoli)

---

<div style="text-align: center;">
    <a href="https://www.buymeacoffee.com/drenso"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=drenso&button_colour=FF5F5F&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" /></a>
</div>
