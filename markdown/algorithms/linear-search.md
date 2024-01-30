# Linear Search 

Linear search is the most common way we might think about searching for somehting in a continuous list of elements.
We usually have to resort to linear search whenever we want to find something inside a list but we are not sure about how the elements 
are structured inside said list. So for example, let's say we want to find a specific page in a book, but we are not sure where the page is, how would we do to find the page?

Since we can't tell anything about the list, there is no way to find the page without going through every single page, comparing the value to the value you have.
The algorithm is something like this:

1. Let i be 0
2. While i is less than the number of pages
    1. Check if the ith page is the same we are looking for
    2. If it is return true
    3. Otherwise increment i
3. If i = number of pages, we could not find the page, therefore the page must not be in the book

So let's say the number of pages is 120, and the page we want to find is the same as the last one, we would need to iterate all over the list
the find the page 120, so in the worst case scenario, we would have to go through all the elements in the list, which might seem really expensive (and it can be for huge lists), but it is usually really fast because of [cache locality](http://localhost:3000/concepts/cache-locality).
Because of this limitation, we say that linear search has a complexity of *O(n)* such that n is the number of the input list.

## Implementation

The implementantion is pretty much the same in every single language, but let us implement it in C:

```
#include <stdint.h>

uint8_t linear_search(uint8_t page_to_search_by, uint8_t *pages, uint_8 pagenumber)
{
    uint8_t i = 0;
    while (i < pagenumber)
    {
        if (pages[i] == page_to_search_by) return 1;
        i++;
    }
    return 0;
}
```

## When should I use linear search?

Linear search should be used whenever we cannot apply some sort of sorting to all the elements of the list, or the list is not really big.
Small lists can fit in L3 cache and are really fast for the computer to access so it is a lot faster to just go through the whole list than doing something more sophisticated such as [binary search](http://localhost:3000/algorithms/binary-search).
If the list can be big and it is sorted, binary search is the best approach.

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, january/2024.