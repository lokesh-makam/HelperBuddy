# Helper Buddy

Helper Buddy is a web application that helps users find and book local service providers like electricians, plumbers, cleaners, and more.

## 🔧 Features

- User and service provider login/signup
- Book services based on your location
- Ratings and reviews after service
- Admin panel to manage everything

## 🛠️ Tech Stack

- Next.js  
- Tailwind CSS  
- Clerk (for authentication)  
- PostgreSQL  
- Prisma  
- Vercel (for deployment)

## 🚀 How to Run

1. Clone the project  
   `git clone https://github.com/makam-lokesh/HelperBuddy.git`

2. Install dependencies  
   `npm install`

3. Set environment variables in `.env.local`

4. Setup database  
   `npx prisma generate`  
   `npx prisma migrate dev --name init`

5. Start the app  
   `npm run dev`

---