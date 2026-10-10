---
id: flows-and-matchings
title: Flows and Matchings
author: Prottoy Fuad
date: 16122022
---

>*I originally wrote this as a study note while learning about flows. I’ve cleaned up the formatting a bit, but yeah— there are almost certainly mistakes still hiding in here.*

Consider a graph with a source node (s) and a sink node (t). Each edge has a capacity (C). If we supply flow from the source to the sink, our goal is to find the maximum possible total flow (F).

General constraints:

```text
0 ≤ F(u, v) ≤ C(u, v)
∀ v ∈ V \ {s, t},  ∑ F(u, v) = ∑ F(v, w)
F = ∑ F(s, u) - ∑ F(u, s)
```

For the Ford-Fulkerson algorithm, we conceptually modify the graph by adding a reversed edge for every original edge. The modified equations (using skew symmetry) for this network are:

```text
F(u, v) = -F(v, u)
F(u, v) ≤ C(u, v)
∑ F(u, v) = 0
```

And, total flow F = ∑ F(s, u) = ∑ F(u, t)

## OBSERVATIONS

F = F1 + F2
Total flow = sum of all flows

F = F1 + F2 + … … …
Every flow can be decomposed into a set of paths from the source (s) to the sink (t), plus possible cycles.

## RESIDUAL CAPACITY

Residual capacity represents how much additional flow can be pushed through an edge.
C'(u, v) = C(u, v) - F(u, v)

