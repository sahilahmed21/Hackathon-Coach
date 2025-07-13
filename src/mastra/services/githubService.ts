import { Octokit } from "@octokit/rest";
import fetch from "node-fetch";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Creates a new GitHub repository and pushes an initial README file.
 */
export const createRepo = async (repoName: string, readmeContent: string, isPrivate: boolean = false) => {
    const owner = (await octokit.users.getAuthenticated()).data.login;

    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: isPrivate,
        auto_init: false, // We will create the first commit ourselves
    });

    await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repo.name,
        path: "README.md",
        message: "chore: initial commit",
        content: Buffer.from(readmeContent).toString("base64"),
    });

    return {
        url: repo.html_url,
        readmeUrl: `${repo.html_url}/blob/main/README.md`,
    };
};

/**
 * Pushes multiple files to a GitHub repository.
 */
export const pushFilesToRepo = async (
    owner: string,
    repo: string,
    files: { path: string; content: string }[],
    commitMessage: string
) => {
    const { data: { login } } = await octokit.users.getAuthenticated();
    const { data: latestCommit } = await octokit.repos.getBranch({ owner: login, repo, branch: 'main' });
    const latestCommitSha = latestCommit.commit.sha;

    const tree = await octokit.git.createTree({
        owner: login,
        repo,
        base_tree: latestCommitSha,
        tree: files.map(({ path, content }) => ({
            path,
            mode: '100644', // file
            type: 'blob',
            content,
        })),
    });

    const { data: newCommit } = await octokit.git.createCommit({
        owner: login,
        repo,
        message: commitMessage,
        tree: tree.data.sha,
        parents: [latestCommitSha],
    });

    await octokit.git.updateRef({
        owner: login,
        repo,
        ref: 'heads/main',
        sha: newCommit.sha,
    });

    return `https://github.com/${login}/${repo}/tree/${newCommit.sha}`;
};


/**
 * Fetches the .diff content of a GitHub Pull Request.
 */
export const getPullRequestDiff = async (owner: string, repo: string, pull_number: number): Promise<string> => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, {
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3.diff'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch PR diff: ${response.statusText}`);
    }
    return await response.text();
};