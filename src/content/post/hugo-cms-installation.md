---
title: Hugo CMS Installation and Basic Site Creation
description: Learn how to install Hugo CMS on Linux, Windows, and macOS and create a basic site using a theme. Deploy the site for free using GitHub and Vercel.
publishDate: 2022-09-28
tags:
  - hugo
  - cms
  - tutorial
  - web development
---

## Installing Hugo on Linux

### Check if Snap is Installed

To install Hugo on Linux, we will use the Snap package manager. So, the first thing we will do is check if this manager is installed by using the following command:

```sh
snap version
```

This should return a response like the following:

```sh
snap    2.55.3+22.04
snapd   2.55.3+22.04
series  16
ubuntu  22.04
kernel  5.15.0-48-generic
```

If so, it means Snap is installed, and we can proceed with the installation.

### Install the hugo-extended Package

Using the Snap manager, we will install the _hugo-extended_ package.

```sh
snap install hugo --channel=extended
```

## Installing Hugo on Windows

To install the latest version of Hugo on Windows, the first step is to go to the following [link](https://github.com/gohugoio/hugo/releases).

Once there, download the latest version with a filename format of _hugo_extended_x.x.x_windows-amd64.zip_, where x.x.x corresponds to the version.

This zip will contain the CMS, but we will have to perform the installation manually.

Extract the zip, and for convenience, move the resulting Hugo.exe file to the _C:\Hugo\bin_ directory, which we will create.

Once we have it, in the Windows search bar, access _Edit the system environment variables_ by searching for it.

A window called System Properties will open, and in it, we will click on _Environment Variables_.

In the list that appears, we will look for the PATH variable and add 'C:\Hugo\bin' at the end.

With this, after restarting the system, we will have Hugo installed and accessible on our system.

## Installing Hugo on macOS

If we don't have it already installed, we will install the brew package manager with the following command:

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Once installed, we will use this command to install Hugo:

```sh
brew install hugo
```

## Creating the Site with Hugo

### Creating the Site

Following the previous tutorial, we should now have Hugo installed on our system.

Now, to create a site with the CMS, we will use the following commands:

```sh
# WARNING: THESE COMMANDS MUST BE EXECUTED FROM OUR REGULAR USER, NEVER FROM SUDO
hugo new site site_name
cd site_name
```

Our site is created, but it is not functional yet. To make it functional, we first need to find a theme to use.

### Installing a Theme on the Site

As an example, I will use the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, but there are many available online that we can use. To install the theme, we will do the following (each theme may have its own installation method, but most are like this):

```sh
echo "theme = 'hugo-PaperMod'" >> config.toml
cd themes
# Clone or download the theme we like into this folder.
git clone https://github.com/adityatelange/hugo-PaperMod
# Enter the theme folder
cd hugo-PaperMod
# Remove the .git folder from this theme to avoid issues
# when uploading our page
rm -rf .git
```

With this, we will have the theme installed, and we can start our site using:

```sh
hugo server
```

After starting it, the command will return a URL where we can view our site while this server is running.

### Creating Articles in Hugo

To create articles in Hugo, we will go to the content folder, and within it, in the post folder, we can start writing them in _Markdown_ or _MD_ for short.

As we write, the articles will be added to the site and visible on our local server.

### Uploading Our Site to the Internet and Publishing It for Free

To upload our site, we will use GitHub as hosting, a code platform that allows us to upload static files.

We will need a [GitHub](https://github.com) account and the [GIT](https://git-scm.com/downloads) program.

Steps to upload our page to GitHub using the GIT protocol:

```sh
# These commands are executed from the root or base folder of our site.
# First, we will initialize a repository.
git init
# We will add our files to the Staging Area
git add *
# =============
# WARNING: These separated commands (git config) should only be executed the first time we configure git.
git config user.name "YOUR NAME"
git config user.email "YOUR EMAIL"
#=======
# We will add the "SUBJECT" of the upload.
git commit -m "first commit"
# We will go to our GitHub account and create a repository.
# We will set up the remote repository destination,
# this URL will be provided by GitHub when we create the repository.
git remote add origin github_url
git branch -M main
# Finally, we will push the changes to the server.
git push -u origin main
```

Now our code is uploaded to GitHub, and we are ready to deploy it.

### Deploying on Vercel

First, we will create an account on [Vercel](https://vercel.com). We can use our GitHub account for this.

Once inside our Vercel account, we will create a new project.
For the project origin, we will specify that we want to import it from GitHub.

This will automatically detect that we are using Hugo and set everything up for us.

Sometimes, deployment fails due to the default version of Hugo; if we encounter an error, we need to define an Environment Variable called HUGO_VERSION with the version we are using locally. To find out this version, we can use the command:

```sh
hugo version
```

With this, we click deploy, and in a matter of seconds, our page will be deployed and will provide us with a URL that will be our public web address.

To update the site, simply update the files in GitHub, and within minutes, Vercel will automatically detect the changes and deploy the updates.