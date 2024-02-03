import {createClient} from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
)

const putData = async (
  tableName: string,
  data: {}
): Promise<{status: number; statusText: string} | {error: any}> => {
  const {status, statusText, error} = await supabase
    .from(tableName)
    .insert(data)

  if (error) {
    console.error("Error inserting data: ", error)
  }

  return {status, statusText}
}

export default putData
