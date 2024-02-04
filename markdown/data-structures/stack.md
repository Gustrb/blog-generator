# Stack 

The stack is an *abstract data type*, and by this I mean that the stack is defined in terms of the operations we perform on it rather than the specifics of its implementation. The stack supports 3 main operations on it:

- push (insert at the end)
- pop (remove the last element)
- peek (check the value of the last element)

And so, by the operations we can see that the stack works just like a stack of plates, whenever we want to access a plate, we need to keep lifting all the plates up to fetch the plate we want, then we need to put all the plates back. Because of this simple nature, the stack is really easy to implement using any data structure, and it is also a really importanty concept for how the computer actually works.

Here is an image representing how the stack operations work:

![Alt](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230726165552/Stack-Data-Structure.png "Title")

## Implementation

Most of the modern programming languages already provide a Stack class or object, that provides the abstract operations I previously mentioned above, for example, in java there is a `Stack` class, in Javascript we use the `Array` class along with the methods `push, pop`. If the language being in use does not provide a stack we could just use an array and an integer to keep the stack, here is how it would be in the C programming language:
```c
#include <stdint.h>
#include <stdlib.h>

#define STACKLEN 1024

struct stack_t
{
    int32_t data[STACKLEN];
    uint32_t stackptr;
};

void push(struct stack_t *stack, int32_t val)
{
    if (stack->stackptr + 1 > STACKLEN)
    {
        fprintf(stderr, "Error: stack overflow");
        exit(1);
        return;
    }

    stack->data[++stack->stackptr] = val;
}

int32_t pop(struct stack_t *stack)
{
    if (stack->stackptr == 0)
    {
        fprintf(stderr, "Error: stack underflow");
        exit(1);
        return;
    }
    return stack->data[stack->stackptr--];
}

int32_t peek(struct stack_t *stack)
{
    return stack->data[stack->stackptr];
}
```

So you can see how easy it is to implement those operations, even on such a barebones language such as C, we implemented a stack with security checks in a bit over 20 lines.

To insert a new element onto the stack, we bump the pointer, to accomodate the element we want to insert and then we store it there, and to pop it, we do the opposite, we get the value that is being currently pointed by the `stackptr` and then decrement it, so we basically 'forget'about the value that was previously there.

The name of the error `stack overflow` might have caught your attention, the stack overflow is a common error name whenever we want to push a new element onto a stack but the stack is not large enough to store it, it is also the name of the famous programming forums out there, see: [Stack overflow](https://stackoverflow.com).

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, february/2024.