# Your AI-Powered Study Companion 🎓

<div align="center">
  <img src="public/igebra-icon.svg" alt="iGebra.ai Logo" width="120" height="120" />
  <h3>Your AI-Powered Study Companion</h3>
</div>

## 🌟 Overview

iGebra.ai is an intelligent educational platform that combines the power of AI with personalized learning. It provides interactive tutoring across multiple subjects, making learning more engaging and effective.

## ✨ Features

- **Multi-Subject Support**: 
  - Mathematics
  - Physics
  - Chemistry
  - Biology
  - Computer Science
  - English
  - History
  - Geography

- **Smart Chat Interface**:
  - Real-time AI tutoring
  - Context-aware responses
  - Support for mathematical equations
  - Code snippets and explanations

- **Personalization**:
  - Subject-specific learning paths
  - Progress tracking
  - Customizable UI themes
  - Responsive sidebar navigation

- **Modern UI/UX**:
  - Clean, intuitive interface
  - Dark/Light mode support
  - Smooth animations
  - Mobile-responsive design

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS

- **Authentication**:
  - Supabase Auth

- **Styling**:
  - Tailwind CSS
  - CSS Modules
  - Custom animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/allwinromario/igebra.git
   cd igebra
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customization

### Theme Configuration

The application supports both light and dark modes, with customizable color schemes:

- Default theme colors can be modified in `tailwind.config.js`
- Global styles are defined in `src/app/globals.css`
- Theme switching logic is handled by `ThemeProvider.tsx`

### Adding New Subjects

To add new subjects, modify the subjects array in `src/components/Sidebar.tsx`:

```typescript
const subjects = [
  { id: 'new-subject', name: 'New Subject', icon: '🎯' },
  // ... existing subjects
];
```

## 📱 Responsive Design

iGebra.ai is built with a mobile-first approach and is fully responsive across:
- Desktop monitors
- Laptops
- Tablets
- Mobile devices

## 🔒 Security

- Secure authentication with Supabase
- Protected API routes
- Environment variable protection
- Input sanitization
- XSS protection

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for authentication
- All contributors and supporters

## 📞 Contact

Allwin Romario - [GitHub](https://github.com/allwinromario)

Project Link: [https://github.com/allwinromario/igebra.git](https://github.com/allwinromario/igebra.git)
