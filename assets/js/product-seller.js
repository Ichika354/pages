document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://wirausahaanakulbi-server.vercel.app/product";
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

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tableBody = document.querySelector("#product-table tbody");

      data.data.forEach((product, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.users.name}</td>
            <td>${product.product_name}</td>
            <td>${product.categories.category_admins.category}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.detail}</td>
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
});
