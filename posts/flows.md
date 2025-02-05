---
layout: post
title: Flows and Matchings
author: prottoyfuad
date: 22/12/16
---

We have a graph with a source(s) and a sink(t) node. Each edge has a capacity(C). We supply water from source to sink. We need to find the maximum flow(F).

Generally -
0 <= F(u-v) <= C(u-v)
∀(v≠s,t), F(u-v) = F(v-u)
F = ⅀F(s-u) - ⅀F(u-s)

Here, black numbers denote capacity(C) of the edge and red numbers denote flow through the edge. And max flow is 13 units.

For F.F. algorithm, we modify the graph a bit. We add a reversed edge for all the edges. And the modified equations for the modified graph will be -

F(u-v)  = -F(v-u)
    C(u-v)  = 0
F(u-v) <= C(u-v)
⅀F(v-u) = 0

And, F = ⅀F(s-u) / ⅀F(u-t)

### OBSERVATIONS

F = F1 + F2 
Total flow = sum of all flows

F = F1 + F2 + … … …
Every flow(Fi) can be decomposed into some paths[from (s) to (t)] or cycles.

### RESIDUAL CAPACITY

Residual capacity means how much more flow is possible through an edge. 
C’(u-v) = C(u-v) - F(u-v)

And we will maintain a graph with only residual capacities, and only keep those edges where C’ = 0. 
The edges with capacity(0) are called Saturated-Edges.

For a new flow(F)[red-mark], we decrease the C’ of that edge by F, and decrease C’ of the opposite edge by -F.

  C’(v-u) = C’(v-u) - F
  C’(u-v) = C’(u-v) - (-F)

## FORD FULKERSON

An augmenting path is a path where for all edges of the path has a residual capacity(C’) > 0. So, if we can find an augmenting path, it implies that for that path the current flow is not possible yet and we can increase the flow of that path by some Δ.

And, Δ = min(C’) of ∀(v-u) ∈ aug.path.

So, the algorithm is, starting with 0 flow, while we can find an augmenting path, we increase the total flow by Δ, and adjust the residual network by updating the affected edges -

C’(v-u) = C’(v-u) - Δ
  C’(u-v) = C’(u-v) -(-Δ)

### IMPLEMENTATION w/DFS

We run dfs/bfs to find the augmenting path. And while we get a new augmenting path we keep running the algorithm.

So, after finding an augmenting path we need to adjust the residual network by altering all the C’(v-u) ∈ path. And we can easily do it by keeping track of the parent of each vertex of the bfs tree and then after finding an augmenting path we can follow the sink’s parent while we are not at the root yet, and adjust the residual network.

But we can do all the things at once with one dfs. While going down the dfs tree we keep track of the minimum C’(δ), which will be the new flow. And while backtracking from the dfs tree we can adjust the affected edges.

```python
flow_t dfs(v, δ) :
	if used[v] :
		return 0
	used[v] = true
	if v == t :
		return δ
	for ∀(v - u) ∈ G :
		if C(v-u) - F(v-u) == 0 :
			continue
		Δ = dfs(u, min(δ, C(v-u) - F(v-u)))
		if Δ > 0 :
			F(v-u) += Δ
            F(u-v) -= Δ
			return Δ
	return 0
```

let F = total flows, then it turns out the time complexity using dfs is O(F.M) which is non-polynomial. Because there could be an edge of 1 capacity in aug. path and a flow of arbitrarily large number, and in worst case we have to run dfs F times. But this approach works fine when we know that the flow is to be small.

### SCALING

The problem with the implementation with dfs is that we might find a low-flow aug.path. So, we can try to find a good aug.path instead of any aug.path. We can try to find an aug.path with-
C’ = 2^k, where K = [log2(C) … … … -> 0]
While we can find path with C’ = 2^k, we find them and add 2^k to the flow. And when we don’t find any we decrease k by 1. 
And to find any aug.path with (C’ >= 2^k), we just need to change the condition in dfs-
    **if C(v-u) - F(v-u) < 2^k : continue**

For any iteration K, we don't have any aug. path with 
C’ >= 2^(k+1).
And there could be at most m edges with -
C’ ∈ [ 2^k, 2^(k+1) )

