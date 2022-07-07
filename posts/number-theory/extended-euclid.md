---
layout: post
title: Extended Euclidean Algorithm
catagory: Number Theory
---

While the euclidean algorithm finds the greatest common divisor `d` of two numbers `x & y`, the extended version also finds two integer `a & b`, such that `ax + by = d`

_Some more explanation goes here!_

```py
def extended_gcd(x, y):
    if y == 0:
        return x, 1, 0
    d, a, b = gcd(y, x % y)
    return d, b, a - b * (x // y)
```
