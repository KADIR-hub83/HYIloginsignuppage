// Types
export interface User {
  id: string
  fullName: string
  type: 'talent' | 'company' | 'manager' | 'interviewer' | 'relationship manager'
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'pending' | 'active' | 'rejected'
  company: string
  submittedAt: string
  rejection?: {
    reason: string
    technicalFeedback?: string
    suggestedImprovements?: string
    category: 'scope' | 'technical' | 'budget' | 'timeline' | 'resources' | 'compliance' | 'other'
    nextSteps?: string
  }
}

export interface ManagerStats {
  projects: number
  messages: number
  requests: number
  talents: number
  pendingProjects: Project[]
  acceptedProjects: Project[]
  rejectedProjects: Project[]
}

// Helper function to simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 800))

// Manager API
export const managerApi = {
  getManagerStats: async () => {
    try {
      await simulateDelay()

      // Mock data for development
      return {
        projects: 12,
        messages: 24,
        requests: 8,
        talents: 45,
        pendingProjects: [
          {
            id: '1',
            name: 'BugZapper',
            description:
              'AI-powered bug detection and resolution tool that analyzes code in real-time, identifies potential issues, and suggests fixes based on best practices and historical data. Features machine learning models trained on millions of code samples.',
            status: 'pending',
            company: 'TechCorp Inc.',
            submittedAt: '2025-01-15',
          },
          {
            id: '2',
            name: 'CodeFlow',
            description:
              'Intelligent code review platform that automates the review process, enforces coding standards, and provides actionable insights for code quality improvement. Integrates with major version control systems.',
            status: 'pending',
            company: 'DevTools Ltd.',
            submittedAt: '2025-01-14',
          },
          {
            id: '3',
            name: 'SecureVault',
            description:
              'Enterprise-grade password management system with advanced encryption, role-based access control, and real-time security monitoring. Includes features for secure password sharing and audit logging.',
            status: 'pending',
            company: 'CyberSec Solutions',
            submittedAt: '2025-01-13',
          },
          {
            id: '4',
            name: 'AITestPro',
            description:
              'Automated testing platform powered by artificial intelligence that generates, maintains, and executes test cases based on application behavior analysis and user interaction patterns.',
            status: 'pending',
            company: 'TestWorks Inc.',
            submittedAt: '2025-01-12',
          },
          {
            id: '5',
            name: 'CloudOptimizer',
            description:
              'Cloud infrastructure optimization tool that analyzes resource usage patterns and automatically adjusts configurations to minimize costs while maintaining performance requirements. Features AI-driven resource allocation.',
            status: 'pending',
            company: 'CloudTech Systems',
            submittedAt: '2025-01-11',
          },
          {
            id: '6',
            name: 'QuantumML',
            description:
              'Next-generation machine learning platform leveraging quantum computing principles for accelerated model training and inference. Includes quantum-inspired algorithms and hybrid classical-quantum optimization.',
            status: 'pending',
            company: 'Quantum Innovations',
            submittedAt: '2025-01-10',
          },
          {
            id: '7',
            name: 'CyberShield',
            description:
              'Advanced cybersecurity platform with real-time threat detection, automated incident response, and AI-powered vulnerability assessment. Features zero-trust architecture and blockchain-based audit trails.',
            status: 'pending',
            company: 'SecureNet Defense',
            submittedAt: '2025-01-09',
          },
        ],
        acceptedProjects: [
          {
            id: '8',
            name: 'DataViz Pro',
            description:
              'Advanced data visualization and analytics dashboard with real-time updates, customizable widgets, and AI-powered insights. Built with React, D3.js, and WebSocket for live data streaming.',
            status: 'active',
            company: 'Analytics Co.',
            submittedAt: '2025-01-08',
          },
          {
            id: '9',
            name: 'SmartDocs',
            description:
              'Collaborative documentation platform with real-time editing, version control, and AI-powered content suggestions. Features automated documentation generation from code comments.',
            status: 'active',
            company: 'DocTech Ltd.',
            submittedAt: '2025-01-07',
          },
          {
            id: '10',
            name: 'DevOpsHub',
            description:
              'Unified DevOps platform that streamlines CI/CD pipelines, infrastructure management, and deployment processes. Includes advanced monitoring and alerting capabilities.',
            status: 'active',
            company: 'DevOps Solutions',
            submittedAt: '2025-01-06',
          },
          {
            id: '11',
            name: 'EdgeCompute',
            description:
              'Edge computing platform that enables real-time data processing and analytics at the network edge. Features distributed computing architecture and seamless cloud integration.',
            status: 'active',
            company: 'Edge Technologies',
            submittedAt: '2025-01-05',
          },
          {
            id: '12',
            name: 'IoTConnect',
            description:
              'Enterprise IoT management platform with device provisioning, monitoring, and analytics capabilities. Includes support for multiple protocols and edge-to-cloud data synchronization.',
            status: 'active',
            company: 'IoT Solutions Inc.',
            submittedAt: '2025-01-04',
          },
        ],
        rejectedProjects: [
          {
            id: '13',
            name: 'CloudSync',
            description:
              'Enterprise-grade cloud storage synchronization service with end-to-end encryption, version control, and real-time collaboration features.',
            status: 'rejected',
            company: 'StorageTech',
            submittedAt: '2025-01-03',
            rejection: {
              reason: 'Project scope and requirements were not clearly defined.',
              technicalFeedback:
                'The technical architecture lacks detail on data flow and security measures.',
              suggestedImprovements: 'Include detailed API specifications and data model diagrams.',
              category: 'scope',
              nextSteps:
                'Please revise the technical documentation and resubmit with detailed specifications.',
            },
          },
          {
            id: '14',
            name: 'AIChat',
            description:
              'Customer service automation platform using advanced natural language processing to handle customer inquiries and support requests.',
            status: 'rejected',
            company: 'AI Solutions',
            submittedAt: '2025-01-02',
            rejection: {
              reason: 'Similar project already in development.',
              technicalFeedback:
                'Current NLP approach lacks innovation compared to existing solutions.',
              suggestedImprovements:
                'Consider specialized domain adaptation or novel interaction patterns.',
              category: 'technical',
              nextSteps: 'Research unique differentiators and resubmit with focus on innovation.',
            },
          },
          {
            id: '15',
            name: 'BlockchainPay',
            description:
              'Decentralized payment processing system built on blockchain technology with support for multiple cryptocurrencies and traditional payment methods.',
            status: 'rejected',
            company: 'FinTech Innovations',
            submittedAt: '2025-01-01',
            rejection: {
              reason: 'Technology stack and security requirements need further evaluation.',
              technicalFeedback:
                'Missing critical security protocols for cross-chain transactions.',
              suggestedImprovements: 'Implement multi-signature wallets and audit trails.',
              category: 'compliance',
              nextSteps: 'Complete security audit and provide compliance documentation.',
            },
          },
          {
            id: '16',
            name: 'ARWorkspace',
            description:
              'Augmented reality collaboration platform for remote teams with 3D workspace visualization and holographic meetings.',
            status: 'rejected',
            company: 'AR Dynamics',
            submittedAt: '2024-12-31',
            rejection: {
              reason: 'Hardware requirements and compatibility issues need to be addressed.',
              technicalFeedback: 'Limited device support and high performance requirements.',
              suggestedImprovements: 'Add fallback 2D interface and optimize for mobile AR.',
              category: 'technical',
              nextSteps: 'Revise hardware requirements and expand device compatibility.',
            },
          },
          {
            id: '17',
            name: 'BioMetrics',
            description:
              'Advanced biometric authentication system using multi-factor biometric data and behavioral analysis for secure access control.',
            status: 'rejected',
            company: 'BioSec Systems',
            submittedAt: '2024-12-30',
            rejection: {
              reason:
                'Privacy compliance and data protection measures require significant enhancement.',
              technicalFeedback:
                "Data storage and processing methods don't meet GDPR requirements.",
              suggestedImprovements: 'Implement data minimization and encryption at rest.',
              category: 'compliance',
              nextSteps: 'Update data handling architecture with privacy-first approach.',
            },
          },
        ],
      } as ManagerStats
    } catch (error) {
      throw error
    }
  },
}
