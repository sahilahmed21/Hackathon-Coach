Hackathon Coach: Your AI-Powered Co-Pilot for Instant Project Scaffolding

  
  
  


Executive Summary
Hackathon Coach is a sophisticated, multi-agent AI system designed to eliminate the friction of starting a new software project. It acts as an intelligent co-pilot, guiding developers from a vague project idea to a fully scaffolded, secure, and deployment-ready GitHub repository in minutes. Built on the Mastra TypeScript framework, it leverages a team of eight specialized AI agents, each an expert in a specific domain of the development lifecycle, orchestrated by an interactive, stateful workflow.
The system stands out with its modular architecture (Agents -> Tools -> Services), a dual-LLM fallback mechanism (Google Gemini as primary, with Ollama as backup), and stateful memory for both short-term conversational context and long-term project persistence via a local JSON database. This makes Hackathon Coach a production-grade AI assistant, empowering developers to build faster and more efficiently.
🏆 Submission for the Nosana Agent Challenge: Agent-101📹 Video Demo: [Insert link to 1-3 minute video demo here]🐳 Docker Hub Container: https://hub.docker.com/r/sahilahmed21/hackathon-coach🚀 Nosana Deployment: [Insert link to Nosana job dashboard or job ID here]
🎯 The Problem It Solves
Starting a new software project often involves repetitive, time-consuming tasks: brainstorming ideas, creating a project plan, setting up a GitHub repository, writing boilerplate code, and configuring CI/CD pipelines. These steps can take hours, draining creative momentum. Hackathon Coach automates this entire pipeline, enabling developers to focus on building innovative features.
✨ Key Features

🚀 Full-Cycle Project Generation: Transform a single topic (e.g., "AI recipe app") into a complete, initialized GitHub repository in one command.
🧠 Specialized AI Agents: A team of eight expert agents handles ideation, security, deployment, code review, and more.
⚙️ Interactive & Stateful Workflow: An intelligent workflow pauses for user input, creating a dynamic, guided experience.
💾 Long-Term Project Memory: The ProjectTrackerAgent saves project details to a local JSON database for persistent tracking and management.
🛡️ Dual-LLM Fallback System: Uses Google Gemini as the primary LLM, with automatic fallback to a self-hosted Ollama instance for high availability.
🔧 Professional Architecture: Built on a scalable Agents -> Tools -> Services pattern for easy maintenance and extension.

🛠️ Architecture Overview
Hackathon Coach is built with professional software engineering principles, emphasizing modularity, scalability, and maintainability.
Technology Stack

Core Framework: Mastra, an open-source TypeScript framework for AI applications.
Language: TypeScript, ensuring type safety and robust code structure.
Primary LLM: Google Gemini (gemini-1.5-flash-latest), used for reasoning, instruction-following, and code generation.
Fallback LLM: Ollama-hosted Qwen (qwen2.5:7b), ensuring high availability if Gemini fails (e.g., due to rate limits or outages).
GitHub Integration: Octokit/rest for repository creation, file pushes, and PR analysis.
Stateful Memory:
Conversational: Managed by Mastra’s Memory class, with each agent maintaining isolated context.
Persistent: Implemented via projectDBService, using a local projects.json file as a database.



File Structure
src/mastra/
├── agents/                   # Agent personas and goals
│   ├── ProjectCoachAgent.ts
│   ├── GuardianAgent.ts
│   ├── DeploymentGuruAgent.ts
│   ├── ReviewAgent.ts
│   ├── CiAgent.ts
│   ├── GitStatAgent.ts
│   ├── HelpAgent.ts
│   ├── ProjectTrackerAgent.ts
├── services/                 # Reusable business logic
│   ├── githubService.ts
│   ├── projectDBService.ts
│   └── ...
├── tools/                    # Bridges between agents and services
│   ├── github/
│   ├── analysis/
│   └── ...
├── workflows/                # Multi-agent orchestration
│   └── coach-workflow.ts
├── config.ts                 # Dual-LLM configuration
└── index.ts                  # Mastra component registration

The Agents -> Tools -> Services Pattern

Agents: The "brain," defining personas and high-level goals (e.g., ProjectCoachAgent for ideation).
Tools: The "hands," exposing capabilities like creating repositories or scanning dependencies.
Services: The "engine room," handling complex logic like GitHub API calls and database operations.

Agent Roster

ProjectCoachAgent: Brainstorms ideas, creates development plans, and scaffolds GitHub repositories.
GuardianAgent: Scans dependencies for vulnerabilities and outdated packages.
DeploymentGuruAgent: Adds deployment files (e.g., Dockerfile, .nosana-ci.yml, vercel.json).
ReviewAgent: Conducts qualitative code reviews on GitHub Pull Requests.
CiAgent: Monitors GitHub Actions status for commits.
GitHub Project Insights Agent (GitStatAgent): Generates repository statistics and lists "good first issues."
HelpAgent: Provides resources for coding problems and errors.
ProjectTrackerAgent: Saves and lists project details in a local projects.json database.

Main Workflow: hackathonCoachWorkflow
The workflow orchestrates agents in four steps:

