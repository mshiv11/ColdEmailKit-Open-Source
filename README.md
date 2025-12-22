# ColdEmailKit

<p align="center">
  Find the best cold email tools for your outreach.
  <br />
  <a href="https://coldemailkit.com"><strong>Learn more »</strong></a>
  <br />
  <br />
  <a href="https://coldemailkit.com">Website</a>
  ·
  <a href="https://github.com/mshiv11/ColdEmailKit-Open-Source/issues">Issues</a>
</p>

<p align="center">
   <a href="https://github.com/mshiv11/ColdEmailKit-Open-Source/stargazers"><img src="https://img.shields.io/github/stars/mshiv11/ColdEmailKit-Open-Source" alt="Github Stars" /></a>
   <a href="https://github.com/mshiv11/ColdEmailKit-Open-Source/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mshiv11/ColdEmailKit-Open-Source" alt="License" /></a>
</p>

## About this project

ColdEmailKit is a community driven list of **cold email tools** and applications.

Our goal is to be your first stop when researching for a new service to help you grow your business through cold email outreach. We will help you **find and compare** the best tools available.

Join us in creating the biggest **directory of cold email tools**.

## License & Attribution

This project is a modified version of [OpenAlternative](https://github.com/piotrkulpinski/openalternative) by [Piotr Kulpinski](https://github.com/piotrkulpinski), originally licensed under GPL-3.0.

**Modifications made by:** [mshiv11](https://github.com/mshiv11)  
**Date of first modification:** December 22, 2024  
**Summary of changes:** Rebranded as ColdEmailKit with focus on cold email tools, updated content and branding, and various feature enhancements.

This derivative work is also licensed under [GPL-3.0](LICENSE).

**Source Code:** https://github.com/mshiv11/ColdEmailKit-Open-Source

## Services

ColdEmailKit uses the following third-party services:

- Database: [Neon](https://neon.tech)
- Analytics: [Plausible](https://plausible.io), [PostHog](https://posthog.com)
- Newsletter: [Beehiiv](https://www.beehiiv.com/?via=mshiv)
- Scraping: [Firecrawl](https://firecrawl.link/mshiv)
- Background Jobs: [Inngest](https://inngest.com)
- File Storage: [AWS S3](https://aws.amazon.com/s3)
- Payments: [Stripe](https://stripe.com)
- Screenshots: [ScreenshotOne](https://screenshotone.com/?via=mshiv)

Make sure to set up accounts with these services and add the necessary environment variables to your `.env` file.

## Project Structure

ColdEmailKit is built in Next.js App Router. The project structure is organized as follows:

- `/app` - Application routes and layouts (Next.js App Router)
- `/components` - Reusable React components
- `/lib` - Core utilities and business logic
- `/actions` - Server actions
- `/utils` - Helper functions and utilities
- `/hooks` - React hooks
- `/contexts` - React context providers
- `/services` - Service integrations
- `/emails` - Email templates
- `/server` - Server-side code
- `/functions` - Utility functions
- `/config` - Configuration files
- `/content` - Content management
- `/prisma` - Prisma schema and utilities
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Development

This project uses [Bun](https://bun.sh/) as the package manager and runtime. Make sure you have Bun installed before proceeding.

To set up the project for development:

1. Clone the repository
2. Run `bun install` to install all dependencies
3. Set up the required environment variables (see below)
4. Run `bun run db:push` to push the Prisma schema to the database
5. Run `bun run dev` to start the application in development mode

### Environment Variables

Refer to the `.env.example` file for a complete list of required variables.

Copy the `.env.example` file to `.env` and update the variables as needed:

```bash
cp .env.example .env
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `bun install`     | Installs dependencies                            |
| `bun run dev`     | Starts local dev server at `localhost:5173`      |
| `bun run build`   | Build production application                     |
| `bun run start`   | Preview production build locally                 |
| `bun run lint`    | Run linter                                       |
| `bun run format`  | Format code                                      |
| `bun run typecheck` | Run TypeScript type checking                   |
| `bun run db:generate` | Generate Prisma client                       |
| `bun run db:studio` | Start Prisma Studio                           |
| `bun run db:push` | Push Prisma schema to database                  |
| `bun run db:pull` | Pull Prisma schema from database                |
| `bun run db:reset` | Reset Prisma schema                            |

## Deployment

The project is set up for deployment on Vercel. To deploy manually:

1. Build the project: `bun run build`
2. Start the production server: `bun run start`

Ensure all environment variables are properly set in your production environment.

## License

ColdEmailKit is licensed under the [GPL-3.0 License](LICENSE).
