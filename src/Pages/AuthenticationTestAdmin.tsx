import { withAdminAuth } from "../HOC";

function AuthenticationTestAdmin() {
  return (
    <div>This page can be accessed if role of logged in user is ADMIN</div>
  );
}

export default withAdminAuth(AuthenticationTestAdmin);
