import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed data for testing - this will populate the database with sample content
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists to avoid duplicates
    const existingArticles = await ctx.db.query("articles").take(1);
    if (existingArticles.length > 0) {
      return { message: "Database already seeded" };
    }

    // Seed Articles
    await ctx.db.insert("articles", {
      title: "Breakthrough in Quantum Computing Research",
      content: "Researchers at the university have made significant progress in quantum computing, developing a new algorithm that could revolutionize data processing. The team, led by Dr. Sarah Chen, has successfully demonstrated quantum supremacy in solving complex optimization problems that would take classical computers thousands of years to complete. This breakthrough opens new possibilities for cryptography, drug discovery, and artificial intelligence applications.",
      author: "Dr. Sarah Chen",
      category: "news",
      summary: "University researchers achieve quantum computing breakthrough with new algorithm demonstration.",
      publicationDate: Date.now() - 86400000, // 1 day ago
    });

    await ctx.db.insert("articles", {
      title: "Student Research Symposium Highlights Innovation",
      content: "The annual Student Research Symposium showcased outstanding undergraduate research projects across multiple disciplines. Over 150 students presented their work, ranging from biomedical engineering to social sciences. The event highlighted the university's commitment to fostering undergraduate research opportunities and preparing the next generation of scientists and scholars.",
      author: "Prof. Michael Rodriguez",
      category: "newspaper",
      summary: "Annual symposium features 150+ student research presentations across diverse fields.",
      publicationDate: Date.now() - 172800000, // 2 days ago
    });

    await ctx.db.insert("articles", {
      title: "New Funding Awarded for Climate Change Studies",
      content: "The Research Undergraduate Society has secured a $2.5 million grant from the National Science Foundation to study climate change impacts on coastal ecosystems. The five-year project will involve undergraduate researchers in field studies, data analysis, and policy recommendations. This funding represents one of the largest grants ever awarded to undergraduate research initiatives.",
      author: "Dr. Emily Watson",
      category: "news",
      summary: "$2.5M NSF grant funds undergraduate climate research on coastal ecosystems.",
      publicationDate: Date.now() - 259200000, // 3 days ago
    });

    // Seed Journals
    await ctx.db.insert("journals", {
      title: "Machine Learning Applications in Biomedical Image Analysis",
      authors: ["Alex Thompson", "Maria Garcia", "Dr. James Liu"],
      abstract: "This paper presents a comprehensive study of machine learning techniques applied to biomedical image analysis. We developed a novel convolutional neural network architecture that achieves 95% accuracy in detecting early-stage cancer cells in microscopic images. Our approach combines transfer learning with custom feature extraction methods, resulting in improved diagnostic capabilities. The model was trained on a dataset of 50,000 annotated medical images and validated through cross-institutional testing.",
      pdfUrl: "https://example.com/papers/ml-biomedical-analysis.pdf",
      publicationDate: Date.now() - 604800000, // 1 week ago
    });

    await ctx.db.insert("journals", {
      title: "Sustainable Energy Solutions: A Comparative Analysis of Solar Technologies",
      authors: ["Rachel Kim", "David Park"],
      abstract: "This research examines the efficiency and cost-effectiveness of various solar energy technologies, including photovoltaic cells, concentrated solar power, and emerging perovskite solar cells. Through extensive laboratory testing and economic modeling, we demonstrate that hybrid solar systems can achieve 40% higher energy output compared to traditional silicon-based panels. Our findings suggest significant potential for reducing renewable energy costs and accelerating adoption in developing regions.",
      pdfUrl: "https://example.com/papers/sustainable-solar-tech.pdf",
      publicationDate: Date.now() - 1209600000, // 2 weeks ago
    });

    await ctx.db.insert("journals", {
      title: "Social Media Impact on Academic Performance: A Longitudinal Study",
      authors: ["Jennifer Lee", "Mark Johnson", "Dr. Patricia Brown"],
      abstract: "This longitudinal study tracked 500 undergraduate students over two academic years to examine the relationship between social media usage and academic performance. Using advanced statistical modeling and machine learning techniques, we identified key patterns in digital behavior that correlate with GPA changes. Our results indicate that structured social media use for educational purposes can enhance learning outcomes, while excessive recreational use shows negative correlations with academic achievement.",
      pdfUrl: "https://example.com/papers/social-media-academic-performance.pdf",
      publicationDate: Date.now() - 1814400000, // 3 weeks ago
    });

    // Seed Events
    await ctx.db.insert("events", {
      title: "Annual Research Showcase",
      description: "Join us for our biggest research event of the year! Students and faculty will present their latest research findings across all disciplines. The showcase features poster sessions, oral presentations, and networking opportunities with industry professionals. Awards will be given for outstanding undergraduate research in each category.",
      eventDate: Date.now() + 1209600000, // 2 weeks from now
      location: "University Student Center, Main Auditorium",
    });

    await ctx.db.insert("events", {
      title: "Workshop: Introduction to Data Science",
      description: "Learn the fundamentals of data science in this hands-on workshop. Topics include Python programming, statistical analysis, data visualization, and machine learning basics. Perfect for beginners with no prior experience. All materials and datasets will be provided. Bring your laptop!",
      eventDate: Date.now() + 604800000, // 1 week from now
      location: "Computer Science Building, Room 201",
    });

    await ctx.db.insert("events", {
      title: "Guest Lecture: Future of Artificial Intelligence",
      description: "Dr. Alan Turing Jr., renowned AI researcher from MIT, will discuss the current state and future prospects of artificial intelligence. The lecture will cover recent breakthroughs in large language models, computer vision, and robotics. Q&A session will follow the presentation.",
      eventDate: Date.now() + 2419200000, // 4 weeks from now
      location: "Science Library, Conference Room A",
    });

    // Seed Societies
    await ctx.db.insert("societies", {
      name: "Biomedical Research Society",
      description: "A student organization dedicated to promoting biomedical research among undergraduates. We organize research seminars, lab visits, and mentorship programs connecting students with faculty researchers. Members gain hands-on experience in cutting-edge biomedical research and develop skills essential for careers in medicine and biotechnology.",
    });

    await ctx.db.insert("societies", {
      name: "Computer Science Innovation Club",
      description: "Fostering innovation and collaboration in computer science research. Our club focuses on emerging technologies including artificial intelligence, cybersecurity, and software engineering. We host hackathons, coding competitions, and industry networking events to help members develop both technical skills and professional connections.",
    });

    await ctx.db.insert("societies", {
      name: "Environmental Research Collective",
      description: "Committed to addressing environmental challenges through undergraduate research. Our members work on projects related to climate change, renewable energy, and sustainable development. We collaborate with local environmental organizations and participate in field research expeditions to study ecosystem dynamics and conservation strategies.",
    });

    // Seed Pages
    await ctx.db.insert("pages", {
      slug: "about-us",
      title: "About the Research Undergraduate Society",
      content: "The Research Undergraduate Society (RUS) is a premier organization dedicated to fostering research excellence among undergraduate students. Founded in 2010, we have grown to become the largest student research organization on campus, with over 500 active members across all academic disciplines.\n\nOur mission is to provide undergraduate students with opportunities to engage in meaningful research, develop critical thinking skills, and prepare for graduate studies or research careers. We achieve this through mentorship programs, research funding opportunities, academic conferences, and collaborative projects with faculty members.\n\nRUS offers various programs including the Summer Research Fellowship, which provides stipends for students to conduct full-time research; the Research Mentorship Program, which pairs undergraduates with graduate student and faculty mentors; and the Annual Research Symposium, where students present their findings to the academic community.\n\nWhether you're interested in STEM fields, humanities, social sciences, or interdisciplinary research, RUS provides the resources and community to help you succeed in your research endeavors.",
    });

    await ctx.db.insert("pages", {
      slug: "membership",
      title: "Membership Information",
      content: "Joining the Research Undergraduate Society is open to all undergraduate students regardless of their academic major or research experience level. We welcome students from freshmen to seniors who are passionate about research and discovery.\n\n**Membership Benefits:**\n- Access to research funding opportunities up to $2,000 per project\n- Mentorship from experienced researchers and graduate students\n- Priority registration for workshops and seminars\n- Networking opportunities with faculty and industry professionals\n- Access to research equipment and laboratory facilities\n- Opportunities to present research at national conferences\n\n**How to Join:**\n1. Attend one of our weekly information sessions (Wednesdays at 6 PM in the Student Center)\n2. Complete the online membership application\n3. Attend the new member orientation session\n4. Pay the annual membership fee of $25\n\n**Membership Requirements:**\n- Maintain a minimum GPA of 3.0\n- Attend at least 75% of general meetings\n- Participate in at least one research project or society event per semester\n- Complete 10 hours of community service related to research outreach\n\nFor questions about membership, contact our Membership Chair at membership@rus.university.edu",
    });

    await ctx.db.insert("pages", {
      slug: "research-opportunities",
      title: "Research Opportunities",
      content: "The Research Undergraduate Society offers numerous opportunities for students to engage in cutting-edge research across various disciplines. Our programs are designed to accommodate students at all levels of research experience.\n\n**Current Research Areas:**\n\n*STEM Research:*\n- Biomedical Engineering and Healthcare Technology\n- Environmental Science and Sustainability\n- Computer Science and Artificial Intelligence\n- Materials Science and Nanotechnology\n- Physics and Astronomy\n\n*Social Sciences and Humanities:*\n- Psychology and Behavioral Studies\n- Economics and Public Policy\n- History and Cultural Studies\n- Literature and Linguistics\n- Political Science and International Relations\n\n**Funding Opportunities:**\n\n*Undergraduate Research Grants:* Up to $2,000 for individual projects\n*Collaborative Research Funds:* Up to $5,000 for team projects\n*Conference Travel Grants:* Up to $1,500 for presenting research\n*Summer Research Fellowships:* $4,000 stipend plus research expenses\n\n**How to Get Started:**\n1. Browse our research project database\n2. Attend faculty research presentations\n3. Connect with potential mentors through our matching program\n4. Submit a research proposal through our online portal\n5. Begin your research journey with full RUS support\n\nFor more information about specific opportunities, visit our Research Portal or contact our Research Coordinator at research@rus.university.edu",
    });

    return { 
      message: "Database successfully seeded with sample data",
      counts: {
        articles: 3,
        journals: 3,
        events: 3,
        societies: 3,
        pages: 3
      }
    };
  },
});

// Helper mutation to clear all data (for testing purposes)
export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all documents from each table
    const articles = await ctx.db.query("articles").collect();
    const journals = await ctx.db.query("journals").collect();
    const events = await ctx.db.query("events").collect();
    const societies = await ctx.db.query("societies").collect();
    const pages = await ctx.db.query("pages").collect();

    // Delete all documents
    for (const article of articles) {
      await ctx.db.delete(article._id);
    }
    for (const journal of journals) {
      await ctx.db.delete(journal._id);
    }
    for (const event of events) {
      await ctx.db.delete(event._id);
    }
    for (const society of societies) {
      await ctx.db.delete(society._id);
    }
    for (const page of pages) {
      await ctx.db.delete(page._id);
    }

    return { 
      message: "Database cleared successfully",
      deletedCounts: {
        articles: articles.length,
        journals: journals.length,
        events: events.length,
        societies: societies.length,
        pages: pages.length
      }
    };
  },
});
