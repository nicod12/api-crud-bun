import { t } from "elysia";
import { handleCreateUser, handleDeleteUser, handleGetAllUsers, handleGetUserById, handleUpdateUser } from "../utils/userHandlers";

export default (app: any) => {
  app
    .get("/api/users", async () => {
      return await handleGetAllUsers();
    })
    .get("/api/users/:id", async ({ params: { id }, set }: any) => {
      try {
        const user = await handleGetUserById(id);
        return user;
      } catch (error) {
        if (isHttpError(error)) {
          set.status = error.status;
          return error.message || "Internal Server Error";
        } else {
          set.status = 500;
          return "Internal Server Error";
        }
      }
    })
    .post("/api/users", async ({ body }: any) => {
      try {
        const { username, email, password  } = body;
        const newUser = await handleCreateUser(username, email, password);
        return newUser;
      } catch (error) {
        throw error;
      }
    }, { body: t.Object({ username: t.String(), password: t.String(), email: t.String(), }) })
    .put("/api/users/:id", async ({ body, params: { id } }: any) => {
      try {
        const { name, age, origin, admin } = body;
        const updatedUser = await handleUpdateUser(id, name, age, origin);
        return updatedUser;
      } catch (error) {
        throw error;
      }
    }, { body: t.Object({ username: t.String(), password: t.String(), email: t.String(), }) })
    .delete("/api/users/:id", async ({ params: { id } }: any) => {
      try {
        const deletedUser = await handleDeleteUser(id);
        return deletedUser;
      } catch (error) {
        throw error;
      }
    });
};


function isHttpError(error: any): error is { status: number, message?: string } {
  return typeof error === 'object' && error !== null && 'status' in error;
}
