import {supabase} from "./supabase-client.ts"

const patchData = async (
  tableName: string,
  data: {}
): Promise<{status: number; statusText: string} | {error: any}> => {
  const {status, statusText, error} = await supabase
    .from(tableName)
    .upsert(data, {onConflict: "company_number, report_year"})
    .select()

  if (error) {
    console.error("Error inserting data: ", error)
  }

  return {status, statusText}
}

export default patchData
