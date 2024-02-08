# Quick Sort Algorithm 

The quick sort is one of the most famous sorting algorithm, because it is implemented in several programming languages inside the standard library. Why is this algorithm so used??
Because of its speed, the quick sort algorithm is one of the fastest sorting algorithms having a time complexity of O(n * log n) where n is the size of the array and log is the [logarithm](http://localhost:3000/math/logarithms) base 2.

## How does it work?

The main concept necessary to understand the quick sort algorithm, is the divide and conquer strategy.
The divide and conquer strategy is a famous military term, that used to mean that to conquer a big nation you should make first the nation, divided, often by internal conflict or civil war, and then you go and swipe the whole nation while they are busy.
Ok, but how does this concept translates to computer science? The divide and conquer, in algorithms, mean that he solve a problem by solving smaller problems, this is rather similar to the concept of mathematical induction, in which, we establish f(1), then we establish f(n) and then, we show that f(n - 1) works, by doing this, we can proof a concept.
Divide and conquer problems works the same way, first we solve the simplest problem, often called the base case, then, we formulate the recursive case, and, at last, we make so the problem, is broken down into the the simplest problems, because those we know how to solve.

## The algorithm

I will show an implementation in C, and then I am going to explain line by line how this works, since it is a fairly complicated idea.

```c
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>

void _quick_sort(uint32_t *arr, size_t low, size_t high);
void quick_sort(uint32_t *arr, size_t size);

int32_t main(void)
{
    uint32_t list[] = {1, 4, 5, 10, 2, 9, 17, 100, 4, 2, 1000};

    // 11 is the number of elements list has
    // this is really usefull, because whenever we pass an array to a function, it decays as a pointer
    // due to this, if the function is in another translation layer it won't be able to know, so it can do the 
    // sizeof(list) / sizeof(list[1]) trick
    quick_sort(list, 11);

    for (size_t i = 0; i < 11; ++i)
    {
        printf("%u ", list[i]);
    }

    return EXIT_SUCCESS;
}

// Just a helper to have a cleaner interface
void quick_sort(uint32_t *arr, size_t size)
{
    // Note: here we are passing the high bound as the size - 1,
    // so in here we are having an inclusive range
    // this is important because it makes the algorithm slightly simpler
    // and it requires less -1's which usually causes a lot of off-by one mistakes
    _quick_sort(arr, 0, size - 1);
}

size_t partition(uint32_t *arr, size_t low, size_t high)
{
    // Partition is the operation that puts all the elements smaller than the pivot
    // We are picking the last element as the pivot always,
	// I guess we could be more clever and pick a random element
	// or the median of the first, middle and last elements
	// but this is just a simple example
    size_t pivot_index = high;
    uint32_t pivot = arr[pivot_index];

    // This is going to be the index of the pivot at the end
    // of the loop
    size_t i = low;
    for (size_t j = low; j <= high; ++j)
    {
        // If the current element is less than the pivot,
		// we swap it with the element at index i
		// and increment i,
		// doing this we will know exacyly where the pivot
		// should be placed after the iteration is done
		// because all the elements of index < i are less than the pivot
		// and all the elements of index > i are greater than the pivot
		// so we just need to swap the pivot with the element at index i
        if (arr[j] < pivot)
        {
            uint32_t temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;

            ++i;
        }
    }

    // putting the pivot at the right spot, remember, it could've been anywhere
    arr[pivot_index] = arr[i];
    arr[i] = pivot;

    return i;
}

void _quick_sort(uint32_t *arr, size_t low, size_t high)
{
    // The main idea of this function, is to use a window, that has the bounds
    // [low, high] inclusive, so if the window has length 0, low = high
    // it means we reached our base case, and the list is already sorted
    // since an array without elements is always going to be sorted
    // I guess
    if (low >= high)
    {
        return;
    }

    // The pivot index is the index of the pivot element after partitioning,
    // so it means that the list is weakly sorted around the pivot,
    // (i.e. all elements to the left of the pivot are less than the pivot)
    // and all elements to the right are greater then
    size_t pivot_index = partition(arr, low, high);

    // Here we have a cool implementation detail
    // since pivot_index is a size_t, it is unsigned
    // and if we subtract 1 from an unsigned 0,
    // we get undefined behavior
    // This would happen, if the last element should be the first
    // in this case, no sorting is necessary, since there is nothing
    // before it
    if (pivot_index > 0)
    {
        // Sorting the left hand window
        // they have the bounds, [low, pivot_index - 1]
        // the -1 is so it is inclusive
        // because we now know the pivot is in the right spot
        _quick_sort(arr, low, pivot_index - 1);
    }

    // Same thing with before, now, we are sorting the right side of the window
    _quick_sort(arr, pivot_index + 1, high);
}
```

So the main idea of the algorithm is rather simple, break the array partition the list into two parts, one in which all the elements are smaller than the pivot and one in which all the elements are larger than the pivot.
And then, recursively apply this algorithm to the parts themselves, until the part has no elements, in this case, we can be sure it is properly sorted

There's an important nuance on picking a pivot in the quick sort algorithm, if we choose bad pivots, we are going to end up with a terrible complexity, because every time we split the array into two arrays, we end up with small arrays, in this case, we are going to have n recursive calls and we will have to walk n elements, therefore quick sort has a worst case scenario of O(n*n), which is awfull, so we ned to be careful when picking a pivot, one good approach is to pick a random number, by doing so, we are pretty sure going to get the middle case, which is O(n * log n), log n since in the average case, we will split the array into two arrays that have half the elements of the initial array, and since we have to go through all the elements, there is a factor of n

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, february/2024.