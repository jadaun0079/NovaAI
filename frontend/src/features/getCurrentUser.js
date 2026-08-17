
import api from "../../utils/axios"

const getCurrentUser=async () => {
    
    try {
        const {data}=await api.get("/api/me")
        if (data && typeof data === 'object' && !Array.isArray(data) && !data.message) {
            return data
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}

export default getCurrentUser