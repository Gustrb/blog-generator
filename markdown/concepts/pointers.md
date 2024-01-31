# Pointers 

Ok so before anything, what is a pointer, where does it live why do we need it??
A pointer is nothing more than just a data type, usually some kind of unsigned integer that has a really big range (big enough to fit all the adressable memory in the computer).
Usually whenever we want to store something in a computer program, we use a variable and store the actual thing we want inside the variable, for example, look at this C code:
```c
#include <stdint.h>

int main(void)
{
    uint8_t really_important_value = 69;
    return 1;
}
```

In this case, we are storing inside the `really_important_value` variable, the actual decimal number 69, so whenever we reference the name `really_important_value` we are aliasing the number 69.
Ok but where does the pointer fit in?
One thing that I did not explain, is that there is an important thing that every single variable in a program has, that is its memory addres, and by memory address I mean where you can find it in the memory of the computer, see [Virtual Memory](http://localhost:3000/os/virtual-memory).

So, every single has a memory address, but how can I access it? In most programming languages there is no such way to get the address of a variable, since pointers are implicit. Here is how we can access and print the memory address of a variable in C:
```c
#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint8_t really_important_value = 69;
    printf("%p\n", &really_important_value); // the hex representation of the memory address
    return 1;
}
```

Then, we now know that `&` is used to get the memory addrees, or more commonly, the reference of a value, so we can't do stuff like `&420`, since `420` is a constant, it does not have a memory address, (and I don't think you would ever need it).
The pointer is nothing more than the type that can contain a reference, se the example bellow:
```c
#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint8_t really_important_value = 69;
    uint8_t *a_not_that_important_pointer = &really_important_value;
    printf("%p\n", a_not_that_important_pointer); // the same as printing &really_important_value
    return 1;
}
```

The only new syntax introduced in this example is the type definition `uint8_t *`, this type can be interpreted as *a pointer to an unsigned int of 8 bits*, so what do we mean by that? It means that the value inside `a_not_that_important_pointer` is **not** a `uint8_t` but it is a pointer to one.

Ok but can we actually get the value of thing being pointed at, from the pointer? And the answer is *YES* but for that you have to use the dereference operator, that is also a `*`
See the following example:
```c
#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint8_t really_important_value = 69;
    uint8_t *a_not_that_important_pointer = &really_important_value;
    printf("%d\n", *a_not_that_important_pointer); // the same as printing really_important_value
    return 1;
}
```

Here when we were acessing the pointer, we add a `*` before the pointer, achieving the same result as printing the value of `really_important_value`.

Everything is cool and all, but why do I actually need pointers then, if it's just a way to acessing the same memory, shouldn't I just access the value itself instead of adding indirection?

There is a really cool benefit of having this indirection which might not seem obvious, so let me show with a quick example:
```c
#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint8_t really_important_value = 69;

    uint8_t *a_not_that_important_pointer = &really_important_value;
    uint8_t not_a_pointer = really_important_value;

    really_important_value = 0;

    printf("%d\n", *a_not_that_important_pointer); // prints 0
    printf("%d\n", not_a_pointer); // prints 69 

    return 1;
}
```

Here is one of the most obvious benefits of this indirection, even though we are storing the same **value** as `really_important_value` into `not_a_pointer`, we are just doing a simple copy, so there is no 'binding' from the value in `really_important_value` and `not_a_pointer`.
But when we set a pointer to that memory address, we are 'binding' to the value of that variable, so whenever we change the value of `really_important_value`, we can acess the updated value from `*a_not_that_important_pointer` while we can't through `not_a_pointer`.

Ok? But that still sounds a bit weid, why would we need that? Since that 'binding' which is not a binding is just a side effect of how pointers work, that also happens when passing arguments to functions, and so we can change the value of variables that are not in our scope, which is really powerfull, since now we can have multiple return values for example, let's think of a function that goes through a list of student grades, and computes the average and the sum of all grades, how would we return it? Here's a simple way to do that:
```c
void compute_grades_info(double grades[], size_t num_grades, double *sum, double *avg)
{
    for (size_t i = 0; i < num_grades; ++i)
    {
        *sum += grades[i];
    }
    *avg = (*sum) / (double) num_grades;
}

int main(void)
{
    double grades[] = { 10.0, 5.8, 7.0, 5.2 };
    double average_grade = 0.0, sum_of_grades = 0.0;
    compute_grades_info(grades, 4, &sum_of_grades, &average_grade);
    return 0;
}
```

In the example above, we computed both the sum and the average in the function `compute_grades_info` and stored the result inside the average_grade and sum_of_grades variables.

## Pass by Value vs Pass by Reference

This is a really common way of teaching about passing pointers to functions, so I am going to explain, but I don't think this is the correct way of thinking about passing pointers.

### Pass by Value

Is the default way of passing arguments to functions, when we pass a variable into a function, the program copies the value and puts it inside the argument, so any change to the argument won't have any kind of effect on the value passed to it, for example:
```c
void compute_grades_info(double grades[], size_t num_grades, double sum, double avg)
{
    for (size_t i = 0; i < num_grades; ++i)
    {
        sum += grades[i];
    }
    *avg = sum / (double) num_grades;
}
```

