---
layout: "post"
permalink: "/blog/groundhogs"
title: "Groundhogs"
date: "October 25, 2022"
skills: [R]
desc: Phenology, in its simplest definition, is the study of nature's calendar. It seeks to answer questions such as "what signals tell birds that it is time to migrate south for the winter?", "why spring cold snaps can ruin a year's crop yield?", and most importantly, "how accurate have Punxsutawney Phil's predictions been over the years?".
thumbnail: "/assets/blog/why-are-there-so-many-gene-trees/coalescent_plot_1.png"
---

### Setup and Question

*You are an exterminator and have been called to a customer’s home to capture a groundhog that has been digging tunnels underneath their yard. Upon arrival, you see the vermin disappear underground into a what appears to be a maze of passages, depicted below:*

Maze

*You block off all of the entrances/exits to the tunnel to prevent the groundhog from escaping but don’t know where the groundhog is within the tunnels. If you can select only one location in the maze, where should you place your trap to optimize the chance that the groundhog will walk into it? For simplicity, assume that the groundhog has a random starting and ending location within the tunnels, with an equal probability given to every position, and that it follows the shortest path between those two locations (no backtracking).*

### Thought Process

To start off, are all of the trap locations equally likely to capture the groundhog under these conditions? I sure hope not, otherwise this thought experiment won’t be very satisfying, but let’s check. Here, I’ve numbered each position within the maze.

Numbered Maze

I know that there are 25 starting positions each with 25 associated ending positions for a total of 625 possible paths for the groundhog to travel. If I place my trap on position 1, I can list out all of the shortest paths that start, stop, or pass through this position:

List of paths

It’s important to see that there aren’t any paths that pass through position 1 on their way from/to another node, only paths which start or end there. This isn’t the case for many of the other possible trap positions. For example, any path that starts or ends at position 1 must utilize position 6, with the exception of 1->1. So it is clear that some locations have more shortest paths that pass through them than others, and these positions could be candidates for my trap.

In defining the problem this way, I’ve conveniently landed very close to a well known property in network theory, known as betweenness centrality. There are many different methods for measuring centrality, which is a ranking system for nodes based on their positions in a network. Betweenness centrality ranks nodes based on the number of shortest paths that pass through them. This gif shows how a maze can be visualized as a network and color the nodes based on their betweenness centrality value.

GIF of maze to network

I can use these values to calculate the probability of capturing the groundhog for every possible trap position in the maze, but it will take some modification. Returning to position 1, the betweenness centrality value is 0 because there aren’t any paths that pass through position 1, but there are paths that start and stop at position 1, so we will need to take those into account in the probability of trapping. Here is the equation for converting betweenness centrality to trapping probability and a table of all of the nodes with their associated probabilities:

Probability from Betweenness and Number of Nodes
P[trapping] = (2*(Betweenness + #Nodes) - 1) / #Nodes^2

From the table, position X has the highest probability of trapping the groundhog. So this problem seems to be pretty solved…

But is there more to it than that? If I had two traps, where should I put them to get the best coverage? It isn’t as simple as using the two positions with the highest trapping probability, because there may be significant overlap between the paths that they cover.
