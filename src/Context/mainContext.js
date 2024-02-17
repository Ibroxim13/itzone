import { createContext, useContext, useState } from "react";

const MainContext = createContext()
export const UseMainContext = () => useContext(MainContext)

const MainContextProvider = ({ children }) => {
    const [notDep, setNotDep] = useState(false)
    const [Groupdep, setGroupDep] = useState(false)

    return (
        <MainContext.Provider value={[notDep, setNotDep, Groupdep, setGroupDep]}>
            {children}
        </MainContext.Provider>
    )
}

export default MainContextProvider;