# Chirps

Chirps is a modern chat application built with Next.js, Tailwind CSS, Shadcn, Clerk for authentication, and Convex for a real-time database. I'm building this for fun while learning Next.js, Tailwind CSS, Shadcn, Clerk, and Convex.

## Features

- **Real-time Messaging**: Instant messaging with real-time updates.
- **User Authentication**: Secure user authentication using Clerk.
- **Responsive Design**: Beautiful and responsive UI built with Tailwind CSS.
- **Scalable Backend**: Real-time database powered by Convex.

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn**: Component library for building consistent and accessible UI.
- **Clerk**: Authentication and user management.
- **Convex**: Real-time database for instant data synchronization.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
Note that I use Bun for this project, but you can use npm or yarn as well.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/chirps.git
    cd chirps
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:
    Create a `.env.local` file in the root directory and add your environment variables. Example:

    ```env
    NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
    CLERK_API_KEY=<your-clerk-api-key>
    CONVEX_URL=<your-convex-url>
    ```

    You can find your Clerk API keys in the Clerk Dashboard. For Convex, you can sign up for a free account on the Convex website.

### Running the App

1. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Building for Production

1. Build the application:

    ```bash
    npm run build
    # or
    yarn build
    ```

2. Start the production server:

    ```bash
    npm start
    # or
    yarn start
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Tools

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn](https://shadcn.dev/)
- [Clerk](https://clerk.dev/)
- [Convex](https://convex.dev/)
