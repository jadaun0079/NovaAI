import api from "../../utils/axios"

export const createConversation=async () => {
    try {
        const {data}=await api.get("/api/chat/create-conversation")
        if (data && typeof data === 'object' && !Array.isArray(data) && !data.message) {
            return data
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}