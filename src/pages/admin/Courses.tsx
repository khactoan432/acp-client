import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

const AdminCourse = () => {
  return (
    <div className="flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        {/* content */}
        <div>
          <h1>Welcome to Admin Course</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminCourse;
