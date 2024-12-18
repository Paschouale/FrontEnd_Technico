# Technico - Renovation Contractor Agency Web Application

Technico is a full-stack web application for managing renovation projects. It includes two primary roles: **Admin (Agency Employee)** and **Property Owner (Client)**. The platform supports property management, repair tracking, and detailed reporting.

## Table of Contents

- [Technico - Renovation Contractor Agency Web Application](#technico---renovation-contractor-agency-web-application)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Application Features](#application-features)
  - [Project Structure](#project-structure)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Project Overview

Technico is designed to streamline property and repair management by offering:

- CRUD operations for **Property Owners**, **Properties**, and **Repairs**
- Role-based authentication and authorization
- An interactive admin dashboard with repair schedules
- Owner-specific dashboards with repair histories
- Detailed modals for viewing and managing records

## Technologies Used

**Frontend:**
- Angular 18
- Bootstrap 5
- SCSS

**Backend:**
- Java 23
- Spring Boot
- MySQL Server

**Other:**
- Maven
- IntelliJ IDEA
- Visual Studio Code
- MySQL Workbench
- GitHub for version control

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/technico-backend.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd technico-backend
   ```
3. Build the project using Maven:
   ```bash
   mvn clean install
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/your-username/technico-frontend.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd technico-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   ng serve
   ```
5. Access the app at `http://localhost:4200/`

## Application Features

### Admin Features:
- **Dashboard:** View scheduled repairs.
- **Search:** Find records by ID, name, or status.
- **Manage:** CRUD operations for Properties, Property Owners, and Repairs.

### Property Owner Features:
- **Dashboard:** View personal properties and repairs.
- **Edit Profile:** Update personal details securely.
- **Request Repair:** Submit new repair requests for properties.


## Usage

1. Login as **Admin** or **Property Owner**.
2. Admins can manage all records, while Property Owners can only manage their properties and repair requests.
3. Use the search bar and filters for faster record lookup.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
