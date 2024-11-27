import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

const AdminTeacher = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        {/* content */}
        <div>
          <h1>Welcome to Admin Teacher</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacher;
