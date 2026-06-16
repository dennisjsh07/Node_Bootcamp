"use strict";
/*
 * Basics
 */
// print a number
const a = 10;
console.log(a);
// print sum of 2 numbers using a function...
function sum(a, b) {
    return a + b;
}
console.log(sum(2, 3));
// print true or false based on age = 18+...
function isLegal(age) {
    if (age >= 18) {
        return true;
    }
    return false;
}
console.log(isLegal(17));
// create a function that takes another function as an input and retrun it after 1sec.
function runAfter1sec(fn) {
    setTimeout(fn, 1000);
}
runAfter1sec(() => console.log("hello world"));
// objects
function legalStatus(user) {
    if (user.age >= 18) {
        return true;
    }
    return false;
}
console.log(legalStatus({ name: "Dennis", age: 29 }));
function checkLegalStatus(user) {
    if (user.age >= 18) {
        return "legal";
    }
    return "illegal";
}
class Employee {
    constructor(n, a) {
        this.name = n;
        this.age = a;
    }
    greet(phrase) {
        console.log(`${phrase} ${this.name}`);
    }
}
const emp1 = new Employee("Dennis", 29);
emp1.greet("Hello my name is");
function sumOfAge(user1, user2) {
    return user1.age + user2.age;
}
console.log(sumOfAge({ name: "Dennis", age: 29, isActive: true }, { name: "Bhavin", age: 8, isActive: true }));
function printId(id) {
    return id;
}
console.log(printId("Dennis"));
console.log(printId(29));
console.log(printId(true));
const emp2 = {
    name: "Dennis",
    date: new Date(),
    position: "Manager",
};
console.log(emp2);
function findMax(arr) {
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= max) {
            max = arr[i];
        }
    }
    return max;
}
console.log(findMax([3, 5, 6]));
function filterUser(users) {
    return users.filter((user) => user.age > 10);
}
console.log(filterUser([
    { name: "Dennis", age: 29 },
    { name: "Bhavin", age: 8 },
]));
// Enums: Group of named constants.
// enum ResourceType {
//   Book, // 0
//   Author, // 1
//   Film, // 2
//   Person, // 3
// }
// function createResource(type: ResourceType, name: string) {
//   console.log(`Creating ${name} as ${ResourceType[type]}`);
// }
// createResource(ResourceType.Book, "Harry Potter");
// Generics for variables
function identity(a) {
    return a;
}
console.log(identity("dennis"));
console.log(identity(2));
console.log(identity(true));
// Generics for arrays
function arrayIdentity(arr) {
    return arr;
}
console.log(arrayIdentity(["a", "b", "c"]));
console.log(arrayIdentity([1, 2, 3]));
console.log(arrayIdentity([true, false, true]));
function getFirstElement(arr) {
    return arr[0];
}
console.log(getFirstElement([
    { name: "Dennis", age: 29, isActive: true },
    { name: "Bhavin", age: 8, isActive: true },
]));
function testPick(user) { }
console.log(testPick({ name: "Dennis", age: 29 }));
const obj = {
    name: "Dennis",
    age: 29,
};
obj.name = "Joshua";
console.log("obj", obj);
const obj1 = {
    name: "Dennis",
    age: 29,
};
// obj1.name = "Joshua";
