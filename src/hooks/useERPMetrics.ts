import { useMemo } from 'react';
import { useERPEntities } from './useERP';

export interface FinancialMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  accounts: Array<{
    id: string;
    name: string;
    balance: number;
    type: string;
  }>;
}

export interface SalesMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  activeCustomers: number;
  newLeads: number;
  conversionRate: number;
  pipelineValue: number;
  salesPipeline: Array<{
    stage: string;
    count: number;
    value: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    revenue: number;
    status: string;
    contact: string;
  }>;
}

export interface HRMetrics {
  totalEmployees: number;
  newHires: number;
  openPositions: number;
  avgSalary: number;
  departments: Array<{
    name: string;
    count: number;
    budget: number;
  }>;
}

export interface ManufacturingMetrics {
  totalProduction: number;
  efficiency: number;
  activeLines: number;
  totalLines: number;
  qualityRate: number;
  downtime: number;
  productionLines: Array<{
    id: string;
    name: string;
    status: string;
    efficiency: number;
    output: number;
    target: number;
    product: string;
  }>;
  workOrders: Array<{
    id: string;
    product: string;
    quantity: number;
    completed: number;
    status: string;
    priority: string;
    dueDate: string;
  }>;
}

export interface SupplyChainMetrics {
  activeShipments: number;
  onTimeDelivery: number;
  totalRoutes: number;
  avgTransitTime: number;
  costPerMile: number;
  shipments: Array<{
    id: string;
    origin: string;
    destination: string;
    status: string;
    progress: number;
    eta: string;
    cargo: string;
  }>;
  warehouses: Array<{
    id: string;
    name: string;
    location: string;
    capacity: number;
    utilization: number;
    inventory: number;
  }>;
}

export interface ProcurementMetrics {
  totalSpend: number;
  monthlyReduction: number;
  pendingOrders: number;
  activeSuppliers: number;
  avgDeliveryTime: number;
  costSavings: number;
  purchaseOrders: Array<{
    id: string;
    supplier: string;
    amount: number;
    status: string;
    date: string;
    category: string;
  }>;
  suppliers: Array<{
    id: string;
    name: string;
    rating: number;
    onTime: number;
    quality: number;
    spend: number;
  }>;
}

export interface OperationsMetrics {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  inventory: {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    value: number;
  };
  processes: Array<{
    id: string;
    name: string;
    status: string;
    efficiency: number;
    avgTime: string;
  }>;
}

// Helper function to safely extract entity data
const extractEntityData = (entity: any) => {
  return entity?.entity_data || {};
};

export const useFinancialMetrics = (organizationId: string): { metrics: FinancialMetrics; isLoading: boolean } => {
  const { entities: transactions, isLoading: transactionsLoading } = useERPEntities(
    organizationId,
    'financial',
    'transaction'
  );
  const { entities: accounts, isLoading: accountsLoading } = useERPEntities(
    organizationId,
    'financial',
    'account'
  );

  const metrics = useMemo(() => {
    const revenue = transactions
      .filter((t: any) => extractEntityData(t).type === 'income')
      .reduce((sum: number, t: any) => sum + (extractEntityData(t).amount || 0), 0);
    
    const expenses = transactions
      .filter((t: any) => extractEntityData(t).type === 'expense')
      .reduce((sum: number, t: any) => sum + Math.abs(extractEntityData(t).amount || 0), 0);

    const accountsList = accounts.map((a: any) => ({
      id: a.id,
      name: extractEntityData(a).name || 'Unnamed Account',
      balance: extractEntityData(a).balance || 0,
      type: extractEntityData(a).type || 'checking'
    }));

    const totalBalance = accountsList.reduce((sum, a) => sum + a.balance, 0);

    return {
      revenue,
      expenses,
      profit: revenue - expenses,
      cashFlow: totalBalance,
      accounts: accountsList
    };
  }, [transactions, accounts]);

  return {
    metrics,
    isLoading: transactionsLoading || accountsLoading
  };
};

