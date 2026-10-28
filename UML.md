# Part B – UML Class Diagram

> Visibility: `+` public · `-` private · `#` protected

```mermaid
classDiagram
    class User {
        +id: number
        +name: string
        #email: string
        -password: string
        #phone: string
        -age: number
        -notebooks: NoteBook[]
        +displayInfo() void
        +checkPassword(password: string) boolean
        +addNotebook(notebook: NoteBook) void
        +removeNotebook(notebookId: number) void
        +getNotebooks() NoteBook[]
    }

    class Admin {
        +manageNotes(notebook: NoteBook, action: string, noteId?: number) void
        +displayInfo() void
    }

    class Note {
        +id: number
        +title: string
        +content: string
        +author: User
        +userId: number
        +preview(length: number) string
    }

    class NoteBook {
        +id: number
        +name: string
        -notes: Note[]
        +addNote(title: string, content: string, author: User) Note
        +removeNote(noteId: number) void
        +getNotes() Note[]
    }

    class Storage~T~ {
        -items: T[]
        +addItem(item: T) void
        +removeItem(item: T) void
        +getAllItems() T[]
    }

    User <|-- Admin : Inheritance
    NoteBook *-- "0..*" Note : Composition
    User o-- "0..*" NoteBook : Aggregation
    Note --> "1" User : Association (author)
```

## Relationships

| Relationship | Between | UML symbol | Explanation |
|---|---|---|---|
| **Inheritance** | `Admin` → `User` | Hollow triangle arrow (`<|--`) | `Admin` **is a** `User`; it inherits all properties and methods and adds `manageNotes()`. |
| **Composition** | `NoteBook` ◆— `Note` | Filled diamond on NoteBook side | Notes are created **inside** the notebook (`addNote()` makes the `Note`). A note cannot exist without its notebook — if the notebook is deleted, its notes are deleted too. |
| **Aggregation** | `User` ◇— `NoteBook` | Hollow diamond on User side | A user **has** many notebooks, but notebooks are created separately and passed in with `addNotebook()`, so they can exist independently of the user. |
| **Association** | `Note` → `User` | Plain arrow | Each note **knows** its author (`author: User`). Both objects live independently; the note just references the user. |

`Storage<T>` is a standalone **generic class** – it has no relationship with the other classes but can store any of them (e.g. `Storage<User>`, `Storage<Note>`, `Storage<number>`).
