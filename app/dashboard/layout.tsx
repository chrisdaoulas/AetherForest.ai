import SideNav from "../ui/dashboard/sidenav";
import Provider from "../components/context";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <Provider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-44">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
      </Provider>
    );
  }