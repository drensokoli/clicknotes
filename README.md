# ClickNotes: Your All-in-One Media Management Solution

## Overview
ClickNotes is a comprehensive, modern web application that revolutionizes media management by seamlessly integrating with Notion to create a unified platform for organizing movies, TV shows, and books. Built with Next.js and TypeScript, this full-stack application leverages multiple external APIs to provide an extensive media discovery and management experience.

### Core Platform & Integration
At its core, ClickNotes serves as a bridge between popular media databases and your personal Notion workspace. The application connects to The Movie Database (TMDB) for movies and TV shows, Google Books API for book information, and the New York Times Bestsellers API for curated book recommendations. Users can search through vast libraries of content, discover new media, and instantly save items to their organized Notion databases with a single click.

### Search & Discovery
The application features a sophisticated search system with real-time results, allowing users to find specific titles or browse through popular content across all media types. Each search result displays comprehensive information including ratings, descriptions, release dates, cast information, and high-quality cover images. The search functionality is optimized with debounced queries to provide instant feedback while maintaining excellent performance.

### Notion Integration & Automation
ClickNotes transforms the way users interact with their media collections by automating the organization process. When users find content they want to track, the application automatically creates structured entries in their Notion databases, complete with all relevant metadata, images, and categorization. This eliminates the manual work of maintaining media lists and ensures consistency across collections.

The Notion integration is particularly powerful, offering automatic database template creation for different media types. Users can connect their Notion workspace through secure OAuth authentication, and ClickNotes will create pre-structured databases with appropriate properties for movies (including genre, rating, runtime, cast), TV shows (seasons, episodes, status), and books (author, publication date, genre, page count). The application maintains real-time synchronization with Notion, allowing users to update status, ratings, and notes directly within their Notion workspace.

### Media Management Features
For movie and TV show management, ClickNotes provides detailed information sourced from TMDB, including cast and crew details, trailers, production companies, and user ratings. The application displays high-resolution posters and backdrop images, creating an visually appealing browsing experience. Users can filter content by genre, release year, rating, and other criteria to discover new content tailored to their preferences.

The book management system integrates with Google Books API to provide comprehensive book information including author details, publication information, page counts, and book covers. The application also features integration with the New York Times Bestsellers list, automatically updating with current bestselling titles across various categories. This allows users to stay current with popular and critically acclaimed books.

### User Experience & Design
ClickNotes includes a robust user profile system that tracks all connected Notion databases and provides analytics on saved content. Users can view their complete media collection across all categories, see recently added items, and get recommendations based on their saved content. The profile system also manages multiple database connections, allowing users to organize different types of content into separate Notion workspaces if desired.

The application features a modern, responsive design that works seamlessly across desktop and mobile devices. Built as a Progressive Web App (PWA), ClickNotes can be installed on mobile devices and provides offline functionality for previously viewed content. The user interface is designed with accessibility in mind, featuring intuitive navigation, clear visual hierarchy, and responsive design patterns.

### Performance & Technical Features
Performance is a key focus of ClickNotes, with server-side rendering for improved SEO and faster initial page loads. The application implements Redis caching for frequently accessed data, reducing API calls and improving response times. Image optimization and lazy loading ensure fast page loads even with high-resolution media images.

### Security & Privacy
Security is paramount in ClickNotes' design. All user data is encrypted using AES encryption, particularly sensitive information like Notion API keys. The application implements secure session management through NextAuth.js, supporting Google OAuth for user authentication. User data is stored securely in MongoDB with proper access controls and data validation.

### Advanced Features
The application also includes advanced features like random content discovery, allowing users to get random recommendations from their saved collections. Status tracking enables users to mark items as "watched," "reading," "want to watch," or custom statuses within their Notion databases. The search functionality extends to users' personal Notion databases, enabling them to quickly find items in their collections.

### User Workflows & Scalability
ClickNotes supports multiple media workflows, from casual browsing and discovery to serious collection management. Power users can leverage the application's API integrations to bulk import content, while casual users can simply browse and save interesting titles they encounter. The application scales from personal use to family account management, with proper user separation and privacy controls.

## Key Features

### Media Integration
- **Movies & TV Shows**: Powered by TMDB API, offering access to an extensive database of films and television series
- **Books**: Integration with Google Books API and New York Times Bestsellers list
- **Real-time Search**: Instant search functionality with debounced queries for optimal performance
- **Rich Media Details**: Comprehensive information including ratings, descriptions, release dates, and more

### Modern Technology Stack
- **Frontend**: Next.js 13+ with TypeScript for type-safe development
- **Authentication**: Secure Google OAuth integration via NextAuth.js
- **Database**: MongoDB for user data storage
- **Caching**: Redis for optimized performance
- **Progressive Web App (PWA)**: Offline capabilities and mobile-first design
- **Styling**: Tailwind CSS for responsive and modern UI

### Security & Privacy
- AES encryption for sensitive data (Notion API keys)
- Secure session management
- Privacy-focused design
- GDPR-compliant data handling

### Notion Integration
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

# API Keys - TMDB
TMDB_API_KEY=<YOUR_TMDB_API_KEY>

# API Keys - OMDB (Multiple keys for higher rate limits)
OMDB_API_KEY_1=<YOUR_OMDB_API_KEY_1>
OMDB_API_KEY_2=<YOUR_OMDB_API_KEY_2>
OMDB_API_KEY_3=<YOUR_OMDB_API_KEY_3>

# API Keys - Google Books (Multiple keys for redundancy)
GOOGLE_BOOKS_API_KEY_1=<YOUR_GOOGLE_BOOKS_API_KEY_1>
GOOGLE_BOOKS_API_KEY_2=<YOUR_GOOGLE_BOOKS_API_KEY_2>

# API Keys - New York Times
NYTIMES_API_KEY=<YOUR_NYTIMES_API_KEY>

# Notion OAuth Integration
MOVIES_NOTION_OAUTH_CLIENT_ID=<YOUR_MOVIES_NOTION_OAUTH_CLIENT_ID>
MOVIES_NOTION_OAUTH_CLIENT_SECRET=<YOUR_MOVIES_NOTION_OAUTH_CLIENT_SECRET>
BOOKS_NOTION_OAUTH_CLIENT_ID=<YOUR_BOOKS_NOTION_OAUTH_CLIENT_ID>
BOOKS_NOTION_OAUTH_CLIENT_SECRET=<YOUR_BOOKS_NOTION_OAUTH_CLIENT_SECRET>

# Application URLs
BASE_URL=<YOUR_BASE_URL>
NEXT_PUBLIC_MOVIES_AUTHORIZATION_URL=<YOUR_MOVIES_AUTHORIZATION_URL>
NEXT_PUBLIC_BOOKS_AUTHORIZATION_URL=<YOUR_BOOKS_AUTHORIZATION_URL>

# Cache - Redis
REDIS_URL=<YOUR_REDIS_URL>
REDIS_HOST=<YOUR_REDIS_HOST>
REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>

# Security
ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY>

# Analytics (Optional)
NEXT_PUBLIC_MICROSOFT_CLARITY=<YOUR_MICROSOFT_CLARITY_ID>
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