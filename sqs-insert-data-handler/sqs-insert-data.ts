import {getYear} from "date-fns"

import {
  pascalCaseToSnakeCase,
  transformObjectKeys,
  selectObjectProperties,
} from "./services/utils.ts"
import putData from "./services/put-data.ts"
import patchData from "./services/patch-data.ts"
import {
  statsPropertyKeys,
  companyPropertyKeys,
  companyHistoryKeys,
  EMPLOYER_TABLE_NAME,
  EMPLOYER_HISTORY_TABLE_NAME,
  ANNUAL_STATS_TABLE_NAME,
} from "./services/constants.ts"

export const handler = async (event): Promise<object> => {
  const {MessageBody: messageBody} = event
  const {data, companyRecordExists, reportYear, lastReportYear} =
    JSON.parse(messageBody)
  const testModeEnabled = process.env.TEST_MODE === "enabled"

  console.log({data, companyRecordExists, reportYear})

  const transformedDataObject = transformObjectKeys(
    {...data, reportYear},
    pascalCaseToSnakeCase
  )

  const statsDataToInsert = selectObjectProperties(
    transformedDataObject,
    statsPropertyKeys
  )

  const companyDataToInsert = selectObjectProperties(
    transformedDataObject,
    companyPropertyKeys
  )

  const companyHistoryDataToInsert = selectObjectProperties(
    transformedDataObject,
    companyHistoryKeys
  )

  const response = {
    statusCode: 200,
    body: {
      message: "SQS event processed successfully!",
    },
  }

  if (testModeEnabled) {
    console.log(
      {
        statsData: statsDataToInsert,
        companyRecord: companyRecordExists
          ? "Employer data already in db"
          : companyDataToInsert,
        companyHistoryRecord: companyHistoryDataToInsert,
      },
      "test mode enabled"
    )
    return response
  }

  try {
    if (!companyRecordExists) {
      console.info("Employer does not exist")

      await putData(EMPLOYER_TABLE_NAME, companyDataToInsert)
    }

    await patchData(EMPLOYER_HISTORY_TABLE_NAME, companyHistoryDataToInsert)

    if (lastReportYear && lastReportYear < reportYear) {
      const dataToUpsert = {
        last_report_year: lastReportYear,
        employer_name: data.employer_name,
      }
      await patchData(EMPLOYER_TABLE_NAME, dataToUpsert)
    }

    await putData(ANNUAL_STATS_TABLE_NAME, statsDataToInsert)

    return response
  } catch (error) {
    console.error("Error processing S3 event:", error)
    return {
      statusCode: 500,
      body: {message: JSON.stringify("Error processing S3 event"), error},
    }
  }
}
