import { create } from 'zustand'

 const useStore = create((set) => ({
        sections: {},
        updateSections: (sections) =>  set((state) => ({sections: sections })),
        openCard: false,
        updateOpenCard: (card) =>  set((state) => ({openCard: card })),
        cardID: '',
        updateCardId: (card) =>  set((state) => ({cardID: card })),
    }))

export default useStore