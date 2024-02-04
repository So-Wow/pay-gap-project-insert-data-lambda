export const statsPropertyKeys = [
  "employer_id",
  "company_number",
  "diff_mean_hourly_percent",
  "diff_median_hourly_percent",
  "diff_mean_bonus_percent",
  "diff_median_bonus_percent",
  "male_bonus_percent",
  "female_bonus_percent",
  "male_lower_quartile",
  "female_lower_quartile",
  "male_lower_middle_quartile",
  "female_lower_middle_quartile",
  "male_upper_middle_quartile",
  "female_upper_middle_quartile",
  "male_top_quartile",
  "female_top_quartile",
  "report_year",
]

export const companyPropertyKeys = [
  "employer_name",
  "employer_id",
  "company_number",
  "current_name",
  "last_report_year",
]

export const employerHistoryKeys = [
  "employer_name",
  "employer_id",
  "address",
  "post_code",
  "company_number",
  "sic_codes",
  "company_link_to_gpginfo",
  "employer_size",
  "current_name",
  "last_report_year",
]

export const EMPLOYER_TABLE_NAME = "companies"

export const ANNUAL_STATS_TABLE_NAME = "annual_report_stats"

export const EMPLOYER_HISTORY_TABLE_NAME = "companies_history"