Hence, for each K, we might get a new flow for at most (2m) times.

So, we have to run dfs for at most 2m.log(C) times. And, we obtain a somewhat weak-polynomial time complexity of O(m.m.log(C)).

## EDMONDS-KARP w/BFS

Edmonds-Karp provided an algorithm for Ford-Fulkerson which uses bfs to find the augmenting paths. The idea is to find the shortest augmenting path instead of finding any aug. path each time. And, it is enough to get a polynomial complexity.

Because, after adjusting an augmenting path from (s) to (t), we remove and add some new edge in the residual network.

But, the distance from source to any node(v) does not decrease in the next iteration, as we always choose the shortest aug.path.

Now, we think about what is the maximum number of times we might remove and add back a single edge again.

When we remove edge(v-u), distance of node(u) increases by at least 1.

And when we add it back, the new d[v] becomes at least the last updated d[u]+1.

So, removing and inserting the same edge increases d[v] by at least two. But distances are bounded by at most n. Hence, we can not increase distances or change one change more than n times.

So the total number of edges is m, and each edge changes at most n times. So we call bfs (nm) times. Hence, the time complexity is - O(n.m.m).

## MIN CUT THEOREM

We have a graph with a source(s) and sink(t) similar to ford-fulkerson. We need to remove some edges so that (t) is not reachable from (s) anymore and minimize the cost of the removed edges.

Turns out, the min cut problem is a dual problem of the maximum flow problem.

Let’s assume, we removed some edge and now (t) is not reachable from (s). And the removed edges connect the set reachable from (s) and the set not reachable from (s).
	
And at any point, flow(F) through the removed edges will be less than total cost of these edges i.e. cut(C) of these two sets.

And at any point when we get F = C, that is our minimum cut, as well as maximum flow from the set reachable to the set not reachable; as they are dual problems.

And to find the minimum cut we first find the maximum flow. And then run dfs one more time.

The dfs will visit some edges and some edges will be non visited.

Note that, the connecting edges between visited edge set and not visited edge set must have-
    **C’ = 0 ⇔ F(u-v) = C(u-v)**

So, the flow through these edges will be maximum, hence this is our min cut.

## DINITZ

We have a graph with a source(s) and a sink(t) node. Each edge has a capacity(C). With Edmonds Karp’s implementation of ford-fulkerson algorithm we can find the maximum flow of the graph in O(n.m.m) by finding the shortest path flow in each iteration.

In Dinitz’s algorithm, we build upon the same idea. In this case we will build a layered network with each bfs instead of finding only one aygm. A layered network is a graph with all possible shortest paths from vertex (s) to (t).

And after building the layered network we follow the same approach of edmonds karp algorithm as long as we can find a new path from (s) to (t) in the layered network -

We find a path in a layered network, remove all the saturated edges (where C’ = 0). And remove all the dead ends(those nodes from which we can’t reach the sink).

And when we don't have any more path from (s) to (t) in the layered network, then there is no more shortest path, and we go to the next iteration of edmonds algorithm and build the layered network from all possible next shortest path.

Note that, the newly added backwards edges in the residual network do not affect the layered network, because they do not contribute to any shortest path as they go from a farther node to a closer node from source.

### ALGORITHM

```python
while (there is path s → t) {
    bfs() to build L.N.(layered network)		
    while (there is path s → t in L.N) {
        find_path()
        Δ = min C’(v-u) where (v-u) ∈ path
        flow += Δ
        remove saturated edges [where C’ = 0]
        remove dead-ends(newly created sinks ≠ (t))
    }
}
```

Here, the outer loop runs at most n times because we can build the layered networks at most n times as the maximum distance(s → t) is n. And, we can build layered networks in linear time with bfs - O(m). 

From each layered network, we can find maximum m paths, as in each iteration, we remove at least one saturated edge where C’ = 0. And we can find paths in linear time of O(n).

And we remove dead-ends from the layered network at most n times, and adjacent edges at most m times over all the iterations on a layered network. So the amortized complexity of this operation is linear. It can be done pretty fast with keeping counters for # of degrees.

