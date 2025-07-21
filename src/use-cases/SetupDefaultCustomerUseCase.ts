import { CustomerService } from '../services';
import { IUseCase, UseCaseResponse } from './BaseUseCase';
import { ICustomer } from '../types';

interface SetupDefaultCustomerRequest {
  tenantId: string;
}

export class SetupDefaultCustomerUseCase implements IUseCase<SetupDefaultCustomerRequest, UseCaseResponse<ICustomer>> {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  async execute(request: SetupDefaultCustomerRequest): Promise<UseCaseResponse<ICustomer>> {
    try {
      const { tenantId } = request;

      const defaultCustomerData = {
        name: "Default",
        code: "DEF",
        tenant: tenantId,
        isDefault: true,
        warehouses: [],
        currency: "$",
        currentBillingProfile: null,
        active: true,
        metaData: {
          ticket: "HOP-5833"
        },
        settings: {
          workflows: {
            inbound: {
              enabled: true
            }
          }
        }
      };

      const customer = await this.customerService.create(defaultCustomerData);

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