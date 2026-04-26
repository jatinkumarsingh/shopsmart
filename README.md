# NST DevOps - Full Stack Application with CI/CD

A modern, production-ready full-stack application featuring automated CI/CD pipelines, containerized environments, and cloud deployment.

## 🏗️ System Architecture

- **Frontend**: React application built with Vite, served via Nginx.
- **Backend**: Node.js & Express API using Prisma ORM.
- **Database**: PostgreSQL for persistent data storage.
- **Infrastructure**: Automated deployment to AWS EC2 via SSH.

## 🛠️ DevOps Features

### 🐳 Containerization
- **Multi-stage Docker Builds**: Optimized images for both client and server components.
- **Docker Compose**: Orchestrates the entire stack including the database, migrations, and application services.
- **Persistent Volumes**: Ensures database data persistence across container restarts.

### 🚀 CI/CD Pipeline (GitHub Actions)
Located in `.github/workflows/deploy.yml`, the pipeline automates:
1.  **Continuous Integration**:
    - Linting and formatting checks for both Client and Server.
    - Automated unit tests with a dedicated transient PostgreSQL service for backend tests.
2.  **Continuous Delivery**:
    - Builds and pushes Docker images to **GitHub Container Registry (GHCR)** on every push to main.
    - Uses Git commit hashes for precise image tagging.
3.  **Continuous Deployment**:
    - Automatic SSH deployment to AWS EC2.
    - Automated database migrations and seeding process.

## 💻 Local Development

### Prerequisites
- Docker & Docker Desktop
- Node.js 20+ (for local scripts/linting)

### Running the Stack
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jatinkumarsingh/shopsmart.git
    cd shopsmart
    ```
2.  **Start the services**:
    ```bash
    docker compose up --build
    ```
    This will start the Database, run Migrations, Seed the data, and start both the API and Web client.

3.  **Access the Application**:
    - Frontend: [http://localhost](http://localhost)
    - Backend API: [http://localhost:5001](http://localhost:5001)

## 📡 Environment Configuration
The following secrets are required in GitHub for the deployment pipeline:
- `EC2_HOST`: IP/Domain of the production server.
- `EC2_USER`: SSH username (e.g., `ubuntu`).
- `EC2_SSH_KEY`: Private SSH key for server access.
- `GITHUB_TOKEN`: Automatically provided by GitHub for GHCR access.
