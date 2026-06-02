import { PrismaClient, AnimationPreset } from "@prisma/client";
import { defaultBlockContent } from "../src/lib/cms/blocks";
import { encrypt } from "../src/lib/security/encrypt";

const prisma = new PrismaClient();

const SERVICES = [
  { title: "Portfolio Development", category: "Development", slug: "portfolio-development" },
  { title: "E-Commerce Development", category: "Development", slug: "e-commerce-development" },
  { title: "Brand Strategy", category: "Branding", slug: "brand-strategy" },
  { title: "Brand Showcase", category: "Branding", slug: "brand-showcase" },
  { title: "Digital Marketing", category: "Marketing", slug: "digital-marketing" },
  { title: "Video Editing", category: "Content", slug: "video-editing" },
  { title: "Content Optimization", category: "Content", slug: "content-optimization" },
  { title: "Premium Website Development", category: "Development", slug: "premium-website-development" },
  { title: "Mobile App Development", category: "Development", slug: "mobile-app-development" },
  { title: "SEO", category: "Growth", slug: "seo" },
  { title: "AEO", category: "Growth", slug: "aeo" },
  { title: "GEO", category: "Growth", slug: "geo" },
  { title: "AI Automation", category: "Technology", slug: "ai-automation" },
  { title: "Social Media Marketing", category: "Marketing", slug: "social-media-marketing" },
];

