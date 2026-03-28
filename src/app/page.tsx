import { LabelEditor } from "@/ui/components/label-editor";

const HomePage = () => (
  <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef6f5_100%)] px-4 py-8 md:px-8">
    <div className="mx-auto max-w-7xl">
      <LabelEditor />
    </div>
  </main>
);

export default HomePage;
