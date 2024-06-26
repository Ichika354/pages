document.getElementById('submit-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const npm = document.getElementById('npm').value;
    const password = document.getElementById('password').value;

    const loginData = {
        npm: npm,
        password: password
    };

    fetch('https://wirausahaanakulbi-server.vercel.app/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            // Set token in cookie
            document.cookie = `token=${data.token}; path=/;`;

            if (data.role === "admin"){
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: data.message,
                    showConfirmButton: true,
                }).then(() => {
                    // Redirect to another page after login
                    window.location.href = './admin/dashboard.html'; // Ubah ke halaman yang diinginkan
                });
            }
            // Success notification
        } else {
            throw new Error('No token received');
        }
    })
    .catch(error => {
        // Error notification
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message
        });
    });
});