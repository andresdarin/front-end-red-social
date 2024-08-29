import { Global } from "./Global";

export const GetProfile = async (userId, setState) => {
    const token = localStorage.getItem('token'); // Obtén el token aquí

    try {
        const request = await fetch(Global.url + 'user/profile/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if (!request.ok) {
            throw new Error(`HTTP error! status: ${request.status}`);
        }

        const data = await request.json();

        if (data.status === 'success') {
            setState(data.user);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};
