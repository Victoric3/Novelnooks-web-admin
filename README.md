# Sushmeela Portfolio Website

## Overview

The Sushmeela Portfolio Website is an advanced platform designed to showcase Sushmeela's skills, projects, and professional journey. Developed with a focus on modern web technologies and user experience, this website serves as a dynamic portfolio that highlights Sushmeela's capabilities and achievements.

## Features

### 1. **User-Friendly Interface**
   - Clean and intuitive design for easy navigation.
   - Responsive layout ensuring a seamless experience across devices.

### 2. **Dynamic Content Management**
   - Admin interface to add and manage content dynamically.
   - Ability to update projects, write-ups, and other professional content regularly.

### 3. **Advanced Skills Section**
   - A dedicated section showcasing Sushmeela's advanced skills in a first-person context.
   - Detailed descriptions and examples of proficiency in various technologies and methodologies.

### 4. **Interactive Elements**
   - Rich text editor for creating detailed project descriptions and posts.
   - Interactive icons and elements to enhance user engagement.

### 5. **Authentication and Security**
   - Secure login system for administrators.
   - Email notifications for scheduled calls and other important actions.

### 6. **SEO Optimized**
   - Proper use of meta tags and SEO best practices to ensure visibility on search engines.

### 7. **Backend Integration**
   - Node.js server with RESTful APIs.
   - Integration with third-party services like Google SMTP for email notifications.

## Technologies Used

- **Frontend**: React, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Email Service**: Nodemailer with Google SMTP
- **Other Tools**: Pug for email templates, slugify for URL management

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/Victoric3/sushmeela/tree/master
    cd sushmeela-portfolio
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:

    ```env
    NODE_ENV=development
    SITE_NAME=Sushmeela Portfolio
    EMAIL_ACCOUNT=sushmeelawritess@gmail.com
    EMAIL_PASS=your_generated_app_password
    EMAIL_USERNAME_DEV=your_mailtrap_username
    EMAIL_PASS_DEV=your_mailtrap_password
    ```

4. **Start the development server:**
    ```sh
    npm run dev
    ```

### Usage

- **Admin Interface:** Accessible only to authenticated users, allowing Sushmeela to add, update, or delete content dynamically.
- **Public Interface:** Accessible to all users, showcasing Sushmeela's portfolio in a visually appealing manner.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or feedback, please contact Sushmeela at [sushmeelawritess@gmail.com](mailto:sushmeelawritess@gmail.com).