But in practice, we do this operation lazily by maintaining n pointers indicating how many adjacent (u) for each (v) is dead-ends. We only remove edges when finding a new path. While finding a new path in the layered network, if we find such (v) from which all (v-u) has C’=0, then v is a dead-end. And we go back from our dfs, and remove v, and continue our search. As all nodes are removed maximum once, the complexity stays linear.

So, overall Time Complexity :
    **O( n(m + mn + m) )  ≈  O(n.n.m)  ≈  O(n^4)**
    And if we apply Scaling, we can get- **O(nm.logC)**.

### OPTIMIZATIONS

The slowest part of dinitz’s algorithm is finding the paths in the layered network. This bottleneck can be improved further using data structures like LINK CUT TREE. The idea is to use some segment of previous paths as a part of the new path.

And as the operations in a link cut tree are O(logn), the overall complexity is O(n.m.logn).
_// Too tough implementation, will learn later :3_

## COMPLEXITY ANALYSIS OF FLOW ALGORITHMS

Let’s assume two cases over the flow algorithms- when all C(u-v) = 1 and when all C(u-v) = 1 with no parallel edges.

| Algorithm       | Complexity   | when C(u-v)=1 | C(u-v)=1 & No par.edges |
|:----------------|:-------------|:--------------|:------------------------|
| ford fulkerson  | O(F.m)       | O(m.m)        | O(n.m)                  |
| edmonds karp    | O(n.m.m)     | O(m.m)        | O(n.m)                  |
| dinitz          | O(n.n.m)     | O(m.sqrt(m))  | O(m.power(n, 2/3))      |

For Dinitz algorithm, intuitively we can deduce that in these modified cases, time complexity of dinitz algorithm won’t be more than O(n.m). But actually, it's much better.

When all Capacity(u-v)=1, the time complexity is O(m.sqrt(m)). Let's assume we found all the flows with paths length less than sqrt(m), then the remaining flows will have a path length more than sqrt(m). As the total number of edges is sqrt(m), and all paths have more than sqrt(m) length, there can not be more than m remaining phases in dinitz’s algorithm. So the total time complexity won’t be more than O(m.2sqrt(m)).

And in the second case, when all Capacity(u-v) = 1 and there is no parallel edges, the time complexity will be O(m.power(n, 2/3)) .
	
Again, let's assume a layered network of distance, d = power(n, 2/3)  and there are a[i] number of nodes in the i-th layer.

In this network, there must be a cut(c) between two layers such that the cut,  c <= power(n,2/3).

Because -
    **Cmin <= min∀(a[i].a[i+1]) <= power((n/power(n,2/3)),2) <= power(n, 2/3)**
And, the remaining flow, **ΔF <= Cmin <= power(n, 2/3)**.
So, the total complexity won’t be more than O(m.2n23).

## MATCHING w/DINITZ (Hopcroft-Karp)

We can reduce the bipartite matching problem to the maximum flow problem. We add two additional node source(s) to all the left part of the bipartite graph and a sink(t) node to all the left part of the graph.

And if all the edges have unit capacity {∀ C(u→v)=1}, then the maximum flow will be the maximum matching. And all the saturated edges will be the matching edges.

The Kuhn's algorithm finds matching like the ford fulkerson algorithm. We know that for unit capacity and no parallel edges F.F. algo’s complexity is O(n.m) which is the complexity of Kuhn’s algorithm. But we can find the matching using Dinitz’s algorithm, which has a better complexity. It is known as the Hopcroft-Karp algorithm.

Let’s assume the dinitz’s algorithm already completed sqrt(n) phases.

Then the next phases will have paths of length more than sqrt(n) .

As the total size of all the paths in the matching network is no more than n and the paths are vertex-disjoint (each vertex can belong to only one path). So, dinitz will run for at most sqrt(n)  more phases.

The complexity of Dinitz can be at most O(m.power(n, 2/3) )  for unit capacity and no parallel edges, but for the matching problem it's even better for the matching problem as the network is vertex-disjoint and the number of phases in Dinitz won’t be more than 2.sqrt(n) .

So, the overall complexity of Hopcroft-Karp is O(m.sqrt(n)). And this is the best known algo for bipartite matching.

<br/><br/>
[Go back](../)
