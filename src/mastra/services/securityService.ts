import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

interface DependencyReport {
    hasHighSeverity: boolean;
    dependencies: {
        name: string;
        version: string;
        license: string;
    }[];
    summary: string;
}

/**
 * Fetches and analyzes a package.json from a GitHub repo.
 * NOTE: In a real-world scenario, this would integrate with Snyk, Dependabot API, or another vulnerability DB.
 * For this challenge, we'll simulate it by checking for common insecure patterns or outdated versions.
 */
export const analyzeDependencies = async (owner: string, repo: string): Promise<DependencyReport> => {
    try {
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: 'package.json',
        });

        if (!('content' in data)) {
            throw new Error("package.json is not a file.");
        }

        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const packageJson = JSON.parse(content);

        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // This is a simplified check. A real implementation would be far more complex.
        const hasOutdatedExpress = dependencies.express && dependencies.express.includes('^4.');

        return {
            hasHighSeverity: hasOutdatedExpress,
            dependencies: Object.entries(dependencies).map(([name, version]) => ({
                name,
                version: version as string,
                license: packageJson.license || 'Not specified'
            })),
            summary: hasOutdatedExpress
                ? "High severity issue found: The project uses a potentially outdated version of Express. Recommend updating to the latest stable version."
                : "No obvious high-severity issues found in package.json. For a comprehensive scan, integrate with a dedicated security tool."
        };

    } catch (error: any) {
        if (error.status === 404) {
            return {
                hasHighSeverity: false,
                dependencies: [],
                summary: "No package.json file found in the repository root."
            };
        }
        throw error;
    }
};