# Kanban System
This system helps to track your tasks. There are three columns in the system: "To Do", "In Progress", and "Done". This lets you know the status of the tasks you are working on. It helps you keep control of your time and easily resume tasks from where you left off.

## To run this project on your local machine, follow the steps below

### Step I
- Clone the project to your local machine using either the SSH key or HTTPS (whichever you prefer):

    ```git clone git@github.com:dinesh-bazgain/Kanban-System.git```

### Step II
- Install all dependencies by running ```npm install``` in the root directory for both the frontend (kanban) and the backend.

### Step III
- Start your Postgres server.
- Create a database in Postgres with ```CREATE DATABASE kanban;```
- Create a local database user with your own credentials in Postgres. Add a `.env` file at the root and add your credentials, using the ```.env.example``` file as a reference.

### Step IV
- Open a terminal in the frontend (kanban) root directory and run ```npm run dev``` to start the frontend.
- To start the backend, open another terminal window, run ```cd backend```, and then run ```npm run start:dev```.

This will run both the frontend and backend, and connect to the database, giving you full access to the system.

## Demo

Check out the live version here [Live Demo](https://kanban-system-one.vercel.app/)


## License

MIT License © 2026 Dinesh Bajgain


## Contact

Feel free to reach out to me via [mail](mailto:dinesh.bazgain@gmail.com) or open an issue on GitHub!

### Happy coding and converting!!!
---