If we try to call this function, passing our sum, and avg arguments, the only thing they will contain is garbage, since when we call the function `compute_grades_info` all of our arguments are copied over, so the value inside the parameter sum and avg, will be correct at the end of the calculation, but it won't affect the outside scope, since when we copy, we create a new variable, with its own address.

### Pass by Reference

Happens when we pass a pointer into the argument of a function, so whenever we change the value pointed by the pointer we actually change the variable itself, the following example shows this, the values of `average_grade` and `sum_of_grades` were *actually* altered, since we altered it using the deref operator, we altered the thing that was beign pointed by `sum` and `avg` instead of the parameters themselves 
```c
void compute_grades_info(double grades[], size_t num_grades, double *sum, double *avg)
{
    for (size_t i = 0; i < num_grades; ++i)
    {
        *sum += grades[i];
    }
    *avg = (*sum) / (double) num_grades;
}

int main(void)
{
    double grades[] = { 10.0, 5.8, 7.0, 5.2 };
    double average_grade = 0.0, sum_of_grades = 0.0;
    compute_grades_info(grades, 4, &sum_of_grades, &average_grade);
    return 0;
}
```

### Why I don't like this distinction

I have a clear objection to this way of teaching passing by value/reference since I don't really think there is such a think as a pass by reference, since that when you pass a reference into a function, you are passing by value, but the value is pointer, so a copy is going to happen anyway, but it is the copy of a pointer instead of the value, that allows us to have the 'binding' that I mentioned earlier.

Altough it is a weird distinction it makes a lot of sense in languages such that pointer syntax is abstracted, for example, let's look at a quick example in JavaScript:
```javascript
function mutateObject(obj) {
    obj.dumbThing = 420;
}

function sum(number) {
    number += 2;
}

var obj = {};
var num = 2;

mutateObject(obj);
sum(num);
```

Here if we run this code, we can easily check that the value of `obj` is `{ dumbThing: 420 }` after the function `mutateObject` runs, altough the `num` variable is still equal to `2` after the `sum` function.
This happens because we don't actually store the object when we assign it to a variable, we store a pointer to it, while when we have a number we have the actual number, so it is 'passed by value' while the `obj` is 'passed by reference'.

## Pointer Arithmetic

Now we are actually getting inside the C programming language semantics, so if you are not a C programmer, or curious this part won't make a lot of sense. Ok? Ok, so I what the fuck do I actually mean about pointer arithmetic?
Recall when I said earlier that pointer are just big unsigned integers, that are big enough to address any memory, so the cool part about it is that, since a pointer is a number, we can treat it like so, for example:
```c
#include <stdint.h>
#include <stdio.h>

int main(void)
{
    const uint8_t *message = "Hello world";
    uint8_t *pointer = message;

    // we can add
    ++pointer;
    printf("%c\n", *pointer); // prints 'e'

    // subtract
    --pointer;
    printf("%c\n", *pointer); // prints 'H'
}
```

That way, we can use pointers as windows into larger pointers, in this case the string is nothing more than a pointer, and we are going through it by incrementing and subtracting the pointer variable.
Why does this work?

Whenever we declare a pointer with multiple elements such as `const uint8_t *message = "Hello world"` we get back a pointer to the very first character of the string, and when going through the string, the only way we can tell we are done, is to look if the value of the pointer is NULL, thats what we mean when we try to say that strings in C are *null terminated byte arrays*.
Does it make sense to be like this? Yea, kind of. There are two ways to actually do that, we could either null terminate the string thus wasting one byte, or we could pack the pointer with a counter that indicates how big the string is, which seems far better right?
But how big would this counter have to be? 1 byte, nah that would only allow strings from up to 255 elements, 2 bytes, still really small, probably the counter would need to have the same size as a pointer, which would waste a lot of memory.

Here is an example of how to iterate over a string using pointer arithmetic:
```c
#include <stdlib.h>

size_t strlen(const char *buffer)
{
    char *a = buffer;
    while (*a++) {}

    return a - buffer;
}
```

Here you can see how we can use both the - and the + operators to calculate the size of a string, without even having to allocate a counter or something like this.
Obs: the ++ there does not actually add one to the pointer, it adds one *times the size of the thing being pointed at*, this is one of the few C abstractions.


## Array Decay Into Pointers

This is another C specific point, what I mean by array decay, is that arrays in C are a contiguos (not really, see [Virtual Memory](http://localhost:3000/os/virtual-memory)) block of memory, so we use bracket syntax to access the elements of our array, but the bracket syntax is nothing more than just syntax sugar, since every time we create an array we actually get back a pointer to the first element of the list, for example:
```c
#include <stdint.h>
#include <stdio.h>

int main(void)
{
    int32_t a[] = {1, 2, 3, 4};

    printf("%d\n", *a); // this is the same as a[0], they both print '1'
    printf("%d\n", a[0]);

    printf("%d\n", *(a + 1)); // this is the same as a[1]
    printf("%d\n", a[1]);

    return 1;
}
```

So this is a really cool thing, an array is nothing more than just a pointer with some syntax capabilities, so whenever we pass an array into a function we must understand that we are actually passing a pointer, and not the value of the array itself, or, 'passing by reference'.
This also explains why in C arrays are 0 based, acessing the element using bracket notation is nothing more than `*(array_ptr + offset)`, when we add 0, we just get the very first element of the array.

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, january/2024.