export const useSalesMetrics = (organizationId: string): { metrics: SalesMetrics; isLoading: boolean } => {
  const { entities: customers, isLoading: customersLoading } = useERPEntities(
    organizationId,
    'sales',
    'customer'
  );
  const { entities: leads, isLoading: leadsLoading } = useERPEntities(
    organizationId,
    'sales',
    'lead'
  );
  const { entities: deals, isLoading: dealsLoading } = useERPEntities(
    organizationId,
    'sales',
    'deal'
  );

  const metrics = useMemo(() => {
    const activeCustomers = customers.filter((c: any) => extractEntityData(c).status === 'active').length;
    const totalRevenue = customers.reduce((sum: number, c: any) => sum + (extractEntityData(c).revenue || 0), 0);
    const newLeads = leads.filter((l: any) => {
      const createdAt = new Date(l.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt >= thirtyDaysAgo;
    }).length;

    // Calculate pipeline by stage
    const pipelineStages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closing'];
    const salesPipeline = pipelineStages.map(stage => {
      const stageDeals = deals.filter((d: any) => extractEntityData(d).stage === stage);
      return {
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        count: stageDeals.length,
        value: stageDeals.reduce((sum: number, d: any) => sum + (extractEntityData(d).value || 0), 0)
      };
    });

    const pipelineValue = salesPipeline.reduce((sum, s) => sum + s.value, 0);
    const convertedLeads = leads.filter((l: any) => extractEntityData(l).status === 'converted').length;
    const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

    const topCustomers = customers
      .map((c: any) => ({
        id: c.id,
        name: extractEntityData(c).name || 'Unknown',
        revenue: extractEntityData(c).revenue || 0,
        status: extractEntityData(c).status || 'active',
        contact: extractEntityData(c).contact || ''
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue,
      monthlyGrowth: 0, // Would need historical data to calculate
      activeCustomers,
      newLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      pipelineValue,
      salesPipeline,
      topCustomers
    };
  }, [customers, leads, deals]);

  return {
    metrics,
    isLoading: customersLoading || leadsLoading || dealsLoading
  };
};

export const useHRMetrics = (organizationId: string): { metrics: HRMetrics; isLoading: boolean } => {
  const { entities: employees, isLoading: employeesLoading } = useERPEntities(
    organizationId,
    'hr',
    'employee'
  );
  const { entities: positions, isLoading: positionsLoading } = useERPEntities(
    organizationId,
    'hr',
    'position'
  );
  const { entities: departments, isLoading: deptsLoading } = useERPEntities(
    organizationId,
    'hr',
    'department'
  );

  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    
    // Count new hires in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = employees.filter((e: any) => {
      const hireDate = new Date(extractEntityData(e).start_date || e.created_at);
      return hireDate >= thirtyDaysAgo;
    }).length;

    const openPositions = positions.filter((p: any) => extractEntityData(p).status === 'open').length;

    const salaries = employees.map((e: any) => extractEntityData(e).salary || 0).filter((s: number) => s > 0);
    const avgSalary = salaries.length > 0 
      ? Math.round(salaries.reduce((sum: number, s: number) => sum + s, 0) / salaries.length)
      : 0;

    // Group employees by department
    const deptMap = new Map<string, { count: number; budget: number }>();
    employees.forEach((e: any) => {
      const dept = extractEntityData(e).department || 'Unassigned';
      const current = deptMap.get(dept) || { count: 0, budget: 0 };
      deptMap.set(dept, {
        count: current.count + 1,
        budget: current.budget + (extractEntityData(e).salary || 0)
      });
    });

    const departmentsList = Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      budget: data.budget
    }));

    return {
      totalEmployees,
      newHires,
      openPositions,
      avgSalary,
      departments: departmentsList
    };
  }, [employees, positions, departments]);

  return {
    metrics,
    isLoading: employeesLoading || positionsLoading || deptsLoading
  };
};

