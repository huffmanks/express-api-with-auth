import { DocumentType } from '@typegoose/typegoose/lib/types'
import { isValidObjectId } from 'mongoose'

type TArg<T> = DocumentType<T>

export const documentExists = (model: TArg<any>, id: string | undefined) => {
    const isValid = isValidObjectId(id)
    if (!isValid) return false

    const docExists = model.exists({ _id: id })

    return !!docExists
}
