import Axios from "axios";

const api = Axios.create({
    baseURL: 'http://166.0.138.149:9000/', //urls[process.env.NODE_ENV],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export default api;
