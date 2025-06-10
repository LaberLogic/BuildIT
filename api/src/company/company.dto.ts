import { CompanyResponseDto } from "shared";

export const toCompanyDTO = (company: any): CompanyResponseDto => {
  const { id, name, createdAt, updatedAt } = company;
  console.log("here");
  return {
    id,
    name,
    createdAt,
    updatedAt,
    address: `${company.address.streetNumber} ${company.address.street}, ${company.address.city}, ${company.address.country} ${company.address.postalCode}`,

    siteCount: company.sites.length,
    userCount: company.users.length,
  };
};
