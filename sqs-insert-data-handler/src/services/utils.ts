export const pascalCaseToSnakeCase = str =>
  str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()

export const transformObjectKeys = (originalObject, transformFunction) => {
  const transformedObjectKeys = Object.entries(originalObject).map(
    ([key, value]) => [pascalCaseToSnakeCase(key), value]
  )

  return Object.fromEntries(transformedObjectKeys)
}

export const selectObjectProperties = (originalObject, selectedProperties) => {
  if (typeof originalObject !== "object" || originalObject === null) {
    throw new Error("Input must be a valid object")
  }

  if (!Array.isArray(selectedProperties)) {
    throw new Error("Selected properties must be specified as an array")
  }

  const newObject = {}

  for (const property of selectedProperties) {
    if (originalObject.hasOwnProperty(property)) {
      newObject[property] = originalObject[property]
    }
  }

  return newObject
}
