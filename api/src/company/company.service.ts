import { toCompanyDTO } from "./company.dto";
import { getCompanies } from "./company.repository";

export const getAllCompanies = () => {
  return getCompanies().map((companies) =>
    companies.map((company) => toCompanyDTO(company)),
  );
};
