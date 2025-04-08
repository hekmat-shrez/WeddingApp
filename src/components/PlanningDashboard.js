import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlanningDashboard.module.css';

function PlanningDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedCategory, setEditedCategory] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [newGuest, setNewGuest] = useState('');
  const [editedGuest, setEditedGuest] = useState('');
  const [editedAttending, setEditedAttending] = useState(false);

  // Default data
  const defaultTodos = [
    { id: Date.now() + 1, text: 'Book the wedding venue', completed: false, dueDate: '2025-05-30' },
    { id: Date.now() + 2, text: 'Choose a wedding date', completed: true, dueDate: '2025-05-10' },
    { id: Date.now() + 3, text: 'Send out save-the-dates', completed: false, dueDate: '2025-06-15' },
    { id: Date.now() + 4, text: 'Hire a photographer', completed: false, dueDate: '2025-07-15' },
    { id: Date.now() + 5, text: 'Select wedding dress', completed: false, dueDate: '2025-08-01' },
  ];

  const defaultBudget = {
    venueRental: 12000,
    catering: 9000,
    photography: 5000,
    videography: 3000,
    weddingAttire: 7000,
    flowersAndDecor: 6000,
    stationery: 2500,
    rings: 4000,
    officiant: 500,
    musicAndEntertainment: 4500,
    transportation: 1000,
    favorsAndGifts: 1500,
    honeymoonFund: 5000,
    miscellaneous: 2000,
  };

  const defaultGuests = {
    JohnDoe: { name: 'John Doe', attending: true },
    JaneSmith: { name: 'Jane Smith', attending: false },
  };

  // State for dashboard data
  const [todos, setTodos] = useState(defaultTodos);
  const [budgetData, setBudgetData] = useState(defaultBudget);
  const [guestData, setGuestData] = useState(defaultGuests);
  const [selectedTab, setSelectedTab] = useState('todo');

  // Base API URL
  const API_BASE_URL = 'http://localhost:5000';

  // Check authentication status and fetch user data when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login if no token is found
        navigate('/login', { state: { from: '/planning' } });
        return;
      }

      try {
        // Get user information from token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email;
        setUserEmail(email);
        
        // Fetch user dashboard data
        await fetchUserData(email, token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login', { state: { from: '/planning' } });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Update the fetch functions in PlanningDashboard.js

// Fetch user dashboard data from API
const fetchUserData = async (email, token) => {
  try {
    console.log(`Fetching data for: ${email} with token`);
    
    const response = await fetch(`${API_BASE_URL}/api/dashboard/${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', response.status, errorData);
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const userData = await response.json();
    console.log('User data received:', userData);
    
    // Update state with user data if available, otherwise use defaults
    if (userData.checklist) setTodos(userData.checklist);
    if (userData.budget) setBudgetData(userData.budget);
    if (userData.guests) setGuestData(userData.guests);
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Keep using default data if fetch fails
  }
};

// Save data to backend whenever it changes
const saveToBackend = async (dataType, data) => {
  if (!isAuthenticated || !userEmail) return;
  
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const endpoint = `${API_BASE_URL}/api/${dataType}`;
    const payload = {
      email: userEmail,
      [dataType]: data
    };

    console.log(`Saving ${dataType} for ${userEmail}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', response.status, errorData);
      throw new Error(`Failed to save ${dataType}: ${response.statusText}`);
    }
    
    console.log(`${dataType} saved successfully`);
  } catch (error) {
    console.error(`Error saving ${dataType}:`, error);
  }
};

  // Tab management
  const handleTabChange = (tab) => setSelectedTab(tab);

  // To-Do List functions
  const handleAddTask = () => {
    if (newTask.trim()) {
      const updatedTodos = [...todos, { id: Date.now(), text: newTask, completed: false, dueDate: '' }];
      setTodos(updatedTodos);
      saveToBackend('checklist', updatedTodos);
      setNewTask('');
    }
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveToBackend('checklist', updatedTodos);
  };

  const handleDueDateChange = (event, id) => {
    const newDueDate = event.target.value;
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, dueDate: newDueDate } : todo
    );
    setTodos(updatedTodos);
    saveToBackend('checklist', updatedTodos);
  };

  // Budget functions
  const handleAddCategory = () => {
    if (newCategory && newAmount) {
      const updatedBudget = {
        ...budgetData,
        [newCategory]: parseFloat(newAmount),
      };
      setBudgetData(updatedBudget);
      saveToBackend('budget', updatedBudget);
      setNewCategory('');
      setNewAmount('');
    }
  };

  const handleDeleteCategory = (category) => {
    const updatedBudget = { ...budgetData };
    delete updatedBudget[category];
    setBudgetData(updatedBudget);
    saveToBackend('budget', updatedBudget);
  };

  const handleCategoryChange = (event) => setEditedCategory(event.target.value);
  const handlePriceChange = (event) => setEditedPrice(event.target.value);

  const handleEdit = (category) => {
    setEditMode(category);
    setEditedCategory(category);
    setEditedPrice(budgetData[category]);
  };

  const handleSave = () => {
    if (editedCategory && !isNaN(editedPrice)) {
      const updatedBudget = {
        ...budgetData,
        [editedCategory]: parseFloat(editedPrice),
      };
      setBudgetData(updatedBudget);
      saveToBackend('budget', updatedBudget);
    }
    setEditMode(null);
  };

  const handleCancel = () => setEditMode(null);

  // Guest List functions
  const handleAddGuest = () => {
    if (newGuest.trim()) {
      const updatedGuests = {
        ...guestData,
        [newGuest]: { name: newGuest, attending: false },
      };
      setGuestData(updatedGuests);
      saveToBackend('guests', updatedGuests);
      setNewGuest('');
    }
  };

  const handleEditGuest = (guest) => {
    setEditMode(guest);
    setEditedGuest(guest);
    setEditedAttending(guestData[guest].attending);
  };

  const handleSaveGuest = () => {
    if (editedGuest) {
      const updatedGuests = {
        ...guestData,
        [editedGuest]: { ...guestData[editedGuest], attending: editedAttending },
      };
      setGuestData(updatedGuests);
      saveToBackend('guests', updatedGuests);
    }
    setEditMode(null);
  };

  const handleCancelGuest = () => setEditMode(null);

  const handleDeleteGuest = (guest) => {
    const updatedGuests = { ...guestData };
    delete updatedGuests[guest];
    setGuestData(updatedGuests);
    saveToBackend('guests', updatedGuests);
  };

  // Show loading indicator while checking authentication
  if (isLoading) {
    return <div className={styles.loadingIndicator}>Loading...</div>;
  }

  // Only render dashboard content if authenticated
  if (!isAuthenticated) {
    return null; // This prevents any flash of content before redirect completes
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Your Wedding Plan</h2>

      <div className={styles.tabs}>
        <button
          className={selectedTab === 'todo' ? styles.activeTab : ''}
          onClick={() => handleTabChange('todo')}
        >
          To-Do List
        </button>
        <button
          className={selectedTab === 'budget' ? styles.activeTab : ''}
          onClick={() => handleTabChange('budget')}
        >
          Budgeting
        </button>
        <button
          className={selectedTab === 'guest' ? styles.activeTab : ''}
          onClick={() => handleTabChange('guest')}
        >
          Guest List
        </button>
      </div>

      {selectedTab === 'todo' && (
        <div className={styles.todoSection}>
          <h3 className={styles.todoTitle}>To-Do List</h3>
          <div className={styles.addTask}>
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className={styles.taskInput}
            />
            <button onClick={handleAddTask} className={styles.addTaskButton}>
              Add Task
            </button>
          </div>
          <ul className={styles.todoList}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  className={styles.checkbox}
                />
                <span>{todo.text}</span>
                <div className={styles.dueDate}>
                  <label htmlFor={`dueDate-${todo.id}`}>Due Date:</label>
                  <input
                    type="date"
                    id={`dueDate-${todo.id}`}
                    value={todo.dueDate}
                    onChange={(event) => handleDueDateChange(event, todo.id)}
                    className={styles.dateInput}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === 'budget' && (
        <div className={styles.budgetSection}>
          <h3 className={styles.sectionTitle}>Budget Summary</h3>
          <div className={styles.addBudgetCategory}>
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={styles.budgetInput}
            />
            <input
              type="number"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className={styles.budgetInput}
            />
            <button onClick={handleAddCategory} className={styles.addButton}>Add Category</button>
          </div>
          <ul>
            {Object.entries(budgetData).map(([category, amount]) => (
              <li key={category} className={styles.budgetItem}>
                {editMode === category ? (
                  <>
                    <input
                      type="text"
                      value={editedCategory}
                      onChange={handleCategoryChange}
                      className={styles.budgetInput}
                    />
                    <input
                      type="number"
                      value={editedPrice}
                      onChange={handlePriceChange}
                      className={styles.budgetInput}
                    />
                    <button onClick={handleSave} className={styles.addButton}>Save</button>
                    <button onClick={handleCancel} className={styles.addButton}>Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{category}:</strong> ${amount.toLocaleString()}
                    <div className={styles.buttons}>
                      <button onClick={() => handleEdit(category)} className={styles.editButton}>Edit</button>
                      <button onClick={() => handleDeleteCategory(category)} className={styles.deleteButton}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === 'guest' && (
        <div className={styles.guestSection}>
          <h3 className={styles.sectionTitle}>Guest List</h3>
          <div className={styles.addGuestCategory}>
            <input
              type="text"
              placeholder="Add a new guest"
              value={newGuest}
              onChange={(e) => setNewGuest(e.target.value)}
              className={styles.budgetInput}
            />
            <button onClick={handleAddGuest} className={styles.addButton}>Add Guest</button>
          </div>
          <ul>
            {Object.entries(guestData).map(([guest, { name, attending }]) => (
              <li key={guest} className={styles.budgetItem}>
                {editMode === guest ? (
                  <>
                    <input
                      type="text"
                      value={editedGuest}
                      onChange={(e) => setEditedGuest(e.target.value)}
                      className={styles.budgetInput}
                    />
                    <label>
                      Attending:
                      <input
                        type="checkbox"
                        checked={editedAttending}
                        onChange={() => setEditedAttending(!editedAttending)}
                      />
                    </label>
                    <button onClick={handleSaveGuest} className={styles.addButton}>Save</button>
                    <button onClick={handleCancelGuest} className={styles.addButton}>Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{name}</strong> {attending ? '(Attending)' : '(Not Attending)'}
                    <div className={styles.buttons}>
                      <button onClick={() => handleEditGuest(guest)} className={styles.editButton}>Edit</button>
                      <button onClick={() => handleDeleteGuest(guest)} className={styles.deleteButton}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PlanningDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './PlanningDashboard.module.css';

// function PlanningDashboard() {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [newTask, setNewTask] = useState('');
//   const [newCategory, setNewCategory] = useState('');
//   const [newAmount, setNewAmount] = useState('');
//   const [editMode, setEditMode] = useState(null);
//   const [editedCategory, setEditedCategory] = useState('');
//   const [editedPrice, setEditedPrice] = useState('');
//   const [newGuest, setNewGuest] = useState('');
//   const [editedGuest, setEditedGuest] = useState('');
//   const [editedAttending, setEditedAttending] = useState(false);

//   // Check authentication status when component mounts
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         // Redirect to login if no token is found
//         navigate('/login', { state: { from: '/planning' } });
//       } else {
//         setIsAuthenticated(true);
//       }
//       setIsLoading(false);
//     };

//     checkAuth();
//   }, [navigate]);

//   const [todos, setTodos] = useState([
//     { id: Date.now() + 1, text: 'Book the wedding venue', completed: false, dueDate: '2025-05-30' },
//     { id: Date.now() + 2, text: 'Choose a wedding date', completed: true, dueDate: '2025-05-10' },
//     { id: Date.now() + 3, text: 'Send out save-the-dates', completed: false, dueDate: '2025-06-15' },
//     { id: Date.now() + 4, text: 'Hire a photographer', completed: false, dueDate: '2025-07-15' },
//     { id: Date.now() + 5, text: 'Select wedding dress', completed: false, dueDate: '2025-08-01' },
//   ]);

//   const [budgetData, setBudgetData] = useState({
//     venueRental: 12000,
//     catering: 9000,
//     photography: 5000,
//     videography: 3000,
//     weddingAttire: 7000,
//     flowersAndDecor: 6000,
//     stationery: 2500,
//     rings: 4000,
//     officiant: 500,
//     musicAndEntertainment: 4500,
//     transportation: 1000,
//     favorsAndGifts: 1500,
//     honeymoonFund: 5000,
//     miscellaneous: 2000,
//   });

//   const [guestData, setGuestData] = useState({
//     JohnDoe: { name: 'John Doe', attending: true },
//     JaneSmith: { name: 'Jane Smith', attending: false },
//   });

//   const [selectedTab, setSelectedTab] = useState('todo');

//   const handleTabChange = (tab) => setSelectedTab(tab);

//   const handleAddTask = () => {
//     if (newTask.trim()) {
//       setTodos([...todos, { id: Date.now(), text: newTask, completed: false, dueDate: '' }]);
//       setNewTask('');
//     }
//   };

//   const handleToggleComplete = (id) => {
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, completed: !todo.completed } : todo
//       )
//     );
//   };

//   const handleDueDateChange = (event, id) => {
//     const newDueDate = event.target.value;
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, dueDate: newDueDate } : todo
//       )
//     );
//   };

//   const handleAddCategory = () => {
//     if (newCategory && newAmount) {
//       setBudgetData((prevData) => ({
//         ...prevData,
//         [newCategory]: parseFloat(newAmount),
//       }));
//       setNewCategory('');
//       setNewAmount('');
//     }
//   };

//   const handleDeleteCategory = (category) => {
//     const updatedBudget = { ...budgetData };
//     delete updatedBudget[category];
//     setBudgetData(updatedBudget);
//   };

//   const handleCategoryChange = (event) => setEditedCategory(event.target.value);
//   const handlePriceChange = (event) => setEditedPrice(event.target.value);

//   const handleEdit = (category) => {
//     setEditMode(category);
//     setEditedCategory(category);
//     setEditedPrice(budgetData[category]);
//   };

//   const handleSave = () => {
//     if (editedCategory && !isNaN(editedPrice)) {
//       setBudgetData({
//         ...budgetData,
//         [editedCategory]: parseFloat(editedPrice),
//       });
//     }
//     setEditMode(null);
//   };

//   const handleCancel = () => setEditMode(null);

//   const handleAddGuest = () => {
//     if (newGuest.trim()) {
//       setGuestData((prevData) => ({
//         ...prevData,
//         [newGuest]: { name: newGuest, attending: false },
//       }));
//       setNewGuest('');
//     }
//   };

//   const handleEditGuest = (guest) => {
//     setEditMode(guest);
//     setEditedGuest(guest);
//     setEditedAttending(guestData[guest].attending);
//   };

//   const handleSaveGuest = () => {
//     if (editedGuest) {
//       setGuestData((prevData) => ({
//         ...prevData,
//         [editedGuest]: { ...prevData[editedGuest], attending: editedAttending },
//       }));
//     }
//     setEditMode(null);
//   };

//   const handleCancelGuest = () => setEditMode(null);

//   const handleDeleteGuest = (guest) => {
//     const updatedGuestData = { ...guestData };
//     delete updatedGuestData[guest];
//     setGuestData(updatedGuestData);
//   };

//   // Show loading indicator while checking authentication
//   if (isLoading) {
//     return <div className={styles.loadingIndicator}>Loading...</div>;
//   }

//   // Only render dashboard content if authenticated
//   if (!isAuthenticated) {
//     return null; // This prevents any flash of content before redirect completes
//   }

//   return (
//     <div className={styles.dashboardContainer}>
//       <h2 className={styles.dashboardTitle}>Your Wedding Plan</h2>

//       <div className={styles.tabs}>
//         <button
//           className={selectedTab === 'todo' ? styles.activeTab : ''}
//           onClick={() => handleTabChange('todo')}
//         >
//           To-Do List
//         </button>
//         <button
//           className={selectedTab === 'budget' ? styles.activeTab : ''}
//           onClick={() => handleTabChange('budget')}
//         >
//           Budgeting
//         </button>
//         <button
//           className={selectedTab === 'guest' ? styles.activeTab : ''}
//           onClick={() => handleTabChange('guest')}
//         >
//           Guest List
//         </button>
//       </div>

//       {selectedTab === 'todo' && (
//         <div className={styles.todoSection}>
//           <h3 className={styles.todoTitle}>To-Do List</h3>
//           <div className={styles.addTask}>
//             <input
//               type="text"
//               placeholder="Add a new task..."
//               value={newTask}
//               onChange={(e) => setNewTask(e.target.value)}
//               className={styles.taskInput}
//             />
//             <button onClick={handleAddTask} className={styles.addTaskButton}>
//               Add Task
//             </button>
//           </div>
//           <ul className={styles.todoList}>
//             {todos.map((todo) => (
//               <li
//                 key={todo.id}
//                 className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={todo.completed}
//                   onChange={() => handleToggleComplete(todo.id)}
//                   className={styles.checkbox}
//                 />
//                 <span>{todo.text}</span>
//                 <div className={styles.dueDate}>
//                   <label htmlFor={`dueDate-${todo.id}`}>Due Date:</label>
//                   <input
//                     type="date"
//                     id={`dueDate-${todo.id}`}
//                     value={todo.dueDate}
//                     onChange={(event) => handleDueDateChange(event, todo.id)}
//                     className={styles.dateInput}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {selectedTab === 'budget' && (
//         <div className={styles.budgetSection}>
//           <h3 className={styles.sectionTitle}>Budget Summary</h3>
//           <div className={styles.addBudgetCategory}>
//             <input
//               type="text"
//               placeholder="New Category"
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               className={styles.budgetInput}
//             />
//             <input
//               type="number"
//               placeholder="Amount"
//               value={newAmount}
//               onChange={(e) => setNewAmount(e.target.value)}
//               className={styles.budgetInput}
//             />
//             <button onClick={handleAddCategory} className={styles.addButton}>Add Category</button>
//           </div>
//           <ul>
//             {Object.entries(budgetData).map(([category, amount]) => (
//               <li key={category} className={styles.budgetItem}>
//                 {editMode === category ? (
//                   <>
//                     <input
//                       type="text"
//                       value={editedCategory}
//                       onChange={handleCategoryChange}
//                       className={styles.budgetInput}
//                     />
//                     <input
//                       type="number"
//                       value={editedPrice}
//                       onChange={handlePriceChange}
//                       className={styles.budgetInput}
//                     />
//                     <button onClick={handleSave} className={styles.addButton}>Save</button>
//                     <button onClick={handleCancel} className={styles.addButton}>Cancel</button>
//                   </>
//                 ) : (
//                   <>
//                     <strong>{category}:</strong> ${amount.toLocaleString()}
//                     <div className={styles.buttons}>
//                       <button onClick={() => handleEdit(category)} className={styles.editButton}>Edit</button>
//                       <button onClick={() => handleDeleteCategory(category)} className={styles.deleteButton}>Delete</button>
//                     </div>
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {selectedTab === 'guest' && (
//         <div className={styles.guestSection}>
//           <h3 className={styles.sectionTitle}>Guest List</h3>
//           <div className={styles.addGuestCategory}>
//             <input
//               type="text"
//               placeholder="Add a new guest"
//               value={newGuest}
//               onChange={(e) => setNewGuest(e.target.value)}
//               className={styles.budgetInput}
//             />
//             <button onClick={handleAddGuest} className={styles.addButton}>Add Guest</button>
//           </div>
//           <ul>
//             {Object.entries(guestData).map(([guest, { name, attending }]) => (
//               <li key={guest} className={styles.budgetItem}>
//                 {editMode === guest ? (
//                   <>
//                     <input
//                       type="text"
//                       value={editedGuest}
//                       onChange={(e) => setEditedGuest(e.target.value)}
//                       className={styles.budgetInput}
//                     />
//                     <label>
//                       Attending:
//                       <input
//                         type="checkbox"
//                         checked={editedAttending}
//                         onChange={() => setEditedAttending(!editedAttending)}
//                       />
//                     </label>
//                     <button onClick={handleSaveGuest} className={styles.addButton}>Save</button>
//                     <button onClick={handleCancelGuest} className={styles.addButton}>Cancel</button>
//                   </>
//                 ) : (
//                   <>
//                     <strong>{name}</strong> {attending ? '(Attending)' : '(Not Attending)'}
//                     <div className={styles.buttons}>
//                       <button onClick={() => handleEditGuest(guest)} className={styles.editButton}>Edit</button>
//                       <button onClick={() => handleDeleteGuest(guest)} className={styles.deleteButton}>Delete</button>
//                     </div>
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PlanningDashboard;