import axios from "axios";
import type { CreateUserDto, UpdateUserDto, UserResponseDto } from "shared";
export const useUser = () => {
  const api = axios.create({
    baseURL: "http://localhost:3001/users",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const createUser = async (data: CreateUserDto): Promise<UserResponseDto> => {
    const response = await api.post("/", data);
    return response.data;
  };

  const updateUser = async (
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> => {
    const response = await api.put(`/${userId}`, data);
    return response.data;
  };

  const deleteUser = async (userId: string): Promise<void> => {
    await api.delete(`/${userId}`);
  };

  const getUser = async (userId: string): Promise<UserResponseDto> => {
    const response = await api.get(`/${userId}`);
    return response.data;
  };

  const getUsersByCompany = async (
    companyId: string,
  ): Promise<UserResponseDto> => {
    const response = await api.get(`/company/${companyId}`);
    return response.data;
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUsersByCompany,
  };
};
