import Link from "next/link";
import { fetchRoadmaps, Roadmap } from "@/lib/api";

export default async function RoadmapsPage() {
  let roadmaps: Roadmap[] = [];
  try {
    roadmaps = await fetchRoadmaps();
  } catch (error) {
    console.error("Failed to fetch roadmaps", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Developer Roadmaps</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Step by step guides and paths to learn different tools or technologies from scratch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roadmaps.length === 0 ? (
          <p className="text-muted-foreground col-span-3 text-center py-12">No roadmaps available yet.</p>
        ) : (
          roadmaps.map((roadmap) => (
            <Link key={roadmap.id} href={`/roadmaps/${roadmap.slug}`} className="group p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col">
              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{roadmap.title}</h2>
              <p className="text-muted-foreground flex-1 mb-6">{roadmap.description}</p>
              <div className="text-sm font-semibold text-primary">
                View Roadmap &rarr;
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
