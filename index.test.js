const Todos = require('./index');
const assert = require('assert').strict;
const fs = require('fs');

describe("integrated test", () => {
  it("can successfully add todos and mark as completed", () => {
    let todos = new Todos();
    assert.strictEqual(todos.list().length, 0);

    todos.add('first todo');
    todos.add('second todo');
    assert.strictEqual(todos.list().length, 2);
    assert.deepStrictEqual(todos.list(),
      [
        {title: 'first todo', completed: false},
        {title: 'second todo', completed: false}
      ]
    );
    
    todos.complete('first todo');
    assert.deepStrictEqual(todos.list(),
      [
        {title: 'first todo', completed: true},
        {title: 'second todo', completed: false}
      ]
    );

  });
});

describe("complete()", () => {
  beforeEach(() => {
    this.todos = new Todos();
  });

  it("if no todos, throws an error message", () => {
    const expectedError = new Error("There are no ToDos, try adding a new ToDo");
    assert.throws(() => {
      this.todos.complete("doesn't exist");
    }, expectedError);
  });

  it("if todo does not exist, throws a new Error", () => {
    const existingToDo = 'existing todo';
    const notExistingToDo = 'not existing todo';
    this.todos.add(existingToDo);
    const expectedError = new Error(`no ToDo was found with the title "${notExistingToDo}"`);
    assert.throws(() => {
      this.todos.complete(notExistingToDo);
    }, expectedError);
  });
});

describe("saveToFile()", () => {
  beforeEach(() => {
    this.todos = new Todos();
    this.todos.add('save to csv');
  });

  afterEach(() => {
    if (fs.existsSync("todos.csv")) {
      fs.unlinkSync("todos.csv");
    }
  });

  it("should have a single todo saved created in todos.csv", async () => {
    await this.todos.saveToFile();

    assert.strictEqual(fs.existsSync("todos.csv"), true);
    let expectedFileContents = "Title,Completed\nsave to csv,false\n";
    let content = fs.readFileSync("todos.csv").toString();
    assert.strictEqual(content, expectedFileContents);
  });

  it("has a single todo saved and completed in todos.csv", async () => {
    this.todos.complete("save to csv");
    await this.todos.saveToFile();

    assert.strictEqual(fs.existsSync("todos.csv"), true);
    let expectedFileContents = "Title,Completed\nsave to csv,true\n";
    let content = fs.readFileSync("todos.csv").toString();
    assert.strictEqual(content, expectedFileContents);
  });
});