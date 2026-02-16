import { create } from "zustand";

const useStore = create((set) => ({
    content:[ {
        id:'',
        title:'', 
        body:'',
        slug:''
    }],
    updateContent: (state) => set(() => ({content: state}))

}))

export default useStore