import { SITE_STATUS } from "@prisma/prisma";
import { UserObject } from "types";

type Site = {
  id: string;
  name: string;
  priority?: string | null;
  status: SITE_STATUS;
  address: {
    streetNumber: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  companyId: string;
  startDate: null | Date;
  endDate: null | Date;
  notes: string | null;
  assignments: {
    lastVisited: Date | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  material: {
    id: string;
    name: string;
    unit: string;
    amount: number;
    threshold: number;
  }[];
};

export const toSiteDTO = (site: Site, user: UserObject) => {
  const totalDays =
    site.startDate && site.endDate
      ? Math.max(
          (new Date(site.endDate).getTime() -
            new Date(site.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
          1,
        )
      : 1;

  const elapsedDays = site.startDate
    ? Math.max(
        (Date.now() - new Date(site.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
        0,
      )
    : 0;

  const progress = Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
  return {
    id: site.id,
    name: site.name,
    address: `${site.address.streetNumber} ${site.address.street}, ${site.address.city}, ${site.address.country} ${site.address.postalCode}`,
    progress,
    //DUMMY DATA
    hoursLogged: 0,
    status: site.status,
    priority: site.priority ?? "medium",
    materialInfo: {
      total: site.material?.length ?? 0,
      warnings:
        site.material?.filter(
          (m: {
            id: string;
            name: string;
            unit: string;
            amount: number;
            threshold: number;
          }) => m.amount < m.threshold,
        ).length ?? 0,
    },
    material: site.material,
    //DUMMY DATA
    chat: {
      unreadCount: 0,
      lastMessage: "",
    },
    lastVisited: site.assignments.find(
      (assignment) => assignment.user.id === user.id,
    )?.lastVisited,
    assignments: site.assignments.map((assignment) => ({
      userId: assignment.user.id,
      firstName: assignment.user.firstName,
      lastName: assignment.user.lastName,
    })),
    endDate: site.endDate,
    startDate: site.startDate,
  };
};
