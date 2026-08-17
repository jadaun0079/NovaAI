import api from "../../utils/axios"

export const getConversations=async () => {
    try {
        const {data}=await api.get("/api/chat/get-conversations")
        if (Array.isArray(data)) {
            return data
        }
        return []
    } catch (error) {
        console.log(error)
        return []
    }
}