export const useManufacturingMetrics = (organizationId: string): { metrics: ManufacturingMetrics; isLoading: boolean } => {
  const { entities: workOrders, isLoading: ordersLoading } = useERPEntities(
    organizationId,
    'manufacturing',
    'work_order'
  );
  const { entities: productionLines, isLoading: linesLoading } = useERPEntities(
    organizationId,
    'manufacturing',
    'production_line'
  );

  const metrics = useMemo(() => {
    const lines = productionLines.map((l: any) => ({
      id: l.id,
      name: extractEntityData(l).name || 'Unknown Line',
      status: extractEntityData(l).status || 'stopped',
      efficiency: extractEntityData(l).efficiency || 0,
      output: extractEntityData(l).output || 0,
      target: extractEntityData(l).target || 100,
      product: extractEntityData(l).product || 'Unknown'
    }));

    const activeLines = lines.filter(l => l.status === 'running').length;
    const totalLines = lines.length || 1;
    const avgEfficiency = lines.length > 0
      ? Math.round(lines.reduce((sum, l) => sum + l.efficiency, 0) / lines.length * 10) / 10
      : 0;
    const totalProduction = lines.reduce((sum, l) => sum + l.output, 0);
    const downtime = Math.round((1 - activeLines / totalLines) * 100 * 10) / 10;

    const orders = workOrders.map((o: any) => ({
      id: extractEntityData(o).order_id || o.id.slice(0, 8),
      product: extractEntityData(o).product || 'Unknown',
      quantity: extractEntityData(o).quantity || 0,
      completed: extractEntityData(o).completed || 0,
      status: extractEntityData(o).status || 'pending',
      priority: extractEntityData(o).priority || 'medium',
      dueDate: extractEntityData(o).due_date || ''
    }));

    const completedUnits = orders.reduce((sum, o) => sum + o.completed, 0);
    const totalUnits = orders.reduce((sum, o) => sum + o.quantity, 0);
    const qualityRate = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100 * 10) / 10 : 100;

    return {
      totalProduction,
      efficiency: avgEfficiency,
      activeLines,
      totalLines,
      qualityRate,
      downtime,
      productionLines: lines,
      workOrders: orders
    };
  }, [workOrders, productionLines]);

  return {
    metrics,
    isLoading: ordersLoading || linesLoading
  };
};

export const useSupplyChainMetrics = (organizationId: string): { metrics: SupplyChainMetrics; isLoading: boolean } => {
  const { entities: shipments, isLoading: shipmentsLoading } = useERPEntities(
    organizationId,
    'supply_chain',
    'shipment'
  );
  const { entities: warehouses, isLoading: warehousesLoading } = useERPEntities(
    organizationId,
    'supply_chain',
    'warehouse'
  );

  const metrics = useMemo(() => {
    const shipmentsList = shipments.map((s: any) => ({
      id: extractEntityData(s).shipment_id || s.id.slice(0, 8),
      origin: extractEntityData(s).origin || 'Unknown',
      destination: extractEntityData(s).destination || 'Unknown',
      status: extractEntityData(s).status || 'pending',
      progress: extractEntityData(s).progress || 0,
      eta: extractEntityData(s).eta || '',
      cargo: extractEntityData(s).cargo || 'General'
    }));

    const activeShipments = shipmentsList.filter(s => s.status === 'in_transit').length;
    const deliveredOnTime = shipmentsList.filter(s => 
      s.status === 'delivered' && extractEntityData(s).on_time !== false
    ).length;
    const totalDelivered = shipmentsList.filter(s => s.status === 'delivered').length;
    const onTimeDelivery = totalDelivered > 0 
      ? Math.round((deliveredOnTime / totalDelivered) * 100 * 10) / 10
      : 100;

    const warehousesList = warehouses.map((w: any) => ({
      id: w.id,
      name: extractEntityData(w).name || 'Unknown Warehouse',
      location: extractEntityData(w).location || 'Unknown',
      capacity: extractEntityData(w).capacity || 0,
      utilization: extractEntityData(w).utilization || 0,
      inventory: extractEntityData(w).inventory || 0
    }));

    return {
      activeShipments,
      onTimeDelivery,
      totalRoutes: new Set(shipmentsList.map(s => `${s.origin}-${s.destination}`)).size,
      avgTransitTime: 3.2, // Would need historical data
      costPerMile: 2.45, // Would need cost data
      shipments: shipmentsList,
      warehouses: warehousesList
    };
  }, [shipments, warehouses]);

  return {
    metrics,
    isLoading: shipmentsLoading || warehousesLoading
  };
};

