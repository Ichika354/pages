document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://wirausahaanakulbi-server.vercel.app/category-admin";
  const userLogin = document.getElementById("user-login");
  // Function to decode JWT token
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  }

  // Get the token from cookie (assuming it's already set)
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    .split("=")[1];

  if (token) {
    const user = parseJwt(token);
    userLogin.textContent = user.name; // Update with user information, e.g., user.name
  } else {
    console.error("Token not found or expired.");
    // Handle error or redirect to login page
  }

  // Fetch and display categories
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tableBody = document.querySelector("#category-table tbody");

      data.data.forEach((category, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
                      <td>${index + 1}</td>
                      <td>${category.category}</td>
                      <td>${category.icon}</td>
                      <td>
                          <button class="edit-btn">Edit</button>
                          <button class="delete-btn">Delete</button>
                      </td>
                  `;
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
    });

  // Fungsi untuk logout
  async function logout() {
    try {
      const response = await fetch("https://wirausahaanakulbi-server.vercel.app/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert(result.message);
          window.location.href = "/login";
        } else {
          alert("Logout failed");
        }
      } else {
        alert("Logout request failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout");
    }
  }

  document.getElementById("logoutButton").addEventListener("click", function (event) {
    event.preventDefault();
    logout();
  });
});
