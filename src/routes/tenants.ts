import { Router } from 'express';
import { TenantController } from '../controllers/tenantController';
import { validateCreateTenant, validateUpdateTenant } from '../middleware/validation';

const router = Router();
const tenantController = new TenantController();

router.post('/', validateCreateTenant, tenantController.createTenant);
router.get('/', tenantController.getAllTenants);
router.get('/:id', tenantController.getTenantById);
router.put('/:id', validateUpdateTenant, tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);
router.post('/:tenantId/setup/warehouse', tenantController.setupDefaultWarehouse);

export default router;