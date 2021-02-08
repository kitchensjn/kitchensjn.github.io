---
layout: post
link: /blog/updating-website-to-jekyll
title: Updating Website to Jekyll
github-link: https://github.com/kitchensjn/streamflow-and-precipitation
date: January 6, 2021
skills: [Jekyll, HTML, CSS, JavaScript]
desc: With all of the rain coming to the southeastern United States, I started to think about how it is affecting the river levels.
thumbnail: /assets/blog/updating-website-to-jekyll/thumbnail.png
---

{:.images}
![Pyinstaller](/assets/blog/updating-website-to-jekyll/thumbnail.png)

At the start of quaratine in early 2020, I decided to develop a personal website where I could highlight my ongoing and past research projects and write short blog posts on various topics that I find interesting. This website was built with custom HTML, CSS, and JavaScript. As it has grown, I've run into numerous scenarios where I've had to repeat code and hardcode sections. Creating new blog posts was tedious, as it required specific and longwinded formatting of paragraph elements. I was happy with the design of my website, but wanted to streamline the file structure. Jekyll, originially developed by Shopify, is a static site generator that solves many of these issues by allowing users to create templates that are filled by inputs from Markdown files. In addition to this, Jekyll is supported by GitHub Pages, which allows for free hosting of these sites. There is a plethora of Jekyll templates, known as themes, found online. The first version of my website was actually built using the modern-resume-theme theme developed by James Grant, which served as my introduction to the generator; I ultimately switched to a custom site for the second version to better match my interest in blogging as well as build my skills in front end web development.

So how do I go about converting my static website into Jekyll site? This walkthrough will describe Jekyll installation, the beginnings of theme creation, the pros and cons of how I organized my files and templates, and how I have used Jekyll for my personal website to decrease development hassle as a whole. I am still in the process of learning all of the ins and outs of the new generator, so some of the opinions and discussion points may be updated in the future. Because of this, the GitHub repository and codes linked might not match directly with what is found within this blog post, though it will hopefully remain similar.

As a first time user of Jekyll, I would recommend that you start with a predeveloped theme. There's thousands of them on GitHub and other sites, like [jekyllthemes.org](http://jekyllthemes.org). Many of these can be hosted directly through GitHub without having to install anything onto your own computer. Jekyll themes are designed to have their users manipulate information in Markdown and YML files that then are passed through an HTML template and visualized on your website. All sites start with the same structure:

- _config.yml: the configuration settings of your site. Contains elements like your website title and which directories to include in your build
- _layouts: overarching HTML templates, such as for a homepage or blog post
- _includes: smaller HTML templates. These alter sections of the page, such as the navigation bar, call to action, etc...
- _sass: the stylesheets for your site
- assets: additional static files, such as images, scripts, and more

### Installing Jekyll

Because I wanted to develop my own theme, I needed to install Jekyll on my computer. I use a Mac, which actually comes with Ruby preinstalled (Jekyll is built off of Ruby). Unfortunately, this almost leads to more difficulty as the computer fights to avoid changing any of these preinstalled files. I tried to follow the official documentation ([HERE](https://jekyllrb.com/docs/installation/macos/)), but ran into a number of issues that prevented install. I ultimately was successfuly by using [RVM](https://rvm.io) rather than Homebrew to install the latest version of Ruby, and then returning to the official instructions for installing Jekyll on top of that.

### Creating A New Theme

{:.codeheader}
console
```
jekyll new-theme parallax-mountains
```

This command creates a new Jekyll theme called "parallax-mountains", including all of the scaffolding needed to get you started.

