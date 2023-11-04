# U_products

server_u_products is the backend part for my U_products project

## Major tools which I used

- **NodeJs**
- **ExpressJs** && **Express-session**
- **MongoDB** && **Mongoose**
- **Firebase** (to store images)
- **Bcryptjs**

## Included Services

- **User**
- **Product**

## Installation

Use yarn to install dependencies

```bash
yarn
```

## Usage

Create a .env file using the provided .sample.env file.
The **"G_"** prefix is for Firebase app configuration
- **DB_CS**=mongodb connection string
- **G_API_KEY**=apiKey
- **G_AUTH_DOMAIN**=authDomain
- **G_PROJECT_ID**=projectId
- **G_STORAGE_BUCKET**=storageBucket
- **G_MESSAGING_SENDER_ID**=messagingSenderId
- **G_APP_ID**=appId


Run the server using the yarn command

```bash
yarn dev
```

## Contributing

Pull requests are welcome. For significant changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
