// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    // Add A Default Task.
    constructor() public {
        createTask("Learn More About Blockchain.");
    }

    uint256 public taskCount = 0;

    // Task Model - Define How Our Task Looks Like.
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    /*
     Task State.
     With this we can store our tasks in the blockchain.
    */
    mapping(uint256 => Task) public tasks;

    // Method responsible to create a new task.
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }
}
