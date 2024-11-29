import { ChangeEvent, FormEvent, useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ERoutesNames } from "@pages/routes"
import { useValidate } from "@shared/hooks/useValidate"
import { registration } from "@entities/token/api"
import { Button, Checkbox, Input } from "antd"
import ErrorWrapper from "@shared/ui/errorWrapper"

const RegisterForm = () => {
  const [requestData, setRequestData] = useState<{
    username: string
    email: string
    password: string
  }>({
    username: "",
    email: "",
    password: ""
  })

  const [isAccepted, setIsAccepted] = useState(false)
  const [acceptedError, setAcceptedError] = useState("")

  const { handleValidate, error } = useValidate({
    ...requestData
  })

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
      const { data, status } = await registration(requestData)
      if (status !== 201) throw new Error("Invalid registration!")
      navigate(ERoutesNames.DEFAULT)
      return data
    } else if (!isAccepted) {
      setAcceptedError("Подтвердите согласие о политике")
    }
  }

  return (
    <form
      className=" flex flex-col rounded-xl space-y-4 w-[500px] p-5 py-7 bg-blue-300"
      onSubmit={onFormSubmit}
    >
      <div className="flex justify-center items-center space-x-3">
        <h1 className="text-center text-white text-3xl font-bold">Присоединится</h1>
      </div>
      <section className=" flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="font-light uppercase text-xs text-white">Email</label>
          <section className=" space-y-1">
            <Input
              name="email"
              placeholder="Email"
              size="large"
              value={requestData.email}
              onChange={handleChangeValue}
            />
            {error.email && <ErrorWrapper message={error.email.message} />}
          </section>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-light uppercase text-xs text-white">Username</label>
          <section className="space-y-1">
            <Input
              name="username"
              placeholder="Username"
              size="large"
              value={requestData.username}
              onChange={handleChangeValue}
            />
            {error.username && <ErrorWrapper message={error.username.message} />}
          </section>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-light uppercase text-xs text-white">Пароль</label>
          <section className="space-y-1">
            <Input
              name="password"
              placeholder="Пароль"
              size="large"
              value={requestData.password}
              type="password"
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
          <Button htmlType="submit">Зарегистрироваться</Button>
          <span className="text-center text-white text-sm">
            Есть аккаунт? <Link to={ERoutesNames.LOGIN_PAGE}>Войти</Link>
          </span>
        </div>
      </div>
    </form>
  )
}

export default RegisterForm
