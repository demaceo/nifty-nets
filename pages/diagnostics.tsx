import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      env: {
        nodeEnv: process.env.NODE_ENV || "unknown",
        hasDbUrl: !!process.env.DATABASE_URL,
        hasAdminKey: !!process.env.ADMIN_KEY,
        hasPublicAdminKey: !!process.env.NEXT_PUBLIC_ADMIN_KEY,
        dbUrlPreview: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.substring(0, 30) + "..."
          : "not set",
      },
    },
  };
};

export default function Diagnostics({
  env,
}: {
  env: {
    nodeEnv: string;
    hasDbUrl: boolean;
    hasAdminKey: boolean;
    hasPublicAdminKey: boolean;
    dbUrlPreview: string;
  };
}) {
  const testAPI = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}`);
      const data = await response.json();
      console.log(`${endpoint} response:`, response.status, data);
      alert(
        `${endpoint}: ${response.status} - ${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      console.error(`${endpoint} error:`, error);
      alert(`${endpoint} error: ${error}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Diagnostics</h1>

      <h2>Environment Variables</h2>
      <pre>{JSON.stringify(env, null, 2)}</pre>

      <h2>API Tests</h2>
      <button
        onClick={() => testAPI("simple")}
        style={{ margin: "5px", padding: "10px" }}
      >
        Test Simple API
      </button>
      <button
        onClick={() => testAPI("db-test")}
        style={{ margin: "5px", padding: "10px" }}
      >
        Test Database
      </button>
      <button
        onClick={() => testAPI("websites")}
        style={{ margin: "5px", padding: "10px" }}
      >
        Test Websites GET
      </button>

      <h2>Client-side Environment</h2>
      <p>
        NEXT_PUBLIC_ADMIN_KEY:{" "}
        {process.env.NEXT_PUBLIC_ADMIN_KEY ? "Present" : "Missing"}
      </p>
      <p>
        Window location:{" "}
        {typeof window !== "undefined" ? window.location.href : "Server-side"}
      </p>
    </div>
  );
}
