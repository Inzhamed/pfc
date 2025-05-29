import axios from "axios";
import { API_BASE_URL } from "../api"

export async function login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
    });
    return response.data; // { access_token: string, token_type: string }
}