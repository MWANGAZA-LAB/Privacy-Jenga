import { EnhancedQuestion } from '../types';

// Enhanced Bitcoin Privacy Questions Database
// 54 questions matching the original physical Jenga blocks exactly
export const ENHANCED_PRIVACY_QUESTIONS: EnhancedQuestion[] = [
  // ===== 🔴 RED BLOCKS (High Risk - HARD Difficulty) =====
  
  // RED 1: Putting identifiable information in an OP_RETURN
  {
    id: 'red-001',
    type: 'multiple_choice',
    difficulty: 'hard',
    category: 'on-chain',
    question: 'What privacy risk occurs when putting identifiable information in an OP_RETURN?',
    options: [
      'It increases transaction fees',
      'It permanently links your identity to the transaction on the blockchain',
      'It slows down transaction confirmation',
      'It reduces the transaction size'
    ],
    correctIndex: 1,
    explanation: 'OP_RETURN data is permanently stored on the blockchain and can contain identifiable information that links your identity to the transaction, creating a permanent privacy risk.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['op_return', 'blockchain-privacy', 'identity-linkage'],
  },

  // RED 2: Publicly sharing your IP address
  {
    id: 'red-002',
    type: 'scenario',
    difficulty: 'hard',
    category: 'network-privacy',
    question: 'Alice shares her IP address publicly while using Bitcoin. What is the main privacy risk?',
    options: [
      'Her transactions will be slower',
      'Her IP can be linked to her Bitcoin transactions and location',
      'Her wallet will be compromised',
      'Her fees will increase'
    ],
    correctIndex: 1,
    explanation: 'Sharing your IP address publicly can link your physical location and identity to your Bitcoin transactions, creating a significant privacy risk.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['ip-address', 'location-privacy', 'identity-linkage'],
  },

  // RED 3: Using compromised wallet
  {
    id: 'red-003',
    type: 'multiple_choice',
    difficulty: 'hard',
    category: 'wallet-setup',
    question: 'What is the primary risk of using a compromised wallet?',
    options: [
      'Higher transaction fees',
      'Loss of all funds and complete privacy compromise',
      'Slower transaction processing',
      'Limited functionality'
    ],
    correctIndex: 1,
    explanation: 'A compromised wallet can lead to complete loss of funds and compromise of all privacy, as the attacker gains full control over your private keys.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['wallet-security', 'compromise', 'fund-loss'],
  },

  // RED 4: Using a compromised ISP
  {
    id: 'red-004',
    type: 'true_false',
    difficulty: 'hard',
    category: 'network-privacy',
    question: 'Using a compromised ISP can expose all your Bitcoin transactions and browsing activity.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'A compromised ISP can monitor all your internet traffic, including Bitcoin transactions, wallet connections, and browsing activity, creating a major privacy risk.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['isp', 'network-monitoring', 'traffic-analysis'],
  },

  // RED 5: Exclusively using exchanges to manage all transactions
  {
    id: 'red-005',
    type: 'scenario',
    difficulty: 'hard',
    category: 'exchange-privacy',
    question: 'Bob uses only exchanges for all his Bitcoin transactions. What privacy risk does this create?',
    options: [
      'Higher fees',
      'Complete surveillance of all financial activity by exchange and authorities',
      'Slower transactions',
      'Limited coin selection'
    ],
    correctIndex: 1,
    explanation: 'Using only exchanges creates complete surveillance of all financial activity, as exchanges are required to report to authorities and can track all your transactions.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['exchange-surveillance', 'kyc', 'financial-tracking'],
  },

  // RED 6: Sharing the location of your bitcoin private keys
  {
    id: 'red-006',
    type: 'multiple_choice',
    difficulty: 'hard',
    category: 'wallet-setup',
    question: 'What happens when you share the location of your Bitcoin private keys?',
    options: [
      'Nothing, keys are just information',
      'Anyone who finds them can steal all your funds',
      'It improves security',
      'It helps with backup'
    ],
    correctIndex: 1,
    explanation: 'Sharing the location of your private keys is equivalent to giving someone access to steal all your funds, as private keys provide complete control over Bitcoin addresses.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['private-keys', 'security', 'fund-theft'],
  },

  // RED 7: Using public bitcoin APIs that log your data
  {
    id: 'red-007',
    type: 'true_false',
    difficulty: 'hard',
    category: 'api-privacy',
    question: 'Public Bitcoin APIs that log your data can track your IP address and query patterns.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Public Bitcoin APIs often log IP addresses, query patterns, and usage data, which can be used to track your Bitcoin activity and link it to your identity.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['api-logging', 'ip-tracking', 'query-patterns'],
  },

  // RED 8: Storing your private keys in a browser extension
  {
    id: 'red-008',
    type: 'scenario',
    difficulty: 'hard',
    category: 'wallet-setup',
    question: 'What is the main risk of storing private keys in a browser extension?',
    options: [
      'Slower performance',
      'Browser extensions can be compromised and steal your keys',
      'Limited functionality',
      'Higher fees'
    ],
    correctIndex: 1,
    explanation: 'Browser extensions can be compromised, updated maliciously, or have vulnerabilities that expose your private keys to attackers.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['browser-extension', 'key-storage', 'compromise-risk'],
  },

  // RED 9: Putting your bitcoin address on your business card
  {
    id: 'red-009',
    type: 'multiple_choice',
    difficulty: 'hard',
    category: 'social-privacy',
    question: 'What privacy risk occurs when putting your Bitcoin address on your business card?',
    options: [
      'No risk, addresses are public',
      'It links your real identity to all transactions to that address',
      'It increases transaction fees',
      'It improves security'
    ],
    correctIndex: 1,
    explanation: 'Putting your Bitcoin address on a business card links your real identity to all transactions involving that address, creating a permanent privacy risk.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['address-sharing', 'identity-linkage', 'business-privacy'],
  },

  // RED 10: Sending your bitcoin to a malicious entity
  {
    id: 'red-010',
    type: 'scenario',
    difficulty: 'hard',
    category: 'transaction-security',
    question: 'What happens when you send Bitcoin to a malicious entity?',
    options: [
      'The transaction will be reversed',
      'Your funds are permanently lost and may be used for illegal activities',
      'You can recover the funds later',
      'Nothing, it\'s just a transaction'
    ],
    correctIndex: 1,
    explanation: 'Sending Bitcoin to a malicious entity results in permanent loss of funds, and the transaction may be used to link you to illegal activities.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['malicious-entity', 'fund-loss', 'illegal-activities'],
  },

  // RED 11: Tweeting about engagement in illicit activity
  {
    id: 'red-011',
    type: 'true_false',
    difficulty: 'hard',
    category: 'social-privacy',
    question: 'Tweeting about engagement in illicit activity can link your identity to Bitcoin transactions.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Tweeting about illicit activities can link your identity to Bitcoin transactions and create evidence that can be used against you legally.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['social-media', 'illicit-activity', 'legal-evidence'],
  },

  // RED 12: Spending KYC bitcoin
  {
    id: 'red-012',
    type: 'multiple_choice',
    difficulty: 'hard',
    category: 'kyc-privacy',
    question: 'What happens when you spend KYC Bitcoin?',
    options: [
      'Nothing, it\'s just a transaction',
      'Your identity is permanently linked to the transaction and can be tracked',
      'The transaction is faster',
      'You get better privacy'
    ],
    correctIndex: 1,
    explanation: 'Spending KYC Bitcoin permanently links your identity to the transaction, as the source of the funds is already identified through the exchange.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['kyc', 'identity-linkage', 'transaction-tracking'],
  },

  // RED 13: Submitting your private keys to a malicious software wallet
  {
    id: 'red-013',
    type: 'scenario',
    difficulty: 'hard',
    category: 'wallet-setup',
    question: 'What is the immediate consequence of submitting private keys to a malicious software wallet?',
    options: [
      'The wallet will work normally',
      'Complete loss of all funds as the attacker gains full control',
      'You can recover the keys later',
      'The wallet will be more secure'
    ],
    correctIndex: 1,
    explanation: 'Submitting private keys to a malicious wallet gives the attacker complete control over all your funds, resulting in immediate and total loss.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['malicious-wallet', 'key-submission', 'fund-loss'],
  },

  // RED 14: Tweeting an image of your transaction
  {
    id: 'red-014',
    type: 'true_false',
    difficulty: 'hard',
    category: 'social-privacy',
    question: 'Tweeting an image of your Bitcoin transaction can reveal your wallet address and transaction details.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Tweeting transaction images can reveal wallet addresses, transaction amounts, and other details that link your identity to specific Bitcoin activity.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['transaction-sharing', 'wallet-revelation', 'social-media'],
  },

  // RED 15: Posting your bitcoin wallet address on your website for donations
  {
    id: 'red-015',
    type: 'multiple_choice',
    difficulty: 'hard',
    category: 'social-privacy',
    question: 'What privacy risk occurs when posting a Bitcoin address on your website for donations?',
    options: [
      'No risk, addresses are meant to be shared',
      'It links your identity to all incoming transactions and spending patterns',
      'It improves security',
      'It reduces fees'
    ],
    correctIndex: 1,
    explanation: 'Posting a Bitcoin address on your website links your identity to all incoming donations and any subsequent spending from that address.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['donation-address', 'identity-linkage', 'spending-patterns'],
  },

  // RED 16: Repeatedly reusing the same address
  {
    id: 'red-016',
    type: 'scenario',
    difficulty: 'hard',
    category: 'on-chain',
    question: 'Alice repeatedly reuses the same Bitcoin address. What privacy risk does this create?',
    options: [
      'No risk, addresses are public anyway',
      'All her transactions are linked together, creating a complete spending history',
      'It improves security',
      'It reduces fees'
    ],
    correctIndex: 1,
    explanation: 'Reusing the same address links all transactions together, creating a complete spending history that can be analyzed and tracked.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['address-reuse', 'transaction-linking', 'spending-history'],
  },

  // RED 17: Inputting private information into a phishing attack
  {
    id: 'red-017',
    type: 'multiple_choice',
    difficulty: 'hard',
    category: 'security',
    question: 'What happens when you input private information into a phishing attack?',
    options: [
      'Nothing, it\'s just a form',
      'Your private keys and identity information are stolen',
      'The website will work normally',
      'You get better security'
    ],
    correctIndex: 1,
    explanation: 'Phishing attacks steal private keys and identity information, giving attackers complete control over your funds and personal data.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['phishing', 'key-theft', 'identity-theft'],
  },

  // RED 18: Selling bitcoin on a KYC exchange
  {
    id: 'red-018',
    type: 'true_false',
    difficulty: 'hard',
    category: 'exchange-privacy',
    question: 'Selling Bitcoin on a KYC exchange permanently links your identity to the transaction.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'KYC exchanges require identity verification and report transactions to authorities, permanently linking your identity to the Bitcoin transaction.',
    stabilityImpact: { correct: 20, incorrect: -35 },
    points: { correct: 25, incorrect: 0 },
    learningTags: ['kyc-exchange', 'identity-linkage', 'authority-reporting'],

  },

  // ===== 🟠 ORANGE BLOCKS (Medium Risk - MEDIUM Difficulty) =====

  // ORANGE 1: Logging into wallet or exchange from a public shared computer
  {
    id: 'orange-001',
    type: 'scenario',
    difficulty: 'medium',
    category: 'security',
    question: 'What risk occurs when logging into a wallet from a public computer?',
    options: [
      'Slower performance',
      'Keyloggers or malware can steal your credentials',
      'Higher fees',
      'Limited functionality'
    ],
    correctIndex: 1,
    explanation: 'Public computers may have keyloggers or malware that can capture your passwords, private keys, or other sensitive information.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['public-computer', 'keylogger', 'malware'],
  },

  // ORANGE 2: Creating unique and identifiable transaction structures
  {
    id: 'orange-002',
    type: 'multiple_choice',
    difficulty: 'medium',
    category: 'on-chain',
    question: 'How can unique transaction structures compromise privacy?',
    options: [
      'They increase fees',
      'They create identifiable patterns that can be linked to specific wallets',
      'They slow down confirmations',
      'They reduce security'
    ],
    correctIndex: 1,
    explanation: 'Unique transaction structures create identifiable patterns that blockchain analysis can use to link transactions to specific wallets or individuals.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['transaction-structure', 'fingerprinting', 'pattern-analysis'],
  },

  // ORANGE 3: Spending funds from a dust attack
  {
    id: 'orange-003',
    type: 'true_false',
    difficulty: 'medium',
    category: 'on-chain',
    question: 'Spending funds from a dust attack can link your wallet to the attacker\'s address.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Dust attacks send small amounts to many addresses to track which ones are active. Spending these funds links your wallet to the attacker\'s address.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['dust-attack', 'wallet-tracking', 'address-linking'],
  },

  // ORANGE 4: Combining inputs from many UTXOs into a single transaction
  {
    id: 'orange-004',
    type: 'scenario',
    difficulty: 'medium',
    category: 'on-chain',
    question: 'What privacy risk occurs when combining many UTXOs in one transaction?',
    options: [
      'Higher fees',
      'It reveals that all UTXOs belong to the same wallet',
      'Slower confirmation',
      'Better privacy'
    ],
    correctIndex: 1,
    explanation: 'Combining many UTXOs in one transaction reveals that all inputs belong to the same wallet, linking previously separate transaction histories.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['utxo-consolidation', 'wallet-linking', 'transaction-history'],
  },

  // ORANGE 5: Using a software wallet that fingerprints all transactions
  {
    id: 'orange-005',
    type: 'multiple_choice',
    difficulty: 'medium',
    category: 'wallet-setup',
    question: 'What is transaction fingerprinting in Bitcoin wallets?',
    options: [
      'A security feature',
      'Creating unique transaction patterns that can identify the wallet software',
      'A privacy enhancement',
      'A fee optimization'
    ],
    correctIndex: 1,
    explanation: 'Transaction fingerprinting occurs when wallet software creates unique patterns in transactions that can identify the specific wallet software being used.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['transaction-fingerprinting', 'wallet-identification', 'software-patterns'],
  },

  // ORANGE 6: Reusing an address for a second transaction
  {
    id: 'orange-006',
    type: 'true_false',
    difficulty: 'medium',
    category: 'on-chain',
    question: 'Reusing an address for a second transaction links the two transactions together.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Reusing an address links multiple transactions together, making it easier for blockchain analysis to track spending patterns.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['address-reuse', 'transaction-linking', 'spending-patterns'],
  },

  // ORANGE 7: Posting to twitter complaining that your transaction hasn't been mined
  {
    id: 'orange-007',
    type: 'scenario',
    difficulty: 'medium',
    category: 'social-privacy',
    question: 'What privacy risk occurs when complaining on Twitter about unmined transactions?',
    options: [
      'No risk, it\'s just a complaint',
      'It can reveal your transaction details and wallet activity',
      'It improves transaction speed',
      'It helps with fees'
    ],
    correctIndex: 1,
    explanation: 'Complaining about unmined transactions can reveal transaction details, fees, and wallet activity that can be linked to your identity.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['transaction-complaints', 'wallet-activity', 'social-media'],
  },

  // ORANGE 8: Sharing how much bitcoin you own
  {
    id: 'orange-008',
    type: 'multiple_choice',
    difficulty: 'medium',
    category: 'social-privacy',
    question: 'What risk occurs when sharing how much Bitcoin you own?',
    options: [
      'No risk, it\'s just information',
      'It makes you a target for theft and can link your identity to transactions',
      'It improves security',
      'It helps with privacy'
    ],
    correctIndex: 1,
    explanation: 'Sharing Bitcoin holdings makes you a target for theft and can link your identity to specific transactions and addresses.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['wealth-disclosure', 'theft-target', 'identity-linkage'],
  },

  // ORANGE 9: Sharing screenshots of wallets with identifiable information
  {
    id: 'orange-009',
    type: 'true_false',
    difficulty: 'medium',
    category: 'social-privacy',
    question: 'Sharing wallet screenshots can reveal addresses, balances, and transaction history.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Wallet screenshots can reveal addresses, balances, transaction history, and other sensitive information that compromises privacy.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['wallet-screenshots', 'balance-revelation', 'transaction-history'],
  },

  // ORANGE 10: Using an app that allows SMS password retrieval
  {
    id: 'orange-010',
    type: 'scenario',
    difficulty: 'medium',
    category: 'security',
    question: 'What security risk occurs with SMS password retrieval?',
    options: [
      'No risk, SMS is secure',
      'SMS can be intercepted, allowing account takeover',
      'It improves security',
      'It reduces fees'
    ],
    correctIndex: 1,
    explanation: 'SMS can be intercepted through SIM swapping or other attacks, allowing attackers to reset passwords and gain account access.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['sms-security', 'sim-swapping', 'account-takeover'],
  },

  // ORANGE 11: Installing suspicious browser extensions
  {
    id: 'orange-011',
    type: 'multiple_choice',
    difficulty: 'medium',
    category: 'security',
    question: 'What risk occurs when installing suspicious browser extensions?',
    options: [
      'Slower browsing',
      'Extensions can access your browsing data and potentially steal information',
      'Higher fees',
      'Better functionality'
    ],
    correctIndex: 1,
    explanation: 'Suspicious browser extensions can access your browsing data, passwords, and potentially steal sensitive information including cryptocurrency credentials.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['browser-extensions', 'data-access', 'credential-theft'],
  },

  // ORANGE 12: Linking lightning node public key to your public identity
  {
    id: 'orange-012',
    type: 'true_false',
    difficulty: 'medium',
    category: 'lightning',
    question: 'Linking your Lightning node public key to your identity can reveal payment patterns.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Linking your Lightning node public key to your identity can reveal payment patterns, channel balances, and routing information.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['lightning-node', 'payment-patterns', 'channel-balances'],
  },

  // ORANGE 13: Delivering bitcoin hardware to your home address
  {
    id: 'orange-013',
    type: 'scenario',
    difficulty: 'medium',
    category: 'physical-privacy',
    question: 'What privacy risk occurs when having Bitcoin hardware delivered to your home?',
    options: [
      'No risk, it\'s just delivery',
      'It links your physical address to Bitcoin ownership',
      'It improves security',
      'It reduces costs'
    ],
    correctIndex: 1,
    explanation: 'Having Bitcoin hardware delivered to your home address links your physical location to Bitcoin ownership, creating a privacy risk.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['hardware-delivery', 'address-linkage', 'ownership-revelation'],
  },

  // ORANGE 14: Public sharing about tax evasion
  {
    id: 'orange-014',
    type: 'multiple_choice',
    difficulty: 'medium',
    category: 'regulatory',
    question: 'What risk occurs when publicly sharing about tax evasion?',
    options: [
      'No risk, it\'s just discussion',
      'It can provide evidence for legal action and link you to transactions',
      'It improves privacy',
      'It reduces taxes'
    ],
    correctIndex: 1,
    explanation: 'Publicly sharing about tax evasion can provide evidence for legal action and link your identity to specific Bitcoin transactions.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['tax-evasion', 'legal-evidence', 'transaction-linkage'],
  },

  // ORANGE 15: Using extremely outdated software
  {
    id: 'orange-015',
    type: 'true_false',
    difficulty: 'medium',
    category: 'security',
    question: 'Using extremely outdated Bitcoin software can expose you to security vulnerabilities.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Outdated software may contain known security vulnerabilities that can be exploited to compromise your funds or privacy.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['outdated-software', 'security-vulnerabilities', 'exploitation'],
  },

  // ORANGE 16: Using a compromised block explorer
  {
    id: 'orange-016',
    type: 'scenario',
    difficulty: 'medium',
    category: 'network-privacy',
    question: 'What risk occurs when using a compromised block explorer?',
    options: [
      'Slower performance',
      'Your queries and IP address can be logged and tracked',
      'Higher fees',
      'Better functionality'
    ],
    correctIndex: 1,
    explanation: 'A compromised block explorer can log your queries, IP address, and browsing patterns, creating a privacy risk.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['block-explorer', 'query-logging', 'ip-tracking'],
  },

  // ORANGE 17: Storing your private keys in the cloud
  {
    id: 'orange-017',
    type: 'multiple_choice',
    difficulty: 'medium',
    category: 'wallet-setup',
    question: 'What risk occurs when storing private keys in the cloud?',
    options: [
      'No risk, cloud is secure',
      'Cloud services can be compromised, exposing your keys',
      'It improves security',
      'It reduces costs'
    ],
    correctIndex: 1,
    explanation: 'Cloud services can be compromised through hacking, insider threats, or legal requests, exposing your private keys to attackers.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['cloud-storage', 'key-exposure', 'service-compromise'],
  },

  // ORANGE 18: Broadcasting a transaction from your home IP address
  {
    id: 'orange-018',
    type: 'true_false',
    difficulty: 'medium',
    category: 'network-privacy',
    question: 'Broadcasting transactions from your home IP can link your location to Bitcoin activity.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Broadcasting transactions from your home IP address can link your physical location to Bitcoin activity, creating a privacy risk.',
    stabilityImpact: { correct: 12, incorrect: -20 },
    points: { correct: 15, incorrect: 0 },
    learningTags: ['home-ip', 'location-linkage', 'transaction-broadcasting'],

  },

  // ===== 🟢 GREEN BLOCKS (Lower Risk - EASY Difficulty) =====

  // GREEN 1: Using software that doesn't support intentional coin selection
  {
    id: 'green-001',
    type: 'multiple_choice',
    difficulty: 'easy',
    category: 'on-chain',
    question: 'What is intentional coin selection in Bitcoin?',
    options: [
      'Choosing which coins to spend based on privacy considerations',
      'Selecting the cheapest coins first',
      'Using the newest coins',
      'Random coin selection'
    ],
    correctIndex: 0,
    explanation: 'Intentional coin selection allows you to choose which UTXOs to spend based on privacy considerations, rather than using default selection algorithms.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['coin-selection', 'utxo-privacy', 'spending-control'],
  },

  // GREEN 2: Using the bitcoin base layer for all transactions
  {
    id: 'green-002',
    type: 'true_false',
    difficulty: 'easy',
    category: 'on-chain',
    question: 'Using only the Bitcoin base layer for all transactions can reduce privacy.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Using only the base layer for all transactions makes all activity visible on the public blockchain, reducing privacy compared to layer 2 solutions.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['base-layer', 'layer2', 'blockchain-visibility'],
  },

  // GREEN 3: Using round amounts when sending payments
  {
    id: 'green-003',
    type: 'scenario',
    difficulty: 'easy',
    category: 'on-chain',
    question: 'Why can using round amounts in Bitcoin payments reduce privacy?',
    options: [
      'Round amounts are more expensive',
      'Round amounts are easier to track and identify',
      'Round amounts are slower',
      'Round amounts are less secure'
    ],
    correctIndex: 1,
    explanation: 'Round amounts are easier to track and identify in blockchain analysis, making it easier to link transactions to specific individuals or businesses.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['round-amounts', 'transaction-tracking', 'blockchain-analysis'],
  },

  // GREEN 4: Mixing KYC and non-KYC bitcoin, deanonymizing all UTXOs
  {
    id: 'green-004',
    type: 'multiple_choice',
    difficulty: 'easy',
    category: 'kyc-privacy',
    question: 'What happens when you mix KYC and non-KYC Bitcoin?',
    options: [
      'Nothing, they remain separate',
      'The KYC Bitcoin deanonymizes all mixed UTXOs',
      'It improves privacy',
      'It reduces fees'
    ],
    correctIndex: 1,
    explanation: 'Mixing KYC and non-KYC Bitcoin deanonymizes all the mixed UTXOs, as the KYC Bitcoin can be traced back to your identity.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['kyc-mixing', 'deanonymization', 'utxo-tracking'],
  },

  // GREEN 5: Using slightly outdated software
  {
    id: 'green-005',
    type: 'true_false',
    difficulty: 'easy',
    category: 'security',
    question: 'Using slightly outdated Bitcoin software can expose you to minor security risks.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Even slightly outdated software may contain security vulnerabilities that could be exploited, though the risk is lower than with extremely outdated software.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['software-updates', 'security-vulnerabilities', 'minor-risks'],
  },

  // GREEN 6: Using a public blockchain explorer
  {
    id: 'green-006',
    type: 'scenario',
    difficulty: 'easy',
    category: 'network-privacy',
    question: 'What privacy consideration exists when using public blockchain explorers?',
    options: [
      'No considerations',
      'Your queries can be logged and tracked',
      'They are more secure',
      'They are faster'
    ],
    correctIndex: 1,
    explanation: 'Public blockchain explorers can log your queries, potentially linking your IP address to specific Bitcoin addresses you\'re researching.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['blockchain-explorer', 'query-logging', 'ip-linkage'],
  },

  // GREEN 7: Talking about bitcoin publicly
  {
    id: 'green-007',
    type: 'multiple_choice',
    difficulty: 'easy',
    category: 'social-privacy',
    question: 'What privacy risk can occur when talking about Bitcoin publicly?',
    options: [
      'No risk, it\'s just discussion',
      'It can reveal your interest and potentially link you to transactions',
      'It improves privacy',
      'It reduces fees'
    ],
    correctIndex: 1,
    explanation: 'Publicly discussing Bitcoin can reveal your interest and potentially link you to transactions if you later use Bitcoin.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['public-discussion', 'interest-revelation', 'transaction-linkage'],
  },

  // GREEN 8: Talking about your bitcoin transactions on an insecure messaging app
  {
    id: 'green-008',
    type: 'true_false',
    difficulty: 'easy',
    category: 'social-privacy',
    question: 'Discussing Bitcoin transactions on insecure messaging apps can expose transaction details.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Insecure messaging apps can expose transaction details to third parties, compromising privacy.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['insecure-messaging', 'transaction-exposure', 'third-party-access'],
  },

  // GREEN 9: Having a high profile as a public figure or activist
  {
    id: 'green-009',
    type: 'scenario',
    difficulty: 'easy',
    category: 'social-privacy',
    question: 'How does being a public figure affect Bitcoin privacy?',
    options: [
      'It has no effect',
      'It makes you a target for surveillance and analysis',
      'It improves privacy',
      'It reduces fees'
    ],
    correctIndex: 1,
    explanation: 'Being a public figure makes you a target for surveillance and blockchain analysis, as your transactions are more likely to be monitored.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['public-figure', 'surveillance-target', 'blockchain-analysis'],
  },

  // GREEN 10: Broadcasting a transaction from your home internet
  {
    id: 'green-010',
    type: 'multiple_choice',
    difficulty: 'easy',
    category: 'network-privacy',
    question: 'What privacy consideration exists when broadcasting from home internet?',
    options: [
      'No considerations',
      'Your IP address can be linked to the transaction',
      'It\'s more secure',
      'It\'s faster'
    ],
    correctIndex: 1,
    explanation: 'Broadcasting from your home internet can link your IP address to the transaction, potentially revealing your location.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['home-internet', 'ip-linkage', 'location-revelation'],
  },

  // GREEN 11: Using one wallet for all purposes
  {
    id: 'green-011',
    type: 'true_false',
    difficulty: 'easy',
    category: 'wallet-setup',
    question: 'Using one wallet for all purposes can link different types of transactions together.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Using one wallet for all purposes links different types of transactions together, making it easier to analyze your complete financial activity.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['wallet-separation', 'transaction-linking', 'financial-analysis'],
  },

  // GREEN 12: Having bitcoin stickers on your laptop or water bottle
  {
    id: 'green-012',
    type: 'scenario',
    difficulty: 'easy',
    category: 'physical-privacy',
    question: 'What privacy risk can occur from displaying Bitcoin stickers?',
    options: [
      'No risk, they\'re just stickers',
      'They can indicate Bitcoin ownership and make you a target',
      'They improve security',
      'They reduce costs'
    ],
    correctIndex: 1,
    explanation: 'Bitcoin stickers can indicate ownership and make you a target for theft or surveillance.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['physical-indicators', 'ownership-revelation', 'theft-target'],
  },

  // GREEN 13: Broadcasting a transaction from the same node that runs your wallet
  {
    id: 'green-013',
    type: 'multiple_choice',
    difficulty: 'easy',
    category: 'network-privacy',
    question: 'What privacy consideration exists when using the same node for wallet and broadcasting?',
    options: [
      'No considerations',
      'It can link your wallet activity to your IP address',
      'It\'s more secure',
      'It\'s faster'
    ],
    correctIndex: 1,
    explanation: 'Using the same node for wallet and broadcasting can link your wallet activity to your IP address, potentially revealing your location.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['node-privacy', 'wallet-ip-linkage', 'location-revelation'],
  },

  // GREEN 14: Using the default transaction structure of 1 input & 2 outputs
  {
    id: 'green-014',
    type: 'true_false',
    difficulty: 'easy',
    category: 'on-chain',
    question: 'Default transaction structures can make transactions easier to identify and track.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Default transaction structures create predictable patterns that make transactions easier to identify and track through blockchain analysis.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['transaction-structure', 'predictable-patterns', 'blockchain-analysis'],
  },

  // GREEN 15: Publicly discussing your personal security practices
  {
    id: 'green-015',
    type: 'scenario',
    difficulty: 'easy',
    category: 'social-privacy',
    question: 'What risk can occur from discussing security practices publicly?',
    options: [
      'No risk, it\'s educational',
      'It can reveal vulnerabilities and make you a target',
      'It improves security',
      'It helps others'
    ],
    correctIndex: 1,
    explanation: 'Publicly discussing security practices can reveal vulnerabilities and make you a target for attackers.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['security-discussion', 'vulnerability-revelation', 'attack-target'],
  },

  // GREEN 16: Attending bitcoin conferences
  {
    id: 'green-016',
    type: 'multiple_choice',
    difficulty: 'easy',
    category: 'social-privacy',
    question: 'What privacy consideration exists when attending Bitcoin conferences?',
    options: [
      'No considerations',
      'Your attendance can indicate Bitcoin interest and ownership',
      'It improves privacy',
      'It reduces costs'
    ],
    correctIndex: 1,
    explanation: 'Attending Bitcoin conferences can indicate your interest in Bitcoin and potentially link you to ownership.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['conference-attendance', 'interest-indication', 'ownership-linkage'],
  },

  // GREEN 17: Personal pro-bitcoin material on twitter
  {
    id: 'green-017',
    type: 'true_false',
    difficulty: 'easy',
    category: 'social-privacy',
    question: 'Posting pro-Bitcoin content on social media can indicate Bitcoin ownership.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Posting pro-Bitcoin content on social media can indicate ownership and make you a target for surveillance or theft.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['social-media', 'ownership-indication', 'surveillance-target'],
  },

  // GREEN 18: Sharing widely that you own bitcoin
  {
    id: 'green-018',
    type: 'scenario',
    difficulty: 'easy',
    category: 'social-privacy',
    question: 'What risk can occur from widely sharing Bitcoin ownership?',
    options: [
      'No risk, it\'s just information',
      'It can make you a target for theft and surveillance',
      'It improves security',
      'It helps with adoption'
    ],
    correctIndex: 1,
    explanation: 'Widely sharing Bitcoin ownership can make you a target for theft, surveillance, and social engineering attacks.',
    stabilityImpact: { correct: 8, incorrect: -15 },
    points: { correct: 10, incorrect: 0 },
    learningTags: ['ownership-disclosure', 'theft-target', 'surveillance-target'],
  },
];

export default ENHANCED_PRIVACY_QUESTIONS;
