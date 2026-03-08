#!/usr/bin/env node

// Database Utility Scripts
// These scripts are for development/testing only and should NOT be exposed in production

const scripts = {
'generate_schedules.js': 'Generate course schedules for all classes',
'fetch_taha.js': 'Fetch Taha Benissaouia student data',
'check_models.js': 'List all Prisma models',
'check_schedules.js': 'Verify schedules data',
'check-db.mjs': 'Database connectivity check',
'seed_schedules.js': 'Seed schedule data',
'verify_schedules.js': 'Verify schedule count in database',
'test_auth.js': 'Test authentication functionality'
}

console.log('\n📋 DEVELOPMENT UTILITY SCRIPTS\n')
console.log('These scripts are for development only and should not be exposed in production.\n')

Object.entries(scripts).forEach(([name, desc]) => {
console.log(`  • ${name.padEnd(25)} - ${desc}`)
})

console.log('\n💡 Usage:\n')
console.log(' node scripts/<script-name>\n')
console.log('⚠️ Note: These should NEVER be accessible as web routes in production.\n')
