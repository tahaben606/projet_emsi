#!/usr/bin/env node

/**
 * DEVELOPMENT UTILITY SCRIPTS
 * 
 * ⚠️  IMPORTANT: These scripts are for development/testing only.
 * They should NEVER be:
 * - Exposed as HTTP endpoints in production
 * - Committed to public repositories with sensitive data
 * - Accessible via the web interface
 * 
 * All scripts are CLI-only utilities for local development.
 */

const fs = require('fs');
const path = require('path');

const scripts = [
  {
    name: 'check-db.mjs',
    description: 'Check database connectivity and basic health',
    usage: 'node check-db.mjs'
  },
  {
    name: 'check_models.js',
    description: 'List all available Prisma data models',
    usage: 'node check_models.js'
  },
  {
    name: 'check_schedules.js',
    description: 'Verify schedule data integrity in database',
    usage: 'node check_schedules.js'
  },
  {
    name: 'fetch_taha.js',
    description: 'Fetch and display Taha Benissaouia student data (for testing)',
    usage: 'node fetch_taha.js'
  },
  {
    name: 'generate_schedules.js',
    description: 'Generate course schedules for all 8 classes (112 total entries)',
    usage: 'node generate_schedules.js'
  },
  {
    name: 'seed_schedules.js',
    description: 'Initial seed script for schedule data',
    usage: 'node seed_schedules.js'
  },
  {
    name: 'test_auth.js',
    description: 'Test authentication system with sample credentials',
    usage: 'node test_auth.js'
  },
  {
    name: 'verify_schedules.js',
    description: 'Count and verify schedules in database by class',
    usage: 'node verify_schedules.js'
  }
];

if (process.argv[2] === '--help' || process.argv[2] === '-h') {
  console.log('\n📋 EMSI FLOW - Development Utility Scripts\n');
  console.log('AVAILABLE SCRIPTS:\n');
  
  scripts.forEach((script, idx) => {
    console.log(`${(idx + 1).toString().padEnd(2)} ${script.name.padEnd(25)} ${script.description}`);
    console.log(`   └─ ${script.usage}\n`);
  });
  
  console.log('GENERAL USAGE:');
  console.log('  node scripts/<script-name>\n');
  
  console.log('EXAMPLES:');
  console.log('  node scripts/verify_schedules.js       (Check current schedules)');
  console.log('  node scripts/generate_schedules.js     (Create schedules for all classes)');
  console.log('  node scripts/test_auth.js              (Test login credentials)\n');
  
  process.exit(0);
}

// If run directly, show help
if (require.main === module) {
  console.log('Run with --help for available scripts\n');
  console.log('Quick reference:\n');
  scripts.slice(0, 3).forEach(script => {
    console.log(`  📌 ${script.name}`);
  });
  console.log('  ... and 5 more\n');
  console.log('Use: node scripts/<script-name> --help\n');
}

module.exports = scripts;