Ideate & Initialize: ProjectCoachAgent refines the user’s topic and creates a GitHub repository with initial files (README.md, package.json).
Interactive Choice: Pauses to prompt the user to choose between security scanning or deployment setup.
Intelligent Dispatch: Executes the chosen task using GuardianAgent or DeploymentGuruAgent.
Persist to Memory: ProjectTrackerAgent saves project details to the database.

🚀 Getting Started
Follow these steps to run Hackathon Coach locally.
Prerequisites

Node.js: v20.x or later
pnpm: Package manager
Git: Version control
GitHub Account: With a Personal Access Token (repo permissions)
Docker: For containerized deployment

1. Clone the Repository
git clone https://github.com/sahilahmed21/hackathon-coach
cd hackathon-coach

2. Install Dependencies
pnpm install

3. Configure Your Environment
Create a .env file by copying .env.example and filling in your credentials:
# .env

# --- Google Gemini Configuration ---
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
GEMINI_MODEL_NAME=gemini-1.5-flash-latest

# --- Ollama Fallback Configuration ---
API_BASE_URL=http://127.0.0.1:11434
MODEL_NAME_AT_ENDPOINT=qwen2.5:7b

# --- Fallback Configuration ---
PRIMARY_PROVIDER=google

# --- GitHub Configuration ---
GITHUB_TOKEN=ghp_...
GITHUB_USERNAME=sahilahmed21

4. Run the Development Server
pnpm run dev

This starts the Mastra server. Access the Playground at http://localhost:4111 to test individual agents.
💡 How to Use
Testing Individual Agents (via Playground)
Navigate to http://localhost:4111 to interact with agents.
Example 1: HelpAgent

Agent: HelpAgent
Prompt: How do I fix a CORS error in my Express.js app?
Expected Output:I found resources to help with your CORS error:
- **MDN Web Docs: Cross-Origin Resource Sharing (CORS)**: Official documentation. You likely need a middleware library.
- **Stack Overflow: Express CORS Middleware**: Common solution is to use the `cors` npm package.



Example 2: ProjectTrackerAgent

Agent: ProjectTrackerAgent
Prompt: List my saved projects
Expected Output (after running the workflow):Here are your saved projects:
Name                  Framework  GitHub URL
ai-recipe-advisor     nextjs     https://github.com/sahilahmed21/ai-recipe-advisor



Testing the Main Workflow (via CLI)
Run the end-to-end workflow to scaffold a project:
pnpm mastra workflow run hackathon-coach-workflow --input='{ "topic": "A personal finance dashboard" }'

Expected Interaction
🤖 CoachAgent: Generating idea and scaffolding project for topic: "A personal finance dashboard"...
✅ Repo created: https://github.com/sahilahmed21/personal-finance-dashboard
🌱 Initializing repository with a README.md file...
✅ Repository initialized successfully.

🤔 What would you like to do next?
1. Scan for security issues
2. Set up deployment files
Enter choice (1 or 2): 2

🚀 DeploymentGuru: Scaffolding deployment files...
✅ Task "deployment" completed.
💾 ProjectTrackerAgent: Saving project details to database...
🎉 All done! Your project "personal-finance-dashboard" has been fully scaffolded and saved.

🐳 Docker & Deployment
Build the Container
docker build -t sahilahmed21/hackathon-coach:latest .

Run the Container Locally
docker run -p 8080:8080 --env-file .env sahilahmed21/hackathon-coach:latest

Push to Docker Hub
docker login
docker push sahilahmed21/hackathon-coach:latest

Nosana Deployment
The project is configured for deployment on the Nosana network via a .nosana-ci.yml file generated by DeploymentGuruAgent. Check the Nosana job dashboard for deployment status.
📚 Technical Details
Dual-LLM Fallback System

Primary: Google Gemini (gemini-1.5-flash-latest) for robust performance.
Fallback: Ollama (qwen2.5:7b) for high availability during API issues.
Configured in src/mastra/config.ts, with PRIMARY_PROVIDER=google by default.

Persistent Memory

Conversational: Each agent uses Mastra’s Memory class for context.
Persistent: ProjectTrackerAgent saves project details (name, URL, framework, description) to projects.json.

GitHub Integration

Uses Octokit/rest for creating repositories, committing files, and analyzing PRs.
Configured via GITHUB_TOKEN and GITHUB_USERNAME in .env.

🛡️ Security & Reliability

GuardianAgent scans dependencies for vulnerabilities.
Dual-LLM ensures uninterrupted operation.
TypeScript enforces type safety, reducing runtime errors.

🚀 Future Enhancements

Add support for additional frameworks (e.g., React, Django).
Integrate more CI/CD platforms (e.g., CircleCI, Jenkins).
Enhance GitStatAgent with real-time analytics visualizations.
Expand HelpAgent to include Stack Overflow API integration.

📝 License
MIT License. See LICENSE for details.
🙌 Acknowledgments

Nosana Agent Challenge for inspiring this project.
Mastra Framework for providing a robust AI development platform.
Google Gemini and Ollama for powering the AI capabilities.
