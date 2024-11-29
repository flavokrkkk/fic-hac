import { FC } from "react"

interface IErrorWrapper {
  message: string
}
const ErrorWrapper: FC<IErrorWrapper> = ({ message }) => {
  return <h4 className="leading-3 text-red-700 text-xs">{message}</h4>
}

export default ErrorWrapper
