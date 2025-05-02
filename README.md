# FrontendAngularTest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (which includes npm) - ^22.14.0 (LTS) version recommended.
*   [Angular CLI](https://angular.dev/tools/cli) - ^19.2.10 version recommended. Install globally using `npm i @angular/cli@19.2.10`.

## Installation

1.  **Clone the repository:**
	If you haven't cloned the project repository yet, do so:
	```bash
	git clone https://github.com/MichelFigueira/frontend-angular-test.git
	cd frontend-angular-test
	```

2.  **Install dependencies:**
	Navigate to the project's root directory in your terminal and run:
	```bash
	npm install
	```
	This command downloads and installs all the necessary project dependencies defined in `package.json`.

## Running the Development Server

1.  **Start the server:**
	Run the following command to compile the application and start the local development server:
	```bash
	ng serve
	```
	You can also use `ng serve --open` (or `ng serve -o`) to automatically open your default browser to the application.

	> **Note:** This project uses two branches: `dev` and `master`. The `dev` branch is the main branch for development and testing purposes, while the `master` branch is reserved for production builds. Ensure you are working on the appropriate branch based on your task.

2.  **Access the application:**
	Once the server is running (it will typically say "Application bundle generation complete. [x seconds]"), open your web browser and navigate to:
	`http://localhost:4200/`

	The application will automatically reload if you change any of the source files.

## Building for Production

	To build the project for a production environment, run:

	```bash
	ng build
	```

	This command compiles your project and stores the optimized build artifacts in the `dist/frontend-angular-test/browser/` directory .
	**<span style="color:red">Remember to build on the master branch for production. The dev environment is exclusive for developers and testing.</span>**

## Running Unit Tests

	To execute the unit tests via [Jasmine/Karma], run:

	```bash
	ng test
	```

	This will launch the test runner, execute the tests, and report the results.

