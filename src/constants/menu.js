import { adminRoot } from "./config";
import { UserRole } from "../utils/auth.roles";

const data = [
  {
    id: "",
    icon: "iconsminds-shop",
    label: "menu.dashboard",
    permissions: ["read-dashboard"],
    to: `${adminRoot}`,
  },
];

export default data;
