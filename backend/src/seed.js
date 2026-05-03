/**
 * Database Seeder
 * Run: node src/seed.js
 * This creates demo users, projects, and tasks so you can log in immediately.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create Users
  const users = await User.create([
    { name: 'Alex Johnson', email: 'admin@taskflow.io', password: 'password123', role: 'Admin', department: 'Engineering', bio: 'Building world-class software 🚀' },
    { name: 'Sarah Chen', email: 'sarah@taskflow.io', password: 'password123', role: 'Manager', department: 'Design', bio: 'UX & Product design enthusiast' },
    { name: 'Marcus Williams', email: 'marcus@taskflow.io', password: 'password123', role: 'Team Lead', department: 'Engineering', bio: 'Full-stack developer | Open source' },
    { name: 'Priya Patel', email: 'priya@taskflow.io', password: 'password123', role: 'Member', department: 'Backend', bio: 'Backend & DevOps specialist' },
    { name: 'Jordan Lee', email: 'jordan@taskflow.io', password: 'password123', role: 'Member', department: 'DevOps', bio: 'Infra & CI/CD pipelines' },
    { name: 'Emma Rodriguez', email: 'emma@taskflow.io', password: 'password123', role: 'Guest', department: 'QA', bio: 'Quality & testing advocate' },
  ]);
  console.log(`👥 Created ${users.length} users`);

  const [alex, sarah, marcus, priya, jordan, emma] = users;

  // Create Projects
  const projects = await Project.create([
    {
      name: 'Marketing Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved performance.',
      owner: alex._id,
      members: [alex._id, sarah._id, marcus._id],
      status: 'In Progress',
      priority: 'High',
      color: '#3b82f6',
      tags: ['Design', 'Frontend'],
      dueDate: new Date('2026-06-15'),
    },
    {
      name: 'Q3 Mobile App Release',
      description: 'Launch the new mobile application for iOS and Android platforms with offline support.',
      owner: alex._id,
      members: [alex._id, priya._id, jordan._id, emma._id],
      status: 'At Risk',
      priority: 'Urgent',
      color: '#ef4444',
      tags: ['Mobile', 'Backend'],
      dueDate: new Date('2026-05-30'),
    },
    {
      name: 'Client Portal V2',
      description: 'Second version of the client portal with enhanced features, SSO, and better analytics.',
      owner: sarah._id,
      members: [sarah._id, marcus._id],
      status: 'On Track',
      priority: 'Medium',
      color: '#22c55e',
      tags: ['Portal', 'UI'],
      dueDate: new Date('2026-05-10'),
    },
    {
      name: 'Analytics Dashboard',
      description: 'Build real-time analytics dashboard for business intelligence and KPI tracking.',
      owner: alex._id,
      members: [alex._id, marcus._id, priya._id],
      status: 'In Progress',
      priority: 'High',
      color: '#f59e0b',
      tags: ['Analytics', 'Data'],
      dueDate: new Date('2026-07-01'),
    },
    {
      name: 'API Integration Suite',
      description: 'Third-party API integration for payment (Stripe) and CRM (Salesforce) systems.',
      owner: priya._id,
      members: [priya._id, marcus._id],
      status: 'On Track',
      priority: 'High',
      color: '#06b6d4',
      tags: ['Backend', 'API'],
      dueDate: new Date('2026-06-20'),
    },
  ]);
  console.log(`📁 Created ${projects.length} projects`);

  const [mktWebsite, mobileApp, portal, analytics, apiSuite] = projects;

  // Create Tasks
  const tasks = await Task.create([
    // Marketing Website
    { title: 'Design new homepage hero section', description: 'Create a modern, engaging hero with animated elements and gradient backgrounds.', project: mktWebsite._id, assignee: sarah._id, reporter: alex._id, status: 'In Progress', priority: 'High', dueDate: new Date('2026-05-20'), labels: ['Design', 'Frontend'], estimatedHours: 8, timeTracked: 5, order: 0 },
    { title: 'Implement responsive navigation', description: 'Build mobile-first navigation with hamburger menu for all breakpoints.', project: mktWebsite._id, assignee: marcus._id, reporter: sarah._id, status: 'Todo', priority: 'Medium', dueDate: new Date('2026-05-22'), labels: ['Frontend'], estimatedHours: 6, order: 1 },
    { title: 'Fix navigation bug on iOS Safari', description: 'Hamburger menu not closing after selection on iOS Safari 16+.', project: mktWebsite._id, assignee: marcus._id, reporter: alex._id, status: 'In Review', priority: 'High', dueDate: new Date('2026-05-08'), labels: ['Bug', 'Mobile'], estimatedHours: 3, timeTracked: 2, order: 2 },
    { title: 'Create email notification templates', description: 'Design responsive HTML email templates for system notifications (onboarding, alerts).', project: mktWebsite._id, assignee: sarah._id, reporter: alex._id, status: 'Blocked', priority: 'Medium', dueDate: new Date('2026-05-12'), labels: ['Email', 'Design'], estimatedHours: 5, timeTracked: 1, order: 3 },
    { title: 'SEO optimization pass', description: 'Add meta tags, structured data, and improve Core Web Vitals scores.', project: mktWebsite._id, assignee: marcus._id, reporter: sarah._id, status: 'Backlog', priority: 'Low', dueDate: new Date('2026-06-01'), labels: ['SEO'], estimatedHours: 4, order: 4 },
    { title: 'Launch page A/B test', description: 'Setup Optimizely for A/B testing on CTA button placement and copy.', project: mktWebsite._id, assignee: alex._id, reporter: sarah._id, status: 'Completed', priority: 'Low', dueDate: new Date('2026-04-30'), labels: ['Analytics'], estimatedHours: 3, timeTracked: 3, order: 5 },

    // Mobile App
    { title: 'Implement user authentication flow', description: 'JWT-based auth with refresh tokens, biometrics, and session management.', project: mobileApp._id, assignee: priya._id, reporter: alex._id, status: 'Todo', priority: 'Urgent', dueDate: new Date('2026-05-15'), labels: ['Backend', 'Security'], estimatedHours: 12, order: 0 },
    { title: 'Setup CI/CD pipeline', description: 'Automate build and deploy process using GitHub Actions for both iOS and Android.', project: mobileApp._id, assignee: jordan._id, reporter: alex._id, status: 'In Progress', priority: 'High', dueDate: new Date('2026-05-25'), labels: ['DevOps'], estimatedHours: 10, timeTracked: 4, order: 1 },
    { title: 'Setup monitoring and alerts', description: 'Configure Datadog monitoring, Sentry error tracking, and PagerDuty alert routing.', project: mobileApp._id, assignee: jordan._id, reporter: priya._id, status: 'Backlog', priority: 'High', dueDate: new Date('2026-05-28'), labels: ['DevOps', 'Monitoring'], estimatedHours: 6, order: 2 },
    { title: 'Push notification service', description: 'Integrate Firebase Cloud Messaging for iOS and Android push notifications.', project: mobileApp._id, assignee: priya._id, reporter: alex._id, status: 'Todo', priority: 'Medium', dueDate: new Date('2026-06-01'), labels: ['Backend', 'Mobile'], estimatedHours: 8, order: 3 },
    { title: 'App store submission prep', description: 'Prepare screenshots, descriptions, and compliance docs for App Store and Play Store.', project: mobileApp._id, assignee: emma._id, reporter: alex._id, status: 'Backlog', priority: 'Low', dueDate: new Date('2026-06-10'), labels: ['Operations'], estimatedHours: 4, order: 4 },

    // Client Portal
    { title: 'Conduct user testing session', description: 'Organize and run user testing sessions for the new onboarding flow with 10 participants.', project: portal._id, assignee: emma._id, reporter: sarah._id, status: 'Todo', priority: 'Low', dueDate: new Date('2026-05-25'), labels: ['UX', 'Testing'], estimatedHours: 4, order: 0 },
    { title: 'Implement dark mode toggle', description: 'Add persistent dark/light mode preference across the entire portal with OS detection.', project: portal._id, assignee: marcus._id, reporter: sarah._id, status: 'Completed', priority: 'Low', dueDate: new Date('2026-04-30'), labels: ['Frontend', 'UI'], estimatedHours: 4, timeTracked: 4, order: 1 },
    { title: 'SSO integration with Google & Microsoft', description: 'OAuth2 SSO support for enterprise clients using Google Workspace and Azure AD.', project: portal._id, assignee: marcus._id, reporter: sarah._id, status: 'In Progress', priority: 'High', dueDate: new Date('2026-05-18'), labels: ['Auth', 'Enterprise'], estimatedHours: 16, timeTracked: 6, order: 2 },

    // Analytics
    { title: 'Optimize database queries', description: 'Add indexes and optimize slow MongoDB aggregation queries in the analytics module.', project: analytics._id, assignee: priya._id, reporter: marcus._id, status: 'In Progress', priority: 'High', dueDate: new Date('2026-05-18'), labels: ['Backend', 'Performance'], estimatedHours: 8, timeTracked: 3, order: 0 },
    { title: 'Build real-time chart updates', description: 'WebSocket-based chart data streaming for live dashboard updates without page refresh.', project: analytics._id, assignee: marcus._id, reporter: alex._id, status: 'Todo', priority: 'High', dueDate: new Date('2026-06-01'), labels: ['Frontend', 'WebSocket'], estimatedHours: 12, order: 1 },
    { title: 'Export to CSV/PDF feature', description: 'Allow users to export their analytics reports to CSV and PDF formats.', project: analytics._id, assignee: priya._id, reporter: alex._id, status: 'Backlog', priority: 'Medium', dueDate: new Date('2026-07-01'), labels: ['Feature'], estimatedHours: 6, order: 2 },

    // API Suite
    { title: 'Write API documentation', description: 'Document all REST endpoints using OpenAPI 3.0 specification with Swagger UI.', project: apiSuite._id, assignee: marcus._id, reporter: priya._id, status: 'Completed', priority: 'Medium', dueDate: new Date('2026-05-05'), labels: ['Docs', 'API'], estimatedHours: 6, timeTracked: 6, order: 0 },
    { title: 'Stripe payment integration', description: 'Integrate Stripe Checkout for subscription billing with webhook handling.', project: apiSuite._id, assignee: priya._id, reporter: alex._id, status: 'In Review', priority: 'Urgent', dueDate: new Date('2026-05-20'), labels: ['Payments', 'Backend'], estimatedHours: 14, timeTracked: 10, order: 1 },
    { title: 'Salesforce CRM connector', description: 'Bidirectional sync between our platform and Salesforce using REST API v58.', project: apiSuite._id, assignee: marcus._id, reporter: priya._id, status: 'Todo', priority: 'High', dueDate: new Date('2026-06-15'), labels: ['CRM', 'Integration'], estimatedHours: 20, order: 2 },
  ]);
  console.log(`✅ Created ${tasks.length} tasks`);

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('Demo login credentials:');
  console.log('  📧 Email:    admin@taskflow.io');
  console.log('  🔑 Password: password123\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
