# Node.js App with MySQL Database Deployment Guide

This guide will walk you through the steps to configure a MySQL database using Google Cloud SQL, install a Node.js app locally, and deploy it with the Google Cloud SDK.

## Prerequisites
- Google Cloud SDK installed and authenticated
- Google Cloud SQL instance created
- Node.js and NPM installed

## Database Configuration with Google Cloud SQL

1. Open the Google Cloud Console and create a new project.

2. In the navigation menu, go to **SQL** > **Create Instance**.

3. Select MySQL as the database engine and choose a region and zone for the instance.

4. Choose a machine type and set the database version and storage capacity.

5. Set the root password and choose the network settings for the instance.

6. Click **Create** to create the instance. This may take a few minutes to complete.

7. After the instance is created, click on the instance name to go to the instance details page.

8. In the **Users** tab, click **Create User Account** to create a new user account with access to the database.

9. Set the username and password for the new user and grant it the appropriate privileges for the database.

10. In the **Databases** tab, click **Create database** to create a new database.

11. Set the name of the database and the collation settings, if applicable.

12. Note the instance connection name, database name, username, and password for use in the app configuration.

## Local Installation

1. Clone the app repository to your local machine.

2. Navigate to the app directory and run the following command to install the required dependencies:

```
npm install
```

3. Create a new `.env` file in the app directory and set the following environment variables:

```
DB_HOST=<INSTANCE_CONNECTION_NAME>
DB_USER=<DATABASE_USERNAME>
DB_PASSWORD=<DATABASE_PASSWORD>
DB_NAME=<DATABASE_NAME>
```

Replace `<INSTANCE_CONNECTION_NAME>` with the instance connection name for your Google Cloud SQL instance, `<DATABASE_USERNAME>` and `<DATABASE_PASSWORD>` with the username and password for your database user, and `<DATABASE_NAME>` with the name of your database.

4. Run the following command to start the app:

```
npm run dev
```

5. The app will be accessible at http://localhost:3000 in your web browser.

## Deployment with Google Cloud SDK

1. In the app directory, run the following command to deploy the app to Google Cloud Functions:

```
gcloud functions deploy FUNCTION_NAME --runtime nodejs14 --trigger-http --allow-unauthenticated --set-env-vars "DB_HOST=<INSTANCE_CONNECTION_NAME>,DB_USER=<DATABASE_USERNAME>,DB_PASSWORD=<DATABASE_PASSWORD>,DB_NAME=<DATABASE_NAME>"
```

Replace `FUNCTION_NAME` with the name of your function, `<INSTANCE_CONNECTION_NAME>` with the instance connection name for your Google Cloud SQL instance, `<DATABASE_USERNAME>` and `<DATABASE_PASSWORD>` with the username and password for your database user, and `<DATABASE_NAME>` with the name of your database.

2. Your function will be deployed and ready to use. You can test it using a REST client like Postman or by calling it from your frontend code.

3. To update the function with new code changes, run the same deploy command again.

