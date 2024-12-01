import { ChangeEvent, FC, useMemo, useState } from "react"
import { IGeoObject, objectSelector } from "../../model"
import PenIcon from "@shared/assets/social/penIcon"
import { Button, Input } from "antd"
import CheckIconOutlined from "@shared/assets/panel/checkIconOutlined"
import CloseIconOutlined from "@shared/assets/panel/closeIconOutlined"
import { useActions } from "@shared/hooks/useActions"
import { IUpdateRequestBody } from "@/shared/api/queryObject/types"
import { useAppSelector } from "@shared/hooks/useAppSelector"
import Select, { DefaultOptionType } from "antd/es/select"

interface IDetailObjectCard {
  object: IGeoObject
}
const DetailObjectCard: FC<IDetailObjectCard> = ({ object }) => {
  const [editStatus, setStatusEdit] = useState({ status: object.properties.status, isEdit: false })
  const [editName, setEditName] = useState({ name: object.properties.name, isEdit: false })
  const { statusObject } = useAppSelector(objectSelector)
  const { updateObject } = useActions()

  const options = useMemo(() => {
    return statusObject.reduce((acc, b) => {
      acc.push({ label: b.name, value: b.id })
      return acc
    }, [] as Array<DefaultOptionType>)
  }, [statusObject.length])

  const handleChangeStatusEdit = () => {
    setStatusEdit(prevState => ({ ...prevState, isEdit: !prevState.isEdit }))
  }

  const handleChangeNameEdit = () => {
    setEditName(prevState => ({ ...prevState, isEdit: !prevState.isEdit }))
  }

  const handleChangeNameValue = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(prevState => ({ ...prevState, name: event.target.value }))
  }
  const handleChangeStatusValue = (values: string) => {
    const searchStatus = options.find(opt => opt.value === +values)
    setStatusEdit(prevState => ({ ...prevState, status: `${searchStatus?.label}` }))
  }

  const resetName = () => {
    setEditName(prevState => ({ ...prevState, isEdit: false, name: object.properties.name }))
  }

  const resetStatus = () => {
    setStatusEdit(prevState => ({ ...prevState, isEdit: false, status: object.properties.status }))
  }

  const handleAcceptEdition = (type: "status" | "name") => {
    const body: IUpdateRequestBody = {
      name: editName.name,
      status: 2
    }
    updateObject({ body, id: object.id })

    if (type === "status") {
      handleChangeStatusEdit()
      return
    }

    if (type === "name") {
      handleChangeNameEdit()
      return
    }
  }

  return (
    <section className="flex flex-col space-y-2">
      <div>
        <section className="flex items-center space-x-2">
          <h1 className="font-medium">Название</h1>
          <span className="mt-[2px] cursor-pointer" onClick={handleChangeNameEdit}>
            <PenIcon />
          </span>
        </section>
        {editName.isEdit ? (
          <div className="flex space-x-1">
            <Input
              value={editName.name}
              onChange={handleChangeNameValue}
              size="small"
              className="w-[250px] text-sm"
            />
            <Button
              icon={<CheckIconOutlined />}
              size="small"
              onClick={() => handleAcceptEdition("name")}
            />
            <Button icon={<CloseIconOutlined />} size="small" onClick={resetName} />
          </div>
        ) : (
          <p className="leading-3 text-xs">{object.properties.name}</p>
        )}
      </div>
      <div>
        <section className="flex items-center space-x-2">
          <h1 className="font-medium">Тип коммуникации</h1>
        </section>

        <p className="leading-3 text-xs">{object.properties.type}</p>
      </div>
      <div>
        <section className="flex items-center space-x-2">
          <h1 className="font-medium">Глубина залегания</h1>
        </section>
        <p className="leading-3 text-xs">{object.properties.depth}</p>
      </div>
      <div>
        <section className="flex items-center space-x-2">
          <h1 className="font-medium">Статус</h1>
          <span className="mt-[2px] cursor-pointer" onClick={handleChangeStatusEdit}>
            <PenIcon />
          </span>
        </section>
        {editStatus.isEdit ? (
          <div className="flex space-x-1">
            <Select
              value={editStatus.status}
              options={options}
              className="w-[250px] text-sm"
              size="small"
              onChange={handleChangeStatusValue}
            />
            <Button
              icon={<CheckIconOutlined />}
              size="small"
              onClick={() => handleAcceptEdition("status")}
            />
            <Button icon={<CloseIconOutlined />} size="small" onClick={resetStatus} />
          </div>
        ) : (
          <p className="leading-3 text-xs">{object.properties.status}</p>
        )}
      </div>
    </section>
  )
}

export default DetailObjectCard
