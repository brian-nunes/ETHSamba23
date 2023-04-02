import { useState } from "react"
import Login from "./components/login/Login.jsx"
import Detail from "./components/detail/Detail.jsx"
import Products from "./components/products/Products.jsx"

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isDetail, setIsDetail] = useState(false);
  const [product, setIsProducts] = useState(false);

  if(isLogin){
    return (
      <div>
        <Login />
      </div>
    ) 
  }

  if(isDetail){
    return (
      <div>
        <Login />
      </div>
    )
  }

  if(isProduct){
    return (
      <div>
        <Login />
      </div>
    )
  }
}

export default App
