# Google Calendar API

Clone the repo:

```
git clone git@github.com:KresimirCosic/google-calendar.git
```

Navigate to the backend directory:

```
cd path/to/google-calendar/backend
```

Add the environment variables via `.env` file as listed in the `.env.example` file:

```
touch .env
```

Install backend packages:

```
npm i
```

Run Docker:

```
docker compose up
```

The backend should fire up now successfully and create the database with provided username and password.

Run the migrations and the prisma typescript client generator:

```
npx prisma migrate dev
npx prisma generate
```

The database should now be in sync with the model schema from Prisma ORM.

Navigate to the frontend directory:

```
cd path/to/google-calendar/frontend
```

Add the environment variables via `.env` file as listed in the `.env.example` file:

```
touch .env
```

Install frontend packages:

```
npm i
```

Run the frontend dev

```
npm run dev
```
