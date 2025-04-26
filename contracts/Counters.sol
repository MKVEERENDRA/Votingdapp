// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Counters {
    struct Counter {
        uint256 _value; // default: 0
    }

    function add(Counter storage counter, uint256 amount) internal {
        counter._value += amount;
    }

    function sub(Counter storage counter, uint256 amount) internal {
        require(counter._value >= amount, "Counter: subtraction amount exceeds counter");
        counter._value -= amount;
    }

    function increment(Counter storage counter) internal {
        
        counter._value += 1;
    }

    function decrement(Counter storage counter) internal {
        require(counter._value > 0, "Counter: decrement underflow");
        counter._value -= 1;
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }
}
