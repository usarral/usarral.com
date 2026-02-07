---
title: Monitor Your Websites for Free with Upptime
description: Learn how to monitor your websites for free using Upptime, an open-source tool powered by GitHub Actions. Discover step-by-step instructions to set up Upptime, customize notifications, and create a status page to track website uptime efficiently without any paid subscriptions.
publishDate: 2024-12-30
tags:
  - monitoring
  - github actions
  - devops
  - tutorial
  - open source
---

## Introduction

In the world of web development, a common concern for developers is ensuring their websites remain online and functional. This is where website monitoring comes in. Monitoring systems notify you when your website goes down, allowing you to take swift action and restore functionality.

While numerous monitoring services exist, many have limitations like the number of monitored pages or daily checks. Paid subscriptions are often required to bypass these restrictions.

This post explores Upptime, a free and open-source alternative that leverages GitHub Actions to perform website monitoring. Upptime generates a status page showcasing all your monitored websites and offers various notification options.

> **📦 Example Repository:** You can find a complete working example of this tutorial at [github.com/blogusarral/upptime-demo](https://github.com/blogusarral/upptime-demo) and see the live status page at [blogusarral.github.io/upptime-demo](https://blogusarral.github.io/upptime-demo/).

## Why Choose Upptime?

Here's what makes Upptime an attractive choice for website monitoring:

- **Free and Open-Source:** Upptime leverages GitHub Actions, eliminating the need for paid subscriptions.
- **Easy Setup:** Upptime utilizes a GitHub repository template, simplifying the setup process.
- **Customizable Notifications:** Upptime supports various notification platforms like Discord, Telegram, Slack, and Microsoft Teams.
- **Status Page:** Upptime generates a status page that displays the health of all your monitored websites.
- **Automated:** GitHub Actions run scheduled checks every 5 minutes (configurable) without manual intervention.
- **Historical Data:** Keeps track of uptime history and response times with graphs and statistics.

## How It Works

Upptime uses GitHub Actions to periodically ping your websites and check their availability. Here's what happens:

1. **Scheduled Checks:** GitHub Actions run every 5 minutes (by default) to check your websites.
2. **Issue Creation:** When a site goes down, an issue is automatically created in your repository.
3. **Notifications:** You receive notifications via your configured channels (Discord, Slack, etc.).
4. **Status Page Update:** The status page is automatically updated to reflect current site status.
5. **Issue Closure:** When the site comes back online, the issue is automatically closed.

All of this runs entirely on GitHub's infrastructure, leveraging the free tier of GitHub Actions (2,000 minutes/month for private repos, unlimited for public repos).

## Getting Started with Upptime

Upptime's setup involves creating a GitHub repository and configuring the websites you want to monitor. Here's a step-by-step guide:

### 1. Create a GitHub Repository

- Visit the Upptime repository template: [https://github.com/upptime/upptime](https://github.com/upptime/upptime)
- Click "Use this template" to create a new repository.
- **Important:** Include all branches when you create the repository. The monitoring website is hosted on the `gh-pages` branch.
- Name your repository (e.g., `upptime-demo` or `status`).
- Decide whether to make the repository public or private. Public repositories benefit from unlimited GitHub Actions usage, while private repos have a 2,000 minutes/month limit.

### 2. Configure Upptime

Edit the `.upptimerc.yml` file in your repository:

- Replace placeholders like `owner` and `repo` with your GitHub username and repository name, respectively.
- Add the assignees for auto-assign issues when sites go down.
- Under `sites`, define the websites you want to monitor. Specify the website name and URL for each entry.
- Configure the status page under `status-website`. If you have a custom domain, set the URL in the `cname` field. Otherwise, uncomment the `baseUrl` line and add your repository name.

```yaml
# Change these first
owner: blogusarral # Your GitHub organization or username
repo: upptime-demo # The name of this repository
assignees:
  - usarral

sites:
  - name: Google
    url: https://www.google.com
  - name: Usarral.com
    url: https://usarral.com
  - name: GitHub
    url: https://github.com
  - name: This site not exists
    url: http://not-exist2.com/

status-website:
  # Add your custom domain name, or remove the `cname` line if you don't have a domain
  # Uncomment the `baseUrl` line if you don't have a custom domain and add your repo name there
  # cname: demo.upptime.js.org
  baseUrl: /upptime-demo
  logoUrl: https://raw.githubusercontent.com/upptime/upptime.js.org/master/static/img/icon.svg
  name: Upptime Demo
  introTitle: "**Upptime** is the open-source uptime monitor and status page"
  introMessage: This is a sample status page which uses **real-time** data from our GitHub repository
  navbar:
    - title: Status
      href: /
    - title: GitHub
      href: https://github.com/$OWNER/$REPO

# Upptime also supports notifications, assigning a different user based on which site goes down
# status-website:
#   theme: dark
```

### 3. Enable GitHub Pages

After your first commit, GitHub Actions will create a `gh-pages` branch. You need to enable GitHub Pages:

- Go to your repository settings.
- Navigate to "Pages" in the left sidebar.
- Under "Source", select the `gh-pages` branch.
- Click "Save".

Your status page will be available at `https://yourusername.github.io/repository-name/` within a few minutes.

### 4. Enable Notifications (Optional)

Upptime supports various notification platforms. Here's an example using Discord:

#### Discord Setup:

- Create a Discord webhook on some server channel:
  1. Go to your Discord server settings
  2. Navigate to Integrations → Webhooks
  3. Click "New Webhook" and copy the webhook URL
- In your GitHub repository settings under "Secrets and variables" → "Actions", create three secrets:
  - `NOTIFICATION_DISCORD`: Set to `true`
  - `NOTIFICATION_DISCORD_WEBHOOK`: Set to `true`
  - `NOTIFICATION_DISCORD_WEBHOOK_URL`: Paste the Discord webhook URL here

#### Other Notification Options:

Upptime also supports:
- **Slack:** Use `NOTIFICATION_SLACK` and `NOTIFICATION_SLACK_WEBHOOK_URL`
- **Telegram:** Use `NOTIFICATION_TELEGRAM` and `NOTIFICATION_TELEGRAM_CHAT_ID`
- **Microsoft Teams:** Use `NOTIFICATION_MS_TEAMS` and `NOTIFICATION_MS_TEAMS_WEBHOOK_URL`
- **Email:** Can be configured through GitHub Actions workflow files

### 5. Commit Changes and Monitor

- Commit your changes to the repository.
- The GitHub Action will run automatically and:
  - Check all your monitored sites
  - Update the README file with current status
  - Generate/update the status page
  - Create issues for any sites that are down

The initial setup may take 2-5 minutes to complete.

## Testing Upptime

To test Upptime's functionality, you can add a non-existent website to your monitored sites (as shown in the example configuration above with `http://not-exist2.com/`). When you commit this change, the GitHub Action will trigger:

1. An issue will be created in your repository with details about the outage
2. A notification will be sent to your chosen notification platform (e.g., Discord)
3. The status page will show the site as "Down" with a red indicator
4. The README will be updated to reflect the current status

This demonstrates Upptime's ability to detect and report website outages in real-time.

## Customization Options

### Advanced Configuration

You can customize many aspects of Upptime in the `.upptimerc.yml` file:

- **Check frequency:** Modify the cron schedule in `.github/workflows/uptime.yml`
- **Response time checks:** Set expected response times and get alerted if they're exceeded
- **Custom headers:** Add authentication headers for protected endpoints
- **HTTP methods:** Use POST, PUT, or other methods instead of GET
- **Expected status codes:** Define what status codes are considered "up"

### Custom Domain

If you want to use a custom domain for your status page:

1. Add a `CNAME` file to your repository with your domain name
2. Update the `cname` field in `.upptimerc.yml`
3. Configure your DNS provider to point to `yourusername.github.io`

## Troubleshooting

### Common Issues:

**GitHub Actions not running:**
- Check that GitHub Actions are enabled in your repository settings
- Verify that the workflows are not disabled
- Ensure you have the `.github/workflows` directory with workflow files

**Status page not showing:**
- Make sure GitHub Pages is enabled and set to the `gh-pages` branch
- Wait a few minutes after the first deployment
- Check the Actions tab for any errors in the workflow runs

**Notifications not working:**
- Verify that your secrets are correctly set in the repository settings
- Check that the secret names match exactly (they're case-sensitive)
- Test your webhook URL independently to ensure it's valid

**Rate limiting:**
- If you're monitoring many sites, you might hit GitHub API rate limits
- Consider reducing check frequency or the number of monitored sites
- Use a public repository for unlimited GitHub Actions minutes

## GitHub Actions Limitations

Keep in mind the following limitations when using Upptime:

- **Free tier limits:** Private repositories have a 2,000 minutes/month limit on GitHub Actions
- **Execution time:** Each workflow run has a maximum execution time of 6 hours
- **Concurrent jobs:** Free accounts can run up to 20 concurrent jobs
- **Storage:** Artifacts and logs are kept for 90 days by default

For most use cases, these limitations are more than sufficient. A public repository monitoring 10 websites with 5-minute intervals uses approximately 300 minutes per month.

## Example Repository

You can explore a fully functional example at:

- **Repository:** [git@github.com:blogusarral/upptime-demo.git](https://github.com/blogusarral/upptime-demo)
- **Live Status Page:** [https://usarral.github.io/upptime-demo/](https://usarral.github.io/upptime-demo/)

Clone or fork this repository to get started quickly:

```bash
git clone git@github.com:blogusarral/upptime-demo.git
```

## Conclusion

Upptime offers a compelling solution for free and effective website monitoring. Its ease of use, customizability, and open-source nature make it a valuable tool for developers of all experience levels.

**Key Takeaways:**
- ✅ Completely free for public repositories
- ✅ No infrastructure to maintain
- ✅ Automated monitoring every 5 minutes
- ✅ Beautiful status page with historical data
- ✅ Multiple notification channels supported
- ✅ Issues tracking for incident management

If you're looking for a reliable and cost-effective way to monitor your websites, Upptime is definitely worth considering. Whether you're monitoring personal projects, client websites, or production services, Upptime provides enterprise-level monitoring without the enterprise-level costs.

## Additional Resources

- [Upptime Official Documentation](https://upptime.js.org)
- [Upptime GitHub Repository](https://github.com/upptime/upptime)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Example Repository - upptime-demo](https://github.com/blogusarral/upptime-demo)
