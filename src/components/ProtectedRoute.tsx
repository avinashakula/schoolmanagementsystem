import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
  permission: string;
};

export default function ProtectedRoute({ children, permission }: Props) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ admin can access all
  if (user.role?.toLowerCase() === "admin") {
    return children;
  }

  const permissions =
    typeof user.permissions === "string"
      ? JSON.parse(user.permissions)
      : user.permissions || [];

  // ✅ check permission
  if (!permissions.includes(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
