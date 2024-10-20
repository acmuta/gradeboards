import Searchbar from "@/components/search/searchbar";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-11/12 md:w-3/4">
      <div className="md:py-6 sm:px-0 flex flex-col justify-center items-center">
        <Searchbar />
      </div>
    </div>
  );
}
