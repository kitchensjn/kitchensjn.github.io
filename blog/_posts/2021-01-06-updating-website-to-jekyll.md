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

At the start of quarantine in early 2020, I decided to develop a personal website where I could highlight my ongoing and past research projects and write short blog posts on various topics that I find interesting. This website was built with custom HTML, CSS, and JavaScript. As it has grown, I've run into numerous scenarios where I've had to repeat code and hardcode sections. Creating new blog posts was tedious, as it required specific and long-winded formatting of paragraph elements. I was happy with the design of my website, but wanted to streamline the file structure. Jekyll, originally developed by Shopify, is a static site generator that solves many of these issues by allowing users to create templates that are filled by inputs from Markdown files. In addition to this, Jekyll is supported by GitHub Pages, which allows for free hosting of these sites. There is a plethora of Jekyll templates, known as themes, found online. The first version of my website was actually built using the modern-resume-theme theme developed by James Grant, which served as my introduction to the generator; I ultimately switched to a custom site for the second version to better match my interest in blogging as well as build my skills in front end web development.

So how do I go about converting my static website into Jekyll site? This walk-through will describe Jekyll installation, the beginnings of theme creation, the pros and cons of how I organized my files and templates, and how I have used Jekyll for my personal website to decrease development hassle as a whole. I am still in the process of learning all of the ins and outs of the new generator, so some of the opinions and discussion points may be updated in the future. Because of this, the GitHub repository and codes linked might not match directly with what is found within this blog post, though it will hopefully remain similar.

As a first time user of Jekyll, I would recommend that you start with a pre-developed theme. There's thousands of them on GitHub and other sites, like [jekyllthemes.org](http://jekyllthemes.org). Many of these can be hosted directly through GitHub without having to install anything onto your own computer. Jekyll themes are designed to have their users manipulate information in Markdown and YML files that then are passed through an HTML template and visualized on your website. All sites start with the same structure:

- _config.yml: the configuration settings of your site. Contains elements like your website title and which directories to include in your build
- _layouts: overarching HTML templates, such as for a homepage or blog post
- _includes: smaller HTML templates. These alter sections of the page, such as the navigation bar, call to action, etc...
- _sass: the stylesheets for your site
- assets: additional static files, such as images, scripts, and more

### Installing Jekyll

