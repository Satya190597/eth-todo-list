App = {
  loading: false,
  contracts: {},
  load: async () => {
    console.log("App Loading");
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.renderTasks();
    // await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    web3.eth.getAccounts().then((e) => {
      $("#account").html(e[0]);
    });
  },
  createTask: async () => {
    console.log($("#newTask").val());
    const content = $("#newTask").val();
    const accounts = await web3.eth.getAccounts();
    await App.todoList.createTask(content, { from: accounts[0] });
    window.location.reload();
  },
  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    console.log(todoList);
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);
    App.todoList = await App.contracts.TodoList.deployed();
  },
  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");
    for (let i = 1; i <= taskCount.toNumber(); i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }
      $newTaskTemplate.show();
    }
  },
  toggleCompleted: async (e) => {
    const taskId = e.target.name;
    const accounts = await web3.eth.getAccounts();
    await App.todoList.toggleCompleted(taskId, { from: accounts[0] });
    window.location.reload();
  },
  render: async () => {},
};

$(() => {
  $(window).load(() => {
    // Load the app.
    App.load();
  });
});