async function main() {
  const primaryEmail = process.env.ADMIN_PRIMARY_EMAIL ?? "admin@example.com";
  const backupEmail = process.env.ADMIN_BACKUP_EMAIL ?? "backup@example.com";

  await prisma.admin.upsert({
    where: { primaryEmail },
    create: { primaryEmail, backupEmail },
    update: { backupEmail },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      brandName: "Intasia Branding",
      tagline: "Branding, websites, apps, and digital growth — made human.",
      contactEmail: "intasiabranding@gmail.com",
      contactPhone: "9342035536",
      whatsapp: "https://wa.me/919342035536",
      instagram: "https://www.instagram.com/intasiabranding__/",
      address: "India",
      autoReplySubject: "We received your message — Intasia Branding",
      autoReplyBody:
        "<p>Thank you for reaching out to Intasia Branding. We received your message and will reply shortly.</p>",
      leadNotifyEmail: "intasiabranding@gmail.com",
      useSmtpForAuth: true,
      otpLoginSubject: "Your admin login verification code",
      otpRecoverySubject: "Your account recovery verification code",
    },
    update: {
      brandName: "Intasia Branding",
      tagline: "Branding, websites, apps, and digital growth — made human.",
      contactEmail: "intasiabranding@gmail.com",
      contactPhone: "9342035536",
      whatsapp: "https://wa.me/919342035536",
      instagram: "https://www.instagram.com/intasiabranding__/",
      leadNotifyEmail: "intasiabranding@gmail.com",
    },
  });

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER ?? process.env.SMTP_USERNAME;
  const smtpPass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
  if (smtpHost && smtpUser && smtpPass && process.env.ENCRYPTION_KEY) {
    const existingSmtp = await prisma.smtpProfile.findFirst({
      where: { name: "Default SMTP" },
    });
    const smtpData = {
      name: "Default SMTP",
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      username: smtpUser,
      passwordEnc: encrypt(smtpPass),
      encryption: process.env.SMTP_ENCRYPTION ?? "TLS",
      fromEmail: process.env.SMTP_FROM_EMAIL ?? smtpUser,
      fromName: process.env.SMTP_FROM_NAME ?? "Digital Growth Ecosystem",
      isActive: true,
    };
    if (existingSmtp) {
      await prisma.smtpProfile.update({
        where: { id: existingSmtp.id },
        data: { ...smtpData, isActive: true },
      });
    } else {
      await prisma.smtpProfile.updateMany({ data: { isActive: false } });
      await prisma.smtpProfile.create({ data: smtpData });
    }
    console.log("SMTP profile seeded from environment variables");
  }

  await prisma.siteTheme.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });

  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        category: s.category,
        order: i,
        description: `Premium ${s.title} services designed to accelerate your business growth. Our expert team delivers measurable results with cutting-edge strategies and technology.`,
        shortDesc: `Expert ${s.title} for modern businesses.`,
        features: [
          "Strategy & Planning",
          "Expert Execution",
          "Performance Analytics",
          "Dedicated Support",
        ],
        pricing: "From $999",
        priceNote: "Custom packages available",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        geoSummary: `${s.title} helps businesses improve visibility, engagement, and revenue through proven digital growth methodologies.`,
      },
      update: { order: i },
    });
  }

  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    create: { slug: "home", title: "Home" },
    update: {},
  });

  await prisma.pageSection.deleteMany({ where: { pageId: homePage.id } });

  const homeSections = [
    "hero",
    "trustBar",
    "servicesGrid",
    "howItWorks",
    "caseStudies",
    "portfolio",
    "testimonials",
    "reviews",
    "stats",
    "faq",
    "cta",
  ] as const;

  for (let i = 0; i < homeSections.length; i++) {
    const type = homeSections[i];
    await prisma.pageSection.create({
      data: {
        pageId: homePage.id,
        type,
        order: i,
        content: defaultBlockContent(type),
        animationPreset: AnimationPreset.FADE_UP,
      },
    });
  }

  const aboutPage = await prisma.page.upsert({
    where: { slug: "about" },
    create: { slug: "about", title: "About" },
    update: {},
  });

  await prisma.pageSection.deleteMany({ where: { pageId: aboutPage.id } });
  const aboutSections = ["richText", "richText", "teamGrid", "timeline", "cta"] as const;
  for (let i = 0; i < aboutSections.length; i++) {
    await prisma.pageSection.create({
      data: {
        pageId: aboutPage.id,
        type: aboutSections[i],
        order: i,
        content:
          aboutSections[i] === "richText"
            ? {
                title: i === 0 ? "Our Story" : "Vision & Mission",
                body: "<p>Building the future of digital growth.</p>",
              }
            : defaultBlockContent(aboutSections[i]),
        animationPreset: AnimationPreset.FADE_UP,
      },
    });
  }

  await prisma.statistic.deleteMany();
  await prisma.statistic.createMany({
    data: [
      { label: "Partner Brands", value: "3", suffix: "+", order: 0 },
      { label: "Core Services", value: "4", suffix: "+", order: 1 },
      { label: "Client Focus", value: "100", suffix: "%", order: 2 },
      { label: "Support", value: "24", suffix: "/7", order: 3 },
    ],
  });

  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Sarah Johnson",
        role: "CEO",
        company: "TechStart Inc",
        content: "Transformed our entire digital presence. Revenue up 300% in 6 months.",
        order: 0,
      },
      {
        name: "Michael Chen",
        role: "Founder",
        company: "GrowthLab",
        content: "The best agency we've worked with. Professional, innovative, and results-driven.",
        order: 1,
      },
    ],
  });

  await prisma.review.createMany({
    skipDuplicates: true,
    data: [
      { author: "Alex R.", platform: "Google", content: "Outstanding service and results!", rating: 5, order: 0 },
      { author: "Emma W.", platform: "Clutch", content: "Top-tier digital growth partner.", rating: 5, order: 1 },
    ],
  });

  await prisma.faq.createMany({
    skipDuplicates: true,
    data: [
      {
        question: "What services do you offer?",
        answer: "We offer branding, web development, mobile apps, SEO, AEO, GEO, AI automation, and full digital marketing.",
        order: 0,
      },
      {
        question: "How long does a typical project take?",
        answer: "Project timelines vary from 2-12 weeks depending on scope. We provide detailed timelines during consultation.",
        order: 1,
      },
      {
        question: "Do you offer ongoing support?",
        answer: "Yes, we offer 24/7 premium support and monthly growth retainer packages.",
        order: 2,
      },
    ],
  });

  await prisma.caseStudy.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "E-Commerce Scale-Up",
        slug: "ecommerce-scale",
        description: "Helped a retail brand increase online revenue by 400%.",
        results: "+400% Revenue",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        order: 0,
      },
    ],
  });

  await prisma.portfolioItem.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "SaaS Platform Redesign",
        slug: "saas-redesign",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        order: 0,
      },
    ],
  });

  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Alex Rivera",
        role: "CEO & Founder",
        bio: "Leads brand strategy and client partnerships across Intasia.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        order: 0,
      },
      {
        name: "Priya Sharma",
        role: "Creative Director",
        bio: "Shapes visual identity, campaigns, and design systems for every client.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        order: 1,
      },
      {
        name: "James Okonkwo",
        role: "Head of Development",
        bio: "Builds fast, accessible websites and apps with modern stacks.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        order: 2,
      },
      {
        name: "Sofia Mendez",
        role: "Growth Lead",
        bio: "Runs SEO, paid media, and analytics to scale measurable results.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        order: 3,
      },
    ],
  });

  await prisma.timelineEvent.createMany({
    skipDuplicates: true,
    data: [
      { year: "2020", title: "Founded", description: "Started with a vision to democratize digital growth.", order: 0 },
      { year: "2022", title: "Growing partnerships", description: "Partnered with Vekara, Calkwalk, BT Builder, and more.", order: 1 },
      { year: "2024", title: "AI Platform", description: "Launched AI automation suite.", order: 2 },
    ],
  });

  await prisma.pricingPlan.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Starter",
        slug: "starter",
        price: "$999",
        description: "Perfect for small businesses",
        features: ["Website Setup", "Basic SEO", "Monthly Report"],
        order: 0,
      },
      {
        name: "Growth",
        slug: "growth",
        price: "$2,499",
        description: "For scaling businesses",
        features: ["Full Marketing", "Advanced SEO", "AI Automation", "Priority Support"],
        highlighted: true,
        order: 1,
      },
      {
        name: "Enterprise",
        slug: "enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions",
        features: ["Dedicated Team", "Custom Development", "24/7 Support", "SLA Guarantee"],
        order: 2,
      },
    ],
  });

  await prisma.blogPost.upsert({
    where: { slug: "future-of-aeo-geo" },
    create: {
      title: "The Future of AEO and GEO in Digital Marketing",
      slug: "future-of-aeo-geo",
      excerpt: "How Answer Engine and Generative Engine Optimization are reshaping search.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "AEO and GEO represent the next evolution beyond traditional SEO...",
              },
            ],
          },
        ],
      },
      status: "PUBLISHED",
      publishedAt: new Date(),
      category: "Growth",
      metaTitle: "AEO & GEO Guide | Digital Growth Ecosystem",
      metaDescription: "Learn how Answer Engine Optimization and Generative Engine Optimization drive growth.",
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    },
    update: {},
  });

  await prisma.seoSettings.upsert({
    where: { path: "/" },
    create: {
      path: "/",
      metaTitle: "Digital Growth Ecosystem | Premium Agency & SaaS Platform",
      metaDescription: "Scale your business with branding, websites, apps, AI automation, SEO, AEO, GEO, and digital marketing.",
    },
    update: {},
  });

  await prisma.aeoGeoBlock.createMany({
    skipDuplicates: true,
    data: [
      {
        type: "FAQ",
        question: "What is Digital Growth Ecosystem?",
        answer: "A premium all-in-one platform combining agency services, SaaS tools, and AI automation for business growth.",
        entityName: "Digital Growth Ecosystem",
        keywords: ["digital marketing", "growth agency", "AI automation"],
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