We maintain a residual graph containing only edges with a strictly positive residual capacity (C' > 0).
Edges where C' = 0 are called saturated edges, and they are conceptually removed from the residual graph.

When pushing a new flow (F) from u to v, we decrease the residual capacity of the forward edge by F, and increase the residual capacity of the reverse edge by F.

```text
C'(u, v) = C'(u, v) - F
C'(v, u) = C'(v, u) + F
```

## FORD FULKERSON

An augmenting path is a simple path from source to sink in the residual graph where every edge has a residual capacity C' > 0. Finding an augmenting path implies that the current flow is not yet maximum, and we can increase the flow along this path by some amount Δ.

Δ = min(C'(u, v)) for all edges (u, v) in the augmenting path.

Starting with 0 flow, while we can find an augmenting path, we increase the total flow by Δ, and adjust the residual network by updating the affected edges:

```text
C'(u, v) = C'(u, v) - Δ
C'(v, u) = C'(v, u) + Δ
```

### IMPLEMENTATION w/DFS

We run DFS or BFS to find an augmenting path. While an augmenting path exists, we continue this process.

After finding an augmenting path, we adjust the residual network by updating C'(u, v) for all edges in the path. This is easily done by keeping track of the parent of each vertex during the BFS/DFS traversal. Once the sink is reached, we trace back through the parents to the source, adjusting the capacities.

With DFS, we can find the path, compute the minimum capacity Δ, and adjust the affected edges all in one recursive traversal. While traversing down the tree, we keep track of the bottleneck capacity. While backtracking, we update the residual capacities.

```python
def dfs(v, current_min_capacity):
    if used[v]:
        return 0
    used[v] = True
    if v == t:
        return current_min_capacity
        
    for u in adj[v]:
        residual_cap = C[v][u] - F[v][u]
        if residual_cap == 0:
            continue
            
        pushed_flow = dfs(u, min(current_min_capacity, residual_cap))
        if pushed_flow > 0:
            F[v][u] += pushed_flow
            F[u][v] -= pushed_flow
            return pushed_flow
    return 0
```

Let F be the maximum flow. The time complexity of Ford-Fulkerson using DFS is O(F · m), which is pseudo-polynomial. This occurs because the algorithm might repeatedly choose augmenting paths that only increase the flow by a small amount (e.g., 1 unit), requiring up to F iterations in the worst case. However, this approach works well if the maximum capacity and total flow are known to be small.

### SCALING

The issue with the basic DFS implementation is that it might choose augmenting paths with very low bottleneck capacities. We can optimize this by prioritizing paths with larger capacities:

```text
C' ≥ 2^k, where k ranges from ⌊log₂(C_max)⌋ down to 0
```

While we can find an augmenting path with bottleneck capacity ≥ 2^k, we push flow along it. Once no such paths exist, we decrease k by 1.
To restrict DFS to edges with sufficient capacity, we simply update the condition:
    **if C[v][u] - F[v][u] < 2^k: continue**

For any scaling phase k, we know there are no remaining augmenting paths with bottleneck capacity ≥ 2^(k+1).
And there could be at most m edges with -
C' ∈ [ 2^k, 2^(k+1) )

Hence, for each phase k, we can find at most 2m augmenting paths.

Since there are log₂(C_max) phases, and each phase requires at most 2m DFS runs (each taking O(m) time), the overall time complexity is O(m² log C_max), which is a polynomial time algorithm.

## EDMONDS-KARP w/BFS

The Edmonds-Karp algorithm is an implementation of Ford-Fulkerson that uses BFS instead of DFS to find augmenting paths. By always choosing the shortest augmenting path (in terms of the number of edges), it guarantees a strongly polynomial time complexity.

This is because adjusting the flow along the shortest augmenting path can remove some edges and add reverse edges to the residual network.

Crucially, the shortest path distance from the source to any node v never decreases monotonically across iterations.

Let's consider the maximum number of times a single edge (u, v) can become a bottleneck (saturated) and thus disappear from the residual network.

When the edge (u, v) is saturated and removed, it means d[v] = d[u] + 1.

For (u, v) to be added back, we must push flow in the reverse direction along (v, u), meaning (v, u) was part of a later augmenting path. At that point, the new distances must satisfy d'[u] = d'[v] + 1. Since distances never decrease, d'[u] ≥ d[v] + 1 = d[u] + 2.

Thus, between consecutive saturations of the same edge, the distance to u must increase by at least 2. Since the maximum possible distance is n (the number of vertices), each edge can be saturated at most O(n) times.

With m total edges, there are at most O(n·m) saturating operations. Each requires a BFS taking O(m) time, resulting in an overall time complexity of O(n·m²).

## MIN CUT THEOREM

Consider a graph with a source (s) and a sink (t). An s-t cut is a partition of the vertices into two sets, one containing s and the other containing t. The goal is to remove a set of edges crossing the cut such that t is no longer reachable from s, while minimizing the sum of the capacities of the removed edges.

The Min-Cut Max-Flow Theorem states that the minimum cut capacity is exactly equal to the maximum flow.

Suppose we have found the maximum flow. Let S be the set of nodes reachable from s in the final residual graph, and T be the remaining nodes (including t).

By definition, any flow F across this cut must be less than or equal to the capacity C of the cut.

When F = C, the flow is maximized and the cut capacity is minimized. This specific cut represents the minimum cut.

To find the edges constituting the minimum cut, we first run any maximum flow algorithm. Then, we perform a final DFS or BFS from the source s in the residual graph.

The search will visit a set of reachable vertices (S). The remaining unvisited vertices belong to set (T).

The edges from the original graph that connect a vertex in S to a vertex in T make up the minimum cut. These edges must be fully saturated, meaning:
    **C'(u, v) = 0  ⇔  F(u, v) = C(u, v)**

So, the flow through these edges is maximum, matching the cut capacity perfectly.

## DINITZ

We have a graph with a source(s) and a sink(t) node. Each edge has a capacity(C). The Edmonds-Karp algorithm finds the maximum flow in O(n·m²) by selecting the shortest augmenting path in each iteration.

Dinitz's algorithm builds upon this idea but optimizes it by processing multiple paths simultaneously. Instead of finding a single augmenting path per BFS, it constructs a layered network containing all shortest paths from s to t.

Once the layered network is built, we repeatedly find augmenting paths within it until no more paths from s to t exist:

For each path found, we push flow, updating residual capacities. We then remove any saturated edges (C' = 0) and dead ends (nodes that can no longer reach the sink).

When no more paths exist in the current layered network, we re-run BFS to construct a new layered network. We repeat this process until t is no longer reachable from s.

Note that the newly added backward edges in the residual network do not affect the current layered network, as they point from a farther layer to a closer layer and thus cannot be part of any shortest s-t path.

### ALGORITHM

```text
while (there is path s → t) {
    bfs() to build L.N.(layered network)
    while (there is path s → t in L.N) {
        find_path()
        Δ = min C'(u, v) where (u, v) ∈ path
        flow += Δ
        remove saturated edges [where C' = 0]
        remove dead-ends (newly created sinks ≠ (t))
    }
}
```

The outer loop (BFS) runs at most n times because the shortest path distance from s to t strictly increases with each new layered network, and the maximum possible distance is n. Building the layered network via BFS takes O(m) time.

Within each layered network, we can find at most m augmenting paths, as each path saturates at least one edge. Finding a path using DFS takes O(n) time in the worst case.

Dead ends are removed at most n times, and their adjacent edges at most m times per layered network. The amortized complexity of maintaining the layered network and finding paths is thus bounded.

In practice, we optimize this using an array of pointers (one for each vertex) to keep track of the next valid edge to explore during DFS. This prevents rescanning saturated edges or dead ends. Since each edge is explored and eventually saturated or discarded, the total time spent across all DFS calls within one phase is O(n·m).

So, overall Time Complexity :
    **O(n · n · m) = O(n²m)**
    With capacity scaling, this can be improved to **O(n·m log C_max)**.

### OPTIMIZATIONS

The slowest part of dinitz's algorithm is finding the paths in the layered network. This bottleneck can be improved further using data structures like LINK CUT TREE. The idea is to use some segment of previous paths as a part of the new path.

Using Link-Cut Trees reduces the time per path to O(log n), bringing the overall complexity to O(m·n log n).
_// Too tough implementation, will learn later :3_

## COMPLEXITY ANALYSIS OF FLOW ALGORITHMS

Let's consider two special cases: unit capacities (C(u, v) = 1) and unit networks (C(u, v) = 1 with no parallel edges).

| Algorithm       | Complexity   | Unit Capacities (C=1) | Unit Networks (C=1, No parallel edges) |
|:----------------|:-------------|:----------------------|:---------------------------------------|
| Ford-Fulkerson  | O(F·m)       | O(m²)                 | O(n·m)                                 |
| Edmonds-Karp    | O(n·m²)      | O(m²)                 | O(n·m)                                 |
| Dinitz          | O(n²·m)      | O(m·√m)               | O(m·n^(2/3))                           |

Intuitively, we might guess Dinitz takes O(n·m) in these cases, but the actual bounds are tighter.

For unit capacities, the time complexity is O(m·√m). Consider the algorithm after √m phases. Any remaining augmenting paths must have a length of at least √m. Since all capacities are 1, remaining augmenting paths must be edge-disjoint. With m total edges, there can be at most m / √m = √m such paths. Thus, there are at most √m remaining phases, leading to an overall time complexity of O(m·√m).

In a unit network (unit capacities and no parallel edges), the time complexity is O(m·n^(2/3)).

Consider the algorithm after n^(2/3) phases. The distance between source and sink is at least n^(2/3). Let a[i] be the number of vertices in the i-th layer of the residual graph.

There must exist a cut between two adjacent layers with capacity at most n^(2/3).

Because the sum of vertices across all layers is at most n, the minimum possible value of a[i] × a[i+1] (which upper bounds the number of edges between layer i and i+1) is at most (n / n^(2/3))² = n^(2/3).
Thus, the remaining maximum flow is bounded by this cut capacity: **ΔF ≤ n^(2/3)**.
Since each remaining phase pushes at least 1 unit of flow and takes O(m) time, the remaining work is bounded by O(m·n^(2/3)).

## BIPARTITE MATCHING w/ DINITZ (Hopcroft-Karp)

The maximum bipartite matching problem can be reduced to the maximum flow problem. We add a source node (s) connected to all vertices on the left side of the bipartite graph, and a sink node (t) connected from all vertices on the right side.

If all edges (including the original bipartite edges and the new source/sink connections) are assigned a unit capacity of 1, the maximum flow value equals the size of the maximum bipartite matching. The saturated edges between the left and right sides correspond to the matched pairs.

Kuhn's algorithm for bipartite matching is essentially Ford-Fulkerson applied to this network. As shown earlier, Ford-Fulkerson takes O(n·m) on unit networks. However, solving this with Dinitz's algorithm is even faster and is equivalently known as the Hopcroft-Karp algorithm.

Suppose Dinitz's algorithm has executed √n phases.

Any subsequent augmenting paths must have a length of at least √n.

Since the maximum possible matching size is n/2, and the remaining paths are vertex-disjoint (due to the unit capacity on source/sink edges), the remaining flow is bounded by n / √n = √n. Thus, there are at most √n remaining phases.

While Dinitz's general bound for unit networks is O(m·n^(2/3)), the specific structure of bipartite matching (where each vertex has capacity constraints preventing path intersections) tightens this. The number of phases is strictly bounded by O(√n).

Therefore, the overall time complexity of the Hopcroft-Karp algorithm is O(m·√n).
