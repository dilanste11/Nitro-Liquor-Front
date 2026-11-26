import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';
import { roleGuard } from './core/guards/role/role.guard';

export const routes: Routes = [
  // ==========================================
  // ZONA PÚBLICA Y PERFIL DEL CLIENTE (Frontoffice)
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./shared/layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      // Acceso Libre
      { path: '', loadComponent: () => import('./features/ecommerce/home/home.component').then(m => m.HomeComponent) },
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'cart', loadComponent: () => import('./features/ecommerce/cart/cart.component').then(m => m.CartComponent) },
      { path: 'checkout/success/:id', loadComponent: () => import('./features/ecommerce/checkout-success/checkout-success.component').then(m => m.CheckoutSuccessComponent) },
      
      // Acceso Protegido (Solo usuarios logueados pueden gestionar sus direcciones)
      { 
        path: 'addresses', 
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/addresses/addresses.component').then(m => m.AddressesComponent) 

      },
      { 
        path: 'profile/orders', 
        loadComponent: () => import('./features/profile/orders/orders.component').then(m => m.OrdersComponent),
        canActivate: [authGuard] 
      },
      { 
        path: 'profile/settings', 
        loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [authGuard] 
      }
    ]
  },

  // ==========================================
  // ZONA ADMINISTRATIVA (Requieren login y rol específico)
  // ==========================================
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN', 'Trabajador'] },
    loadComponent: () => import('./shared/layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      // Dashboard (Acceso general para logueados con rol permitido)
      { path: '', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      
      // --- MÓDULOS DE INVENTARIO Y CATÁLOGO ---
      
      // Productos
      { path: 'products', loadComponent: () => import('./features/admin/products/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'products/new', loadComponent: () => import('./features/admin/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
      
      // Categorías
      { path: 'categories', loadComponent: () => import('./features/admin/categories/category-list/category-list.component').then(m => m.CategoryListComponent) },
      { path: 'categories/new', loadComponent: () => import('./features/admin/categories/category-form/category-form.component').then(m => m.CategoryFormComponent) },
      { path: 'categories/edit/:id', loadComponent: () => import('./features/admin/categories/category-form/category-form.component').then(m => m.CategoryFormComponent) },
      
      // Proveedores
      { path: 'providers', loadComponent: () => import('./features/admin/providers/provider-list/provider-list.component').then(m => m.ProviderListComponent) },
      { path: 'providers/new', loadComponent: () => import('./features/admin/providers/provider-form/provider-form.component').then(m => m.ProviderFormComponent) },
      { path: 'providers/edit/:id', loadComponent: () => import('./features/admin/providers/provider-form/provider-form.component').then(m => m.ProviderFormComponent) },

      // Inventario
      { path: 'inventory-audit', 
        loadComponent: () => import('./features/admin/inventory/inventory-audit/inventory-audit.component').then(m => m.InventoryAuditComponent),
        canActivate: [roleGuard], 
        data: { expectedRoles: ['ADMIN', 'Trabajador'] },
      },

      // --- MÓDULOS DE ADMINISTRACIÓN (Solo ADMIN) ---

      // Impuestos
      { 
        path: 'taxes', 
        loadComponent: () => import('./features/admin/taxes/tax-list/tax-list.component').then(m => m.TaxListComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] } // Nota: Ajustado a expectedRoles
      },
      { 
        path: 'taxes/new', 
        loadComponent: () => import('./features/admin/taxes/tax-form/tax-form.component').then(m => m.TaxFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'taxes/edit/:id', 
        loadComponent: () => import('./features/admin/taxes/tax-form/tax-form.component').then(m => m.TaxFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },

      // Métodos de pago
      { path: 'payment-forms',
        loadComponent: () => import('./features/admin/payment-forms/payment-form-list/payment-form-list.component').then(m => m.PaymentFormListComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] } 
      },
      { path: 'payment-forms/new',
        loadComponent: () => import('./features/admin/payment-forms/payment-form-form/payment-form-form.component').then(m => m.PaymentFormFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { path: 'payment-forms/edit/:id',
        loadComponent: () => import('./features/admin/payment-forms/payment-form-form/payment-form-form.component').then(m => m.PaymentFormFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] } 
      },
      
      // Roles
      { 
        path: 'roles', 
        loadComponent: () => import('./features/admin/roles/role-list/role-list.component').then(m => m.RoleListComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'roles/new', 
        loadComponent: () => import('./features/admin/roles/role-form/role-form.component').then(m => m.RoleFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'roles/edit/:id', 
        loadComponent: () => import('./features/admin/roles/role-form/role-form.component').then(m => m.RoleFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      
      // Usuarios
      { 
        path: 'users', 
        loadComponent: () => import('./features/admin/users/user-list/user-list.component').then(m => m.UserListComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'users/new', 
        loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'users/edit/:id', 
        loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },

      // Movimientos / Compras y ventas
      { 
        path: 'supplier-orders/new',
         loadComponent: () => import('./features/admin/supplier-orders/supplier-order-form/supplier-order-form.component').then(m => m.SupplierOrderFormComponent),
         canActivate: [roleGuard], data: { expectedRoles: ['ADMIN', 'Trabajador'] },
      },
      { 
        path: 'orders', 
        loadComponent: () => import('./features/admin/manage-orders/manage-orders.component').then(m => m.ManageOrdersComponent),
        canActivate: [roleGuard], 
        data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'movements',
        loadComponent: () => import('./features/admin/movements/movement-list/movement-list.component').then(m => m.MovementListComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
      path: 'movements/:id',
      loadComponent: () => import('./features/admin/movements/movement-detail/movement-detail.component').then(m => m.MovementDetailComponent),
      canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { path: 'pos',
        loadComponent: () => import('./features/admin/pos/pos-dashboard/pos-dashboard.component').then(m => m.PosDashboardComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN', 'Trabajador'] },
      },
      // Métodos de Envío
      { 
        path: 'shipping-methods', 
        loadComponent: () => import('./features/admin/shipping-methods/shipping-method-list/shipping-method-list.component').then(m => m.ShippingMethodListComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'shipping-methods/new', 
        loadComponent: () => import('./features/admin/shipping-methods/shipping-method-form/shipping-method-form.component').then(m => m.ShippingMethodFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      },
      { 
        path: 'shipping-methods/edit/:id', 
        loadComponent: () => import('./features/admin/shipping-methods/shipping-method-form/shipping-method-form.component').then(m => m.ShippingMethodFormComponent),
        canActivate: [roleGuard], data: { expectedRoles: ['ADMIN'] }
      }
    ]
  },
  
  // Ruta comodín
  { path: '**', redirectTo: '' }
];