# Queue

Often taught along with stacks, queues are also, *abstract data types* that are defined in term of the operations we perform in them. The big difference between stacks and queues is, the order of operations they enforce, queues are FIRST IN FIRST OUT, or FIFO, that means that, the first thing that gets inside a queue is the first to go out, while stacks are LAST IN FIRST OUT, so the last we put is the first we will get back

Queues are defined in term of three operations:

- enqueue (put an element at the end of the queue)
- dequeue (take an element of the front of the queue)
- peek (get the first element while not removing it from the queue)

We can think of queues as lines in a restaurant, when we get into a line, we have to wait everyone on our front to be served before it's our time.

![Alt](https://media.geeksforgeeks.org/wp-content/uploads/20220805131014/fifo.png "Title")

## Implementation

Here is a simple implementation of a queue using an array:
```c
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>

#define QUEUE_LEN 1024

struct queue_t {
    uint32_t data[QUEUE_LEN];
    size_t ptr;
};

void enqueue(struct queue_t *queue, uint32_t value)
{
    if (queue->ptr + 1 >= QUEUE_LEN)
    {
        fprintf(stderr, "The queue is full");
        exit(1);
    }

    queue->data[queue->ptr++] = value;
}

uint32_t dequeue(struct queue_t *queue)
{
    if (queue->ptr == 0)
    {
        fprintf(stderr, "Cannot dequeue empty queue");
        exit(1);
    }
    uint32_t val = queue->data[0];

    for (size_t i = 1; i < queue->ptr; ++i)
    {
        queue->data[i - 1] = queue->data[i];
    }
    queue->ptr--;
    return val;
}

uint32_t peek(struct queue_t *queue)
{
    if (queue->ptr == 0)
    {
        fprintf(stderr, "Cannot peek empty queue");
        exit(1);
    }
    return queue->data[0];
}
```

There is an interesting implementation detail here, whenever we dequeue, since we are removing an element from the front of the queue,
we must move all the following elements back, so in this implementation, the queue has a complexity of O(n), to avoid that, we would need to have a [LinkedList](http://localhost:3000/data-structures/linked-list) as the underlying data structure, by doing it, we could just move the head pointer to the next, instead of having to do all of this.

## The best implementation

```c
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>

struct node_t {
    uint32_t data;
    struct node_t *next;
};

struct linked_list_t {
    struct node_t *head;
    struct node_t *tail;
    size_t len;
};

void enqueue(struct linked_list_t *list, uint32_t data)
{
    struct node_t *node = malloc(sizeof(struct node_t));

    node->data = data;
    node->next = NULL;

    list->len++;

    if (list->len == 1)
    {
        list->head = list->tail = node;
        return;
    }

    list->tail->next = node;
    list->tail = node;
}

uint32_t dequeue(struct linked_list_t *list)
{
    if (list->len == 0)
    {
        fprintf(stderr, "Cannot dequeue empty list");
        exit(1);
    }

    struct node_t *aux = list->head;
    uint32_t data = aux->data;

    list->head = list->head->next;
    list->len--;
    free(aux);

    return data;
}

uint32_t peek(struct linked_list_t *list)
{
    if (list->len == 0)
    {
        fprintf(stderr, "Cannot peek empty list");
        exit(1);
    }

    return list->head->data;
}

void list_free(struct linked_list_t *list)
{
    struct node_t *prev = NULL;
    struct node_t *aux = list->head;
    while (aux != NULL)
    {
        prev = aux;
        aux = aux->next;
        if (prev) {
            free(prev);
        }
    }
}
```

Here you can see that there is no iteration when enqueuing nor dequeueing, we are just adjusting pointers, so that's why this implementation has a better time complexity when dequeueing.
There is a small caveat though, thanks to [cache locality](http://localhost:3000/concepts/cache-locality) even though this implementation is faster in the worst case, it probably is not in most of them.

[Back to home](http://localhost:3000/index)

All notes were taken by [Gustavo Reis Bauer](https://github.com/Gustrb), aka Gustrb, february/2024.