const express = require('express');
const cors = require('cors');
const { Octokit } = require('@octokit/rest');
const { clerkMiddleware, requireAuth } = require('@clerk/express');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error('Supabase URL and Key are required');
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

async function getUserGitHubToken(userId) {
  const response = await fetch(
    `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_github`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch GitHub OAuth token');
  const tokens = await response.json();
  const githubToken = tokens[0]?.token;
  if (!githubToken) throw new Error('GitHub OAuth token not found for user');
  return githubToken;
}

app.get('/api/repositories', requireAuth, async (req, res) => {
  try {
    const githubToken = await getUserGitHubToken(req.auth.userId);
    const octokit = new Octokit({ auth: githubToken });
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 50,
    });
    const repoData = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      private: repo.private,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
    }));
    res.json(repoData);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/create-webhook', requireAuth, async (req, res) => {
  try {
    const { repo } = req.body;
    const githubToken = await getUserGitHubToken(req.auth.userId);
    const octokit = new Octokit({ auth: githubToken });
    const [owner, repoName] = repo.split('/');
    let webhook;
    try {
      const { data } = await octokit.rest.repos.createWebhook({
        owner,
        repo: repoName,
        config: {
          url: `${process.env.WEBHOOK_URL}/api/webhook/github`,
          content_type: 'json',
        },
        events: ['pull_request'],
        active: true,
      });
      webhook = data;
    } catch (err) {
      if (err.status === 422) {
        const { data: hooks } = await octokit.rest.repos.listWebhooks({ owner, repo: repoName });
        webhook = hooks.find(h => h.config.url === `${process.env.WEBHOOK_URL}/api/webhook/github`);
        if (!webhook) throw err;
      } else throw err;
    }
    const { data, error } = await supabase
      .from('bounties')
      .insert([{ owner_id: req.auth.userId, repo, webhook_id: webhook.id }])
      .select();
    if (error) throw error;
    res.json({ bountyId: data[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bounties/:id', requireAuth, async (req, res) => {
  const { bountyName, bountyRequirements } = req.body;
  const { id } = req.params;
  const { error } = await supabase
    .from('bounties')
    .update({ bounty_name: bountyName, bounty_requirements: bountyRequirements })
    .eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/bounties/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('bounties')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

app.get('/api/bounties/:id/completions', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('completions')
    .select('*')
    .eq('bounty_id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/webhook/github', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  if (event === 'pull_request' && payload.action === 'closed' && payload.pull_request.merged) {
    const repo = payload.repository.full_name;
    const username = payload.pull_request.user.login;
    const prUrl = payload.pull_request.html_url;
    const prNumber = payload.pull_request.number;
    const { data: bounty } = await supabase
      .from('bounties')
      .select('id')
      .eq('repo', repo)
      .single();
    if (bounty) {
      await supabase.from('completions').insert([
        { bounty_id: bounty.id, pr_number: prNumber, pr_url: prUrl, username }
      ]);
    }
  }
  res.sendStatus(200);
});

app.get('/shouldPay', (req, res) => {
  res.json({ pay: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
