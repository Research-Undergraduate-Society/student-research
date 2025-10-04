import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-blue-600">RUS - Research Undergraduate Society</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Undergraduate Society</h1>
        <Authenticated>
          <p className="text-xl text-gray-600">
            Welcome back, {loggedInUser?.email ?? "researcher"}!
          </p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-gray-600">Sign in to manage articles and content</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <Dashboard />
      </Authenticated>
    </div>
  );
}

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<"news" | "newspaper" | "journals" | "events" | "societies" | "pages" | "all">("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const articles = useQuery(api.articles.list, {
    category: selectedTab === "all" || selectedTab === "journals" || selectedTab === "events" || selectedTab === "societies" || selectedTab === "pages" ? undefined : selectedTab
  }) || [];
  
  const journals = useQuery(api.journals.list) || [];
  const events = useQuery(api.events.list) || [];
  const societies = useQuery(api.societies.list) || [];
  const pages = useQuery(api.pages.list) || [];

  // Seed data functionality
  const seedDatabase = useMutation(api.seed.seedDatabase);
  const clearDatabase = useMutation(api.seed.clearDatabase);

  const handleSeedDatabase = async () => {
    try {
      const result = await seedDatabase({});
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to seed database");
    }
  };

  const handleClearDatabase = async () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      try {
        const result = await clearDatabase({});
        toast.success(result.message);
      } catch (error) {
        toast.error("Failed to clear database");
      }
    }
  };

  const totalContent = articles.length + journals.length + events.length + societies.length + pages.length;

  return (
    <div className="space-y-8">
      {/* Database Management */}
      {totalContent === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Get Started</h3>
          <p className="text-blue-700 mb-4">
            Your database is empty. Would you like to populate it with sample data to explore the features?
          </p>
          <button
            onClick={handleSeedDatabase}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Sample Data
          </button>
        </div>
      )}

      {totalContent > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Database Management</h3>
              <p className="text-sm text-gray-600">
                Total content: {totalContent} items
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSeedDatabase}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add More Sample Data
              </button>
              <button
                onClick={handleClearDatabase}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-white rounded-lg shadow-sm border p-1">
          {[
            { key: "all", label: "All Content" },
            { key: "news", label: "News Feed" },
            { key: "newspaper", label: "Newspapers" },
            { key: "journals", label: "Journals" },
            { key: "events", label: "Events" },
            { key: "societies", label: "Societies" },
            { key: "pages", label: "Pages" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedTab === tab.key
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedTab === "all" ? "All Content" : 
             selectedTab === "news" ? "News Feed" : 
             selectedTab === "newspaper" ? "Newspapers" :
             selectedTab === "journals" ? "Academic Journals" :
             selectedTab === "events" ? "Events" :
             selectedTab === "societies" ? "Societies" :
             "Pages"}
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create {selectedTab === "all" ? "Content" : 
                   selectedTab === "journals" ? "Journal" :
                   selectedTab === "events" ? "Event" :
                   selectedTab === "societies" ? "Society" :
                   selectedTab === "pages" ? "Page" : "Article"}
          </button>
        </div>

        {selectedTab === "all" && (
          <div className="space-y-8">
            {/* Recent Articles */}
            {articles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Articles ({articles.length})</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.slice(0, 3).map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent Journals */}
            {journals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Journals ({journals.length})</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {journals.slice(0, 3).map((journal) => (
                    <JournalCard key={journal._id} journal={journal} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Upcoming Events */}
            {events.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Events ({events.length})</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events.slice(0, 3).map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Societies */}
            {societies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Societies ({societies.length})</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {societies.slice(0, 3).map((society) => (
                    <SocietyCard key={society._id} society={society} />
                  ))}
                </div>
              </div>
            )}

            {/* Pages */}
            {pages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pages ({pages.length})</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pages.slice(0, 3).map((page) => (
                    <PageCard key={page._id} page={page} />
                  ))}
                </div>
              </div>
            )}
            
            {totalContent === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No content yet</p>
                <p className="text-gray-400 text-sm mt-2">Create your first content to get started</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === "news" || selectedTab === "newspaper" ? (
          articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first article to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )
        ) : null}

        {selectedTab === "journals" && (
          journals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No journals yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first journal to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {journals.map((journal) => (
                <JournalCard key={journal._id} journal={journal} />
              ))}
            </div>
          )
        )}

        {selectedTab === "events" && (
          events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first event to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )
        )}

        {selectedTab === "societies" && (
          societies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No societies yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first society to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {societies.map((society) => (
                <SocietyCard key={society._id} society={society} />
              ))}
            </div>
          )
        )}

        {selectedTab === "pages" && (
          pages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No pages yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first page to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <PageCard key={page._id} page={page} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Create Forms */}
      {showCreateForm && (
        <>
          {(selectedTab === "news" || selectedTab === "newspaper" || selectedTab === "all") && (
            <CreateArticleForm onClose={() => setShowCreateForm(false)} />
          )}
          {selectedTab === "journals" && (
            <CreateJournalForm onClose={() => setShowCreateForm(false)} />
          )}
          {selectedTab === "events" && (
            <CreateEventForm onClose={() => setShowCreateForm(false)} />
          )}
          {selectedTab === "societies" && (
            <CreateSocietyForm onClose={() => setShowCreateForm(false)} />
          )}
          {selectedTab === "pages" && (
            <CreatePageForm onClose={() => setShowCreateForm(false)} />
          )}
        </>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const deleteArticle = useMutation(api.articles.remove);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle({ id: article._id });
        toast.success("Article deleted successfully");
      } catch (error) {
        toast.error("Failed to delete article");
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          article.category === "news" 
            ? "bg-green-100 text-green-800" 
            : "bg-blue-100 text-blue-800"
        }`}>
          {article.category === "news" ? "News" : "Newspaper"}
        </span>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
      <p className="text-gray-600 text-sm mb-2">By {article.author}</p>
      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{article.summary}</p>
      
      <div className="text-xs text-gray-500">
        {new Date(article.publicationDate).toLocaleDateString()}
      </div>
    </div>
  );
}

function JournalCard({ journal }: { journal: any }) {
  const deleteJournal = useMutation(api.journals.remove);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this journal?")) {
      try {
        await deleteJournal({ id: journal._id });
        toast.success("Journal deleted successfully");
      } catch (error) {
        toast.error("Failed to delete journal");
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
          Journal
        </span>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{journal.title}</h3>
      <p className="text-gray-600 text-sm mb-2">By {journal.authors.join(", ")}</p>
      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{journal.abstract}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {new Date(journal.publicationDate).toLocaleDateString()}
        </div>
        <a
          href={journal.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          View PDF
        </a>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const deleteEvent = useMutation(api.events.remove);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ id: event._id });
        toast.success("Event deleted successfully");
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  const isUpcoming = event.eventDate > Date.now();

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isUpcoming 
            ? "bg-orange-100 text-orange-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {isUpcoming ? "Upcoming" : "Past Event"}
        </span>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{event.description}</p>
      
      <div className="space-y-1">
        <div className="text-sm text-gray-600">
          📅 {new Date(event.eventDate).toLocaleDateString()} at {new Date(event.eventDate).toLocaleTimeString()}
        </div>
        <div className="text-sm text-gray-600">
          📍 {event.location}
        </div>
      </div>
    </div>
  );
}

function SocietyCard({ society }: { society: any }) {
  const deleteSociety = useMutation(api.societies.remove);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this society?")) {
      try {
        await deleteSociety({ id: society._id });
        toast.success("Society deleted successfully");
      } catch (error) {
        toast.error("Failed to delete society");
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          Society
        </span>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{society.name}</h3>
      <p className="text-gray-700 text-sm line-clamp-4">{society.description}</p>
    </div>
  );
}

function PageCard({ page }: { page: any }) {
  const deletePage = useMutation(api.pages.remove);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        await deletePage({ id: page._id });
        toast.success("Page deleted successfully");
      } catch (error) {
        toast.error("Failed to delete page");
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-800">
          Page
        </span>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{page.title}</h3>
      <p className="text-gray-600 text-sm mb-2">Slug: /{page.slug}</p>
      <p className="text-gray-700 text-sm line-clamp-3">{page.content.substring(0, 150)}...</p>
    </div>
  );
}

function CreateArticleForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<"news" | "newspaper">("news");
  const [summary, setSummary] = useState("");
  
  const createArticle = useMutation(api.articles.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createArticle({
        title,
        content,
        author,
        category,
        summary,
      });
      toast.success("Article created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create article");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Article</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "news" | "newspaper")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="news">News Feed</option>
              <option value="newspaper">Newspaper</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary for homepage preview..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full article content..."
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Article
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateJournalForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  
  const createJournal = useMutation(api.journals.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJournal({
        title,
        authors: authors.split(",").map(author => author.trim()).filter(Boolean),
        abstract,
        pdfUrl,
      });
      toast.success("Journal created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create journal");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Journal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Authors</label>
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Separate multiple authors with commas"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">PDF URL</label>
            <input
              type="url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/paper.pdf"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Abstract</label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Journal abstract..."
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Journal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateEventForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  
  const createEvent = useMutation(api.events.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        title,
        description,
        eventDate: new Date(eventDate).getTime(),
        location,
      });
      toast.success("Event created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Event Date & Time</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event location or venue"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event description..."
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateSocietyForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const createSociety = useMutation(api.societies.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSociety({
        name,
        description,
      });
      toast.success("Society created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create society");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Society</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Society description..."
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Society
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreatePageForm({ onClose }: { onClose: () => void }) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const createPage = useMutation(api.pages.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPage({
        slug,
        title,
        content,
      });
      toast.success("Page created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create page");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Page</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="page-url-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">URL: /{slug}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Page content..."
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Page
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
