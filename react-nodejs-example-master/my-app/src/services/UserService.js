
export async function getAllUsers() {

    try{
        const response = await fetch('/api/users');
        return await response.json();
    }catch(error) {
        return [];
    }
    
}

export async function createUser(data) {
    console.log(data + "   ASYNC");
    const response = await fetch(`/api/user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userss: data})
      })
            console.log(JSON.stringify({ users: data }));

    return await response.json();
}