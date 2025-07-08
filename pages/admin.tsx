import { GetServerSideProps } from "next";
import WebsiteForm from "@/components/WebsiteForm";
import Home from "./index";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { key } = ctx.query;
  if (key !== process.env.ADMIN_KEY) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return { props: {} };
};

export default function AdminPage() {
  return (
    <div className="admin-container">
      <div className="admin-wrapper">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          {/* <p className="text-gray-600 text-sm sm:text-base">
            Add new websites to your collection
          </p> */}
        </div>

        <div className="card">
          <WebsiteForm />
        </div>
        <div className="user-view">
          {/* <h2 className="text-2xl font-semibold mb-4">User View</h2> */}
          <Home />
        </div>
      </div>
    </div>
  );
}
