import { create } from 'zustand'

type UserState = {
  userId: string | null
  schoolId: string | null
  role: string | null

  setUser: (data: {
    userId: string
    schoolId: string
    role: string
  }) => void

  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  schoolId: null,
  role: null,

  setUser: ({ userId, schoolId, role }) =>
    set({ userId, schoolId, role }),

  clearUser: () =>
    set({ userId: null, schoolId: null, role: null }),
}))