export const useProcurementMetrics = (organizationId: string): { metrics: ProcurementMetrics; isLoading: boolean } => {
  const { entities: purchaseOrders, isLoading: ordersLoading } = useERPEntities(
    organizationId,
    'procurement',
    'purchase_order'
  );
  const { entities: suppliers, isLoading: suppliersLoading } = useERPEntities(
    organizationId,
    'procurement',
    'supplier'
  );

  const metrics = useMemo(() => {
    const orders = purchaseOrders.map((o: any) => ({
      id: extractEntityData(o).order_id || o.id.slice(0, 8),
      supplier: extractEntityData(o).supplier || 'Unknown',
      amount: extractEntityData(o).amount || 0,
      status: extractEntityData(o).status || 'pending',
      date: extractEntityData(o).date || '',
      category: extractEntityData(o).category || 'General'
    }));

    const suppliersList = suppliers.map((s: any) => ({
      id: s.id,
      name: extractEntityData(s).name || 'Unknown',
      rating: extractEntityData(s).rating || 0,
      onTime: extractEntityData(s).on_time_rate || 0,
      quality: extractEntityData(s).quality_rate || 0,
      spend: extractEntityData(s).total_spend || 0
    }));

    const totalSpend = orders.reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const activeSuppliers = suppliersList.length;

    return {
      totalSpend,
      monthlyReduction: 0, // Would need historical data
      pendingOrders,
      activeSuppliers,
      avgDeliveryTime: 5, // Would need delivery data
      costSavings: 0, // Would need budget data
      purchaseOrders: orders,
      suppliers: suppliersList
    };
  }, [purchaseOrders, suppliers]);

  return {
    metrics,
    isLoading: ordersLoading || suppliersLoading
  };
};

export const useOperationsMetrics = (organizationId: string): { metrics: OperationsMetrics; isLoading: boolean } => {
  const { entities: orders, isLoading: ordersLoading } = useERPEntities(
    organizationId,
    'operations',
    'order'
  );
  const { entities: inventory, isLoading: inventoryLoading } = useERPEntities(
    organizationId,
    'operations',
    'inventory_item'
  );

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => extractEntityData(o).status === 'pending').length;
    const shippedOrders = orders.filter((o: any) => extractEntityData(o).status === 'shipped').length;
    const completedOrders = orders.filter((o: any) => extractEntityData(o).status === 'completed').length;

    const totalItems = inventory.length;
    const lowStock = inventory.filter((i: any) => {
      const qty = extractEntityData(i).quantity || 0;
      const threshold = extractEntityData(i).low_stock_threshold || 10;
      return qty > 0 && qty <= threshold;
    }).length;
    const outOfStock = inventory.filter((i: any) => (extractEntityData(i).quantity || 0) === 0).length;
    const inventoryValue = inventory.reduce((sum: number, i: any) => {
      const qty = extractEntityData(i).quantity || 0;
      const price = extractEntityData(i).unit_price || 0;
      return sum + (qty * price);
    }, 0);

    return {
      totalOrders,
      pendingOrders,
      shippedOrders,
      completedOrders,
      inventory: {
        totalItems,
        lowStock,
        outOfStock,
        value: inventoryValue
      },
      processes: []
    };
  }, [orders, inventory]);

  return {
    metrics,
    isLoading: ordersLoading || inventoryLoading
  };
};

