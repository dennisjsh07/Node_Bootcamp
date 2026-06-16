/*
 * Basics
 */

// print a number
const a: number = 10;
console.log(a);

// print sum of 2 numbers using a function...
function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum(2, 3));

// print true or false based on age = 18+...
function isLegal(age: number): Boolean {
  if (age >= 18) {
    return true;
  }
  return false;
}
console.log(isLegal(17));

// create a function that takes another function as an input and retrun it after 1sec.
function runAfter1sec(fn: () => void) {
  setTimeout(fn, 1000);
}
runAfter1sec(() => console.log("hello world"));

// objects
function legalStatus(user: { name: string; age: number }): Boolean {
  if (user.age >= 18) {
    return true;
  }
  return false;
}

console.log(legalStatus({ name: "Dennis", age: 29 }));

// Interfaces
// objects using interfaces
interface User {
  name: string;
  age: number;
  email?: string;
}

function checkLegalStatus(user: User): string {
  if (user.age >= 18) {
    return "legal";
  }
  return "illegal";
}
// console.log(checkLegalStatus({ name: "Dennis", age: 29 }));

// classes using interface
interface Person {
  name: string;
  age: number;
  greet(phrase: string): void;
}

class Employee implements Person {
  name: string;
  age: number;

  constructor(n: string, a: number) {
    this.name = n;
    this.age = a;
  }

  greet(phrase: string) {
    console.log(`${phrase} ${this.name}`);
  }
}
const emp1 = new Employee("Dennis", 29);
emp1.greet("Hello my name is");

// calculate the sum of age of users
interface User {
  name: string;
  age: number;
  isActive: Boolean;
}

function sumOfAge(user1: User, user2: User) {
  return user1.age + user2.age;
}

console.log(
  sumOfAge(
    { name: "Dennis", age: 29, isActive: true },
    { name: "Bhavin", age: 8, isActive: true },
  ),
);

// Types
// union type
type StringOrNumber = string | number | Boolean;

function printId(id: StringOrNumber) {
  return id;
}
console.log(printId("Dennis"));
console.log(printId(29));
console.log(printId(true));

// intersection type
type Employee1 = {
  name: string;
  date: Date;
};

type Position = {
  position: string;
};

type TeamLead = Employee1 & Position;

const emp2: TeamLead = {
  name: "Dennis",
  date: new Date(),
  position: "Manager",
};
console.log(emp2);

// Arrays
// find the max value in array of numbers

type ArrayType = number[];
function findMax(arr: ArrayType): number {
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= max) {
      max = arr[i];
    }
  }
  return max;
}

console.log(findMax([3, 5, 6]));

// filter users whose age > 18 from an array of users.
interface UserData {
  name: string;
  age: number;
}
function filterUser(users: UserData[]) {
  return users.filter((user) => user.age > 10);
}

console.log(
  filterUser([
    { name: "Dennis", age: 29 },
    { name: "Bhavin", age: 8 },
  ]),
);

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
function identity<T>(a: T) {
  return a;
}
console.log(identity<string>("dennis"));
console.log(identity<number>(2));
console.log(identity<Boolean>(true));

// Generics for arrays
function arrayIdentity<T>(arr: T[]) {
  return arr;
}
console.log(arrayIdentity<string>(["a", "b", "c"]));
console.log(arrayIdentity<number>([1, 2, 3]));
console.log(arrayIdentity<Boolean>([true, false, true]));

// Generics for array of objects
interface Data {
  name: string;
  age: number;
  isActive: Boolean;
}

function getFirstElement<T>(arr: T[]) {
  return arr[0];
}

console.log(
  getFirstElement<Data>([
    { name: "Dennis", age: 29, isActive: true },
    { name: "Bhavin", age: 8, isActive: true },
  ]),
);

/**
 * Typescript Advanced
 */

// Pick : Used to pick properties from interface, all picked properties must be used
interface DBUser {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
}

type PickProps = Pick<DBUser, "name" | "age" | "email">;
type PartialProps = Partial<DBUser>;

function testPick(user: PartialProps) {}

console.log(testPick({ name: "Dennis", age: 29 }));

// ReadOnly: cannot reasign another value to a declared variableF
interface User1 {
  name: string;
  age: 29;
}

const obj = {
  name: "Dennis",
  age: 29,
};
obj.name = "Joshua";
console.log("obj", obj);

const obj1: Readonly<User1> = {
  name: "Dennis",
  age: 29,
};
// obj1.name = "Joshua";
