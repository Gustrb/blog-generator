# Integer Overflow 

Integer overflow is a problem that occurs when we have a constraint in the maximum size of an integer and we have a result that goes through that maximum size, let me demonstrate in base 10.

Let's say we have a maximum of 3 base 10 digits, so the largest value we can have is 999, but let's try to go over the limit and understand better by adding 1 to the 999, we obviously know that the result should be 1000, but in our constrained environment we get the value 0.... Why is that?

It is simple, it did the normal addition algorithm to our number, so it added 1, to the last digit, and got 10, then the carry was 1, so it added, 9 and 1 again, same thing, the result is 0, and there is a carry of 1, and in the last digit, we added 1 to 9, got a carry of 1, and the value was zero, but we can't add the carry digit to the front of the number, since our number is constrained to 3 digits, therefore we forget about the carry, and set a `overflow flag` in the processor.

This is the same thing that happens in a computer. so let's look at this example in C:
```c
#include <stdint.h>
#include <stdio.h>

uint8_t get_overflow(uint8_t num)
{
    uint8_t max = 255;

    return max + num;
}

int32_t main(void)
{
    printf("%u\n", get_overflow(1));
    printf("%u\n", get_overflow(2));
    printf("%u\n", get_overflow(3));
    return 0;
}
```

Here, since we are using an 8 bits unsigned integer, it means that the we can only represent the largest 8 bit unsigned number, which is 255 (it goes from 0 to 255), and if we try to add one to 255, it wraps up and starts counting again from 0.

But something weird happens if we are using signed numbers, see the following example:
```c
#include <stdint.h>
#include <stdio.h>

int8_t get_overflow(int8_t num)
{
    int8_t max = 127;

    return max + num;
}

int32_t main(void)
{
    printf("%d\n", get_overflow(1));
    printf("%d\n", get_overflow(2));
    printf("%d\n", get_overflow(3));
    return 0;
}
```
Obs: Here we must remember that since the sign takes one bit, the range of the unsigned integer is cut in half, so it goes from -128 to 127.
If you run the code above you might have had a surprise, the value is not zero, but the smallest number the type can hold (-128), why is that??

That happens because of how signed numbers are stored in binary, they are stored in a way we call `two's complement`, for ease of operating on top of it.

## Two's complement??

Two complement is a rather simple way to representing binary numbers, you can follow the following algorithm to test it out.
Input: a number x

1. flip all of 'x's bits (if it is one, it becomes 0, if it is zero it becomes 1)
2. Add one to the number

So let's look at a quick example with the number 3, that in binary is 0011, flipping all the bits, would be 1100, and then adding one would be 1101

Because of this odd representation, that we are getting the number -128 when it overflows. And the cool thing is, that we can use the same circuit for adding and subtracting if we are using two's complement.

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, february/2024.