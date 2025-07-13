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
 * A robust function to add files to a repository.
 * It handles both empty repositories (creating the first commit) and existing repositories.
 */
export const pushFilesToRepo = async (
    owner: string,
    repo: string,
    files: { path: string; content: string }[],
    commitMessage: string
) => {
    let latestCommitSha: string | undefined;

    // Try to get the main branch to see if the repo has any commits yet.
    try {
        const { data: mainBranch } = await octokit.repos.getBranch({
            owner,
            repo,
            branch: 'main',
        });
        latestCommitSha = mainBranch.commit.sha;
    } catch (error: any) {
        // If we get a 404, it means the branch doesn't exist because the repo is empty.
        // We can safely ignore this error and proceed to create the first commit.
        if (error.status !== 404) {
            throw error; // Re-throw any other unexpected errors.
        }
        console.log(`Repo "${repo}" is empty. Creating initial commit.`);
    }

    // If a commit exists, we need its tree to build upon. Otherwise, we start fresh.
    const base_tree = latestCommitSha
        ? (await octokit.git.getCommit({ owner, repo, commit_sha: latestCommitSha })).data.tree.sha
        : undefined;

    const tree = await octokit.git.createTree({
        owner,
        repo,
        base_tree,
        tree: files.map(({ path, content }) => ({
            path,
            mode: '100644', // file blob
            type: 'blob',
            content,
        })),
    });

    const { data: newCommit } = await octokit.git.createCommit({
        owner,
        repo,
        message: commitMessage,
        tree: tree.data.sha,
        // If there's a latestCommitSha, use it as the parent. Otherwise, this is the root commit.
        parents: latestCommitSha ? [latestCommitSha] : [],
    });

    // If the main branch already exists, update it. If not, create it.
    if (latestCommitSha) {
        await octokit.git.updateRef({
            owner,
            repo,
            ref: 'heads/main',
            sha: newCommit.sha,
        });
    } else {
        await octokit.git.createRef({
            owner,
            repo,
            ref: 'refs/heads/main',
            sha: newCommit.sha,
        });
    }

    return `https://github.com/${owner}/${repo}/tree/${newCommit.sha}`;
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