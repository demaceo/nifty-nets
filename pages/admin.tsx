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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Add new websites to your collection
          </p>
        </div>

        <div className="card">
          <WebsiteForm />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Website List</h2>
          <Home />
        </div>
      </div>
    </div>
  );
}
