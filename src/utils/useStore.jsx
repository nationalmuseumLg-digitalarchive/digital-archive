import { create } from 'zustand'

const useStore = create((set) => ({
  sections: {},
  updateSections: (sections) => set(() => ({ sections })),
  openCard: false,
  updateOpenCard: (card) => set(() => ({ openCard: card })),
  cardID: '',
  updateCardId: (card) => set(() => ({ cardID: card })),
  searchOpen: false,
  openSearch: () => set(() => ({ searchOpen: true })),
  closeSearch: () => set(() => ({ searchOpen: false })),
  searchQuery: '',
  setSearchQuery: (q) => set(() => ({ searchQuery: q })),
}))

export default useStore