Because I wanted to develop my own theme, I needed to install Jekyll on my computer. I use a Mac, which actually comes with Ruby preinstalled (Jekyll is built off of Ruby). Unfortunately, this almost leads to more difficulty as the computer fights to avoid changing any of these preinstalled files. I tried to follow the official documentation ([HERE](https://jekyllrb.com/docs/installation/macos/)), but ran into a number of issues that prevented install. I ultimately was successfully by using [RVM](https://rvm.io) rather than Homebrew to install the latest version of Ruby, and then returning to the official instructions for installing Jekyll on top of that.

### Creating A New Theme

{:.codeheader}
console
```
jekyll new-theme explorers-portfolio-theme
```

This command creates a new Jekyll theme called "explorers-portfolio-theme", including all of the scaffolding needed to get you started. My website is relatively simple; it has a homepage composed of multiple sections as well as smaller pages associated with blog posts that follow a standard template. For the homepage, I wanted there to be six sections:

- navigation bar: at the top of the website for maneuvering through the site
- home: landing page with picture
- bio: headshot, short biography, and skills list
- projects: major research projects from that I wish to highlight. Many of these have produced some sort of communication material (scientific paper, poster, website, etc) that I link to
- blog: posts about topics that I am interested in and feel might be useful to others
- contact bar: contact information for those that want to connect

Starting at the top, the navigation bar was pulled nearly directly from my original site but with some reusability.

{:.codeheader}
navbar.html
```html
<div id="topnav">
    
    {% if page.layout == 'home' %}
        <a class="section-title" id="Logo" href="javascript:void(0);" onclick="goTo('#home')">
            <i class="fas fa-hiking fa-lg logo" title="{{ site.name }}"></i>
        </a>
        <a class="section-title active" id="Home" href="javascript:void(0);" onclick="goTo('#home')">Home</a>
        <a class="section-title" id="Bio" href="javascript:void(0);" onclick="goTo('#bio')">Bio</a>
        {% for category in site.categories %}
            <a class="section-title" id="{{ category[0] | capitalize }}" href="javascript:void(0);" onclick="goTo( '{{ '#' | append: category[0] }}' )">{{ category[0] | capitalize }}</a>
        {% endfor %}
    {% else %}
        <a class="section-title" id="Logo" href="{{ '/#home' | relative_url }}">
            <i class="fas fa-hiking fa-lg logo" title="{{ site.name }}"></i>
        </a>
        <a class="section-title" id="Home" href="{{ '/#home' | relative_url }}">Home</a>
        <a class="section-title" id="Bio" href="{{ '/#bio' | relative_url }}">Bio</a>
        {% for category in site.categories %}
            <a class="section-title" id="{{ category[0] | capitalize }}" href="{{ '/#' | append: category[0] | relative_url }}">{{ category[0] | capitalize }}</a>
        {% endfor %}
    {% endif %}
    
    {% if site.social_links.CV.link %}
        <a class="section-title" id="CV" href="{{ site.social_links.CV.link | relative_url }}" target="_blank">CV</a>
    {% endif %}
    
    <a href="javascript:void(0);" class="burger" onclick="hamburger()">
        <i class="fa fa-bars"></i>
    </a>
    
</div>
```

The major difference now is that the navigation bar template needs to work slightly differently when users are on the homepage versus on a blog post. On the homepage, navigation links refer to sections that are found somewhere on the homepage, either above or below the users current position, causing the screen to scroll to those sections. This scrolling behavior would not work for when you are on a blog posts as the sections don't exist on that page, so when 'page.layout' is not home, navigation links teleport the user to the respective section on the homepage. Lastly, the Home, Bio, and CV sections are hardcoded within the site, whereas Projects and Blog are not. This will be explained in more depth later on in this post.

Next, we have the landing section of the homepage. This use to be the animated parallax mountains that I made in p5.js, but I wanted to change it up for this latest version.

{:.codeheader}
home.html
```html
<div id="home">
    {% if page.homepage_background %}
        <div class="background" style="background-image: linear-gradient( 90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)), url('{{ page.homepage_background | relative_url }}');"></div>
    {% else %}
        <script src="{{ '/assets/scripts/parallax-mountains.js' | relative_url}}"></script>
        <div id="background"></div>
    {% endif %}
    <div class="textbox {{ page.title_align }}">
        <h1 class="title">{{ site.name }}</h1>
        <p class="desc">{{ site.job_title }}</p>
        <div class="links">
            {% for link in site.social_links %}
                <a target="_blank" href="{{ link[1].link | relative_url }}">
                    <i class="{{ link[1].icon }} link" title="{{ link[0] }}"></i>
                </a>
            {% endfor %}
        </div>
    </div>
</div>
```

There are two options. Within the index.md file, you can select a homepage_background to use for the landing page. Depending on the composition of the picture, you can then align your title box to match. In my case, I went with my partner's picture of me from Angel's Landing in Zion National Park and aligned the title box to the right. There is a slight black gradient added to the background image to help the text stand out. In mobile view, the title box is automatically center aligned. Lastly, if a homepage_background is not defined, the background will default to the parallax mountains.

The bio section is very straight forward with Liquid being used mostly to organize the skills section.

{:.codeheader}
bio.html
```html
<div id="bio" class="section">
    {% if page.headshot.size > 0 %}
        <div style="margin: auto auto 60px auto; background-image:url('{{ page.headshot | relative_url }}'); height: 300px; width: 300px; border-radius: 50%; background-position: center; background-size: cover;"></div>
    {% endif %}
    {% if page.bio.size > 0 %}
        {{ page.bio | strip | markdownify }}
    {% endif %}
    {% if page.skills.size > 0 %}
        <div style="margin: 50px 0px;">
            {% for skillset in page.skills %}
                {% if forloop.first %}
                    <div class="cat" style="text-align: center; margin: 0px 0px 2.5px 0px;">
                {% elsif forloop.last %}
                    <div class="cat" style="text-align: center; margin: 2.5px 0px 0px 0px;">
                {% else %}
                    <div class="cat" style="text-align: center; margin: 2.5px 0px;">
                {% endif %}
                        {% for skill in skillset %}
                            <div class="background">
                                <p class="skill">{{ skill }}</p>
                            </div>
                        {% endfor %}
                    </div>
            {% endfor %}
        </div>
    {% endif %}
    {% if page.publications.size > 0 %}
        <h2>Publications</h2>
        {% for pub in page.publications %}
            <p><b>{{forloop.rindex}}. </b>{{ pub }}</p>
        {% endfor %}
    {% endif %}
</div>
```

This is the first time that I used 'forloop' attributes, including 'forloop.first' and 'forloop.last', which allow you to treat the first and last elements in the loop differently than those in the middle.


Each of these sections has an associated HTML file within the _includes directory. As both projects and blog posts are chronologically ordered, I decided to treat these sections in a very similar way (and actually reuse large sections of code in the process). Looking within the _includes directory, you won't find a projects.html or blog.html file. Instead, these two sections are generated within the categories.html file. Jekyll allows users to identify categories for their blogs to better organize posts around topics. Using this method, I created a projects directory containing another directory named _posts. This tells Jekyll that I am going to put posts in this directory with the category of "projects". Project posts are then markdown files, named in this format: YYYY-MM-DD-"title".md. Each project posts has front matter with information about it's title, post date, a description of the project, and any links to supplemental materials.

