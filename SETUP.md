# Job Crawler - Business Data Extraction Tool

A Next.js web crawler that extracts business information from websites and saves it to MongoDB.

## Features

- 🔍 **Web Crawling**: Extract business data from any URL
- 📊 **Data Display**: View extracted data in a clean table format
- 💾 **Database Storage**: Save extracted data to MongoDB
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support

## Extracted Data Fields

- **Name**: Business/company name
- **Phone Number**: Contact phone number
- **Instagram**: Instagram handle/link
- **Address**: Physical address
- **Email**: Contact email
- **Description**: Business description

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up MongoDB**:

   **Option A: Local MongoDB**
   - Install MongoDB from https://www.mongodb.com/try/download/community
   - Start MongoDB service
   - The app will use: `mongodb://localhost:27017/jobcrawler`

   **Option B: MongoDB Atlas (Cloud)**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get your connection string
   - Update `.env.local` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobcrawler
   ```

3. **Configure environment variables**:
   - Edit `.env.local` file
   - Set your MongoDB URI

## Usage

1. **Start the development server**:
```bash
npm run dev
```

2. **Open your browser**:
   - Navigate to http://localhost:3000

3. **Crawl a website**:
   - Enter a URL (e.g., https://hamvatan.org/toronto/...)
   - Click "Start Crawling"
   - View extracted data in the table

4. **Save to database**:
   - Click "Save to Database" button
   - Data will be saved to MongoDB

## Project Structure

```
jobcrawler/
├── app/
│   ├── api/
│   │   ├── crawl/         # Crawling endpoint
│   │   │   └── route.ts
│   │   └── save/          # Save to database endpoint
│   │       └── route.ts
│   ├── page.tsx           # Main page with UI
│   └── layout.tsx
├── lib/
│   └── mongodb.ts         # MongoDB connection
├── models/
│   └── data.ts           # Mongoose schema
└── .env.local            # Environment variables
```

## API Endpoints

### POST /api/crawl
Extracts data from a given URL.

**Request**:
```json
{
  "url": "https://example.com"
}
```

**Response**:
```json
{
  "name": "Business Name",
  "phoneNumber": "+1234567890",
  "instagram": "@username",
  "address": "123 Street",
  "email": "info@example.com",
  "description": "Business description",
  "crawledAt": "2026-02-18T..."
}
```

### POST /api/save
Saves extracted data to MongoDB.

**Request**:
```json
{
  "name": "Business Name",
  "phoneNumber": "+1234567890",
  "instagram": "@username",
  "address": "123 Street",
  "email": "info@example.com",
  "description": "Business description"
}
```

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Cheerio** - HTML parsing
- **Axios** - HTTP requests
- **Mongoose** - MongoDB ODM
- **MongoDB** - Database

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally: `mongod --version`
- Check connection string in `.env.local`
- For Atlas, whitelist your IP address

### Crawling Issues
- Some websites may block automated requests
- Check if the website structure matches the expected selectors
- Verify the URL is accessible

## License

MIT
