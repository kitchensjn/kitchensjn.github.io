---
layout: "post"
permalink: "/blog/stalberg-grid"
title: "Stalberg Grid"
date: "February 17, 2026"
skills: [Python]
description: Cherry Creek winds its way through the polished granite domes of Emigrant Wilderness, just northwest of Yosemite National Park. In late spring, clear blue snow melt water from the high peaks to the northeast is funneled through the canyon as it descends to Cherry Lake.
image: "/assets/blog/upper-cherry-creek/photos/cherry_bomb_gorge.jpg"
---

Oskar Stålberg is a video game developer who has worked on many cool games that use "wave function collapse"-style algorithms for procedural map generation (Townscaper, Bad North, etc). Superficially inspired by ideas from quantum mechanics, wave function collapse (WFC) works in the same way you might solve a Sudoku puzzle. It starts with a prebuilt set of tiles and rules for how these tiles can connect. The algorithm then seeds an empty map with a small number of fixed tiles. It then fills in empty tiles in the map based on those connection rules until the random map is fully complete. WFC can be implemented during development to generate base maps that can then be updated by environmental artists, within the game loop to allow for infinite levels of similar styling for users to play (Bad North), or as part of a map builder that players can directly interact with (Townscaper).

Though WFC is well-deserving of its own blog post, I was actually most intrigued by another unique feature in Townscaper - its irregular grid. Rather than using the tiles of the map being square, he uses an aperiodic quadrilateral mesh as the base map for the WFC alogirthm; from here on, I'll refer to this grid as a "Stålberg grid". I haven't come across a grid like this before, but it gives the Townscaper maps an organic randomness while still maintaining a familiar boxy layout. It looks very reminiscent of real life towns, where streets don't always flow in a perfectly straight line but instead contour to the environment. Luckily, Stålberg has been very open about how he's thought about and designed Townscaper, and I was interested in recreating his grid in Python.

There are only four steps needed to create the grid:

- Create a triangular mesh
- Remove edges to convert this to a mostly quadrilateral mesh (with some triangles still left over)
- Subdivide each face into smaller quadrilaterals
- Run a relaxation algorithm to reposition the vertices

In the following sections, I'll dive into my implementation of these steps based on descriptions from his presentations.

### The triangular mesh

{:.codeheader}
stalberg_grid.py
```python
def populate_vertices(num_rings, gap_between_rings=1):
    if num_rings < 0:
        raise RuntimeError("`num_rings` must be >=0.")

    vertices = [
        {
            "i": 0,
            "x": 0,
            "y": 0
        }
    ]

    counter = 1

    for ring in range(1, num_rings+1):
        for corner in range(6):
            angle = (corner/6)*(2*math.pi)
            x = math.sin(angle) * (gap_between_rings*ring)
            y = math.cos(angle) * (gap_between_rings*ring)
            vertices.append({
                "i": counter,
                "x": x,
                "y": y
            })
            counter += 1
            
            next_angle = ((corner+1)/6)*(2*math.pi)
            next_x = math.sin(next_angle) * (gap_between_rings*ring)
            next_y = math.cos(next_angle) * (gap_between_rings*ring)
            for vertex in range(1, ring):
                new_x = x + (vertex/ring) * (next_x-x)
                new_y = y + (vertex/ring) * (next_y-y)
                vertices.append({
                    "i": counter,
                    "x": new_x,
                    "y": new_y
                })
                counter += 1

    vertices = pd.DataFrame(vertices)
    return vertices

def populate_faces(num_rings):
    triangles = []
    starting_a = 0
    starting_b = 1
    for ring in range(num_rings+1):
        working_a = starting_a + 0
        working_b = starting_b + 0
        for edge in range(6):
            for i in range(ring):
                if (edge == 5) and (i == ring-1):
                    triangles.append((starting_a, starting_b, working_b))
                    starting_a = working_a + 1
                    starting_b = working_b + 1
                else:
                    triangles.append((working_a, working_b, working_b+1))
                if i < ring-1:
                    if (edge == 5) and (i == ring-2):
                        triangles.append((starting_a, working_a, working_b+1))
                    else:
                        triangles.append((working_a, working_a+1, working_b+1))
                        working_a += 1
                working_b += 1

    edges = []
    for t,tri in enumerate(triangles):
        for i in range(len(tri)):
            if (i < len(tri)-1):
                edges.append((t, tri[i], tri[i+1]))
            else:
                edges.append((t, tri[0], tri[-1]))

    faces = pd.DataFrame(edges, columns=["face", "vertex0", "vertex1"])
    return faces


num_rings = 5

vertices = populate_vertices(num_rings)
faces = populate_faces(num_rings)
edges = faces[["vertex0", "vertex1"]].drop_duplicates().sort_values(by=["vertex0", "vertex1"]).reset_index(drop=True)
```

