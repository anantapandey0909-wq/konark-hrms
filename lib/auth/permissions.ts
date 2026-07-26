import type { AuthRole } from "@/types/auth";

/**
 * Defines all available application permissions.
 * Every role receives a subset of these permissions.
 */
export interface RolePermissions {
  dashboard: boolean;

  employees: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };

  departments: {
    view: boolean;
    manage: boolean;
  };

  attendance: {
    view: boolean;
    mark: boolean;
    approve: boolean;
  };

  leave: {
    view: boolean;
    apply: boolean;
    approve: boolean;
  };

  payroll: {
    view: boolean;
    upload: boolean;
    generate: boolean;
    approve: boolean;
  };

  reports: {
    view: boolean;
    export: boolean;
  };

  settings: boolean;

  users: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

/**
 * Role based permission matrix.
 */
export const ROLE_PERMISSIONS: Record<AuthRole, RolePermissions> = {
  ADMIN: {
    dashboard: true,

    employees: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },

    departments: {
      view: true,
      manage: true,
    },

    attendance: {
      view: true,
      mark: true,
      approve: true,
    },

    leave: {
      view: true,
      apply: true,
      approve: true,
    },

    payroll: {
      view: true,
      upload: true,
      generate: true,
      approve: true,
    },

    reports: {
      view: true,
      export: true,
    },

    settings: true,

    users: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },

  HR: {
    dashboard: true,

    employees: {
      view: true,
      create: true,
      update: true,
      delete: false,
    },

    departments: {
      view: true,
      manage: false,
    },

    attendance: {
      view: true,
      mark: true,
      approve: true,
    },

    leave: {
      view: true,
      apply: true,
      approve: true,
    },

    payroll: {
      view: true,
      upload: true,
      generate: true,
      approve: false,
    },

    reports: {
      view: true,
      export: true,
    },

    settings: false,

    users: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
  },

  ACCOUNTANT: {
    dashboard: true,

    employees: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },

    departments: {
      view: true,
      manage: false,
    },

    attendance: {
      view: true,
      mark: false,
      approve: false,
    },

    leave: {
      view: true,
      apply: false,
      approve: false,
    },

    payroll: {
      view: true,
      upload: false,
      generate: true,
      approve: true,
    },

    reports: {
      view: true,
      export: true,
    },

    settings: false,

    users: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
  },

  MANAGER: {
    dashboard: true,

    employees: {
      view: true,
      create: false,
      update: true,
      delete: false,
    },

    departments: {
      view: true,
      manage: false,
    },

    attendance: {
      view: true,
      mark: false,
      approve: true,
    },

    leave: {
      view: true,
      apply: true,
      approve: true,
    },

    payroll: {
      view: true,
      upload: false,
      generate: false,
      approve: false,
    },

    reports: {
      view: true,
      export: false,
    },

    settings: false,

    users: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
  },

  SUPERVISOR: {
    dashboard: true,

    employees: {
      view: true,
      create: false,
      update: false,
      delete: false,
    },

    departments: {
      view: true,
      manage: false,
    },

    attendance: {
      view: true,
      mark: true,
      approve: false,
    },

    leave: {
      view: true,
      apply: true,
      approve: false,
    },

    payroll: {
      view: false,
      upload: false,
      generate: false,
      approve: false,
    },

    reports: {
      view: true,
      export: false,
    },

    settings: false,

    users: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
  },

  EMPLOYEE: {
    dashboard: true,

    employees: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },

    departments: {
      view: false,
      manage: false,
    },

    attendance: {
      view: true,
      mark: false,
      approve: false,
    },

    leave: {
      view: true,
      apply: true,
      approve: false,
    },

    payroll: {
      view: true,
      upload: false,
      generate: false,
      approve: false,
    },

    reports: {
      view: false,
      export: false,
    },

    settings: false,

    users: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
  },
};

/**
 * Returns permissions for a specific role.
 */
export function getPermissions(role: AuthRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}