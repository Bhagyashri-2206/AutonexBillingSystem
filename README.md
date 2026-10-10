# 🧾 AutoNex Technology – Billing Management System

A **MERN Stack Billing Management System** developed to simplify invoice generation, quotation management, and billing record tracking for businesses.

The application provides a user-friendly dashboard where users can generate GST invoices and quotations, download PDF documents, and manage billing records efficiently.

## 🚀 Features

- 🔐 **User Authentication:** User registration and login with JWT-based authentication.
- 📊 **Interactive Dashboard:** Access billing features through a centralized dashboard.
- 🧾 **GST Invoice Generation:** Create invoices with customer details, quantities, rates, and calculated amounts.
- 📑 **Quotation Management:** Generate quotations for customers.
- 🧮 **Automatic Calculations:** Calculate item totals and applicable GST amounts.
- 📄 **PDF Generation:** Generate downloadable invoice and quotation PDFs.
- 📚 **Invoice History:** View and manage previously generated billing documents.
- 🔎 **Search Functionality:** Find billing records using customer information.
- 🔄 **Document Status Management:** Update document status when required.
- 👤 **User Profile:** Access user-related information.
- 📱 **Responsive Interface:** Designed to provide a convenient experience across different screen sizes.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- REST API
- JSON Web Token (JWT)
- PDFKit

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Development Tools
- Visual Studio Code
- Postman
- Git
- GitHub
- npm

## 🏗️ System Architecture

The application follows a client-server architecture.

1. **Frontend:** React provides the user interface and dashboard.
2. **Backend:** Node.js and Express.js handle API requests and application logic.
3. **Database:** MongoDB stores user information and billing documents.
4. **Authentication:** JWT protects routes that require an authenticated user.
5. **PDF Service:** PDFKit generates invoice and quotation documents.

## 📂 Project Structure

```text
AutonexBillingSystem/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   │   └── pdf/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

*Note: Adjust the folder names to match your actual project structure.*

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Visual Studio Code
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/AutonexBillingSystem.git
```

Navigate to the project folder:

```bash
cd AutonexBillingSystem
```

### 2. Set Up the Backend

Navigate to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the server folder and configure the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your actual configuration. Never upload real credentials or secrets to GitHub.

### 3. Start the Backend Server

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

### 4. Set Up the Frontend

Open a new terminal and navigate to the frontend folder from the project root:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

*Note: These commands assume your frontend is in a `client` folder and uses Vite. Adjust them if your actual setup differs.*

## 🔄 Application Workflow

1. Register a new user account.
2. Log in using the registered credentials.
3. Access the billing dashboard.
4. Select **Generate Invoice** or **Quotation**.
5. Enter customer details and item information.
6. Review the calculated amounts and applicable GST.
7. Generate and download the PDF document.
8. Visit **Invoice History** to find previously generated records.
9. Search for documents and update their status when needed.

## 🔒 Security

- Passwords should be stored using secure password hashing.
- JWT authentication is used to protect authorized routes.
- Environment variables are used for sensitive configuration.
- Database credentials and authentication secrets should never be committed to GitHub.

## 🎯 Project Objective

The primary objective of this project is to develop a web-based billing solution that reduces manual billing work, simplifies GST invoice and quotation generation, and improves the organization of business billing records.

## 🔮 Future Enhancements

- Email invoices directly to customers.
- Add advanced billing analytics and reports.
- Support additional invoice templates.
- Add customer and product management modules.
- Implement automated backup and export features.

## 👩‍💻 Developer

**Bhagyashri Patil**

B.Tech – Computer Science and Engineering

## 📄 License

This project was developed for educational purposes and practical learning in full-stack web development.
