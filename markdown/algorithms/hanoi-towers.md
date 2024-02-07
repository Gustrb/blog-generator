# Hanoi Towers 

The towers of hanoi, is a famous kids puzzle, that consists of three rods (usually made of wood) connected by a wider piece of wook. The puzzle comes with, a few cilindrical disks with different widhts, and to start the puzzle, we must put all the disks in ascending order (the largest will be at the bottom and the smallest on the top). The goal is to move all the disks in the same order to some other rod.
But there is a catch. A smaller cylinder cannot, ever, be under a bigger cylinder.
And that's what makes this problem much harder, so ok, how should we approach it?


![Alt](https://iq.opengenus.org/content/images/2023/01/Head.png "Title")

I guess, we can just check, let's say we have two cylinders, and we want to move them from rod 1 to rod 3, how do we do it?
Ok it's simple:
1. Move the top cylinder from rod 1 to rod 2
2. Move the largest cylinder from rod 1 to rod 3
3. Move ther cylinder from rod 2 to rod 3

Ok, we solved the problem for 2 cylinders, now let's try with 3

Let's call the cylinders by name, A = smallest, B = middle one, C = largest

1. Move cylinder A, from rod 1 to rod 3
2. Move cylinder B, from rod 1 to rod 2
3. Move cylinder A, from rod 3 to rod 2
4. Move cylinder C, from rod 1 to rod 3
5. Move cylinder A, from rod 2, to rod 1
6. Move cylinder B, from rod 2, to rod 3
7. Move cylinder A, from rod 1, to rod 3

Now, I hope you can see the pattern, the first thing we do is, to put the largest rod at the desired, final spot they are going to be in. After that we cam solve the problem as if we had one less rod, so if you see, from the 5th stop to the last one, the problem is the same, the only thing that changes, is the destination and the source rods.
So we can think that from step 5 to the end we were solving for number_of_cylinders = 2, and start = rod 2, end = rod 3

Then we mostly figured out how to solve it, there is just one piece that we did't look into yet, ok, let's say we are solving for just one cylinder, what should be the step?

1. Move cylinder, from rod 1 to rod 3

So in this case, we just move from start to end

Ok, so now we are ready to implement this:

## Implementation

I will write this implementation in Golang, because I feel like it, if you think I could implement in another language let me know, I will do it.

```go
// Just a way to call the _hanoi function without having to allocate an array manually
// this is just a convenience, you should not pay a lot of attention here
func Hanoi(n, start, end int) [][2]int {
	var moves [][2]int
	_hanoi(n, start, end, &moves)
	return moves
}

func _hanoi(n, start, end int, moves *[][2]int) {
	// There is only one disk, therefore we can safely assume that we can
	// move it from start to end.
	if n == 1 {
		*moves = append(*moves, [2]int{start, end})
		return
	}

	// Checking the formula works:
	// if start = 1, end = 3, other = 6 - (1 + 3) = 2
	// if start = 2, end = 3, other = 6 - (2 + 3) = 1
	// if start = 1, end = 2, other = 6 - (1 + 2) = 3
	// if start = 3, end = 2, other = 6 - (3 + 2) = 1
	// if start = 2, end = 1, other = 6 - (2 + 1) = 3
	// if start = 3, end = 1, other = 6 - (3 + 1) = 2
	// It works, because the sum of start, end and other must be 6, since we have
	// rod 1, 2 and 3, and the sum of 1, 2 and 3 is 6.
	// Therefore, we know that sum + start + other = 6,
	// solving for other, we get 6 - (start + end) = other
	other := 6 - (start + end)

	// Now, what can we do to solve, is, find the next subproblem, which in this case
	// is moving the smaller tower from the place we started, to the other place, when we do that,
	// we can be sure, that all of the disks except the largest are in the correct order and in the
	// 'other' rod
	_hanoi(n-1, start, other, moves)

	// Now, the largest disk is alone in the start rod, and we can move it to the end rod
	*moves = append(*moves, [2]int{start, end})

	// Now that our largest disk is alone in the end rod, we can move the tower that has n - 1 disks,
	// that we put in the 'other' rod, to the end rod
	_hanoi(n-1, other, end, moves)
}
```

If we try to use it, let me show the test cases I've implemented for this algorithm:
```go

// Just a helper to help me check the slices are equal
func isEqualMoves(a, b [][2]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i][0] != b[i][0] || a[i][1] != b[i][1] {
			return false
		}
	}
	return true
}

func TestHanoi(t *testing.T) {
	moves := Hanoi(1, 1, 3)

	if !isEqualMoves(moves, [][2]int{{1, 3}}) {
		t.Errorf("Expected [[1, 3]], got %v", moves)
	}

	moves = Hanoi(2, 1, 3)
	if !isEqualMoves(moves, [][2]int{{1, 2}, {1, 3}, {2, 3}}) {
		t.Errorf("Expected [[1, 2], [1, 3], [2, 3]], got %v", moves)
	}

	moves = Hanoi(3, 1, 3)
	if !isEqualMoves(moves, [][2]int{{1, 3}, {1, 2}, {3, 2}, {1, 3}, {2, 1}, {2, 3}, {1, 3}}) {
		t.Errorf("Expected [[1, 3], [1, 2], [3, 2], [1, 3], [2, 1], [2, 3], [1, 3]], got %v", moves)
	}

	// Good enough for me :P
}
```

This solution has a complexity of O(2^n) because the algorithm solves two problems of size n - 1 (where n is the number of discs) for each step, branching out in a tree that has 2^n leafs.

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, february/2024.