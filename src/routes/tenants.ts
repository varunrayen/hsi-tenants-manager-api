import { Router } from 'express';
import { TenantController } from '../controllers/tenant-controller';
import { validateCreateTenant, validateUpdateTenant } from '../middleware/validation';
import { requireTenantManagementPermission } from '../middleware/auth';

const router = Router();
const tenantController = new TenantController();

router.post('/', requireTenantManagementPermission, validateCreateTenant, tenantController.createTenant);
router.get('/', tenantController.getAllTenants);
router.get('/:id', tenantController.getTenantById);
router.get('/:id/audits', tenantController.getAuditHistory);
router.put('/:id', requireTenantManagementPermission, validateUpdateTenant, tenantController.updateTenant);
router.delete('/:id', requireTenantManagementPermission, tenantController.deleteTenant);
router.post('/:tenantId/setup/warehouse', tenantController.setupDefaultWarehouse);
router.post('/:tenantId/setup/customer', tenantController.setupDefaultCustomer);
router.post('/:tenantId/setup/superadmin', tenantController.setupDefaultSuperAdmin);
router.post('/:tenantId/setup/entities', tenantController.setupDefaultEntityTypes);
router.get('/:tenantId/onboarding/progress', tenantController.getTenantOnboardingProgress);

export default router;
