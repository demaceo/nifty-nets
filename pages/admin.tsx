import { GetServerSideProps } from "next";
import WebsiteForm from "@/components/WebsiteForm";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Admin Dashboard
        </h1>
        <WebsiteForm />
      </div>
    </div>
  );
}
