# Heap Memory and Stack Memory 

So before talking anything about stacks, heaps and dynamic memory management, I believe it is really usefull to understand a bit about how the lifetime of the variables in our code work. Because it might seem weird that whenever we declare a variable it lives long enough to serve its purpouse and then we forget about it.

## A bit about scoping

Ok, then, WTF is scoping, and why should I care?
In most modern day programming languages, there is not a lot of reasons to care about scoping, you only need to now when you can access the variable you want, and if you cannot for some odd reason, you can just hoist it up to the previous scope, for example:
```javascript
if (number % 2 == 0) {
    let message = 'the number is divisible by 2';
} else {
    let message = 'the number is not divisible by 2';
}

// here we have no access to the message variable
```
In this case, we have two distinct variables with the exact same name `message` but we can be pretty sure they are diffent, since we cannot access the value of one from the scope of the other, so they must be different.
If we want to be able to access the `message` variable in the outermost scope, we would have to hoist it up, like thi":
```javascript
let message;
if (number % 2 == 0) {
    message = 'the number is divisible by 2';
} else {
    message = 'the number is not divisible by 2';
}

// here we can freely use the message variable
```

OK, so we can establish that the lifetime of a variable is tied to the scope the variable is located in, right?
Yea, kind of... In most modern programming languages, sure, you can think about scoping like that, it is a useful abstraction. But let us think about functions then, see the following example:
```javascript
function getVal() {
    const retVal = {
        message: 'idk'
    };
    return retVal;
}

let value = getVal();
```
In this case, we declared a variable in the scope of the `getVal` function, but we can still acess the value of the poorly named `retVal` variable in the global scope. So we can establish that the language has some semantics to check for variable lifetime, normally in most modern programming languages, it checks if there is not any [pointer](http://localhost:3000/concepts/pointers) to the value of the variable still acessible, and if so, the variable is elegible for [garbage collection](http://localhost:3000/concepts/garbage-collection).

But what happens in languages that are not garbage collected? Can we return pointers to memory scoped to a specific function?
```c
int *my_pointer()
{
    int a = 10;
    return &a;
}
```

This code seems rather inoccent, we assume we are just returning a pointer to a variable, but whenever we try to run this code, we get a beutiful error: `segmentation fault (core dumped)`. WTF???? What happened? It should work right?

Yea, no... This is the most fundamental difference between heap allocation and stack allocation.
Whenever we create a new variable in C, we are directly tying it to the scope it was declared, so whenever the scoped is poped of, think of all the function scopes as items in a big stack (we call it the 'call stack'), we are fundamentally forgetting the values of all the variables inside the function, so if we have a reference to some memory allocated by the poped off function, we give this reference the `dangling reference` name, since it points to memory that is not acessible anymore.
This is called *Allocation on the Stack*, since the variables are stored inside stack frames in the call stack.

But what if I want to allocate something in my function and then return it to another, can I do it?? If you guess yes, you are correct.
This type of allocation is called *Allocation on the heap*

## Heap allocations

Ok, so what is the heap and how can I allocate variables in it? So, the heap is a big chunk of memory, that can be associated with a single process, but the memory a process has access is only one, so all the memory stored in the heap will continue to live there for as long as the program does if not freed up correcly.
In most languages heap vs stack allocations is an implementation detail, and most of them tend to stack allocate primitives and heap allocate anything else.
In C, you can do whatever you want, so for example, let's say I want to allocate an integer on the heap:
```c
#include <stdlib.h> //necessary for the heap allocation functions

int main(void)
{
    int *pointer = malloc(sizeof(int));

    *ponter = 20;
}
```
So, let's dissect what happened here.
1. We declare a pointer to an integer called `pointer`
2. We set the value of `pointer` to equal `malloc(sizeof(int))`
3. We set the value pointed at by `pointer` to 20

WTF does malloc(sizeof(int)) mean??? It is rather simple, `malloc` is the stdlib function for memory allocation, it stands for 'memory alloc', and we need to say how big the block of the memory we want, so in this case, I passed sizeof(int), which in many platforms is 4 bytes, so the malloc function returned a pointer to the block of 4 bytes it allocated on the heap for us, so we can use it like a normal pointer.
But the cool thing is, that the value of the pointer is not tied to any scope, so we can do something like this:
```c
#include <stdlib.h>
#include <stdio.h>

int *get_val()
{
    int *ptr = malloc(sizeof(int));

    *ptr = 20;
    return ptr;
}

int main(void)
{
    int *ptr = get_val();

    printf("%d\n", *ptr);
}
```

And the printf now shows the value 20, and there is no segmentations fault.

Ok but, for the keen eye reading this, you might have thought, ok, but if the heap allocated values are not tied to any scope, when do they get deallocated?
And the short answer is: they don't. You have to manually deallocate it, like this:
```c
#include <stdlib.h>
#include <stdio.h>

int *get_val()
{
    int *ptr = malloc(sizeof(int));

    *ptr = 20;
    return ptr;
}

int main(void)
{
    int *ptr = get_val();

    printf("%d\n", *ptr);

    free(ptr);

    // you can't use the *ptr afterward
}
```

So you must call the `free` function to deallocate memory, otherwise it will cause what is known as a `memory leak` which is going to eat up all your memory if you have a long running program and no low level programming skills.
But if you kill the process, the memory will be automatically freed thanks to your operating system!

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, february/2024.