# ClickNotes Documentation
## Overview
ClickNotes is a Next.js application built with TypeScript that allows users to search for movies, TV shows, and books using the TMDB API, Google Books API, and New York Times API (for bestsellers endpoint). Users can log in with Google authentication provided by NextAuth and save their favorite items to their Notion databases by submitting their Notion API key and database IDs which are encrypted using Advanced Encryption Standard (AES) encryption.

**You can learn about connecting your ClickNotes account to Notion [HERE](https://affiliate.notion.so/connect-to-notion).**

## Getting Started
### Running Locally
To run the ClickNotes application locally, follow these steps:
Clone the repository:
```
git clone https://github.com/drensokoli/clicknotes.git
```

Install the required packages:
```
npm install
```
Create a .env.local file in the root of the project directory and add the following environment variables:

```
GOOGLE_CLIENT_ID=5<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>

NEXTAUTH_URL=<YOUR_NEXTAUTH_URL>
JWT_SECRET=<YOUR_JWT_SECRET>
NEXTAUTH_SECRET=<YOUR_NEXTAUTH_SECRET>

MONGODB_URI=<YOUR_MONGODB_URI>
MONGODB_DB_NAME=<YOUR_MONGODB_DB_NAME>
MONGODB_COLLECTION=<YOUR_MONGODB_COLLECTION>

TMDB_API_KEY=<YOUR_TMDB_API_KEY>

GOOGLE_BOOKS_API_KEY=<YOUR_GOOGLE_BOOKS_API_KEY>
NYTIMES_API_KEY=<YOUR_NYTIMES_API_KEY>

REDIS_URL=<YOUR_REDIS_URL>

ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY>
```

### Getting your env variables
 - [TMDB API key](https://developer.themoviedb.org/reference/intro/getting-started).
 - [Google Books API key](https://developers.google.com/books/docs/v1/getting_started)
 - [New York Times API key](https://developer.nytimes.com/docs/books-product/1/overview)
 - [Google Client Auth Provider](https://console.cloud.google.com/apis/)
 - [MongoDB Atlas](https://www.mongodb.com/atlas/database)
 - [Redis](https://app.redislabs.com)

Start the development server:
```
npm run dev
```

The application should now be running at http://localhost:3000.

## Deployment
To deploy the ClickNotes application, follow the deployment instructions for your preferred hosting platform, such as Vercel or Netlify.
Make sure to set the environment variables in your hosting platform's dashboard, as specified in the .env.local file.

### Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## How to Use the App
Visit the application at http://localhost:3000.
Log in with your Google account using the "Log in with Google" button.
Navigate to the "Profile" page and submit your Notion API key and database IDs for movies, TV shows, and books.
Use the search functionality to find movies, TV shows, and books.
Click the "Save to Notion" button to save the selected item to the corresponding Notion database.

## Contributing
If you would like to contribute to the ClickNotes project, please follow the standard GitHub workflow:
Fork the repository.
Create a new branch for your feature or bugfix.
Make your changes and commit them to your branch.
<a href="https://www.buymeacoffee.com/drenso"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=drenso&button_colour=FF5F5F&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" /></a>
Submit a pull request to the main repository.
Please ensure that your code follows the existing style and structure of the project.

## License
ClickNotes is released under the [MIT License](https://github.com/drensokoli/clicknotes/blob/master/LICENSE).
