export const generateDockerfile = (framework: 'nextjs' | 'nodejs' | 'python'): string => {
    if (framework === 'nextjs') {
        return `# Install dependencies based on the preferred package manager
FROM node:18-alpine AS base
WORKDIR /app
COPY . .

FROM base AS builder
WORKDIR /app/builder
COPY --from=base /app/package.json ./
RUN npm install
COPY --from=base /app .
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/builder/public ./public
COPY --from=builder /app/builder/.next ./.next
COPY --from=builder /app/builder/node_modules ./node_modules
COPY --from=builder /app/builder/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]`;
    }
    return `# Placeholder Dockerfile for ${framework}
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]`;
};

export const generateVercelConfig = (): string => {
    return JSON.stringify({
        "$schema": "https://openapi.vercel.sh/vercel.json",
        "framework": "nextjs",
        "buildCommand": "npm run build"
    }, null, 2);
};

export const generateNosanaCIConfig = (): string => {
    return `
global:
  network: solana-devnet

triggers:
  - branch: main
    jobs:
      - 'Nosana Build & Deploy'

jobs:
  'Nosana Build & Deploy':
    image: node:18-alpine
    commands:
      - 'npm install'
      - 'npm run build'
      - 'echo "Deployment step would go here"'
`;
};