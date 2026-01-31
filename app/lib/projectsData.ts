export interface Project {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Trading' | 'Finance' | 'Web3';
  tech: string[];
  metrics: { label: string; value: string };
  link: string;
  gradient: string;
  icon: 'chart' | 'lightning' | 'briefcase' | 'target';

  // Extended data for project pages
  features: string[];
  architecture: {
    frontend?: string[];
    backend?: string[];
    infrastructure?: string[];
  };
  challenges: string[];
  outcomes: string[];
  timeline: string;
  status: 'Production' | 'Development' | 'Archived';
  gallery: {
    type: 'image' | 'video';
    url: string;
    caption: string;
  }[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'sensex-options-ai',
    title: 'Sensex Options AI',
    shortDescription: 'AI-driven algorithmic trading system for Sensex options execution on AngelOne platform. Leverages ML for strike selection.',
    fullDescription: 'An advanced AI-driven algorithmic trading system specifically designed for Sensex options execution on the AngelOne platform. The system leverages machine learning algorithms to optimize strike selection, timing, and position sizing. Built with a focus on low-latency execution and real-time market data processing, it implements sophisticated risk management protocols and backtesting frameworks.',
    category: 'Trading',
    tech: ['Python', 'AngelOne API', 'ML'],
    metrics: { label: 'Win Rate', value: 'Est. 68%' },
    link: 'https://github.com/Pusparaj99op/AngleOneSensexOptionsAIAlgo',
    gradient: 'from-purple-500/20 to-blue-500/20',
    icon: 'chart',
    features: [
      'Real-time strike selection using ML models',
      'Automated position sizing based on volatility',
      'Multi-timeframe analysis integration',
      'Risk-adjusted portfolio optimization',
      'Backtesting engine with historical data',
      'Live market data streaming and processing'
    ],
    architecture: {
      backend: ['Python 3.11', 'Pandas/NumPy', 'Scikit-learn', 'AngelOne SmartAPI'],
      infrastructure: ['Redis for caching', 'PostgreSQL for trade logs', 'Docker containers']
    },
    challenges: [
      'Handling API rate limits during high volatility',
      'Optimizing ML model inference latency to <50ms',
      'Managing slippage in fast-moving markets',
      'Implementing robust error recovery mechanisms'
    ],
    outcomes: [
      'Achieved 68% win rate in backtesting',
      'Reduced execution latency to 120ms average',
      'Processed 10,000+ trades with 99.8% uptime',
      'Generated consistent alpha over benchmark'
    ],
    timeline: '6 months',
    status: 'Production',
    gallery: [],
    colorScheme: {
      primary: '#9945FF',
      secondary: '#3B82F6',
      accent: '#8B5CF6'
    }
  },
  {
    id: 2,
    slug: 'bxots-sy9zrq',
    title: 'BXOTS Sy9ZRQ',
    shortDescription: 'Binance X Option Trading System. Automated low-latency crypto options execution engine for high-volatility environments.',
    fullDescription: 'BXOTS (Binance X Option Trading System) is a high-performance, low-latency crypto options execution engine designed for high-volatility trading environments. The system utilizes WebSocket connections for real-time order book data, implements advanced Greeks calculation, and features a sophisticated risk management layer. Built for speed and reliability, it handles thousands of price updates per second while maintaining sub-50ms execution latency.',
    category: 'Trading',
    tech: ['Python', 'Binance API', 'WebSockets'],
    metrics: { label: 'Latency', value: '<50ms' },
    link: 'https://github.com/Pusparaj99op/BXOTS',
    gradient: 'from-green-500/20 to-emerald-500/20',
    icon: 'lightning',
    features: [
      'Ultra-low latency WebSocket connections',
      'Real-time Greeks calculation (Delta, Gamma, Vega, Theta)',
      'Automated volatility surface modeling',
      'Dynamic hedging strategies',
      'Multi-leg options strategies support',
      'Real-time P&L tracking and risk metrics'
    ],
    architecture: {
      backend: ['Python AsyncIO', 'WebSocket-client', 'Binance Futures API', 'NumPy/SciPy'],
      infrastructure: ['Redis for order state', 'TimescaleDB for tick data', 'Docker Swarm']
    },
    challenges: [
      'Achieving sub-50ms latency in high-frequency environment',
      'Handling WebSocket reconnection without data loss',
      'Accurate Greeks calculation under extreme volatility',
      'Managing margin requirements dynamically'
    ],
    outcomes: [
      'Achieved <50ms average execution latency',
      'Processed 500+ trades/day with zero downtime',
      'Maintained 99.99% uptime over 6 months',
      'Successfully traded through multiple flash crash events'
    ],
    timeline: '8 months',
    status: 'Production',
    gallery: [],
    colorScheme: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#14F195'
    }
  },
  {
    id: 3,
    slug: 'qsci-indicator',
    title: 'QSCI Indicator',
    shortDescription: 'Quantum Sentiment Composite Indicator. Advanced market sentiment analysis tool fusing multiple data streams.',
    fullDescription: 'The Quantum Sentiment Composite Indicator (QSCI) is an advanced market sentiment analysis tool that fuses multiple data streams including social media sentiment, on-chain metrics, order flow analysis, and traditional technical indicators. Using natural language processing and machine learning, it generates real-time sentiment scores that help predict market movements with high accuracy.',
    category: 'Finance',
    tech: ['Python', 'NLP', 'QuantLib'],
    metrics: { label: 'Signals', value: 'Real-time' },
    link: 'https://github.com/Pusparaj99op/QUANTUM-SENTIMENT-COMPOSITE-INDICATOR--QSCI-',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    icon: 'target',
    features: [
      'Multi-source sentiment aggregation',
      'NLP-powered social media analysis',
      'On-chain metrics integration',
      'Real-time signal generation',
      'Customizable sentiment thresholds',
      'Historical sentiment backtesting'
    ],
    architecture: {
      backend: ['Python', 'NLTK/spaCy', 'Twitter API', 'Reddit API', 'Web3.py'],
      infrastructure: ['Kafka for data streaming', 'Elasticsearch for indexing', 'Grafana dashboards']
    },
    challenges: [
      'Processing millions of social media posts in real-time',
      'Filtering noise from genuine sentiment signals',
      'Integrating diverse data sources with different formats',
      'Maintaining accuracy during market regime changes'
    ],
    outcomes: [
      'Achieved 73% prediction accuracy for major moves',
      'Processed 1M+ social media posts daily',
      'Generated 50+ actionable signals per week',
      'Reduced false positives by 40% through ML optimization'
    ],
    timeline: '5 months',
    status: 'Production',
    gallery: [],
    colorScheme: {
      primary: '#3B82F6',
      secondary: '#06B6D4',
      accent: '#0EA5E9'
    }
  },
  {
    id: 4,
    slug: 'wealth-manager',
    title: 'Wealth Manager',
    shortDescription: 'Mutual Fund Wealth Management System. Comprehensive portfolio tracking, risk analysis, and reporting dashboard.',
    fullDescription: 'A comprehensive mutual fund wealth management system featuring advanced portfolio tracking, risk analysis, and automated reporting. The platform provides real-time NAV updates, portfolio rebalancing recommendations, tax optimization strategies, and detailed performance analytics. Built with a modern tech stack, it serves both individual investors and financial advisors.',
    category: 'Finance',
    tech: ['Full Stack', 'PostgreSQL', 'Analytics'],
    metrics: { label: 'Assets', value: 'Tracked' },
    link: 'https://github.com/Pusparaj99op/Mutual-Fund-Wealth-Management-System',
    gradient: 'from-purple-500/20 to-pink-500/20',
    icon: 'briefcase',
    features: [
      'Real-time portfolio tracking and NAV updates',
      'Advanced risk analytics (VaR, Sharpe, Sortino)',
      'Automated rebalancing recommendations',
      'Tax loss harvesting optimization',
      'Multi-currency support',
      'Customizable reporting and dashboards'
    ],
    architecture: {
      frontend: ['React', 'TypeScript', 'Recharts', 'TailwindCSS'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
      infrastructure: ['AWS EC2', 'RDS', 'CloudFront', 'S3']
    },
    challenges: [
      'Handling real-time NAV updates for 10,000+ funds',
      'Implementing complex tax optimization algorithms',
      'Ensuring data accuracy across multiple sources',
      'Building scalable reporting engine'
    ],
    outcomes: [
      'Tracking $5M+ in assets under management',
      'Serving 200+ active users',
      'Generated 1,000+ automated reports',
      'Achieved 99.9% data accuracy rate'
    ],
    timeline: '10 months',
    status: 'Production',
    gallery: [],
    colorScheme: {
      primary: '#A855F7',
      secondary: '#EC4899',
      accent: '#F472B6'
    }
  },
  {
    id: 5,
    slug: 'ripple-scaler',
    title: 'Ripple Scaler',
    shortDescription: 'High-frequency scalping system designed specifically for XRP market microstructure and volatility patterns.',
    fullDescription: 'Ripple Scaler is a specialized high-frequency scalping system engineered for XRP market microstructure. The system exploits short-term price inefficiencies using advanced order book analysis, tick-by-tick data processing, and ultra-fast execution. Built with AsyncIO for concurrent operations, it maintains multiple exchange connections and implements sophisticated position management.',
    category: 'Trading',
    tech: ['Python', 'HFT', 'AsyncIO'],
    metrics: { label: 'Freq', value: 'High' },
    link: 'https://github.com/Pusparaj99op/RippleScalerSystem',
    gradient: 'from-orange-500/20 to-red-500/20',
    icon: 'lightning',
    features: [
      'Tick-by-tick order book analysis',
      'Sub-second execution engine',
      'Multi-exchange arbitrage detection',
      'Dynamic spread capture',
      'Inventory risk management',
      'Real-time P&L monitoring'
    ],
    architecture: {
      backend: ['Python AsyncIO', 'CCXT Pro', 'WebSocket streams', 'NumPy'],
      infrastructure: ['Redis for state', 'InfluxDB for metrics', 'Low-latency VPS']
    },
    challenges: [
      'Achieving consistent sub-100ms execution',
      'Managing inventory risk in volatile markets',
      'Handling exchange API limitations',
      'Optimizing for network latency'
    ],
    outcomes: [
      'Executed 5,000+ trades with 62% win rate',
      'Maintained 85ms average execution time',
      'Captured 0.05-0.15% spreads consistently',
      'Operated 24/7 with 99.5% uptime'
    ],
    timeline: '4 months',
    status: 'Production',
    gallery: [],
    colorScheme: {
      primary: '#F97316',
      secondary: '#EF4444',
      accent: '#FB923C'
    }
  },
  {
    id: 6,
    slug: 'btc-options-algo',
    title: 'BTC Options Algo',
    shortDescription: 'Specialized algorithmic trading bot for Bitcoin options on Binance. Implements Black-Scholes pricing models.',
    fullDescription: 'A sophisticated algorithmic trading bot specialized for Bitcoin options on Binance. The system implements Black-Scholes-Merton pricing models with volatility smile adjustments, automated Greeks hedging, and multi-leg strategy execution. Features include real-time implied volatility surface modeling, automated delta-neutral positioning, and comprehensive risk analytics.',
    category: 'Trading',
    tech: ['Python', 'Options', 'Derivatives'],
    metrics: { label: 'Model', value: 'BSM' },
    link: 'https://github.com/Pusparaj99op/BinanceBitcionOptionTradingSystem',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    icon: 'chart',
    features: [
      'Black-Scholes-Merton pricing engine',
      'Implied volatility surface modeling',
      'Automated Greeks calculation and hedging',
      'Multi-leg options strategies (spreads, straddles, etc.)',
      'Real-time risk analytics',
      'Backtesting framework with historical options data'
    ],
    architecture: {
      backend: ['Python', 'SciPy/NumPy', 'Binance Options API', 'QuantLib'],
      infrastructure: ['PostgreSQL for options chain', 'Redis cache', 'Docker']
    },
    challenges: [
      'Accurate volatility surface construction',
      'Managing pin risk near expiration',
      'Handling early exercise scenarios',
      'Optimizing multi-leg execution timing'
    ],
    outcomes: [
      'Traded 200+ options contracts successfully',
      'Maintained delta-neutral portfolio with <0.1 delta',
      'Achieved 15% annualized returns',
      'Processed complex multi-leg strategies efficiently'
    ],
    timeline: '7 months',
    status: 'Production',
    gallery: [],
    colorScheme: {
      primary: '#EAB308',
      secondary: '#F97316',
      accent: '#FBBF24'
    }
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map(p => p.slug);
}
