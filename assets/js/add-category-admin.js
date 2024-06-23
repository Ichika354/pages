function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

document.getElementById('category-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the form from submitting the default way
  
  // Get the token from the cookie
  const token = getCookie('token'); // Assuming the token is stored in a cookie named 'token'
  
  // Check if token exists
  if (!token) {
    alert('No token found. Please log in first.');
    return;
  }

  console.log(token);

  // Get form data
  const category = document.getElementById('category').value;
  const icon = document.getElementById('icon').value;

  // Send the POST request
  try {
    const response = await fetch('https://wirausahaanakulbi-server.vercel.app/category-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ category, icon })
    });

    
    const result = await response.json();
    console.log(response);

    if (response.ok) {
      alert('Category Added Successfully');
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while adding the category.');
  }
});