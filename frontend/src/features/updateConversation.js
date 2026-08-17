import api from "../../utils/axios"

export const updateConversation=async (payload) => {
    try {
        const {data}=await api.post("/api/chat/update-conversation",payload)
        if (data && typeof data === 'object' && !Array.isArray(data) && !data.message) {
            return data
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}