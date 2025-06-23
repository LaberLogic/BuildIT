import { ChainedError } from "@utils/chainedError";
import { ResultAsync } from "neverthrow";
import { CompanyResponseDto } from "shared";

import { toCompanyDTO } from "./company.dto";
import { Company, getCompanies } from "./company.repository";

/**
 * Retrieves all companies and maps them to DTOs using `ResultAsync`.
 * Admin only for now
 * @returns {ResultAsync<CompanyDTO[], ChainedError>} A ResultAsync containing either the mapped DTOs or an error.
 */
export const getAllCompanies = (): ResultAsync<
  CompanyResponseDto[],
  ChainedError
> => {
  return getCompanies().map((companies: Company[]) =>
    companies.map((company) => toCompanyDTO(company)),
  );
};
