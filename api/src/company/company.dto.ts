import { CompanyResponseDto } from "shared";

import { Company } from "./company.repository";

export const toCompanyDTO = (company: Company): CompanyResponseDto => {
  const { id, name, createdAt, updatedAt } = company;
  return {
    id,
    name,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    address: `${company.address.street} ${company.address.streetNumber}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`,

    siteCount: company.sites.length,
    userCount: company.users.length,
  };
};
