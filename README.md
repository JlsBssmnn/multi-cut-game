## What is this game about?
This game let's you interactively solve the multicut problem.
There are different levels in ascending difficulty. If you find the optimal solution, you will be notified. There is also the option to create your own levels.

More information can be found on the home page (`/`) of the application.

## Starting the project
Because the project doesn't use babel but jest uses babel you have to delete or rename the `babel.config.js` file before starting the project. Conversely the `babel.config.js` has to be present when running tests. If the file has been removed/renamed just run:
```bash
npm run dev
```