I started by building a triangular mesh in the shape of a hexagon. It's easiest to start with the central point and then create concentric hexagonal rings of points until you get to the desired size. With each ring after the second, the number of vertices along the end of the hexagon increases by one (0:0, 1:0, 2:1, 3:2, etc). Keeping track of the triangular faces will be important when we are removing edges, so the next step is to identify all of the triangles in the mesh. I found that it is also easiest to do this by starting in the center and working out from there. It's also nice that once you find a pattern for an edge, you can repeat that pattern five more times to move around the ring. I decided to store everything in `pandas.DataFrame`s to keep things organized. At the end, I had a table of vertices, faces, and edges. I want to note that the Python package `networkx` (which we will use later) has a function `triangular_lattice_graph()` that may be useful if you don't care about the hexagon shape, but I think it adds a visualizing appealing touch to the grid.


### Removing edges

{:.codeheader}
stalberg_grid.py
```python
def get_num_vertices_in_ring(ring):
    if ring == 0:
        return 1
    edge_length = ring-1
    return 6 + edge_length*6

def get_starting_vertex_of_ring(ring):
    if ring < 0:
        raise RuntimeError("`num_rings` must be >=0.")
    
    total = 0
    for i in range(ring):
        total += get_num_vertices_in_ring(i)
    return total

def lock_outermost_edges(num_rings, edges):
    starting_vertex = get_starting_vertex_of_ring(num_rings)
    for i in range(get_num_vertices_in_ring(num_rings)):
        if (i == get_num_vertices_in_ring(num_rings)-1):
            a, b = starting_vertex, starting_vertex+i
        else:
            a, b = starting_vertex+i, starting_vertex+i+1
        edges.loc[(edges["vertex0"]==a)&(edges["vertex1"]==b),"locked"] = "red"
    return edges

def remove_edge(e, edges, faces):
    if (edges.loc[(edges["vertex0"]==e["vertex0"])&(edges["vertex1"]==e["vertex1"]), "locked"].iloc[0] != "red"):
        relevant_faces = faces.loc[faces["face"].isin(faces.loc[(faces["vertex0"]==e["vertex0"])&(faces["vertex1"]==e["vertex1"]),"face"].values)]
        faces.loc[faces["face"].isin(faces.loc[(faces["vertex0"]==e["vertex0"])&(faces["vertex1"]==e["vertex1"]),"face"].values), "face"] = relevant_faces["face"].min()
        relevant_edges = relevant_faces[["vertex0", "vertex1"]].drop_duplicates().reset_index(drop=True)
        for _,edge in relevant_edges.iterrows():
            edges.loc[(edges["vertex0"]==edge["vertex0"])&(edges["vertex1"]==edge["vertex1"]), "locked"] = "red"
        edges.loc[(edges["vertex0"]==e["vertex0"])&(edges["vertex1"]==e["vertex1"]), "locked"] = "white"
        edges.loc[(edges["vertex0"]==e["vertex0"])&(edges["vertex1"]==e["vertex1"]), "removed"] = True
        faces = faces.drop_duplicates().reset_index(drop=True)
        faces = faces.drop(faces.loc[(faces["vertex0"]==e["vertex0"])&(faces["vertex1"]==e["vertex1"])].index)
    return edges, faces


edges["locked"] = "blue"
edges["removed"] = False
edges = lock_outermost_edges(num_rings, edges)

removal_order = random.sample(range(len(edges.index)), len(edges.index))
for edge in removal_order:
    edges, faces = remove_edge(edges.loc[edge], edges, faces)
edges = edges.loc[edges["removed"]==False]
```

The key to this step is knowing which edges are allowed to be removed. Edges on the perimeter of the grid shouldn't be removed. Additionally, the goal is to convert most of the triangle faces into quadrilaterals, so we need to avoid removing edges from faces that are already quads as this would then make pentagons (not what we want). In the `edges` dataframe, I keep track of which edges are "locked" which means they cannot be removed. All edges start out "unlocked" or "blue"; I then lock ("red") all of the perimeter edges. I then create a random edge removal order that includes all of the edges in the grid. For each edge, I check whether it's locked, and if not, remove it by setting "locked" to "white" and "removed" to `True`. I also lock any edges that originally shared a face with this edge; this makes sure that edge removal only ever makes quadrilaterals. Because of the random edge removal order, it's likely that you will have triangles left over that cannot be turned into a quadrilateral because all of the faces associated edges are locked. That's okay and leads to some nice features in the resulting grid!

