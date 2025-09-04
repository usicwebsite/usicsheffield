# USIC Sheffield Website

The official website for The Islamic Circle at the University of Sheffield (USIC). This modern, responsive website provides a comprehensive platform for Muslim students to connect, access resources, and stay informed about community events.

## 🌟 Features

### 🏠 **Homepage**
- **Hero Section**: Dynamic image slideshow showcasing USIC community events and activities
- **About Section**: Interactive cards displaying USIC's aspirations, values, and vision
- **Events Section**: Upcoming events with detailed information and registration
- **Membership Section**: Information about joining USIC and member benefits

### 📱 **Core Pages**
- **About**: Detailed information about USIC's mission and history
- **Events**: Comprehensive events calendar and registration system
- **Blog**: Community news and articles
- **Resources**: Educational materials and useful links
- **Membership**: Join USIC and access member-only content
- **Sponsors**: Showcase of our generous sponsors and partners

### 🔐 **Authentication & Admin**
- **Google OAuth Integration**: Secure login with Google accounts
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Post Management**: Create, edit, and moderate community posts
- **Analytics**: Track website usage and engagement metrics


### 🎨 **Design & UX**
- **Modern UI**: Clean, professional design with Islamic aesthetic elements
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance**: Optimized images, lazy loading, and efficient code splitting

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library

### Backend & Services
- **Firebase**: Authentication, Firestore database, and hosting
- **Firebase Admin SDK**: Server-side operations and admin features
- **JWT**: Secure token-based authentication
- **Rate Limiting**: API protection against abuse

### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing
- **Turbopack**: Fast development builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/usicsheffield.git
   cd usicsheffield
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```

4. **Configure Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google provider)
   - Create a Firestore database
   - Generate a service account key
   - Add your Firebase configuration to `.env.local`

5. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The website will be available at `http://localhost:3000`

## ⚙️ Environment Variables

Create a `.env.local` file with the following variables:

### Firebase Configuration (Required)

**Important**: The Firebase environment variables must be configured in your production deployment platform. Copy the values from `docs/env.example` and set them in your deployment environment.

For **Vercel**:
1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable from `docs/env.example`

For **Netlify**:
1. Go to Site Settings > Environment Variables
2. Add each variable from `docs/env.example`

For **other platforms**, add the environment variables in their respective environment variable sections.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: If you get a "Firebase: Error (auth/invalid-api-key)" error in production, it means these environment variables are not properly set in your deployment platform.

### Firebase Admin SDK (Required for admin features)
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Security
```env
JWT_SECRET=your_secure_jwt_secret
```

### Rate Limiting (Optional)
```env
# Questions endpoint rate limiting (3 questions per hour)
RATE_LIMIT_QUESTIONS_WINDOW_MS=3600000
RATE_LIMIT_QUESTIONS_PER_HOUR=3

# Posts endpoint rate limiting (1 post per hour for regular users)
RATE_LIMIT_POSTS_WINDOW_MS=3600000
RATE_LIMIT_POSTS_PER_HOUR=1

# Admin posts endpoint rate limiting (10 posts per hour for admins)
RATE_LIMIT_POSTS_ADMIN_WINDOW_MS=3600000
RATE_LIMIT_POSTS_ADMIN_PER_HOUR=10

# Authentication rate limiting (20 attempts per 15 minutes)
RATE_LIMIT_AUTH_WINDOW_MS=900000
RATE_LIMIT_AUTH_ATTEMPTS=20

# Token refresh rate limiting (30 refreshes per 5 minutes)
RATE_LIMIT_REFRESH_WINDOW_MS=300000
RATE_LIMIT_REFRESH_ATTEMPTS=30

# Admin operations rate limiting (50 operations per hour)
RATE_LIMIT_ADMIN_WINDOW_MS=3600000
RATE_LIMIT_ADMIN_OPERATIONS=50

# Rate limit cleanup interval (5 minutes)
RATE_LIMIT_CLEANUP_INTERVAL_MS=300000
```

### Cloudinary (Required for profile photo uploads)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   └── auth/          # Authentication endpoints
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard
│   ├── admin-login/       # Admin login page
│   ├── blog/              # Blog page
│   ├── events/            # Events page
│   ├── membership/        # Membership page
│   ├── resources/         # Resources page
│   └── sponsors/          # Sponsors page
├── components/            # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── contexts/             # React contexts
├── lib/                  # Utility functions and configurations
└── middleware.ts         # Next.js middleware
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting
1. Build the project: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Initialize Firebase: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🔒 Security Features

- **Rate Limiting**: API endpoints protected against abuse
- **Input Validation**: All user inputs validated and sanitized
- **CSRF Protection**: Cross-site request forgery protection
- **Secure Headers**: Security headers configured
- **Authentication**: JWT-based authentication with Firebase
- **Authorization**: Role-based access control for admin features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: islam.circle@sheffield.ac.uk
- Website: [usic-sheffield.org](https://usic-sheffield.org)

## 🙏 Acknowledgments

- University of Sheffield for support
- Our generous sponsors
- The USIC community for feedback and testing
- All contributors who have helped build this platform
