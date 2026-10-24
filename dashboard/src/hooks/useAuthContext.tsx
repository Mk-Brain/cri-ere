import type { User } from "firebase/auth"
import { createContext, useContext } from "react"

interface Value{
    user: User | null,
    loading: boolean
} 

export const AuthContext = createContext<Value>({user: null, loading: false})

export function useAuth(){
    return useContext(AuthContext)
}