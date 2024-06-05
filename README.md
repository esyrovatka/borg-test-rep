# Borg Games

## Getting Started

Install the dependencies:

```bash
yarn
```

Run the development server:

```bash
yarn dev
```

Build the app:

```bash
yarn build
```

## Environment Variables

This project uses environment variables for configuration. You need to create a `.env` file in the root directory of the
project and fill it with your own values. You can use the `.env.example` file as a reference.

Here is an example of what the `.env` file might look like:

```dotenv
NEXT_PUBLIC_MS_CLIENT_ID=your_ms_client_id
NEXT_PUBLIC_STEAM_API_KEY=your_steam_api_key
NEXT_PUBLIC_ONE_DRIVE_BASE_URL="https://graph.microsoft.com/v1.0/me/"
NEXT_PUBLIC_BORG_URL="https://borg-ephemeral.azurewebsites.net/ephemeral/"
```

Open [https://127.0.0.1:4443/](https://127.0.0.1:4443/) with your browser to see the result.
