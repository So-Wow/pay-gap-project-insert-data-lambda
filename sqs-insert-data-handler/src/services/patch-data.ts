import {supabase} from "./supabase-client.ts"

const patchData = async (
  tableName: string,
  data: {},
  companyNumber: string
): Promise<{status: number; statusText: string} | {error: any}> => {
  const {status, statusText, error} = await supabase
    .from(tableName)
    .upsert(data)
    .eq("company_number", companyNumber)
    .select()

  if (error) {
    console.error(error, data, "Error inserting patch data")
  }

  return {status, statusText}
}

export default patchData
