import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const Dashboard2 = Loadable(lazy(() => import('views/dashboard2')));
const Alerts = Loadable(lazy(() => import('views/alerts')));
const AiInsights = Loadable(lazy(() => import('views/ai-insights')));
const Reports = Loadable(lazy(() => import('views/reports')));
const Settings = Loadable(lazy(() => import('views/settings')));
const Connectivity = Loadable(lazy(() => import('views/connectivity')));
const Plans = Loadable(lazy(() => import('views/plans')));
const Help = Loadable(lazy(() => import('views/help')));
const MyProfile = Loadable(lazy(() => import('views/my-profile')));
const Users = Loadable(lazy(() => import('views/users')));
const ScheduleMeet = Loadable(lazy(() => import('views/schedule-meeting')));

const MonitoringDetails = Loadable(lazy(() => import('views/monitoring-details')));
const MonitoringDetailsHistory = Loadable(lazy(() => import('views/monitoring-details-history')));

const UserRoles = Loadable(lazy(() => import('views/user-roles')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Dashboard2 />
    },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: '/dashboard0',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard',
      element: <Dashboard2 />
    },
    { path: 'alerts', element: <Alerts /> },
    { path: 'ai-insights', element: <AiInsights /> },
    { path: 'reports', element: <Reports /> },
    { path: 'settings', element: <Settings /> },
    { path: 'connectivity', element: <Connectivity /> },
    { path: 'plans', element: <Plans /> },
    { path: 'help', element: <Help /> },
    { path: 'my-profile', element: <MyProfile /> },
    { path: 'users', element: <Users /> },
    { path: 'schedule-meet', element: <ScheduleMeet /> },

    { path: '/rtmonitoring/:machineId', element: <MonitoringDetails /> },
    { path: '/himonitoring/:machineId', element: <MonitoringDetailsHistory /> },

    { path: '/user-roles', element: <UserRoles /> }
  ]
};

export default MainRoutes;
