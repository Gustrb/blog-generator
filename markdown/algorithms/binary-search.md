# Binary Search

Binary Search is one of the most famous searching algorithms, since it is kind of a natural way of thinking about searching a sorted list.
So we can think of an imaginary guessing game, that has two players, player A and player B.
Player A, thinks of a number while player B tries to guess exactly which number has Player A thought of.
The only kind of response Player A can give to player B is whether the guessed number is too high, too low, or correct.

How would you do about figuring out what number is player A thinking about? [In the worst case scenario, how many attempts would be needed](http://localhost:3000/concepts/big-o)?

## The bad approach

I guess, the most intuitive way to reason about this problem would be going one number at a time, so you would guess, 1, 2, 3, 4, ...
Until you find the number Player A is thinking about. This is called [Linear search](http://localhost:3000/concepts/linear-search).
In the worst case scenario, how many attemps would be necessary to figure out exactly which number is Player A thinking about?
Let's say in this case, Player A picked, the number 1000, and the accorded range of numbers is from 0 to 100 (inclusive).
So in this case, Player B, would guess incorrectly 100 times, (0 -> 99) before guessing the correct number (100).
100 is small enough that for a computer it would not really matter, since in such small lists, the computer's cache is more efficient, and 100 numbers is nothing for a modern computer. But let's think about a billion numbers, we would have to do 1 billion + 1 guesses, which would be laughably inefficient.
We can do better.

## The best approach

The best approach would be to use the information that the number you'd guessed is to low or to high to make a more informed guess.
Since all the numbers follow a crescent order (from smallest to biggest) we can be sure the list is sorted, therefore we can do something such as:

1. Guessing a number in the middle of the range, in this case 50
2. If we found the number, return true
3. If the number is to high, it means the number Player A picked is contained in the subset '(lower bound, 50]'
4. If the number is to low, it means the number Player A picked is cointained in the subset '[50, upper bound)'
5. Go back to step 1 with the adjusted ranges, until the upper bound is smaller or equal to the lower bound, in this case, return false

Ok. This seems really eficient, now how does this algorithm do in the worst case scenario then?
Let's assume the range is (0, 100]. In this case our first iteration would be:

50 -> too high? -> 25 -> too high? -> 13 -> too high? -> 7 -> too high? -> 3 -> too high? -> 1
Ok, so it took 6 guesses instead of 100, which is a major improvement.
If we look at mathematics, what is the inverse of an exponential, since we can easily check that the number of steps increase inverse to the powers of two, so if the list has 8 elements, the max number of guesses would be 3.
It is a function that grows really fast in the beggining and then really slow as the numbers grow.
This is called a [logarithmic](http://localhost:3000/math/logarithms) complexity, so we can say that binary search has a complexity of O(log n) where log means log base 2, and n is the size of the list.

### Implementation

I will implement the binary search in the C programming language, since there is a really interesting implementation detail that
dynamically typed programming languages hide from you in the following implementation

```
#include <stdint.h>

uint8_t binary_search(uint8_t value_to_search, uint8_t *list, uint8_t lowerbound, uint8_t upperbound)
{
    while( lowerbound <= upperbound )
    {
        uint8_t middle = (lowerbound + upperbound) / 2;
        uint8_t guess = list[middle];

        if (value_to_search == guess) return 1;

        if (guess > value_to_search)
        {
            upperbound = middle - 1;
        }
        else
        {
            lowerbound = middle + 1;
        }
    }

    return 0;
}

```

Could you spot the bug? No? I don't blame you, this bug was hidden inside the JVM source code for years until it was found.
The problem is in the `uint8_t middle = (lowerbound + upperbound) / 2;` line. In this line we are getting the middle point of our list, so this appears to be correct right?
The problem comes when we add lowerbound to upperbound, because both of them are unsigned integers of 8 bits, so they have a range of (0, 255)
And the C programming language along with most statically typed languages, will see two 8 bit numbers being added and will assume that the result is also an 8 bit unsigned integer, but that might not be the case, since lets assume we are in the second iteration, and we guessed the wrong number, so in this case, our upperbound would be 255 (for a list that goes from 0 to 255) and our lowerbound would be half of it that is 127.
So in the line were we would get the middle, we would add 255 and 127 and we would get a number that is outside of the range of unsigned 8 bits integers (382), which would result in an [integer overflow](http://localhost:3000/concepts/integer-overflow).

Ok. But how do we fix this? There is a simple way we can change the calculation, that keeps the same result but does avoid the overflow issue, the code would be:

```
#include <stdint.h>

uint8_t binary_search(uint8_t value_to_search, uint8_t *list, uint8_t lowerbound, uint8_t upperbound)
{
    while( lowerbound <= upperbound )
    {
        uint8_t middle = lowerbound + (uperbound - lowerbound) / 2;
        uint8_t guess = list[middle];

        if (value_to_search == guess) return 1;

        if (guess > value_to_search)
        {
            upperbound = middle - 1;
        }
        else
        {
            lowerbound = middle + 1;
        }
    }
    
    return 0;
}
```

Proof that (l + r) / 2 is the same as l + (r - l) / 2:

![Alt](https://miro.medium.com/v2/resize:fit:720/format:webp/1*oMP2IjNlw-A40YwjYw74lw.jpeg "Title")


[Back to home](http://localhost:3000/index)