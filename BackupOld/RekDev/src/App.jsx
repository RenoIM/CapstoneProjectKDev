import { useState } from 'react'

const App = () => {
  const [FormData, setFormData] = useState({
    Username: '',
    email: '',
    password: ''
  })

  console.log(FormData)
  /* Testing aja ngecek Function dari HandleChange FormData nya jalan */

  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }
    })
  }
  /* mengecek data sebelumnya ketika diketik */

  return (
    <div>
      <form>
        <input
          placeholder='Username'
          name='Username'
          onChange={handleChange}
        />
         <input
          placeholder='Email'
          name='email'
          onChange={handleChange}
        />
         <input
          placeholder='Password'
          name='password'
          onChange={handleChange}
        />

        <button type='Submit'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default App
