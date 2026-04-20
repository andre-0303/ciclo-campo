import { supabase } from "../lib/supabase";

export async function login(email: string, password: string) {
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if(error) throw error
    return data
}

export async function logout() {
    const {error} = await supabase.auth.signOut()

    if(error) throw error
}

export async function resetPassword(email: string) {
    const {error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
    })

    if(error) throw error
}