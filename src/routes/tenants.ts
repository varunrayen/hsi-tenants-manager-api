import { Router } from 'express';
import { TenantController } from '../controllers/tenant-controller';
import { validateCreateTenant, validateUpdateTenant } from '../middleware/validation';

const router = Router();
const tenantController = new TenantController();

router.post('/', validateCreateTenant, tenantController.createTenant);
router.get('/', tenantController.getAllTenants);
router.get('/:id', tenantController.getTenantById);
router.get('/:id/audits', tenantController.getAuditHistory);
router.put('/:id', validateUpdateTenant, tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);
router.post('/:tenantId/setup/warehouse', tenantController.setupDefaultWarehouse);
router.post('/:tenantId/setup/customer', tenantController.setupDefaultCustomer);
router.post('/:tenantId/setup/superadmin', tenantController.setupDefaultSuperAdmin);
router.post('/:tenantId/setup/entities', tenantController.setupDefaultEntityTypes);
router.get('/:tenantId/onboarding/progress', tenantController.getTenantOnboardingProgress);

export default router;
