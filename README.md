# ATLWEB
ATLWEB is an interactive JavaScript learning platform that helps students master programming through hands-on practice and real-time feedback. The course combines theory with practical exercises to build a strong foundation in JavaScript development.

### Course Features

- 📚 Comprehensive JavaScript curriculum from basics to advanced concepts
- 💻 Interactive code editor with real-time execution
- ✅ Automated code validation and testing
- 📝 Progress tracking and achievements
- 🎯 Hands-on projects and coding challenges
- 💬 Community forum for discussion and support
- 📱 Mobile-friendly learning experience

### Course Content

1. JavaScript Fundamentals
   - Variables and Data Types
   - Operators and Control Flow
   - Functions and Scope
   - Arrays and Objects

2. Advanced JavaScript
   - DOM Manipulation
   - Asynchronous Programming
   - Error Handling
   - Modern ES6+ Features

3. Practical Projects
   - Interactive Web Apps
   - Data Visualization
   - API Integration
   - Real-world Applications

4. Best Practices
   - Code Organization
   - Debugging Techniques
   - Performance Optimization
   - Testing Strategies

## Technologies Used

- SvelteKit
- Tailwind CSS
- TypeScript
- Supabase
- Vercel
- Docker (for local development)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/RobertPietraru/atlweb
cd atlweb
```
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:
```bash
POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```
4. Start the database:
```bash
npm run db:start
```

5. Run the database migrations:
```bash
npm run db:push
```
6. Run the database seed command:
```bash
npm run db:seed
```
7. Start the development server:
```bash
npm run dev
```
8. Open your browser and navigate to `http://localhost:5173` to access the application. 
