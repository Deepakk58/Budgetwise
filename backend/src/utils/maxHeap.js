class MaxHeap {
    constructor(compare = (left, right) => left.amount - right.amount) {
        this.items = [];
        this.compare = compare;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    push(item) {
        this.items.push(item);
        this.#bubbleUp(this.items.length - 1);
    }

    pop() {
        if (this.isEmpty()) {
            return null;
        }

        const maximum = this.items[0];
        const lastItem = this.items.pop();

        if (!this.isEmpty()) {
            this.items[0] = lastItem;
            this.#bubbleDown(0);
        }

        return maximum;
    }

    #bubbleUp(index) {
        let currentIndex = index;

        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);

            if (
                this.compare(
                    this.items[currentIndex],
                    this.items[parentIndex]
                ) <= 0
            ) {
                break;
            }

            [this.items[currentIndex], this.items[parentIndex]] = [
                this.items[parentIndex],
                this.items[currentIndex]
            ];

            currentIndex = parentIndex;
        }
    }

    #bubbleDown(index) {
        let currentIndex = index;

        while (true) {
            const leftIndex = (currentIndex * 2) + 1;
            const rightIndex = leftIndex + 1;
            let largestIndex = currentIndex;

            if (
                leftIndex < this.items.length &&
                this.compare(
                    this.items[leftIndex],
                    this.items[largestIndex]
                ) > 0
            ) {
                largestIndex = leftIndex;
            }

            if (
                rightIndex < this.items.length &&
                this.compare(
                    this.items[rightIndex],
                    this.items[largestIndex]
                ) > 0
            ) {
                largestIndex = rightIndex;
            }

            if (largestIndex === currentIndex) {
                break;
            }

            [this.items[currentIndex], this.items[largestIndex]] = [
                this.items[largestIndex],
                this.items[currentIndex]
            ];

            currentIndex = largestIndex;
        }
    }
}

export { MaxHeap };
