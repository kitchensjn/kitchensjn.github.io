---
layout: "post"
link: "/blog/pyinstaller-and-creating-executables"
title: "Pyinstaller and Creating Executables"
date: "October 24, 2020"
skills: [Python]
desc: "As part of my work at the NASA Jet Propulsion Laboratory, I am developing code that needs to be readily usable across a number of different computer environments and by users with varying levels of programming backgrounds."
thumbnail: "/assets/blog/pyinstaller-and-creating-executables/thumbnail.jpg"
---

{:.images}
![Pyinstaller](/assets/blog/pyinstaller-and-creating-executables/thumbnail.jpg)

As part of my work at the NASA Jet Propulsion Laboratory, I am developing code that needs to be readily usable across a number of different computer environments and by users with varying levels of programming backgrounds. To go about this, I began looking into strategies for decreasing the number of dependencies needed for the code to run. I had previously developed a standalone application for MacOS and Windows relating to the TopoTable project using PyQt and Pyinstaller and felt that a similar strategy could be employed for this project as well. This post will document some of the intricacies of developing an application using Pyinstaller and hopefully serve as a helpful guide for solving many of the complications that I have come across.

Pyinstaller is a package which freezes and bundles Python code into a self-contained executable or application. It is designed to capture all of your dependencies (packages which are used by your code) so as to make it possible for users to run the program without Python or any of these packages installed themselves. This is very important when distributing to other users, who are always hoping for the shortest number of steps to run your program. I have had decent success using Pyinstaller for my own projects, but, especially as applications grow in size and become more complex, it will require some internet sleuthing to find answers to any development challenges.

Steps to Generate a Pyinstaller Application:
- Install pyinstaller for your Python version. I prefer using Anaconda (Anaconda Navigator) to maintain my Python environment, but pip works just as well.
- Create your Python script and make sure everything works on its own!
- In Terminal or Console Prompt, make sure you are in your python environment, and run **pyinstaller "yourcode"**. This will generate a “.spec” file and two output directories (build and dist). The “.spec” file contains all of the arguments that are passed to bundle the application. The “dist” directory contains your application and, ultimately, everything that you would be sending to someone else.
- Within **dist/"yourcode"**, there is an executable file which is used to run your program.

And that’s all that is needed to create the simplest application. It really is straightforward to set everything up. Pyinstaller builds the application specific to your computer’s operating system; so if you are on MacOS, you will be building an application specific for MacOS. Pyinstaller also gives you the ability to add additional arguments to the base command in order to better suit the application to your needs. Two such arguments that I have used often are:

- **\--onefile**: Bundles everything into a single file rather than a directory. This can make distribution and running the application very simple for users. Unfortunately, it can lead to a decrease in speed performance.
- **\--noconsole**: Running the executable does not open up a terminal or command prompt window. I have used this with programs that have a Graphical User Interface already built (using tkinter or PyQt) and makes the program look more professional. On MacOS, using this argument will generate a “.app” file rather than the standard Unix executable. During development, I avoid this argument as the console can be helpful for error checking until I am confident that the build is stable.

As with most programming, it rarely goes completely without a hitch. Below I’ve highlighted some common errors that I’ve run into:

- **Missing Packages**: Pyinstaller does it’s best to bundle all of your dependencies, but I have found that it does miss the mark occasionally, especially with programs that use geospatial modules like rasterio and xarray. If you are getting errors associated with missing packages, I have had the best success with manually copying these missing packages into your application. On MacOS, your application’s packages are stored in the same directory as your executable if you are using the default configuration or within “/Contents/MacOS”. This method is not possible with the --onefile argument as everything is bundled within that single executable file, so keep that in mind when you are planning out your application. I copy packages over one at a time until I no longer get missing package errors.
- **Tkinter on MacOS**: There are some major compatibility issues between tkinter and pyinstaller on MacOS. I am uncertain the exact cause of these issues, but I believe that it boils down to version differences between tkinter that is by default installed on MacOS and the updated version that you would install. This discussion on GitHub describes how to go about solving this particular issue.
- **Distributing Applications For MacOS**: I am not a certified application developer for Apple products, but I would still like to be able to send my applications to others. Apple has placed a few barriers into this process. Firstly, when you first open an application downloaded from the internet from an unidentified developer (me in this case), you cannot simply double-click the application; you need to right-click to open. After this initial opening, you can double-click as usually. With distributing your application, a much more difficult issue to diagnose is the fact that MacOS will actually change the perceived location of your application, placing it into a sort of quarantine until it determines that it is safe to use. You can convince the operating system to allow your application to be placed properly by having the user change the directory of the application. This resets the application’s path and will allow you to use relative paths within your program. You can diagnose if you are running into this issue if you have your application print the current working directory; the “quarantine” directory is generated within the AppTranslocation directory at a random address.
- **Distributing Applications for Windows**: If you cannot use the --onefile argument (for whatever reason), the executable file can feel buried within the directory by all of the build files. The easiest way to solve this is by having the user create a shortcut to the executable that is stored in a higher level, cleaner directory. These shortcuts use an absolute path, so it is important that the application does not move after the shortcut is created (or create a new shortcut each time the application moves.