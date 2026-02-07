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

## Why Choose Upptime?

Here's what makes Upptime an attractive choice for website monitoring:

- **Free and Open-Source:** Upptime leverages GitHub Actions, eliminating the need for paid subscriptions.
- **Easy Setup:** Upptime utilizes a GitHub repository template, simplifying the setup process.
- **Customizable Notifications:** Upptime supports various notification platforms like Discord, Telegram, Slack, and Microsoft Teams.
- **Status Page:** Upptime generates a status page that displays the health of all your monitored websites.

## Getting Started with Upptime

Upptime's setup involves creating a GitHub repository and configuring the websites you want to monitor. Here's a step-by-step guide:

### 1. Create a GitHub Repository

- Visit the Upptime repository template: [https://github.com/upptime/upptime](https://github.com/upptime/upptime)
- Click "Use this template" to create a new repository.
- Important: Include all branches when you create the repository. The monitoring website is hosted on another branch.
- Decide whether to make the repository public or private. Public repositories benefit from free GitHub Actions usage.

### 2. Configure Upptime

Edit the `.upptimerc.yml` file:

- Replace placeholders like `owner` and `repo` with your GitHub username and repository name, respectively.
- Add the assignees for auto-assign issues.
- Under `sites`, define the websites you want to monitor. Specify the website name and URL for each entry.
- Configure the status page under `status-website`. If you have a custom domain, set the URL in the `cname` field. Otherwise, uncomment the `baseUrl` line and add your repository name.

```yaml
# Change these first
owner: usarral # Your GitHub organization or username
repo: upptime-demo # The name of this repository
assignees:
  - usarral

sites:
  - name: Google
    url: https://www.google.com
  - name: Usarral.com
    url: https://usarral.com
  - name: This site not exists
    url: http://not-exist2.com/

status-website:
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
```

### 3. Enable Notifications (Optional)

Upptime supports various notification platforms. Here's an example using Discord:

- Create a Discord webhook on some server channel and obtain the URL.
- In your Github repository settings under "Secrets and Variables", create three secrets:
  - `NOTIFICATION_DISCORD`: Set to `true`.
  - `NOTIFICATION_DISCORD_WEBHOOK`: Set to `true`.
  - `NOTIFICATION_DISCORD_WEBHOOK_URL`: Paste the Discord webhook URL here.

### 4. Commit Changes and Monitor

- Commit your changes to the repository.
- The GitHub Action will run and update the README file. A status page will also be generated (e.g., [https://usarral.github.io/upptime-demo/](https://usarral.github.io/upptime-demo/)).

## Testing Upptime

To test Upptime's functionality, add a non-existent website to your monitored sites. When you commit this change, the GitHub Action will trigger:

- An issue will be created in your repository.
- A notification will be sent to your chosen notification platform (e.g., Discord).

This demonstrates Upptime's ability to detect and report website outages.

## Conclusion

Upptime offers a compelling solution for free and effective website monitoring. Its ease of use, customizability, and open-source nature make it a valuable tool for developers of all experience levels. If you're looking for a reliable and cost-effective way to monitor your websites, Upptime is definitely worth considering.