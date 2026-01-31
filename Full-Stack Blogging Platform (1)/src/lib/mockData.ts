import { User, BlogPost, Comment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Tech enthusiast and blogger. Passionate about web development and AI.',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    bio: 'Full-stack developer and coffee lover.',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'UX designer with a passion for creating beautiful experiences.',
    createdAt: '2024-03-10T10:00:00Z'
  }
];

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-react-typescript',
    content: `# Introduction to React and TypeScript

TypeScript has become an essential tool for modern React development. In this comprehensive guide, we'll explore how to set up and use TypeScript with React to build type-safe applications.

## Why TypeScript?

TypeScript adds static typing to JavaScript, which helps catch errors during development rather than at runtime. This leads to more robust and maintainable code.

## Setting Up Your Project

First, let's create a new React project with TypeScript:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

This command sets up a new React project with TypeScript configuration out of the box.

## Defining Component Props

One of the key benefits of TypeScript is type-safe props:

\`\`\`typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  return <button onClick={onClick}>{text}</button>;
};
\`\`\`

## State Management

TypeScript also helps with state management:

\`\`\`typescript
const [count, setCount] = useState<number>(0);
\`\`\`

## Conclusion

TypeScript and React together create a powerful combination for building modern web applications. The type safety and developer experience improvements are well worth the small learning curve.`,
    excerpt: 'Learn how to combine React and TypeScript to build type-safe, robust web applications.',
    coverImage: 'https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc2NDg2Nzc2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    authorId: '1',
    author: mockUsers[0],
    tags: ['React', 'TypeScript', 'Web Development'],
    published: true,
    views: 1234,
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'The Future of AI in Web Development',
    slug: 'future-ai-web-development',
    content: `# The Future of AI in Web Development

Artificial Intelligence is transforming how we build and interact with web applications. Let's explore the emerging trends and possibilities.

## AI-Powered Development Tools

Modern AI tools are revolutionizing the development workflow:

- Code completion and suggestions
- Automated testing and bug detection
- Design-to-code conversion
- Performance optimization

## Natural Language Interfaces

The rise of AI chatbots and voice interfaces is changing user interaction patterns. Developers need to consider:

1. Conversational UI design
2. Context awareness
3. Multi-modal interactions

## Personalization at Scale

AI enables unprecedented levels of personalization:

\`\`\`javascript
// AI-driven content recommendation
const recommendations = await getPersonalizedContent(userId);
\`\`\`

## Ethical Considerations

As we embrace AI, we must consider:

- Data privacy and security
- Algorithmic bias
- Transparency and explainability

## The Road Ahead

The integration of AI in web development is just beginning. The next decade will bring exciting innovations that we can barely imagine today.`,
    excerpt: 'Explore how artificial intelligence is reshaping web development and what it means for the future.',
    coverImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2V8ZW58MXx8fHwxNzY0ODg5MTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    authorId: '2',
    author: mockUsers[1],
    tags: ['AI', 'Machine Learning', 'Future Tech'],
    published: true,
    views: 2341,
    createdAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Designing Accessible User Interfaces',
    slug: 'designing-accessible-user-interfaces',
    content: `# Designing Accessible User Interfaces

Accessibility is not just a feature—it's a fundamental requirement. Let's explore how to create inclusive web experiences.

## Understanding WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide a framework for accessible design:

- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: UI components must be operable by all users
- **Understandable**: Information and operation must be understandable
- **Robust**: Content must be robust enough to work with assistive technologies

## Color and Contrast

Ensure sufficient color contrast for text:

\`\`\`css
/* Good contrast ratio */
.text {
  color: #333;
  background: #fff;
}
\`\`\`

## Keyboard Navigation

All interactive elements should be keyboard accessible:

1. Logical tab order
2. Visible focus indicators
3. Skip navigation links

## Screen Reader Support

Use semantic HTML and ARIA labels:

\`\`\`html
<button aria-label="Close dialog">×</button>
\`\`\`

## Testing for Accessibility

Regular testing with:
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Automated tools (axe, Lighthouse)

## Conclusion

Accessible design benefits everyone, not just users with disabilities. It leads to better, more usable products for all.`,
    excerpt: 'A comprehensive guide to creating web interfaces that everyone can use, regardless of their abilities.',
    coverImage: 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdyaXRpbmd8ZW58MXx8fHwxNzY0OTI4ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    authorId: '3',
    author: mockUsers[2],
    tags: ['UX Design', 'Accessibility', 'Web Standards'],
    published: true,
    views: 987,
    createdAt: '2024-11-25T09:15:00Z',
    updatedAt: '2024-11-25T09:15:00Z'
  },
  {
    id: '4',
    title: 'Mastering CSS Grid and Flexbox',
    slug: 'mastering-css-grid-flexbox',
    content: `# Mastering CSS Grid and Flexbox

Modern CSS layout techniques have revolutionized web design. Let's dive deep into Grid and Flexbox.

## When to Use What

- **Flexbox**: One-dimensional layouts (rows or columns)
- **Grid**: Two-dimensional layouts (rows and columns)

## Flexbox Fundamentals

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## Grid Power

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
\`\`\`

## Practical Examples

Combining both techniques creates powerful, responsive layouts without media queries!

## Browser Support

Both Flexbox and Grid have excellent browser support in modern browsers.`,
    excerpt: 'Master the two most powerful CSS layout systems for creating responsive, modern web designs.',
    coverImage: 'https://images.unsplash.com/photo-1566709603547-638aba3dbbc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwYmxvZyUyMGRlc2t8ZW58MXx8fHwxNzY0OTEyNjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    authorId: '1',
    author: mockUsers[0],
    tags: ['CSS', 'Layout', 'Responsive Design'],
    published: true,
    views: 1567,
    createdAt: '2024-11-28T11:00:00Z',
    updatedAt: '2024-11-28T11:00:00Z'
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    user: mockUsers[1],
    content: 'Great article! TypeScript has really improved my React development workflow.',
    createdAt: '2024-11-16T08:30:00Z'
  },
  {
    id: '2',
    postId: '1',
    userId: '3',
    user: mockUsers[2],
    content: 'Thanks for the clear explanation. The code examples are very helpful!',
    createdAt: '2024-11-17T14:20:00Z'
  },
  {
    id: '3',
    postId: '2',
    userId: '1',
    user: mockUsers[0],
    content: 'Fascinating perspective on AI in web dev. Looking forward to seeing how this evolves.',
    createdAt: '2024-11-21T10:15:00Z'
  },
  {
    id: '4',
    postId: '3',
    userId: '2',
    user: mockUsers[1],
    content: 'Accessibility is so important. Everyone should read this!',
    createdAt: '2024-11-26T16:45:00Z'
  }
];

// Helper function to get current user (in real app, this would come from auth)
export const getCurrentUser = (): User => mockUsers[0];

// Helper function to get posts by author
export const getPostsByAuthor = (authorId: string): BlogPost[] => {
  return mockPosts.filter(post => post.authorId === authorId);
};

// Helper function to get comments for a post
export const getCommentsByPost = (postId: string): Comment[] => {
  return mockComments.filter(comment => comment.postId === postId);
};
