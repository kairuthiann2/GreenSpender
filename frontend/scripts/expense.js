

// Function to handle the 'Edit button click
const editExpense = (id) => {
  // Redirect to the edit_expense.html page with the expense ID in the query string
  window.location.href = `./edit_expense.html?id=${id}`;
};

//Dynamically attach event listeners to buttons
const attachEventListeners = () => {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      editExpense(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      deleteExpense(id);
    });
  });
};

// View Expenses

// Fetching expenses for the logged in user and attatch event listeners after rendering
const fetchExpenses = async () => {
  try {
    console.log("Fetching expenses for the logged-in user...");
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error("User ID is null or undefined");
      return;
    }

    const response = await apiCall(
      `/api/v1/expenses/view_expense/${user_id}`,
      "GET"
    );

    // Log the full response
    console.log("API Respones:", response);

    //Access the result property, which contains the expenses array
    const expenses = response.result;
    console.log("Expenses fetched successfully:", expenses);

    // Upadate the UI with the fetched expenses
    displayExpenses(expenses);

    // Attach event listeners after displaying expenses
    attachEventListeners();
  } catch (error) {
    console.error("Error:", error);
  }
};

// function to display expenses in the UI
const displayExpenses = (expenses) => {
  console.log("Displaying expenses in the UI...");
  const expenseTableBody = document.querySelector(".expense-table tbody");

  if (!expenseTableBody) {
    console.log("Expense table body not found in the DOM ");
    return;
  }

  expenseTableBody.innerHTML = ""; // Clear any existing rows

  expenses.forEach((expense) => {
    const row = document.createElement("tr");

    var date = new Date(expense.date);

    // Add tabble cells for each expense property
    row.innerHTML = `
          <td>${expense.category}</td>
          <td>${expense.description}</td>
          <td>${expense.amount}</td>
          <td>${date.toDateString()}</td>
          <td><button class="edit-btn" data-id ="${
            expense.id
          }">Edit</button</td>
          <td><button class="delete-btn" data-id ="${
            expense.id
          }">Delete</button</td>
          
        `;

    // Append the row to the table body
    expenseTableBody.appendChild(row);
  });
  console.log("Expense displayed successfully.");
};

// call the fetchExpenses function when the page loads
if (window.location.pathname.endsWith("view_expense.html")) {
  document.addEventListener("DOMContentLoaded", fetchExpenses);
}



// Add a new expense
const addExpense = async () => {
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("expense-category").value;
  const description = document.getElementById("description").value;

  console.log("Adding a new expense:", { amount, date, category, description });

  try {
    await apiCall("/api/v1/expenses/add_expense/", "POST", {
      amount,
      date,
      category,
      description,
    });

    alert("Expense added successfully.");

    // Redirect to the view expense page or refresh the list after adding an expense
    window.location.href = "./view_expense.html";

    // Refresh the expenses list
    fetchExpenses();
  } catch (error) {
    console.error("Error:", error);
  }
};

// Add event listener to the add expense form
document.addEventListener("DOMContentLoaded", () => {
  // Check if we are on the add_expense.html page
  if (window.location.pathname.endsWith("add_expense.html")) {
    const form = document.getElementById("expense-form");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        addExpense();
      });
    } else {
      console.log("Form element not found");
    }
  }

  // check if we are on the view_expense.html page
  if (window.location.pathname.endsWith("view_expense.html")) {
    fetchExpenses();
  }
});



// Edit an expense

// Fetch the expense data and prefill the form when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.endsWith("edit_expense.html")) {
    const expenseId = new URLSearchParams(window.location.search).get("id");
    await fetchAndPrefillExpense(expenseId);
  }
});

const fetchAndPrefillExpense = async (id) => {
  try {
    // Destructure result from the apiCall response
    const { result: expense  } = await apiCall(
      `/api/v1/expenses/edit_expense/${id}`,
      "GET"
    );

    // Check that the date exists in the returned expense data
    if (!expense.date) {
      console.error("No date provided in the expense date:", expense);
      alert(" Error: No date provided for the expense.")
      return;

    }

    const date = new Date(expense.date);

    // check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date value:", expense.date);
      alert("Error: Invalid date value.")
      return
    }

    const formattedDate = date.toISOString().split("T")[0];

    console.log("fetched expense:", expense);

    // prefill the form with the fetched expense data
    document.getElementById("expense-category").value = expense.category;
    document.getElementById("description").value = expense.description;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("date").value = formattedDate;
    console.log("Form prefilled with the expense data.");
  } catch (error) {
    console.error("Error fetching expense data:", error);
  }
};

// Function to handle form submission and send updated data to the server
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("edit_expense.html")) {
    const form = document.getElementById("edit-expense-form");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const expenseId = new URLSearchParams(window.location.search).get("id");
        const category = document.getElementById("expense-category").value;
        const description = document.getElementById("description").value;
        const amount = document.getElementById("amount").value;
        const date = document.getElementById("date").value;

        try {
          await apiCall(`/api/v1/expenses/edit_expense/${expenseId}`, "PUT", {
            category,
            description,
            amount,
            date,
          });

          console.log("Expense updated successfully.");
          alert("Expense updated successfully!");

          // Redirect to view_expense.html page after successful edit
          window.location.href = "./view_expense.html";
        } catch (error) {
          if (error.message.includes("400")) {
            console.error("Error: Duplicate Expenses detected");
            alert(
              "An expense with the same date, category, and description already exists."
            );
          } else {
            console.error("Error updating expense:", error);
            alert("Failed to update the expense");
          }
        }
      });
    } else {
      console.log("Form element not found");
    }
  }
});



// Delete an expense
const deleteExpense = async (id) => {
  try {
    await apiCall(`/api/v1/expenses/delete_expense/${id}`, "DELETE");

    console.log(`Expense with ID: ${id} deleted successfully.`);
    alert("Expense Deleted succussfully!");

    // Refresh the expenses list
    fetchExpenses();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to deleted the expense, try again later");
  }
};
