export class AdminModel {
    constructor(
      public restaurantName: string = "",
      public phone: number = 0,
      public ownerName: string = ""
    ) {}
  }
  
  export class AdminEntity {
    constructor(
      public id: string | undefined = undefined,
      public restaurantName: string = "",
      public phone: number = 0,
      public ownerName: string = "",
      public createdAt: string
    ) {}
  }
  
  export class AdminMapper {
    static toEntity(
        adminData: any,
        includeId?: boolean,
        existingAdmin?: AdminEntity
      ): AdminEntity {
        if (existingAdmin != null) {
          return {
            ...existingAdmin,
            restaurantName:
            adminData.restaurantName !== undefined
                ? adminData.restaurantName
                : existingAdmin.restaurantName,
            phone:
            adminData.phone !== undefined
                ? adminData.phone
                : existingAdmin.phone,
            ownerName:
            adminData.ownerName !== undefined
                ? adminData.ownerName
                : existingAdmin.ownerName,
            createdAt:
            adminData.createdAt !== undefined
                ? adminData.createdAt
                : existingAdmin.createdAt,
          };
        } else {
          const adminEntity: AdminEntity = {
            id: includeId
              ? adminData._id
                ? adminData._id.toString()
                : undefined
              : undefined,
            restaurantName: adminData.restaurantName,
            phone: adminData.phone,
            ownerName: adminData.ownerName,
            createdAt: adminData.createdAt
          };
          return adminEntity;
        }
      }
    static toModel(admin: AdminEntity): any {
        return {
          restaurantName: admin.restaurantName,
          phone: admin.phone,
          ownerName: admin.ownerName
        };
      }
}