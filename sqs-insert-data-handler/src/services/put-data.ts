import {supabase} from "./supabase-client.ts"

const putData = async (
  tableName: string,
  data: {}
): Promise<{status: number; statusText: string} | {error: any}> => {
  const {status, statusText, error} = await supabase
    .from(tableName)
    .insert(data)
    .select()

  if (error) {
    console.error(error, data, "Error inserting data")
  }

  return {status, statusText}
}

export default putData
