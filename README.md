# ATLWEB

ATLWEB is an educational platform designed for learning web programming in an interactive and practical way. The platform offers structured courses, practical exercises, and a community-driven learning experience.

## Features

### Learning Experience
- **Structured Courses**: Learn through well-organized courses with chapters and lessons
- **Interactive Exercises**: Practice with real-time code execution and immediate feedback
- **Progress Tracking**: Monitor your learning journey with automatic progress tracking
- **Multi-language Support**: Available in Romanian, English, Hungarian, Ukrainian, German, and Russian

### Course Management
- **Chapter-based Structure**: Courses are organized into chapters and lessons
- **Rich Content Support**: Include text, code examples, and interactive exercises
- **Progress Tracking**: Track completion of chapters and lessons
- **Exercise Integration**: Embed exercises directly in lessons

### Exercise System
- **Real-time Code Execution**: Write and test code directly in the browser
- **Multiple Exercise Types**: Code challenges, multiple choice questions, and interactive coding exercises
- **Solution History**: Track your previous solutions and improvements
- **Immediate Feedback**: Get instant feedback on your code submissions

### Admin Features
- **Course Management**: Create and manage courses, chapters, and lessons
- **Exercise Management**: Create and configure various types of exercises
- **User Management**: Manage user accounts and permissions
- **Content Organization**: Drag-and-drop interface for organizing course content

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Choose your preferred theme
- **Intuitive Navigation**: Easy-to-use interface with breadcrumb navigation
- **Community Features**: Connect with other learners

## Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **UI Components**: Custom components with Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: Custom authentication system
- **Code Execution**: Secure code execution environment
- **Internationalization**: Paraglide for multi-language support

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RobertPietraru/atlweb.git
cd atlweb
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Initialize the database:
```bash
npm run db:init
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run check`: Run type checking
- `npm run lint`: Run linting
- `npm run test`: Run tests

### Project Structure

```
src/
├── lib/
│   ├── components/    # UI components
│   ├── server/        # Server-side code
│   └── utils/         # Utility functions
├── routes/            # Application routes
├── styles/            # Global styles
└── app.html          # HTML template
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email rob_piet@yahoo.com or open an issue in the GitHub repository.

## Acknowledgments

- National College "A. T. Laurian" Botoșani
- All contributors and users of the platform