### Subdivided the faces

{:.codeheader}
stalberg_grid.py
```python
def find_center(f, faces, vertices):
    relevant_edges = faces.loc[faces["face"]==f, ["vertex0", "vertex1"]]
    relevant_vertices = pd.concat([relevant_edges["vertex0"], relevant_edges["vertex1"]], ignore_index=True).unique()
    coords = vertices.loc[vertices["i"].isin(relevant_vertices), ["x", "y"]].mean()
    return coords

def build_graph(vertices, faces):
    G = nx.Graph()
    starting_pos = {}
    for f in faces["face"].unique():
        center = find_center(f, faces, vertices)
        for _,edge in faces.loc[faces["face"]==f].iterrows():
            G.add_edge(edge["vertex0"], f"m_{edge["vertex0"]}_{edge["vertex1"]}")
            G.add_edge(f"m_{edge["vertex0"]}_{edge["vertex1"]}", edge["vertex1"])
            G.add_edge(f"m_{edge["vertex0"]}_{edge["vertex1"]}", f"c_{f}")
            v0 = vertices.loc[vertices["i"]==edge["vertex0"], ["x", "y"]].iloc[0]
            v1 = vertices.loc[vertices["i"]==edge["vertex1"], ["x", "y"]].iloc[0]
            starting_pos[edge["vertex0"]] = [v0["x"], v0["y"]]
            starting_pos[edge["vertex1"]] = [v1["x"], v1["y"]]
            starting_pos[f"m_{edge["vertex0"]}_{edge["vertex1"]}"] = [(v0["x"]+v1["x"])/2, (v0["y"]+v1["y"])/2]
        starting_pos[f"c_{f}"] = [center["x"], center["y"]]
    return G, starting_pos

G, starting_pos = build_graph(vertices, faces)
```

I said that the Stålberg grid was an aperiodic **quadrilateral** grid, but we still have triangular faces. We can finish this conversion by further subdividing the faces, specifically connecting the midpoint of each edge to the center of the face. With this strategy, triangles are divided into three quads and quads are divided into four quads.

![Example of triangle and square being subdivided]

### Relaxation

{:.codeheader}
stalberg_grid.py
```python
def get_edge_nodes(G):
    edge_nodes = []
    starting_vertex = get_starting_vertex_of_ring(num_rings)
    outer_ring = range(starting_vertex, starting_vertex+get_num_vertices_in_ring(num_rings))
    for vertex in outer_ring[:-1]:
        edge_nodes.extend([vertex, f"m_{vertex}_{vertex+1}"])
    edge_nodes.extend([outer_ring[-1], f"m_{outer_ring[0]}_{outer_ring[-1]}"])
    return edge_nodes

edge_nodes = get_edge_nodes(G)

fig, axs = plt.subplots(nrows=1, ncols=2)
pos = nx.spring_layout(G, pos=starting_pos, fixed=G.nodes)
nx.draw_networkx_edges(G, pos=pos, ax=axs[0])
pos = nx.spring_layout(G, k=0.00001, pos=starting_pos, fixed=edge_nodes, iterations=200)
nx.draw_networkx_edges(G, pos=pos, ax=axs[1])
for i in range(2):
    axs[i].set_aspect("equal", 'box')
    axs[i].axis("off")

plt.show()
```

I started this project thinking that I could easily implement the relaxation algorithm using a force-directed layout in `D3.js` (the same as I use for `tskit_arg_visualizer`). I ended up dropping this idea in favor of staying entirely in Python and using `spring_layout()` from `networkx`. The strength of the force simulation is a little extreme with `spring_layout()` so it's not the smoothest transition between rigid and relaxed grids, but it does settle eventually. There may be better parameters than what I am using here.

![Image of prerelaxed to relaxed grid]

### Conclusion

The Stålberg grid is a unique technique for breaking away from the standard triangular or square grid. I think that it provides an organic look that is really interesting to look at. I haven't found a use for it yet, beyond creating nice images, but funnily enough, I've already incorporated the triangular grid generator into another research project.