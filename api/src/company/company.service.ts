import { getCompanies } from "./company.repository";

export const getAllCompanies = async () => {
  return getCompanies();
};
