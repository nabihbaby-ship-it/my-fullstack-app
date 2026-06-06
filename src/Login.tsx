import { useState } from "react"

function Login () {

const [email, setemail] = useState<string>("")
const [password, setpassword] = useState<string>("")

const einloggen = async () => {

    const daten = await fetch("http://localhost:5000/register")
    const  antwort = await daten.json()
}

return(

    <div>

        <input type="text"
        value={email} 
        onChange={(e) => setemail(e.target.value)}
        placeholder="email"/>

        <input type="text"
        value={password}
        onChange={(e) => setpassword(e.target.value)} />

         <button>einloggen</button>
    </div>
)
}

export default Login