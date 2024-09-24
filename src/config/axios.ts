import axios from "axios";


const api = axios.create({
    baseURL: "https://reqres.in/api/", //define server backend url
});
export default api