export interface ProjectMetrics {
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalSpent: number;
  avgCompletion: number;
  onTimeRate: number;
  projects: Array<{
    id: string;
    name: string;
    manager: string;
    status: string;
    progress: number;
    budget: number;
    spent: number;
    startDate: string;
    endDate: string;
    team: number;
  }>;
  milestones: Array<{
    id: string;
    project: string;
    milestone: string;
    dueDate: string;
    status: string;
  }>;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    projects: number;
    utilization: number;
  }>;
}

export const useProjectMetrics = (organizationId: string): { metrics: ProjectMetrics; isLoading: boolean } => {
  const { entities: projects, isLoading: projectsLoading } = useERPEntities(
    organizationId,
    'project',
    'project'
  );
  const { entities: milestones, isLoading: milestonesLoading } = useERPEntities(
    organizationId,
    'project',
    'milestone'
  );
  const { entities: members, isLoading: membersLoading } = useERPEntities(
    organizationId,
    'project',
    'team_member'
  );

  const metrics = useMemo(() => {
    const projectsList = projects.map((p: any) => ({
      id: p.id,
      name: extractEntityData(p).name || 'Untitled Project',
      manager: extractEntityData(p).manager || 'Unassigned',
      status: extractEntityData(p).status || 'active',
      progress: extractEntityData(p).progress || 0,
      budget: extractEntityData(p).budget || 0,
      spent: extractEntityData(p).spent || 0,
      startDate: extractEntityData(p).start_date || '',
      endDate: extractEntityData(p).end_date || '',
      team: extractEntityData(p).team_size || 0
    }));

    const activeProjects = projectsList.filter(p => p.status === 'active').length;
    const completedProjects = projectsList.filter(p => p.status === 'completed').length;
    const totalBudget = projectsList.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projectsList.reduce((sum, p) => sum + p.spent, 0);
    const avgCompletion = projectsList.length > 0
      ? Math.round(projectsList.reduce((sum, p) => sum + p.progress, 0) / projectsList.length)
      : 0;
    const onTimeProjects = projectsList.filter(p => {
      if (!p.endDate) return true;
      return p.status === 'completed' || new Date(p.endDate) >= new Date();
    }).length;
    const onTimeRate = projectsList.length > 0
      ? Math.round((onTimeProjects / projectsList.length) * 100)
      : 100;

    const milestonesList = milestones.map((m: any) => ({
      id: m.id,
      project: extractEntityData(m).project || 'Unknown',
      milestone: extractEntityData(m).title || 'Untitled',
      dueDate: extractEntityData(m).due_date || '',
      status: extractEntityData(m).status || 'pending'
    }));

    const membersList = members.map((m: any) => ({
      id: m.id,
      name: extractEntityData(m).name || 'Unknown',
      role: extractEntityData(m).role || 'Member',
      projects: extractEntityData(m).project_count || 0,
      utilization: extractEntityData(m).utilization || 0
    }));

    return {
      activeProjects,
      completedProjects,
      totalBudget,
      totalSpent,
      avgCompletion,
      onTimeRate,
      projects: projectsList,
      milestones: milestonesList,
      teamMembers: membersList
    };
  }, [projects, milestones, members]);

  return {
    metrics,
    isLoading: projectsLoading || milestonesLoading || membersLoading
  };
};

// Generic industry metrics hook for all industry modules
export interface IndustryMetricsData {
  entityCount: number;
  entities: any[];
  isLoading: boolean;
}

export const useIndustryEntities = (
  organizationId: string,
  moduleKey: string,
  entityType?: string
): IndustryMetricsData => {
  const { entities, isLoading } = useERPEntities(organizationId, moduleKey, entityType);
  return {
    entityCount: entities.length,
    entities,
    isLoading
  };
};
