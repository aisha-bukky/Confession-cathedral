# Software Architecture & React Principles

This document explains the software engineering patterns and React core principles used in **Confession Cathedral**, with plain-language definitions and exact file line references.

---

## 1. Controlled Components

### Plain Language Definition
A **controlled component** is an input element (like a text box) whose current value is completely managed by React state, rather than by the browser's own default internal memory. The input box and the React state are linked: typing in the box updates the state, and updating the state changes what is shown in the box.

### Code Implementation
* **[src/App.jsx: L97-L98](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/App.jsx#L97-L98)**:
  ```javascript
  value={text}
  onChange={handleChange}
  ```
  Here, the `<textarea>` value is bound to the `text` state. The browser cannot change the text inside the box unless it calls `handleChange` to update the React state.
* **[src/App.jsx: L16-L22](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/App.jsx#L16-L22)**:
  ```javascript
  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 280) {
      setText(inputValue);
    }
  };
  ```
  This function intercepts the user's keystrokes. It validates the input length *before* updating the state, which is what actually locks the field at 280 characters.

---

## 2. Immutability

### Plain Language Definition
**Immutability** means "not changeable." In React, we must never edit (mutate) existing variables, arrays, or objects directly. Instead, whenever a state changes, we create a brand new copy of the array or object with the modified data. This helps React quickly detect changes and render them reliably.

### Code Implementation
* **[src/App.jsx: L39](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/App.jsx#L39)**:
  ```javascript
  setConfessions((prev) => [newConfession, ...prev]);
  ```
  Instead of modifying the old list directly (e.g., using `prev.push(newConfession)`), we use the ES6 spread operator (`...prev`) inside square brackets. This creates a **new array reference** containing the new confession followed by copies of the previous items.

---

## 3. Lifting State & Single Source of Truth

### Plain Language Definition
**Lifting State** is the practice of moving state up to the closest common parent component when multiple child components need to share or react to the same data. By keeping state centralized in the parent component (the **Single Source of Truth**), child components can be kept simple and clean, receiving data purely through inputs (props).

### Code Implementation
* **[src/App.jsx: L4-L6](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/App.jsx#L4-L6)**:
  ```javascript
  const [confessions, setConfessions] = useState([]);
  const [text, setText] = useState('');
  ```
  In this single-page app, all states reside at the top level in the `App` component. 
  * If we split the layout into separate component files—like `<AltarForm />` (which needs to edit `text` and submit) and `<WallFeed />` (which needs to read `confessions`)—neither child component would hold the state. We would **lift the state** to `App.jsx`, which would manage the data and pass it down as props.

---

## 4. Separation of Concerns (SoC)

### Plain Language Definition
**Separation of Concerns** means separating our codebase into distinct sections, where each section has one job. It ensures that content (HTML), styling (CSS), and interactive behavior (JavaScript/React) do not get tangled up, making the code much easier to read, debug, and maintain.

### Code Implementation
* **Structure**: [index.html](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/index.html) defines the entry points, header fonts, and SEO layout.
* **Presentation**: [src/index.css](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/index.css) contains color definitions, glassmorphic styles, responsive grids, and animation routines.
* **Logic/State**: [src/App.jsx](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/App.jsx) controls state, validation rules, click event handling, and data structures.
* **Format Helpers**: Line 54–74 (`formatTime`) is a pure utility function isolated from the JSX layout.

---

## 5. Derived State

### Plain Language Definition
**Derived State** is data that can be calculated on-the-fly from existing state values during the render process. Instead of storing redundant values in multiple state variables (which risk falling out of sync), we compute them directly when the component renders.

### Code Implementation
* **[src/App.jsx: L46-L51](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/App.jsx#L46-L51)**:
  ```javascript
  const charCount = text.length;
  const isLimitReached = charCount >= 280;
  const isLimitNear = charCount >= 250;
  const isFormValid = text.trim().length > 0 && charCount <= 280;
  ```
  Instead of creating four separate state variables and updating them in `onChange`, we calculate these values dynamically during every render. Whenever `text` changes, React re-renders and recalculates these variables automatically.

---

## 6. Managing Side Effects (Lifecycle Hooks)

### Plain Language Definition
A **Side Effect** is any operation that affects something outside the scope of the function being executed—such as fetching data, modifying global timers, or manually editing the DOM. In React, side effects are isolated inside a `useEffect` hook to prevent them from executing repeatedly on every single render.

### Code Implementation
* **[src/App.jsx: L9-L14](file:///c:/Users/skdem/OneDrive/Desktop/Confession%20Cathedral/src/App.jsx#L9-L14)**:
  ```javascript
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTicker(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);
  ```
  Setting a timer is a side effect. By wrapping it in `useEffect` with an empty dependency array `[]`, React knows to start this timer exactly **once** when the app loads (mounts), and to destroy it (`clearInterval`) when the app is closed (unmounted).

---

## 7. Unidirectional Data Flow

### Plain Language Definition
**Unidirectional Data Flow** means data inside React moves in a single, predictable path: from top to bottom. State flows down into UI elements to render them. User actions (like typing or clicking) send events back up to trigger state modifications, which flow back down as new rendering data.

### Code Implementation
* **Visualized Flow**:
  1. **State Declaration**: `text` is declared on line 5.
  2. **Downwards Flow**: `text` is passed to the textarea `value` on line 97.
  3. **Upwards Event**: User types a character. The `<textarea>` triggers `onChange` on line 98, which executes `handleChange` on line 16.
  4. **State Modification**: `handleChange` calls `setText` on line 20.
  5. **Downwards Flow (Re-render)**: React receives the new value, re-renders the app, and flows the updated `text` back down to update the screen.
