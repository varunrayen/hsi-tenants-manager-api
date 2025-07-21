import { EntityTypeService } from '../services';
import { IUseCase, UseCaseResponse } from './BaseUseCase';
import { IEntityType } from '../types';

interface SetupDefaultEntityTypesRequest {
  tenantId: string;
}

interface SetupEntityTypesResponse {
  adminRole: IEntityType;
  associateRole: IEntityType;
}

export class SetupDefaultEntityTypesUseCase implements IUseCase<SetupDefaultEntityTypesRequest, UseCaseResponse<SetupEntityTypesResponse>> {
  private entityTypeService: EntityTypeService;

  constructor() {
    this.entityTypeService = new EntityTypeService();
  }

  async execute(request: SetupDefaultEntityTypesRequest): Promise<UseCaseResponse<SetupEntityTypesResponse>> {
    try {
      const { tenantId } = request;

      // Admin role data based on sample schema
      const adminRoleData = {
        name: "ADMIN",
        entityParent: "USER_ROLE",
        attributes: {
          permissionOptions: [
            {
              name: "Dashboard",
              href: "/dashboard",
              selectedImage: "warehouse_selected.png",
              unselectedImage: "warehouse_unselected.png",
              type: "INTRINSIC",
              children: [
                {
                  name: "Orders",
                  href: "/dashboard/orders",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Inventory",
                  href: "/dashboard/inventory",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Space Management",
                  href: "/dashboard/spaceManagement",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            },
            {
              name: "Notifications",
              href: "/notifications",
              selectedImage: "integrations_selected.png",
              unselectedImage: "integrations_unselected.png",
              readable: true,
              writable: true
            },
            {
              name: "Outbound Logistics",
              selectedImage: "warehouse_selected.png",
              unselectedImage: "warehouse_unselected.png",
              children: [
                {
                  name: "Order management",
                  href: "/orders",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Exceptions",
                  href: "/outboundExceptions",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Operations",
                  href: "/outbound",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            },
            {
              name: "Inbound Logistics",
              selectedImage: "warehouse_selected.png",
              unselectedImage: "warehouse_unselected.png",
              children: [
                {
                  name: "Consignments",
                  href: "/consignments",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Operations",
                  href: "/inbound",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            },
            {
              name: "Inventory",
              selectedImage: "integrations_selected.png",
              unselectedImage: "integrations_unselected.png",
              children: [
                {
                  name: "Stock Ledger",
                  href: "/inventoryLedger",
                  selectedImage: "integrations_selected.png",
                  unselectedImage: "integrations_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Cycle Count",
                  href: "/cycle-count-plans",
                  selectedImage: "users_selected.png",
                  unselectedImage: "users_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Stock Transfer",
                  href: "/stockTransfer",
                  selectedImage: "users_selected.png",
                  unselectedImage: "users_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            },
            {
              name: "Setup",
              selectedImage: "stations_selected.png",
              unselectedImage: "stations_unselected.png",
              children: [
                {
                  name: "Warehouse Management",
                  href: "/warehouses",
                  selectedImage: "users_selected.png",
                  unselectedImage: "users_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Client Management",
                  href: "/customers",
                  selectedImage: "users_selected.png",
                  unselectedImage: "users_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "User Management",
                  href: "/users",
                  selectedImage: "users_selected.png",
                  unselectedImage: "users_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Integration Management",
                  href: "/integrations",
                  selectedImage: "integrations_selected.png",
                  unselectedImage: "integrations_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Workflow Management",
                  href: "/workflows",
                  selectedImage: "workflow_selected.png",
                  unselectedImage: "workflow_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            }
          ]
        },
        customers: null,
        warehouses: null,
        subEntityParents: null,
        code: "ADM",
        tenant: tenantId
      };

      // Associate role data based on sample schema (simplified version)
      const associateRoleData = {
        name: "ASSOCIATE",
        entityParent: "USER_ROLE",
        attributes: {
          permissionOptions: [
            {
              name: "Dashboard",
              href: "/dashboard",
              selectedImage: "warehouse_selected.png",
              unselectedImage: "warehouse_unselected.png",
              type: "INTRINSIC",
              children: [
                {
                  name: "Orders",
                  href: "/dashboard/orders",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Inventory",
                  href: "/dashboard/inventory",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            },
            {
              name: "Outbound Logistics",
              selectedImage: "warehouse_selected.png",
              unselectedImage: "warehouse_unselected.png",
              children: [
                {
                  name: "Order management",
                  href: "/orders",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Operations",
                  href: "/outbound",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            },
            {
              name: "Inbound Logistics",
              selectedImage: "warehouse_selected.png",
              unselectedImage: "warehouse_unselected.png",
              children: [
                {
                  name: "Consignments",
                  href: "/consignments",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                },
                {
                  name: "Operations",
                  href: "/inbound",
                  selectedImage: "orders_selected.png",
                  unselectedImage: "orders_unselected.png",
                  readable: true,
                  writable: true
                }
              ]
            }
          ]
        },
        customers: null,
        warehouses: null,
        subEntityParents: null,
        code: null,
        tenant: tenantId
      };

      // Create both roles
      const adminRole = await this.entityTypeService.create(adminRoleData);
      const associateRole = await this.entityTypeService.create(associateRoleData);

      return {
        success: true,
        data: {
          adminRole,
          associateRole
        }
      };
    } catch (error) {
      console.error('Error setting up default entity types:', error);
      return {
        success: false,
        error: 'Failed to setup default entity types'
      };
    }
  }
}