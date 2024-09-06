// Helper function for making API  calls
const apiCall = async (url, method, body = null) => {
    const token = localStorage.getItem('token');
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
    };
    console.log(`Making ${method} request to ${url} with body:`, body);

    const response = await fetch(url, options);

    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
        console.log(`Failed to ${method} data. Status: ${response.status} `)
        throw new Error(`Failed to ${method} data`);

    }

    console.log(`${method} request to ${url} was successful.`)
    return await response.json();

};

