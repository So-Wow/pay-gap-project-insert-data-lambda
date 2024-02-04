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

    await patchData(
      EMPLOYER_HISTORY_TABLE_NAME,
      companyHistoryDataToInsert,
      data.CompanyNumber
    )

    if (lastReportYear && lastReportYear < reportYear) {
      const companyRecordDataToUpdate = {
        last_report_year: reportYear,
        employer_name: data.EmployerName,
        employer_id: data.EmployerId,
        company_number: data.CompanyNumber,
      }
      await patchData(
        EMPLOYER_TABLE_NAME,
        companyRecordDataToUpdate,
        data.CompanyNumber
      )
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
