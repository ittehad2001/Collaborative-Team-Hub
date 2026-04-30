# FredoCloud Collaborative Team Hub

Monorepo implementation of the internship assignment using **Turborepo**, with:
- `apps/web`: Next.js 14+ App Router + Tailwind + Zustand
- `apps/api`: Express + Prisma + PostgreSQL + JWT cookies + Socket.io + Cloudinary
- `packages/shared`: shared constants for domain status enums

## Advanced features chosen
1. **Optimistic UI** (goal/item/announcement creation and item status update apply instantly with rollback on API failure)
2. **Advanced RBAC** (workspace membership + role middleware enforces admin/member permissions per route)

## Implemented features
- Email/password register/login
- JWT access + refresh token flow using httpOnly cookies
- Protected dashboard flow
- Profile endpoint + avatar upload to Cloudinary
- Multi-workspace listing/creation and invite by email with role
- Goals, milestones, and progress updates APIs
- Announcements, comments, emoji reactions, pin support
- Action items with status/priority/due date and goal linking
- Kanban/list toggle UI
- Real-time updates + online members via Socket.io
- Mention notification system: `@email` creates in-app notifications for matched workspace members
- Analytics dashboard cards + Recharts pie chart
- CSV export endpoint for workspace action items
- Swagger docs at `/api/docs`
- Backend tests with Jest + Supertest + token utility tests

## Monorepo scripts
From repo root:

```bash
npm install
npm run dev
npm run build
```

## Local setup
1. Copy env files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```
2. Install dependencies:
```bash
npm install
```
3. Start PostgreSQL and set `DATABASE_URL`.
4. Run Prisma migration + generate client:
```bash
npm run prisma:generate --workspace apps/api
npm run prisma:migrate --workspace apps/api
npm run prisma:seed --workspace apps/api
```
5. Start apps:
```bash
npm run dev
```

## Railway deployment notes
Create one Railway project with:
- Web service root: `apps/web`
- API service root: `apps/api`
- PostgreSQL plugin attached to API service

Set required variables exactly as assignment specifies.

## Demo account
- Email: `demo@teamhub.com`
- Password: `demo1234`

(Available after running seed.)

## Known limitations
- Rich text editor is lightweight contenteditable (not a full editor framework like TipTap/Slate).
- Frontend does not yet render threaded comment history beneath announcements.
- Railway deployment/live URLs and video walkthrough still need to be completed for submission packaging.
