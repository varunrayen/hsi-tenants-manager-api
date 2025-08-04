import { CustomerService } from '../services';
import RegionalServiceFactory from '../services/regional-service-factory';
import { IUseCase, UseCaseResponse } from './base';
import { ICustomer } from '../types';

interface SetupDefaultCustomerRequest {
  tenantId: string;
  warehouses?: string[];
  region?: string;
}

export class SetupDefaultCustomerUseCase implements IUseCase<SetupDefaultCustomerRequest, UseCaseResponse<ICustomer>> {
  private regionalFactory: RegionalServiceFactory;

  constructor() {
    this.regionalFactory = RegionalServiceFactory.getInstance();
  }

  async execute(request: SetupDefaultCustomerRequest): Promise<UseCaseResponse<ICustomer>> {
    try {
      const { tenantId, warehouses, region } = request;

      // Get the appropriate customer service based on region
      const customerService = region 
        ? await this.regionalFactory.getCustomerService(region)
        : new CustomerService();

      const defaultCustomerData = {
        name: "Default",
        code: "DEF",
        tenant: tenantId,
        isDefault: true,
        warehouses: warehouses || [],
        currency: "$",
        currentBillingProfile: null,
        active: true,
        settings: {
          workflows: {
            inbound: {
              enabled: true
            },
            outbound: {
              enabled: true
            }
          }
        }
      };

      const customer = await customerService.create(defaultCustomerData);

      return {
        success: true,
        data: customer
      };
    } catch (error) {
      console.error('Error setting up default customer:', error);
      return {
        success: false,
        error: 'Failed to setup default customer'
      };
    }
  }
}