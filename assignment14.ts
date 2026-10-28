// ===============================================
// Assignment 14 - TypeScript OOP
// Simple Notes Management System
// ===============================================

export {}; // makes this file a module (avoids clash with the built-in DOM "Storage")

// -----------------------------------------------
// 1. Base Class - User
// -----------------------------------------------
class User {
  public readonly id: number;
  public name: string;
  protected email: string;
  private password: string;
  protected phone: string;
  private _age!: number;

  // Aggregation: the user owns notebooks, but notebooks are created outside
  // and passed in, so they can exist independently of the user.
  private notebooks: NoteBook[] = [];

  constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age; // goes through the setter -> validation
  }

  public get age(): number {
    return this._age;
  }

  public set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error(`Age must be between 18 and 60. Got: ${value}`);
    }
    this._age = value;
  }

  public checkPassword(password: string): boolean {
    return this.password === password;
  }

  public displayInfo(): void {
    console.log(
      `User #${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone} | Age: ${this.age}`
    );
  }

  // ---- Aggregation methods ----
  public addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }

  public removeNotebook(notebookId: number): void {
    this.notebooks = this.notebooks.filter((nb) => nb.id !== notebookId);
  }

  public getNotebooks(): NoteBook[] {
    return this.notebooks;
  }
}

// -----------------------------------------------
// 2. Inheritance - Admin extends User
// -----------------------------------------------
class Admin extends User {
  constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
    super(id, name, email, password, phone, age);
  }

  // Admin can manage notes inside any notebook
  public manageNotes(notebook: NoteBook, action: "list" | "delete", noteId?: number): void {
    if (action === "list") {
      console.log(`[Admin ${this.name}] Notes in "${notebook.name}":`);
      notebook.getNotes().forEach((note) => console.log(`  - #${note.id} ${note.title}: ${note.preview()}`));
    } else if (action === "delete" && noteId !== undefined) {
      notebook.removeNote(noteId);
      console.log(`[Admin ${this.name}] Deleted note #${noteId} from "${notebook.name}"`);
    }
  }

  public override displayInfo(): void {
    console.log("[ADMIN]");
    super.displayInfo();
  }
}

// -----------------------------------------------
// 3. Class - Note
// 6. Association - Note -> User (author)
// -----------------------------------------------
class Note {
  public readonly id: number;
  public title: string;
  public content: string;
  public readonly author: User; // Association: every note has an author

  constructor(id: number, title: string, content: string, author: User) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
  }

  public get userId(): number {
    return this.author.id;
  }

  public preview(length: number = 20): string {
    return this.content.length > length ? this.content.slice(0, length) + "..." : this.content;
  }
}

// -----------------------------------------------
// 4. Composition - NoteBook and Notes
// -----------------------------------------------
class NoteBook {
  public readonly id: number;
  public name: string;
  // Composition: notes are created INSIDE the notebook and live only in it.
  // If the notebook is deleted, its notes are deleted with it.
  private notes: Note[] = [];
  private nextNoteId: number = 1;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  public addNote(title: string, content: string, author: User): Note {
    const note = new Note(this.nextNoteId++, title, content, author);
    this.notes.push(note);
    return note;
  }

  public removeNote(noteId: number): void {
    this.notes = this.notes.filter((note) => note.id !== noteId);
  }

  public getNotes(): Note[] {
    return [...this.notes];
  }
}

// -----------------------------------------------
// 7. Generics - Storage<T>
// -----------------------------------------------
class Storage<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public removeItem(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }

  public getAllItems(): T[] {
    return [...this.items];
  }
}

// ===============================================
// Testing
// ===============================================
const user1 = new User(1, "Yostina", "yostina@mail.com", "123456", "01000000000", 22);
const admin = new Admin(2, "Ahmed", "admin@mail.com", "admin123", "01111111111", 30);

user1.displayInfo();
admin.displayInfo();

// Age validation
try {
  new User(3, "Kid", "kid@mail.com", "0000", "0122222222", 15);
} catch (err) {
  console.log((err as Error).message);
}

// Aggregation: notebook created independently, then added to user
const studyNotebook = new NoteBook(1, "Study");
user1.addNotebook(studyNotebook);

// Composition: notes are created through the notebook
studyNotebook.addNote("TypeScript", "TypeScript is a typed superset of JavaScript.", user1);
studyNotebook.addNote("OOP", "Encapsulation, Inheritance, Polymorphism, Abstraction.", user1);

// Association: each note knows its author
studyNotebook.getNotes().forEach((n) => console.log(`Note "${n.title}" written by ${n.author.name} (userId: ${n.userId})`));

// Admin manages notes
admin.manageNotes(studyNotebook, "list");
admin.manageNotes(studyNotebook, "delete", 1);
admin.manageNotes(studyNotebook, "list");

// Generics
const numberStorage = new Storage<number>();
numberStorage.addItem(10);
numberStorage.addItem(20);
numberStorage.removeItem(10);
console.log("Number storage:", numberStorage.getAllItems());

const userStorage = new Storage<User>();
userStorage.addItem(user1);
userStorage.addItem(admin);
console.log("User storage:", userStorage.getAllItems().map((u) => u.name));
