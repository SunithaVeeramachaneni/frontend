import Home from "@material-ui/icons/Home";
import Star from "@material-ui/icons/Star";
import Person from "@material-ui/icons/Person";
import Message from "@material-ui/icons/Message";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Dashboard from "@material-ui/icons/Dashboard";
import DateRangeIcon from '@material-ui/icons/DateRange';
import CreateIcon from '@material-ui/icons/Create';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import CategoryIcon from '@material-ui/icons/Category';
import SettingsIcon from '@material-ui/icons/Settings';


import DashboardPage from "./views/Dashboard/Dashboard.js";
import UserProfile from "./views/UserProfile/UserProfile.js";
import TableList from "./views/TableList/TableList.js";
import Typography from "./views/Typography/Typography.js";
import Icons from "./views/Icons/Icons.js";
import Maps from "./views/Maps/Maps.js";
import NotificationsPage from "./views/Notifications/Notifications.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Home,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Insights",
    icon: Star,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "ROI Forecasting",
    icon: Person,
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Chatter",
    icon: Message,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "IOT and Alerts",
    icon: NotificationsActiveIcon,
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maintenance Control Center",
    icon: Dashboard,
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Planning & Scheduling",
    icon: DateRangeIcon,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Work Instructions Authoring",
    icon: CreateIcon,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Operator Rounds",
    icon: Brightness1Icon,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Paperless Operations",
    icon: CheckBoxOutlineBlankIcon,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Asset Tracker",
    icon: ChangeHistoryIcon,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Warehouse 360°",
    icon: CategoryIcon,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Configure CWP",
    icon: SettingsIcon,
    component: NotificationsPage,
    layout: "/admin"
  },
];

export default dashboardRoutes;
