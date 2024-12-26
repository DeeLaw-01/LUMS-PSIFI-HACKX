import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import SearchBar from './components/SearchBar'
import MessagingPanel from './components/MessagingPanel'
import CreatePost from './components/CreatePost'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar className="hidden md:block w-full md:w-1/4" />
          <div className="flex-1">
            <div className="mb-6 md:hidden">
              <SearchBar />
            </div>
            <CreatePost />
            <Feed />
          </div>
          <MessagingPanel className="hidden lg:block w-1/4" />
        </div>
      </main>
    </div>
  )
}

