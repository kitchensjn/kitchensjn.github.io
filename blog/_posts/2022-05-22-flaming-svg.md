---
layout: "post"
link: "/blog/flaming-svg"
title: "Flaming SVG"
date: "May 22, 2022"
skills: [HTML, CSS]
desc: I was looking for website design inspiration and came across this [website](https://crustac.fr/en/home/) with a really interesting landing page. This site has clearly had a lot of thought put into its design, and I wanted to dissect their methods for masking the video within the company logo. I bounced between parsing through the websites source code and various YouTube videos to develop my own take on the method; the above animation is a gif of the resulting design.
thumbnail: "/assets/blog/flaming-svg/fire_letters_thumb.jpg"
---

{:.images}
![Flaming SVG](/assets/blog/flaming-svg/fire_letters_final.gif)

I was looking for website design inspiration and came across this [website](https://crustac.fr/en/home/) with a really interesting landing page. This site has clearly had a lot of thought put into its design, and I wanted to dissect their methods for masking the video within the company logo. I bounced between parsing through the websites source code and various YouTube videos to develop my own take on the method; the above animation is a gif of the resulting design.

For this, all you need is an SVG file. This will work best for SVGs with large polygons rather than smaller lines as these regions will be replaced by the animated background. You can either find an SVG online or create one using programs like Adobe Illustrator, Adobe XD, or Figma. SVGs can be added directly into the HTML structure really easily.

{:.codeheader}
index.html
```html
<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 500 500">
    <g id="Group_1" data-name="Group 1" transform="translate(-369.691 -12.506)">
        <path id="Path_1" data-name="Path 1" d="M531.5,352.2V172.809a12.674,12.674,0,0,1,3.088-8.291l47.761-55.347a12.673,12.673,0,0,0,3.088-8.291V25.237a12.765,12.765,0,0,0-12.8-12.731H490.354a12.765,12.765,0,0,0-12.8,12.731V374.775a12.761,12.761,0,0,1-12.791,12.731H382.487a12.765,12.765,0,0,0-12.8,12.731v99.539a12.765,12.765,0,0,0,12.8,12.731H572.636a12.765,12.765,0,0,0,12.8-12.731V424.133a12.673,12.673,0,0,0-3.088-8.291l-47.761-55.347A12.674,12.674,0,0,1,531.5,352.2Z" transform="translate(0 0)" fill="black"/>
        <path id="Path_2" data-name="Path 2" d="M682.945,491.484,492.5,270.8a12.683,12.683,0,0,1,0-16.583L682.945,33.528a12.724,12.724,0,0,0-9.708-21.022H554.413a12.819,12.819,0,0,0-9.708,4.435L417.358,164.518a12.675,12.675,0,0,0-3.088,8.291V352.2a12.674,12.674,0,0,0,3.088,8.291L544.7,508.067a12.823,12.823,0,0,0,9.708,4.439h118.82A12.725,12.725,0,0,0,682.945,491.484Z" transform="translate(183.635 0)" fill="black"/>
    </g>
</svg>
```

The website is going to be the animated logo scaled to the full screen size. For a larger project, I would normally put the styling in a separate file, but for this, I decided to contain everything in a single file. Much of the styling is to position the logo in the center of the screen and determine the appropriate size to prevent any scaling issues.

{:.codeheader}
index.html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flaming SVG</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }
            html {
                background-color: #FFFFFF;
            }
            .container {
                width: 100vw;
                height: 100vh;
                position: absolute;
                top: 0px;
                left: 0px;
            }
            #fire-video {
                position: absolute;
                width: 50vw;
                height: 50vw;
                object-fit: cover;
                mix-blend-mode: lighten;
            }
            .size-control {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .text-box {
                position: absolute;
                height: 51vw;
                width: 51vw;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                
            }
            .text {
                width: 100%;
                height: 100%;
                padding: 1vw;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        </style>
    </head>
    <body>
        <section>
            <div class="container" style="background-color: white"></div>
            <div class="container">
                <div class="size-control text-box">
                    <div class="text">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 500 500">
                            <g id="Group_1" data-name="Group 1" transform="translate(-369.691 -12.506)">
                              <path id="Path_1" data-name="Path 1" d="M531.5,352.2V172.809a12.674,12.674,0,0,1,3.088-8.291l47.761-55.347a12.673,12.673,0,0,0,3.088-8.291V25.237a12.765,12.765,0,0,0-12.8-12.731H490.354a12.765,12.765,0,0,0-12.8,12.731V374.775a12.761,12.761,0,0,1-12.791,12.731H382.487a12.765,12.765,0,0,0-12.8,12.731v99.539a12.765,12.765,0,0,0,12.8,12.731H572.636a12.765,12.765,0,0,0,12.8-12.731V424.133a12.673,12.673,0,0,0-3.088-8.291l-47.761-55.347A12.674,12.674,0,0,1,531.5,352.2Z" transform="translate(0 0)" fill="white"/>
                              <path id="Path_2" data-name="Path 2" d="M682.945,491.484,492.5,270.8a12.683,12.683,0,0,1,0-16.583L682.945,33.528a12.724,12.724,0,0,0-9.708-21.022H554.413a12.819,12.819,0,0,0-9.708,4.435L417.358,164.518a12.675,12.675,0,0,0-3.088,8.291V352.2a12.674,12.674,0,0,0,3.088,8.291L544.7,508.067a12.823,12.823,0,0,0,9.708,4.439h118.82A12.725,12.725,0,0,0,682.945,491.484Z" transform="translate(183.635 0)" fill="white"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <div class="size-control text-box" style="mix-blend-mode: darken;">
                    <div class="text" style="background-color: white;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 500 500">
                            <g id="Group_1" data-name="Group 1" transform="translate(-369.691 -12.506)">
                              <path id="Path_1" data-name="Path 1" d="M531.5,352.2V172.809a12.674,12.674,0,0,1,3.088-8.291l47.761-55.347a12.673,12.673,0,0,0,3.088-8.291V25.237a12.765,12.765,0,0,0-12.8-12.731H490.354a12.765,12.765,0,0,0-12.8,12.731V374.775a12.761,12.761,0,0,1-12.791,12.731H382.487a12.765,12.765,0,0,0-12.8,12.731v99.539a12.765,12.765,0,0,0,12.8,12.731H572.636a12.765,12.765,0,0,0,12.8-12.731V424.133a12.673,12.673,0,0,0-3.088-8.291l-47.761-55.347A12.674,12.674,0,0,1,531.5,352.2Z" transform="translate(0 0)" fill="black"/>
                              <path id="Path_2" data-name="Path 2" d="M682.945,491.484,492.5,270.8a12.683,12.683,0,0,1,0-16.583L682.945,33.528a12.724,12.724,0,0,0-9.708-21.022H554.413a12.819,12.819,0,0,0-9.708,4.435L417.358,164.518a12.675,12.675,0,0,0-3.088,8.291V352.2a12.674,12.674,0,0,0,3.088,8.291L544.7,508.067a12.823,12.823,0,0,0,9.708,4.439h118.82A12.725,12.725,0,0,0,682.945,491.484Z" transform="translate(183.635 0)" fill="black"/>
                            </g>
                        </svg>
                    </div>
                    <video id="fire-video" autoplay loop muted>
                        <source src="fire_2.mp4" type="video/mp4">
                    </video>             
                </div>
            </div>
        </section>
    </body>
</html>
```

There are a few non-intuitive aspects of this design. I'm actually drawing two logos, each stored within their own `text-box` class div; they are nearly identical. The first one is draw as a white logo, then the second one is overlaid. Technically, the second has a black fill with a white background, but because of the styling property `mix-blend-mode`, it blends its fill with the mp4 video of the fire. `mix-blend-mode` is a curious property that I am still somewhat bewildered by. Because the mp4 video of the fire is set to `mix-blend-mode: lighten`, it fills the logo with the fire and maintains the white background to the logo. This is not obvious when the background of the website is also white, but on the example website, they showed that you can actually use `mix-blend-mode: darken` on the `text-box` div to blend out the white background to make it possible to see whatever image is behind. You need to draw the logo twice because in this process, the whites from the fire are blended to be transparent; there may be other ways around this, but it was simplest to add a white logo underneath to fill in those transparent sections (this matched the method from the original website).

Occasionally, I was/am getting weird overlapping issues where the fire or white logo would peak through. This occurs when the two overlapping divs are the exact same size. The fire can be solved by making the video smaller than the logo to ensure that the video was always covered. To do this, I made the video 50vw x 50vw and the logo 51vw x 51vw with a 1vw padding. Unfortunately, I haven't found a solution to prevent the white logo from peaking out. This is only apparent with very dark backgrounds and is actually present in the original website which I hadn't realized. This is probably beyond my CSS skills at the moment, but I may return to this later if I can think of a clever solution around.

This was a fun weekend project to get me back into some website design. I'm pretty happy with the resorts and think it would be relatively easy to implement within a site. All of the code is found in the above code block, so I am not going to put together a GitHub repo for this project. If you are interested in using this code in your own project, you can download the mp4 of the fire from [here](https://pixabay.com/videos/fire-burn-flames-gas-heat-smoke-33072/) or you can easily replace the video source with your own mp4. And of course, please share any of your designs with me on Twitter ([@kitchensjn](https://twitter.com/kitchensjn)).