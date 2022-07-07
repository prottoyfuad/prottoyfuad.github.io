---
layout: post
title: Extended Euclidean Algorithm
Catagories: Number Theory
---

Some Content Goes here with the following code -

# IMPLEMENTATION
```py
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    d, x, y = gcd(b, a % b)
    return d, y, x - y * (a // b)
```
