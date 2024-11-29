import { ChangeEvent, FormEvent, useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ERoutesNames } from "@pages/routes"
import { login } from "@entities/token/api"
import ErrorWrapper from "@shared/ui/errorWrapper"
import { useValidate } from "@shared/hooks/useValidate"
import { Button, Checkbox, Input } from "antd"

const LoginForm = () => {
  const [requestData, setRequestData] = useState({
    email: "",
    password: ""
  })
  const [isAccepted, setIsAccepted] = useState(false)
  const [acceptedError, setAcceptedError] = useState("")

  const { handleValidate, error } = useValidate(requestData)

  const navigate = useNavigate()

  const handleChangeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRequestData(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }, [])

  const handleAccepted = useCallback(() => setIsAccepted(prevState => !prevState), [])

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { isError } = handleValidate()
    if (!isError && isAccepted) {
      const { data, status } = await login(requestData)
      if (status !== 200) throw new Error("Invalid registration!")
      navigate(ERoutesNames.DEFAULT)
      return data
    } else if (!isAccepted) {
      setAcceptedError("Подтвердите согласие о политике")
    }
  }

  return (
    <form
      className=" flex flex-col space-y-4 rounded-xl w-[500px] p-5 py-7 bg-blue-300"
      onSubmit={onFormSubmit}
    >
      <div className="flex justify-center items-center space-x-3">
        <h1 className="text-center text-white text-3xl font-bold">Войти</h1>
      </div>

      <section className=" flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="font-light uppercase text-xs text-white">Email</label>
          <section className="space-y-1">
            <Input
              name="email"
              size="large"
              placeholder="Email"
              value={requestData.email}
              onChange={handleChangeValue}
            />
            {error.email && <ErrorWrapper message={error.email.message} />}
          </section>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-light uppercase text-xs text-white">Пароль</label>
          <section className="space-y-1">
            <Input
              name="password"
              size="large"
              placeholder="Пароль"
              value={requestData.password}
              onChange={handleChangeValue}
            />
            {error.password && <ErrorWrapper message={error.password.message} />}
          </section>
        </div>
      </section>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col  space-y-1">
          <div className=" flex space-x-2 items-center">
            <Checkbox checked={isAccepted} onClick={handleAccepted} />
            <span className="text-white">Accept terms and conditions</span>
          </div>
          <div className="">
            <ErrorWrapper message={acceptedError} />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Button size="middle">Войти</Button>
          <span className="text-center text-white text-sm">
            Нет аккаунта? <Link to={ERoutesNames.REGISTER_PAGE}>Зарегестрируйтесь</Link>
          </span>
        </div>
      </div>
    </form>
  )
}

export default LoginForm
